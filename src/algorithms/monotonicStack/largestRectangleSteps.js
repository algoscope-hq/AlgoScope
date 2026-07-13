import { createStep } from '../../lib/utils'

export const largestRectangleSources = {
  javascript: {
    code: `function largestRectangleArea(heights) {
  let maxArea = 0;
  const stack = [];
  const n = heights.length;

  for (let i = 0; i <= n; i++) {
    while (stack.length > 0 && (i === n || heights[i] < heights[stack[stack.length - 1]])) {
      const h = heights[stack.pop()];
      const w = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;
      maxArea = Math.max(maxArea, h * w);
    }
    if (i < n) stack.push(i);
  }
  return maxArea;
}`,
    lineMap: {
      function: 1,
      setup: 2,
      outerLoop: 6,
      whileLoop: 7,
      popAndCalc: 8,
      updateMax: 10,
      push: 12,
      complete: 14,
    },
  },
  python: {
    code: `def largestRectangleArea(heights):
    maxArea = 0
    stack = []
    n = len(heights)

    for i in range(n + 1):
        while stack and (i == n or heights[i] < heights[stack[-1]]):
            h = heights[stack.pop()]
            w = i if not stack else i - stack[-1] - 1
            maxArea = max(maxArea, h * w)
        if i < n: stack.append(i)
        
    return maxArea`,
    lineMap: {
      function: 1,
      setup: 2,
      outerLoop: 6,
      whileLoop: 7,
      popAndCalc: 8,
      updateMax: 10,
      push: 11,
      complete: 13,
    },
  },
  java: {
    code: `public int largestRectangleArea(int[] heights) {
    int maxArea = 0;
    Stack<Integer> stack = new Stack<>();
    int n = heights.length;

    for (int i = 0; i <= n; i++) {
        while (!stack.isEmpty() && (i == n || heights[i] < heights[stack.peek()])) {
            int h = heights[stack.pop()];
            int w = stack.isEmpty() ? i : i - stack.peek() - 1;
            maxArea = Math.max(maxArea, h * w);
        }
        if (i < n) stack.push(i);
    }
    return maxArea;
}`,
    lineMap: {
      function: 1,
      setup: 2,
      outerLoop: 6,
      whileLoop: 7,
      popAndCalc: 8,
      updateMax: 10,
      push: 12,
      complete: 14,
    },
  },
  cpp: {
    code: `int largestRectangleArea(vector<int>& heights) {
    int maxArea = 0;
    stack<int> st;
    int n = heights.size();

    for (int i = 0; i <= n; i++) {
        while (!st.empty() && (i == n || heights[i] < heights[st.top()])) {
            int h = heights[st.top()]; 
            st.pop();
            int w = st.empty() ? i : i - st.top() - 1;
            maxArea = max(maxArea, h * w);
        }
        if (i < n) st.push(i);
    }
    return maxArea;
}`,
    lineMap: {
      function: 1,
      setup: 2,
      outerLoop: 6,
      whileLoop: 7,
      popAndCalc: 8,
      updateMax: 11,
      push: 13,
      complete: 15,
    },
  },
  c: {
    code: `int largestRectangleArea(int* heights, int heightsSize) {
    int maxArea = 0;
    int* stack = (int*)malloc((heightsSize + 1) * sizeof(int));
    int top = -1;

    for (int i = 0; i <= heightsSize; i++) {
        while (top >= 0 && (i == heightsSize || heights[i] < heights[stack[top]])) {
            int h = heights[stack[top--]];
            int w = (top == -1) ? i : i - stack[top] - 1;
            if (h * w > maxArea) maxArea = h * w;
        }
        if (i < heightsSize) stack[++top] = i;
    }
    free(stack);
    return maxArea;
}`,
    lineMap: {
      function: 1,
      setup: 2,
      outerLoop: 6,
      whileLoop: 7,
      popAndCalc: 8,
      updateMax: 10,
      push: 12,
      complete: 15,
    },
  },
  go: {
    code: `func largestRectangleArea(heights []int) int {
    maxArea := 0
    stack := []int{}
    n := len(heights)

    for i := 0; i <= n; i++ {
        for len(stack) > 0 && (i == n || heights[i] < heights[stack[len(stack)-1]]) {
            topIdx := stack[len(stack)-1]
            stack = stack[:len(stack)-1]
            h := heights[topIdx]
            
            w := i
            if len(stack) > 0 { w = i - stack[len(stack)-1] - 1 }
            
            if h * w > maxArea { maxArea = h * w }
        }
        if i < n { stack = append(stack, i) }
    }
    return maxArea
}`,
    lineMap: {
      function: 1,
      setup: 2,
      outerLoop: 6,
      whileLoop: 7,
      popAndCalc: 8,
      updateMax: 15,
      push: 17,
      complete: 19,
    },
  },
  rust: {
    code: `pub fn largest_rectangle_area(heights: Vec<i32>) -> i32 {
    let mut max_area = 0;
    let mut stack: Vec<usize> = Vec::new();
    let n = heights.len();

    for i in 0..=n {
        while !stack.is_empty() && (i == n || heights[i] < heights[*stack.last().unwrap()]) {
            let h = heights[stack.pop().unwrap()];
            let w = if stack.is_empty() { i } else { i - stack.last().unwrap() - 1 };
            max_area = max_area.max(h * w as i32);
        }
        if i < n { stack.push(i); }
    }
    max_area
}`,
    lineMap: {
      function: 1,
      setup: 2,
      outerLoop: 6,
      whileLoop: 7,
      popAndCalc: 8,
      updateMax: 10,
      push: 12,
      complete: 14,
    },
  },
}

