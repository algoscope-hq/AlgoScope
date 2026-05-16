import React from 'react';
import CodePanel from '../visualizer/CodePanel';

const slidingWindowCode = {
  javascript: `function maxSumSubarray(arr, k) {
  let maxSum = 0;
  let windowSum = 0;
  
  // 1. Initial window
  for (let i = 0; i < k; i++) {
    windowSum += arr[i];
  }
  maxSum = windowSum;

  // 2. Slide the window
  for (let i = k; i < arr.length; i++) {
    windowSum += arr[i] - arr[i - k];
    maxSum = Math.max(maxSum, windowSum);
  }
  
  return maxSum;
}`,
  python: `def max_sum_subarray(arr, k):
    max_sum = 0
    window_sum = 0
    
    # 1. Initial window
    for i in range(k):
        window_sum += arr[i]
    max_sum = window_sum
    
    # 2. Slide the window
    for i in range(k, len(arr)):
        window_sum += arr[i] - arr[i - k]
        max_sum = max(max_sum, window_sum)
        
    return max_sum`,
  cpp: `int maxSumSubarray(vector<int>& arr, int k) {
    int maxSum = 0;
    int windowSum = 0;
    
    // 1. Initial window
    for (int i = 0; i < k; i++) {
        windowSum += arr[i];
    }
    maxSum = windowSum;
    
    // 2. Slide the window
    for (int i = k; i < arr.size(); i++) {
        windowSum += arr[i] - arr[i - k];
        maxSum = max(maxSum, windowSum);
    }
    
    return maxSum;
}`,
  java: `public int maxSumSubarray(int[] arr, int k) {
    int maxSum = 0;
    int windowSum = 0;
    
    // 1. Initial window
    for (int i = 0; i < k; i++) {
        windowSum += arr[i];
    }
    maxSum = windowSum;
    
    // 2. Slide the window
    for (int i = k; i < arr.length; i++) {
        windowSum += arr[i] - arr[i - k];
        maxSum = Math.max(maxSum, windowSum);
    }
    
    return maxSum;
}`
};

export default function CodeDisplay({ language, onLanguageChange, activeLine }) {
  return (
    <CodePanel 
      title="Sliding Window (Max Sum Subarray)"
      code={slidingWindowCode[language] || slidingWindowCode.javascript}
      language={language}
      onLanguageChange={onLanguageChange}
      activeLine={activeLine}
    />
  );
}
