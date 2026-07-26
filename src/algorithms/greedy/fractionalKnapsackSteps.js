const createStep = ({
  lineKey,
  type,
  items,
  knapsackState,
  activeItemId = null,
  message = '',
  variables = {},
  duration = 1000,
}) => ({
  lineKey,
  type,
  items: structuredClone(items),
  knapsackState: structuredClone(knapsackState),
  activeItemId,
  message,
  variables,
  duration,
})

export function generateFractionalKnapsackSteps(capacity, inputItems) {
  const steps = []
  let currentCapacity = Number(capacity)

  if (isNaN(currentCapacity) || currentCapacity <= 0) {
    currentCapacity = 50
  }

  // Deep copy the input items
  let items = inputItems
    .map((item, index) => ({
      id: item.id || `Item ${index + 1}`,
      value: Number(item.value),
      weight: Number(item.weight),
      ratio: 0,
      status: 'staged', // staged, ratio-calculated, sorted, active, packed, fractioned, skipped
      packedRatio: 0,
      packedWeight: 0,
      packedValue: 0,
    }))
    .filter(
      (item) =>
        !isNaN(item.value) &&
        !isNaN(item.weight) &&
        item.weight > 0 &&
        item.value > 0
    )

  let knapsackState = {
    capacityLeft: currentCapacity,
    totalCapacity: currentCapacity,
    totalValue: 0,
    contents: [], // blocks packed inside: { id, weight, value, ratio, color }
  }

  // Step 1: Start
  steps.push(
    createStep({
      lineKey: 'init',
      type: 'start',
      items,
      knapsackState,
      message: `Fractional Knapsack Visualizer started. Knapsack capacity: ${currentCapacity} kg.`,
      variables: { capacity: currentCapacity, totalItems: items.length },
      duration: 1000,
    })
  )

  // Step 2: Calculate Ratios
  items.forEach((item) => {
    item.ratio = Number((item.value / item.weight).toFixed(2))
    item.status = 'ratio-calculated'
  })

  steps.push(
    createStep({
      lineKey: 'ratio',
      type: 'calc-ratios',
      items,
      knapsackState,
      message:
        'Calculated Value-to-Weight ratio (Value / Weight) for each item. Greedy strategy prioritizes higher ratios.',
      variables: { capacity: currentCapacity },
      duration: 1200,
    })
  )

  // Step 3: Sort items by ratio descending
  items.sort((a, b) => b.ratio - a.ratio || a.weight - b.weight)
  items.forEach((item) => {
    item.status = 'sorted'
  })

  steps.push(
    createStep({
      lineKey: 'sort',
      type: 'sort-items',
      items,
      knapsackState,
      message:
        'Sorted all items in descending order of their Value-to-Weight ratio.',
      variables: { sorted: true },
      duration: 1200,
    })
  )

  // Step 4: Initialize total value
  steps.push(
    createStep({
      lineKey: 'total',
      type: 'init-total',
      items,
      knapsackState,
      message: 'Initializing total packed value to $0.',
      variables: { totalValue: 0, capacityLeft: currentCapacity },
      duration: 800,
    })
  )

  // Step 5: Pack greedily
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    item.status = 'active'

    steps.push(
      createStep({
        lineKey: 'loop',
        type: 'process-item',
        items,
        knapsackState,
        activeItemId: item.id,
        message: `Inspecting ${item.id} (Weight: ${item.weight} kg, Value: $${item.value}, Ratio: ${item.ratio}).`,
        variables: {
          activeItem: item.id,
          capacityLeft: knapsackState.capacityLeft,
        },
        duration: 900,
      })
    )

    steps.push(
      createStep({
        lineKey: 'check',
        type: 'check-capacity',
        items,
        knapsackState,
        activeItemId: item.id,
        message: `Comparing item weight (${item.weight} kg) with remaining capacity (${knapsackState.capacityLeft} kg).`,
        variables: {
          itemWeight: item.weight,
          capacityLeft: knapsackState.capacityLeft,
        },
        duration: 900,
      })
    )

    if (knapsackState.capacityLeft >= item.weight) {
      // Pack full item
      knapsackState.capacityLeft -= item.weight
      knapsackState.totalValue += item.value

      item.status = 'packed'
      item.packedRatio = 1
      item.packedWeight = item.weight
      item.packedValue = item.value

      knapsackState.contents.push({
        id: item.id,
        weight: item.weight,
        value: item.value,
        ratio: item.ratio,
        fraction: 1,
      })

      steps.push(
        createStep({
          lineKey: 'packFull',
          type: 'packed-full',
          items,
          knapsackState,
          activeItemId: item.id,
          message: `Remaining capacity is sufficient! Packed 100% of ${item.id}. Remaining Capacity reduces to ${knapsackState.capacityLeft} kg.`,
          variables: {
            totalValue: knapsackState.totalValue,
            capacityLeft: knapsackState.capacityLeft,
          },
          duration: 1200,
        })
      )
    } else if (knapsackState.capacityLeft > 0) {
      // Pack fraction of item
      const fraction = knapsackState.capacityLeft / item.weight
      const fractionVal = Number((item.value * fraction).toFixed(2))
      const fractionWt = knapsackState.capacityLeft

      knapsackState.totalValue = Number(
        (knapsackState.totalValue + fractionVal).toFixed(2)
      )
      knapsackState.capacityLeft = 0

      item.status = 'fractioned'
      item.packedRatio = fraction
      item.packedWeight = fractionWt
      item.packedValue = fractionVal

      knapsackState.contents.push({
        id: item.id,
        weight: fractionWt,
        value: fractionVal,
        ratio: item.ratio,
        fraction: fraction,
      })

      steps.push(
        createStep({
          lineKey: 'packFraction',
          type: 'packed-fraction',
          items,
          knapsackState,
          activeItemId: item.id,
          message: `Remaining capacity is ${fractionWt} kg (less than item weight ${item.weight} kg). Took a fraction: ${(fraction * 100).toFixed(1)}% of ${item.id}. Total value increases by $${fractionVal}.`,
          variables: { totalValue: knapsackState.totalValue, capacityLeft: 0 },
          duration: 1200,
        })
      )

      // Rest of the items are skipped since knapsack is full
      for (let j = i + 1; j < items.length; j++) {
        items[j].status = 'skipped'
      }
      break
    } else {
      // Capacity is already 0
      item.status = 'skipped'
      steps.push(
        createStep({
          lineKey: 'loop',
          type: 'process-item',
          items,
          knapsackState,
          activeItemId: item.id,
          message: `Knapsack is full. Skipping ${item.id}.`,
          variables: { totalValue: knapsackState.totalValue, capacityLeft: 0 },
          duration: 800,
        })
      )
    }
  }

  // Final step
  steps.push(
    createStep({
      lineKey: 'finish',
      type: 'complete',
      items,
      knapsackState,
      message: `Fractional Knapsack complete! Maximized total packed value is $${knapsackState.totalValue}.`,
      variables: {
        finalValue: knapsackState.totalValue,
        capacityUsed: knapsackState.totalCapacity - knapsackState.capacityLeft,
      },
      duration: 1500,
    })
  )

  return steps
}