export function getLargestRectangleSource(language = 'javascript') {
  const lang = language.toLowerCase()
  return largestRectangleSources[lang] ?? largestRectangleSources.javascript
}

export function resolveLargestRectangleLine(language, lineKey) {
  if (!lineKey) return undefined
  const source = getLargestRectangleSource(language)
  return (
    source.lineMap[lineKey] ??
    largestRectangleSources.javascript.lineMap[lineKey]
  )
}

export function generateLargestRectangleSteps(inputArray) {
  if (!inputArray || inputArray.length === 0) {
    return [
      createStep({
        lineKey: 'function',
        type: 'start',
        array: [],
        stack: [],
        message: 'Empty input provided.',
        variables: { n: 0, maxArea: 0 },
        duration: 700,
      }),
    ]
  }
  if (inputArray.some((h) => typeof h !== 'number' || h < 0)) {
    throw new Error('All heights must be non-negative numbers')
  }
  const heights = [...inputArray]
  const steps = []
  const n = heights.length

  const stack = []
  let maxArea = 0

  steps.push(
    createStep({
      lineKey: 'function',
      type: 'start',
      array: heights,
      stack: [...stack],
      message: 'Largest Rectangle in Histogram starts.',
      variables: { n, maxArea },
      duration: 700,
    })
  )

  for (let i = 0; i <= n; i++) {
    const currentHeight = i === n ? 0 : heights[i]

    steps.push(
      createStep({
        lineKey: 'outerLoop',
        type: 'outer-loop',
        array: heights,
        stack: [...stack],
        indices: i < n ? [i] : [],
        message:
          i === n
            ? 'Reached end of array. Flushing remaining stack.'
            : `Process bar at index ${i} (height: ${currentHeight}).`,
        variables: { i, maxArea },
        duration: 600,
      })
    )

    while (
      stack.length > 0 &&
      (i === n || currentHeight < heights[stack[stack.length - 1]])
    ) {
      steps.push(
        createStep({
          lineKey: 'whileLoop',
          type: 'compare',
          array: heights,
          stack: [...stack],
          indices: [i, stack[stack.length - 1]],
          message: `Current height ${currentHeight} < stack top ${heights[stack[stack.length - 1]]}. Monotonic property broken.`,
          variables: { i, maxArea },
          duration: 700,
        })
      )

      const topIndex = stack.pop()
      const h = heights[topIndex]
      const w = stack.length === 0 ? i : i - stack[stack.length - 1] - 1
      const area = h * w

      steps.push(
        createStep({
          lineKey: 'popAndCalc',
          type: 'calculate',
          array: heights,
          stack: [...stack],
          indices: [topIndex],
          message: `Pop index ${topIndex}. Height = ${h}, Width = ${w}, Area = ${area}.`,
          variables: { i, h, w, area, maxArea },
          duration: 850,
        })
      )

      if (area > maxArea) {
        maxArea = area
        steps.push(
          createStep({
            lineKey: 'updateMax',
            type: 'update',
            array: heights,
            stack: [...stack],
            message: `New Max Area found: ${maxArea}!`,
            variables: { i, maxArea },
            duration: 800,
          })
        )
      }
    }

    if (i < n) {
      stack.push(i)
      steps.push(
        createStep({
          lineKey: 'push',
          type: 'push',
          array: heights,
          stack: [...stack],
          indices: [i],
          message: `Push index ${i} to stack. Stack is monotonically increasing.`,
          variables: { i, maxArea },
          duration: 650,
        })
      )
    }
  }

  steps.push(
    createStep({
      lineKey: 'complete',
      type: 'complete',
      array: heights,
      stack: [...stack],
      message: `Finished! Maximum Rectangle Area is ${maxArea}.`,
      variables: { maxArea },
      duration: 900,
    })
  )

  return steps
}
