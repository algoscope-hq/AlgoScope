import { createStep } from '../../lib/utils'

export const maximalRectangleSources = {
  javascript: {
    code: `function maximalRectangle(matrix) {
  if (matrix.length === 0) return 0;
  let maxArea = 0;
  const cols = matrix[0].length;
  const heights = new Array(cols).fill(0);

  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < cols; col++) {
      heights[col] = matrix[row][col] === '1' ? heights[col] + 1 : 0;
    }

    const stack = [];
    for (let i = 0; i <= cols; i++) {
      while (stack.length > 0 && (i === cols || heights[i] < heights[stack[stack.length - 1]])) {
        const h = heights[stack.pop()];
        const w = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;
        maxArea = Math.max(maxArea, h * w);
      }
      if (i < cols) stack.push(i);
    }
  }
  return maxArea;
}`,
    lineMap: {
      setup: 2,
      rowLoop: 6,
      updateHeights: 8,
      stackSetup: 11,
      stackLoop: 12,
      whileLoop: 13,
      popAndCalc: 14,
      updateMax: 16,
      push: 18,
      complete: 21,
    },
  },
  python: {
    code: `def maximalRectangle(matrix):
    if not matrix: return 0
    maxArea = 0
    cols = len(matrix[0])
    heights = [0] * cols

    for row in range(len(matrix)):
        for col in range(cols):
            heights[col] = heights[col] + 1 if matrix[row][col] == '1' else 0

        stack = []
        for i in range(cols + 1):
            while stack and (i == cols or heights[i] < heights[stack[-1]]):
                h = heights[stack.pop()]
                w = i if not stack else i - stack[-1] - 1
                maxArea = max(maxArea, h * w)
            if i < cols: stack.append(i)
            
    return maxArea`,
    lineMap: {
      setup: 2,
      rowLoop: 7,
      updateHeights: 9,
      stackSetup: 11,
      stackLoop: 12,
      whileLoop: 13,
      popAndCalc: 14,
      updateMax: 16,
      push: 17,
      complete: 19,
    },
  },
  java: {
    code: `public int maximalRectangle(char[][] matrix) {
    if (matrix.length == 0) return 0;
    int maxArea = 0;
    int cols = matrix[0].length;
    int[] heights = new int[cols];

    for (int row = 0; row < matrix.length; row++) {
        for (int col = 0; col < cols; col++) {
            heights[col] = matrix[row][col] == '1' ? heights[col] + 1 : 0;
        }

        Stack<Integer> stack = new Stack<>();
        for (int i = 0; i <= cols; i++) {
            while (!stack.isEmpty() && (i == cols || heights[i] < heights[stack.peek()])) {
                int h = heights[stack.pop()];
                int w = stack.isEmpty() ? i : i - stack.peek() - 1;
                maxArea = Math.max(maxArea, h * w);
            }
            if (i < cols) stack.push(i);
        }
    }
    return maxArea;
}`,
    lineMap: {
      setup: 2,
      rowLoop: 7,
      updateHeights: 9,
      stackSetup: 12,
      stackLoop: 13,
      whileLoop: 14,
      popAndCalc: 15,
      updateMax: 17,
      push: 19,
      complete: 22,
    },
  },
  cpp: {
    code: `int maximalRectangle(vector<vector<char>>& matrix) {
    if (matrix.empty()) return 0;
    int maxArea = 0;
    int cols = matrix[0].size();
    vector<int> heights(cols, 0);

    for (int row = 0; row < matrix.size(); row++) {
        for (int col = 0; col < cols; col++) {
            heights[col] = matrix[row][col] == '1' ? heights[col] + 1 : 0;
        }

        stack<int> st;
        for (int i = 0; i <= cols; i++) {
            while (!st.empty() && (i == cols || heights[i] < heights[st.top()])) {
                int h = heights[st.top()]; 
                st.pop();
                int w = st.empty() ? i : i - st.top() - 1;
                maxArea = max(maxArea, h * w);
            }
            if (i < cols) st.push(i);
        }
    }
    return maxArea;
}`,
    lineMap: {
      setup: 2,
      rowLoop: 7,
      updateHeights: 9,
      stackSetup: 12,
      stackLoop: 13,
      whileLoop: 14,
      popAndCalc: 15,
      updateMax: 18,
      push: 20,
      complete: 23,
    },
  },
  c: {
    code: `int maximalRectangle(char** matrix, int matrixSize, int* matrixColSize) {
    if (matrixSize == 0) return 0;
    int maxArea = 0;
    int cols = matrixColSize[0];
    int* heights = (int*)calloc(cols, sizeof(int));

    for (int row = 0; row < matrixSize; row++) {
        for (int col = 0; col < cols; col++) {
            heights[col] = matrix[row][col] == '1' ? heights[col] + 1 : 0;
        }

        int* stack = (int*)malloc((cols + 1) * sizeof(int));
        int top = -1;
        for (int i = 0; i <= cols; i++) {
            while (top >= 0 && (i == cols || heights[i] < heights[stack[top]])) {
                int h = heights[stack[top--]];
                int w = (top == -1) ? i : i - stack[top] - 1;
                if (h * w > maxArea) maxArea = h * w;
            }
            if (i < cols) stack[++top] = i;
        }
        free(stack);
    }
    free(heights);
    return maxArea;
}`,
    lineMap: {
      setup: 2,
      rowLoop: 7,
      updateHeights: 9,
      stackSetup: 12,
      stackLoop: 14,
      whileLoop: 15,
      popAndCalc: 16,
      updateMax: 18,
      push: 20,
      complete: 25,
    },
  },
  go: {
    code: `func maximalRectangle(matrix [][]byte) int {
    if len(matrix) == 0 { return 0 }
    maxArea := 0
    cols := len(matrix[0])
    heights := make([]int, cols)

    for row := 0; row < len(matrix); row++ {
        for col := 0; col < cols; col++ {
            if matrix[row][col] == '1' { heights[col]++ } else { heights[col] = 0 }
        }

        stack := []int{}
        for i := 0; i <= cols; i++ {
            for len(stack) > 0 && (i == cols || heights[i] < heights[stack[len(stack)-1]]) {
                topIdx := stack[len(stack)-1]
                stack = stack[:len(stack)-1]
                h := heights[topIdx]
                
                w := i
                if len(stack) > 0 { w = i - stack[len(stack)-1] - 1 }
                
                if h * w > maxArea { maxArea = h * w }
            }
            if i < cols { stack = append(stack, i) }
        }
    }
    return maxArea
}`,
    lineMap: {
      setup: 2,
      rowLoop: 7,
      updateHeights: 9,
      stackSetup: 12,
      stackLoop: 13,
      whileLoop: 14,
      popAndCalc: 15,
      updateMax: 20,
      push: 22,
      complete: 26,
    },
  },
  rust: {
    code: `pub fn maximal_rectangle(matrix: Vec<Vec<char>>) -> i32 {
    if matrix.is_empty() { return 0; }
    let mut max_area = 0;
    let cols = matrix[0].len();
    let mut heights = vec![0; cols];

    for row in 0..matrix.len() {
        for col in 0..cols {
            heights[col] = if matrix[row][col] == '1' { heights[col] + 1 } else { 0 };
        }

        let mut stack: Vec<usize> = Vec::new();
        for i in 0..=cols {
            while !stack.is_empty() && (i == cols || heights[i] < heights[*stack.last().unwrap()]) {
                let h = heights[stack.pop().unwrap()];
                let w = if stack.is_empty() { i } else { i - stack.last().unwrap() - 1 };
                max_area = max_area.max(h * w as i32);
            }
            if i < cols { stack.push(i); }
        }
    }
    max_area
}`,
    lineMap: {
      setup: 2,
      rowLoop: 7,
      updateHeights: 9,
      stackSetup: 12,
      stackLoop: 13,
      whileLoop: 14,
      popAndCalc: 15,
      updateMax: 17,
      push: 19,
      complete: 23,
    },
  },
}

