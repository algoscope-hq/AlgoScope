/**
 * Generates steps for the Fixed Size Sliding Window (Maximum Sum Subarray)
 * @param {number[]} array 
 * @param {number} k 
 * @returns {Object[]} steps
 */
export const generateFixedWindowSteps = (array, k) => {
  const steps = [];
  let currentSum = 0;
  let maxSum = -Infinity;
  let maxStartIndex = -1;

  // Initial window
  for (let i = 0; i < k; i++) {
    currentSum += array[i];
    steps.push({
      type: 'INITIAL_WINDOW',
      windowStart: 0,
      windowEnd: i,
      currentSum,
      maxSum: maxSum === -Infinity ? currentSum : maxSum,
      description: `Adding element ${array[i]} to the initial window.`,
      why: i < k - 1 ? "We are building the initial window of size K." : "The initial window is now complete.",
      highlightLines: [1, 2]
    });
  }

  maxSum = currentSum;
  maxStartIndex = 0;
  steps.push({
    type: 'MAX_UPDATE',
    windowStart: 0,
    windowEnd: k - 1,
    currentSum,
    maxSum,
    maxStartIndex,
    description: `Initial window sum is ${currentSum}. Setting it as current maximum.`,
    why: "Every algorithm needs a starting point. The first window sum is our baseline maximum.",
    highlightLines: [3]
  });

  // Slide the window
  for (let i = k; i < array.length; i++) {
    const prevElement = array[i - k];
    const newElement = array[i];
    
    // Step: Remove previous element
    currentSum -= prevElement;
    steps.push({
      type: 'SLIDE_REMOVE',
      windowStart: i - k + 1,
      windowEnd: i - 1,
      prevElementIndex: i - k,
      currentSum,
      maxSum,
      maxStartIndex,
      description: `Sliding window: Removing ${prevElement} from the left.`,
      why: "To maintain a fixed window size of K, we must remove the oldest element as we move forward.",
      highlightLines: [4, 5]
    });

    // Step: Add new element
    currentSum += newElement;
    steps.push({
      type: 'SLIDE_ADD',
      windowStart: i - k + 1,
      windowEnd: i,
      newElementIndex: i,
      currentSum,
      maxSum,
      maxStartIndex,
      description: `Sliding window: Adding ${newElement} from the right.`,
      why: "We add the next element in the array to complete the new window position.",
      highlightLines: [6]
    });

    // Step: Compare and Update Max
    if (currentSum > maxSum) {
      maxSum = currentSum;
      maxStartIndex = i - k + 1;
      steps.push({
        type: 'MAX_UPDATE',
        windowStart: i - k + 1,
        windowEnd: i,
        currentSum,
        maxSum,
        maxStartIndex,
        description: `New maximum sum found: ${maxSum}!`,
        why: `Current sum (${currentSum}) > Previous Max (${maxSum - (currentSum - maxSum)}). We update the record.`,
        highlightLines: [7, 8]
      });
    } else {
      steps.push({
        type: 'COMPARE',
        windowStart: i - k + 1,
        windowEnd: i,
        currentSum,
        maxSum,
        maxStartIndex,
        description: `Current sum ${currentSum} is not greater than maximum sum ${maxSum}.`,
        why: `The current window sum (${currentSum}) didn't beat our record of ${maxSum}.`,
        highlightLines: [7]
      });
    }
  }

  steps.push({
    type: 'FINISHED',
    windowStart: maxStartIndex,
    windowEnd: maxStartIndex + k - 1,
    currentSum,
    maxSum,
    maxStartIndex,
    description: `Algorithm finished. Maximum sum is ${maxSum}.`,
    why: "We have reached the end of the array. All possible windows of size K have been evaluated.",
    highlightLines: []
  });

  return steps;
};
