# Greedy Algorithms Visualizer

This directory contains the components and layout for the interactive visualizers of **Greedy Algorithms** in AlgoScope. 

The visualizers allow users to explore step-by-step greedy strategy animations, modify input datasets, inspect variables in real time, and view code execution mappings in Java, C++, Python, and JavaScript.

## Algorithms Covered

1. **Huffman Coding** (Data Compression):
   - Visualizes how character frequencies are calculated and leaf nodes are merged into a binary tree forest.
   - Outputs the constructed tree with edges labeled with bits (`0` or `1`) and final generated character codes.
   - Controlled via custom text inputs.

2. **Fractional Knapsack** (Resource Optimization):
   - Visualizes calculating value-to-weight ratios, sorting items by ratio, and packing items (full or fractions) into the knapsack.
   - Outputs an interactive knapsack container grid reflecting packed volumes.
   - Configured via cargo items and knapsack weight capacity.

3. **Job Sequencing with Deadlines** (Timeline Optimization):
   - Visualizes sorting jobs by profit in descending order and scheduling each job in the latest available time slot before its deadline.
   - Outputs a Gantt chart time-slot timeline showing backwards searches and filled slots alongside a Live Metrics dashboard (Total Profit, Scheduled, and Missed Jobs).
   - Configured via a directory of up to 8 jobs with variable profits and deadlines.

## Component Architecture

- `VisualizerPage.jsx`: The main controller page, handling algorithm selection, inputs, and layout synchronization. It imports code execution snippets and step playback state management.
- `HuffmanVisualizer.jsx`: Renders the binary tree structure of the Huffman forest using custom node position mapping and SVG lines.
- `KnapsackVisualizer.jsx`: Renders the cargo inventory and visual packaging stack representing current capacity utilization.
- `JobSequencingVisualizer.jsx`: Renders the Gantt time-slot grid, real-time metrics cards, and status-coded job deck.
- `GreedyBlock.jsx`: Styled container card block using uniform glassmorphic elements.
- `GreedyAlgorithmCard.jsx`: Feature overview card.

## Step Generation & Playback

Algorithm logic is separated into standalone generators that produce step states consumed by the `useStepPlayback` hook:
- `src/algorithms/greedy/huffmanCodingSteps.js`
- `src/algorithms/greedy/fractionalKnapsackSteps.js`
- `src/algorithms/greedy/jobSequencingSteps.js`

To avoid dependency bundling overhead, steps are cloned using native browser `structuredClone()`.