export function getMaximalRectangleSource(language = 'javascript') {
  const lang = language.toLowerCase()
  return maximalRectangleSources[lang] ?? maximalRectangleSources.javascript
}

export function resolveMaximalRectangleLine(language, lineKey) {
  if (!lineKey) return undefined
  const source = getMaximalRectangleSource(language)
  return (
    source.lineMap[lineKey] ??
    maximalRectangleSources.javascript.lineMap[lineKey]
  )
}

export function generateMaximalRectangleSteps(matrixInput) {
  const steps = []
  if (!matrixInput || matrixInput.length === 0) return steps

  const matrix = matrixInput.map((row) => row.map((val) => String(val)))
  const rows = matrix.length
  const cols = matrix[0].length
  const heights = new Array(cols).fill(0)
  let maxArea = 0

  steps.push(
    createStep({
      lineKey: 'setup',
      type: 'start',
      matrix,
      currentRow: -1,
      array: [...heights],
      stack: [],
      message: 'Starting Maximal Rectangle. Initializing empty heights array.',
      variables: { rows, cols, maxArea },
      duration: 800,
    })
  )

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      heights[col] = matrix[row][col] === '1' ? heights[col] + 1 : 0
    }

    steps.push(
      createStep({
        lineKey: 'updateHeights',
        type: 'active',
        matrix,
        currentRow: row,
        array: [...heights],
        stack: [],
        message: `Row ${row}: Updated heights array. Cells with '0' reset height to 0.`,
        variables: { row, maxArea },
        duration: 1000,
      })
    )

    const stack = []

    for (let i = 0; i <= cols; i++) {
      const currentHeight = i === cols ? 0 : heights[i]

      steps.push(
        createStep({
          lineKey: 'stackLoop',
          type: 'outer-loop',
          matrix,
          currentRow: row,
          array: [...heights],
          stack: [...stack],
          indices: i < cols ? [i] : [],
          message:
            i === cols
              ? `Row ${row} ended. Flushing remaining stack.`
              : `Row ${row}: Process column ${i} (height: ${currentHeight}).`,
          variables: { row, col: i, maxArea },
          duration: 600,
        })
      )

      while (
        stack.length > 0 &&
        (i === cols || currentHeight < heights[stack[stack.length - 1]])
      ) {
        steps.push(
          createStep({
            lineKey: 'whileLoop',
            type: 'compare',
            matrix,
            currentRow: row,
            array: [...heights],
            stack: [...stack],
            indices: [i, stack[stack.length - 1]],
            message: `Height ${currentHeight} < stack top ${heights[stack[stack.length - 1]]}. Monotonic property broken.`,
            variables: { row, col: i, maxArea },
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
            matrix,
            currentRow: row,
            array: [...heights],
            stack: [...stack],
            indices: [topIndex],
            message: `Pop col ${topIndex}. Height = ${h}, Width = ${w}, Area = ${area}.`,
            variables: { row, h, w, area, maxArea },
            duration: 850,
          })
        )

        if (area > maxArea) {
          maxArea = area
          steps.push(
            createStep({
              lineKey: 'updateMax',
              type: 'update',
              matrix,
              currentRow: row,
              array: [...heights],
              stack: [...stack],
              message: `New Max Area found: ${maxArea}!`,
              variables: { row, maxArea },
              duration: 800,
            })
          )
        }
      }

      if (i < cols) {
        stack.push(i)
        steps.push(
          createStep({
            lineKey: 'push',
            type: 'push',
            matrix,
            currentRow: row,
            array: [...heights],
            stack: [...stack],
            indices: [i],
            message: `Push col ${i} to stack.`,
            variables: { row, maxArea },
            duration: 650,
          })
        )
      }
    }
  }

  steps.push(
    createStep({
      lineKey: 'complete',
      type: 'complete',
      matrix,
      currentRow: -1,
      array: [...heights],
      stack: [],
      message: `Finished! Maximal Rectangle Area is ${maxArea}.`,
      variables: { maxArea },
      duration: 900,
    })
  )

  return steps
}
