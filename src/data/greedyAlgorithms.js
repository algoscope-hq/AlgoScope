const createAlgorithm = (algorithm) => ({
  ...algorithm,
  complexity: {
    time: algorithm.timeComplexity,
    space: algorithm.spaceComplexity,
  },
})

const activitySelection = {
  cpp: `vector<pair<int,int>> selectActivities(vector<pair<int,int>> a) {
  sort(a.begin(), a.end(), [](auto x, auto y) { return x.second < y.second; });
  vector<pair<int,int>> answer; int lastFinish = -1;
  for (auto activity : a) if (activity.first >= lastFinish) {
    answer.push_back(activity); lastFinish = activity.second;
  }
  return answer;
}`,
  java: `static List<int[]> selectActivities(List<int[]> activities) {
  activities.sort(Comparator.comparingInt(a -> a[1]));
  List<int[]> answer = new ArrayList<>(); int lastFinish = -1;
  for (int[] activity : activities) if (activity[0] >= lastFinish) {
    answer.add(activity); lastFinish = activity[1];
  }
  return answer;
}`,
  python: `def select_activities(activities):
    chosen, last_finish = [], -1
    for start, finish in sorted(activities, key=lambda item: item[1]):
        if start >= last_finish:
            chosen.append((start, finish))
            last_finish = finish
    return chosen`,
  javascript: `function selectActivities(activities) {
  const chosen = []
  let lastFinish = -1
  for (const activity of [...activities].sort((a, b) => a.finish - b.finish)) {
    if (activity.start >= lastFinish) {
      chosen.push(activity)
      lastFinish = activity.finish
    }
  }
  return chosen
}`,
}

const fractionalKnapsack = {
  cpp: `struct Item { double value, weight; };
double fractionalKnapsack(vector<Item> items, double capacity) {
  sort(items.begin(), items.end(), [](Item a, Item b) {
    return a.value / a.weight > b.value / b.weight;
  });
  double total = 0;
  for (auto item : items) {
    double take = min(capacity, item.weight);
    total += take * item.value / item.weight; capacity -= take;
    if (capacity == 0) break;
  }
  return total;
}`,
  java: `record Item(double value, double weight) {}
static double fractionalKnapsack(List<Item> items, double capacity) {
  items.sort((a, b) -> Double.compare(b.value()/b.weight(), a.value()/a.weight()));
  double total = 0;
  for (Item item : items) {
    double take = Math.min(capacity, item.weight());
    total += take * item.value() / item.weight(); capacity -= take;
    if (capacity == 0) break;
  }
  return total;
}`,
  python: `def fractional_knapsack(items, capacity):
    total = 0
    for value, weight in sorted(items, key=lambda item: item[0] / item[1], reverse=True):
        take = min(capacity, weight)
        total += take * value / weight
        capacity -= take
        if capacity == 0: break
    return total`,
  javascript: `function fractionalKnapsack(items, capacity) {
  let total = 0
  for (const item of [...items].sort((a, b) => b.value/b.weight - a.value/a.weight)) {
    const take = Math.min(capacity, item.weight)
    total += take * item.value / item.weight
    capacity -= take
    if (capacity === 0) break
  }
  return total
}`,
}

const huffmanCoding = {
  cpp: `struct Node { char ch; int freq; Node *left, *right; };
struct Compare { bool operator()(Node* a, Node* b) { return a->freq > b->freq; } };
Node* buildHuffman(unordered_map<char,int> frequency) {
  priority_queue<Node*, vector<Node*>, Compare> heap;
  for (auto [ch, freq] : frequency) heap.push(new Node{ch, freq, nullptr, nullptr});
  while (heap.size() > 1) {
    auto left = heap.top(); heap.pop(); auto right = heap.top(); heap.pop();
    heap.push(new Node{'\\0', left->freq + right->freq, left, right});
  }
  return heap.empty() ? nullptr : heap.top();
}`,
  java: `class Node { char ch; int freq; Node left, right; Node(char ch, int freq) { this.ch = ch; this.freq = freq; } }
static Node buildHuffman(Map<Character, Integer> frequency) {
  PriorityQueue<Node> heap = new PriorityQueue<>(Comparator.comparingInt(n -> n.freq));
  frequency.forEach((ch, freq) -> heap.add(new Node(ch, freq)));
  while (heap.size() > 1) {
    Node left = heap.poll(), right = heap.poll();
    Node parent = new Node('\\0', left.freq + right.freq);
    parent.left = left; parent.right = right; heap.add(parent);
  }
  return heap.poll();
}`,
  python: `import heapq
def build_huffman(frequency):
    heap = [[count, index, char] for index, (char, count) in enumerate(frequency.items())]
    heapq.heapify(heap); index = len(heap)
    while len(heap) > 1:
        left, right = heapq.heappop(heap), heapq.heappop(heap)
        heapq.heappush(heap, [left[0] + right[0], index, (left, right)])
        index += 1
    return heap[0] if heap else None`,
  javascript: `class MinHeap {
  constructor() { this.values = [] }
  push(value) { this.values.push(value); this.values.sort((a, b) => a.freq - b.freq) }
  pop() { return this.values.shift() }
  get size() { return this.values.length }
}
function buildHuffman(frequency) {
  const heap = new MinHeap()
  for (const [char, freq] of Object.entries(frequency)) heap.push({ char, freq })
  while (heap.size > 1) {
    const left = heap.pop(), right = heap.pop()
    heap.push({ char: null, freq: left.freq + right.freq, left, right })
  }
  return heap.pop() ?? null
}`,
}

const jobSequencing = {
  cpp: `struct Job { char id; int deadline, profit; };
vector<char> scheduleJobs(vector<Job> jobs) {
  sort(jobs.begin(), jobs.end(), [](Job a, Job b) { return a.profit > b.profit; });
  int maxDeadline = 0; for (auto job : jobs) maxDeadline = max(maxDeadline, job.deadline);
  vector<char> slots(maxDeadline + 1, '\\0');
  for (auto job : jobs) for (int day = min(job.deadline, maxDeadline); day > 0; --day)
    if (!slots[day]) { slots[day] = job.id; break; }
  return slots;
}`,
  java: `record Job(char id, int deadline, int profit) {}
static char[] scheduleJobs(List<Job> jobs) {
  jobs.sort((a, b) -> b.profit() - a.profit());
  int maxDeadline = jobs.stream().mapToInt(Job::deadline).max().orElse(0);
  char[] slots = new char[maxDeadline + 1];
  for (Job job : jobs) for (int day = Math.min(job.deadline(), maxDeadline); day > 0; day--)
    if (slots[day] == 0) { slots[day] = job.id(); break; }
  return slots;
}`,
  python: `def schedule_jobs(jobs):
    slots = [None] * (max((job[1] for job in jobs), default=0) + 1)
    for job_id, deadline, _ in sorted(jobs, key=lambda job: job[2], reverse=True):
        for day in range(min(deadline, len(slots) - 1), 0, -1):
            if slots[day] is None:
                slots[day] = job_id
                break
    return slots[1:]`,
  javascript: `function scheduleJobs(jobs) {
  const slots = Array(Math.max(0, ...jobs.map((job) => job.deadline)) + 1).fill(null)
  for (const job of [...jobs].sort((a, b) => b.profit - a.profit)) {
    for (let day = Math.min(job.deadline, slots.length - 1); day > 0; day -= 1) {
      if (!slots[day]) { slots[day] = job.id; break }
    }
  }
  return slots.slice(1)
}`,
}

const dijkstra = {
  cpp: `vector<int> dijkstra(vector<vector<pair<int,int>>> graph, int source) {
  vector<int> distance(graph.size(), 1e9);
  priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> heap;
  distance[source] = 0; heap.push({0, source});
  while (!heap.empty()) {
    auto [dist, node] = heap.top(); heap.pop();
    if (dist != distance[node]) continue;
    for (auto [next, weight] : graph[node]) if (dist + weight < distance[next]) {
      distance[next] = dist + weight; heap.push({distance[next], next});
    }
  }
  return distance;
}`,
  java: `static int[] dijkstra(List<List<int[]>> graph, int source) {
  int[] distance = new int[graph.size()]; Arrays.fill(distance, Integer.MAX_VALUE);
  PriorityQueue<int[]> heap = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
  distance[source] = 0; heap.add(new int[] {0, source});
  while (!heap.isEmpty()) {
    int[] current = heap.poll(); if (current[0] != distance[current[1]]) continue;
    for (int[] edge : graph.get(current[1])) if (current[0] + edge[1] < distance[edge[0]]) {
      distance[edge[0]] = current[0] + edge[1]; heap.add(new int[] {distance[edge[0]], edge[0]});
    }
  }
  return distance;
}`,
  python: `from heapq import heappop, heappush
def dijkstra(graph, source):
    distance, heap = [float('inf')] * len(graph), [(0, source)]
    distance[source] = 0
    while heap:
        dist, node = heappop(heap)
        if dist != distance[node]: continue
        for neighbor, weight in graph[node]:
            if dist + weight < distance[neighbor]:
                distance[neighbor] = dist + weight
                heappush(heap, (distance[neighbor], neighbor))
    return distance`,
  javascript: `class MinHeap {
  constructor() { this.values = [] }
  push(value) { this.values.push(value); this.values.sort((a, b) => a[0] - b[0]) }
  pop() { return this.values.shift() }
  get size() { return this.values.length }
}
function dijkstra(graph, source) {
  const distance = Array(graph.length).fill(Infinity), queue = new MinHeap()
  distance[source] = 0; queue.push([0, source])
  while (queue.size) {
    const [dist, node] = queue.pop()
    if (dist !== distance[node]) continue
    for (const [next, weight] of graph[node]) if (dist + weight < distance[next]) {
      distance[next] = dist + weight; queue.push([distance[next], next])
    }
  }
  return distance
}`,
}

const prim = {
  cpp: `int prim(vector<vector<pair<int,int>>> graph) {
  vector<bool> used(graph.size());
  priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> heap;
  heap.push({0, 0}); int cost = 0;
  while (!heap.empty()) {
    auto [weight, node] = heap.top(); heap.pop();
    if (used[node]) continue;
    used[node] = true; cost += weight;
    for (auto [next, edgeWeight] : graph[node]) if (!used[next]) heap.push({edgeWeight, next});
  }
  return cost;
}`,
  java: `static int prim(List<List<int[]>> graph) {
  boolean[] used = new boolean[graph.size()];
  PriorityQueue<int[]> heap = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
  heap.add(new int[] {0, 0}); int cost = 0;
  while (!heap.isEmpty()) {
    int[] current = heap.poll(); if (used[current[1]]) continue;
    used[current[1]] = true; cost += current[0];
    for (int[] edge : graph.get(current[1])) if (!used[edge[0]]) heap.add(new int[] {edge[1], edge[0]});
  }
  return cost;
}`,
  python: `from heapq import heappop, heappush
def prim(graph):
    used, heap, cost = set(), [(0, 0)], 0
    while heap:
        weight, node = heappop(heap)
        if node in used: continue
        used.add(node); cost += weight
        for neighbor, edge_weight in graph[node]:
            if neighbor not in used: heappush(heap, (edge_weight, neighbor))
    return cost`,
  javascript: `class MinHeap {
  constructor() { this.values = [] }
  push(value) { this.values.push(value); this.values.sort((a, b) => a[0] - b[0]) }
  pop() { return this.values.shift() }
  get size() { return this.values.length }
}
function prim(graph) {
  const used = new Set(), queue = new MinHeap()
  let cost = 0
  queue.push([0, 0])
  while (queue.size) {
    const [weight, node] = queue.pop()
    if (used.has(node)) continue
    used.add(node); cost += weight
    for (const edge of graph[node]) if (!used.has(edge[0])) queue.push([edge[1], edge[0]])
  }
  return cost
}`,
}

const kruskal = {
  cpp: `struct Edge { int from, to, weight; };
int kruskal(int vertices, vector<Edge> edges) {
  vector<int> parent(vertices); iota(parent.begin(), parent.end(), 0);
  function<int(int)> find = [&](int node) { return parent[node] == node ? node : parent[node] = find(parent[node]); };
  sort(edges.begin(), edges.end(), [](Edge a, Edge b) { return a.weight < b.weight; });
  int cost = 0;
  for (auto edge : edges) if (find(edge.from) != find(edge.to)) {
    parent[find(edge.from)] = find(edge.to); cost += edge.weight;
  }
  return cost;
}`,
  java: `static int kruskal(int vertices, List<int[]> edges) {
  int[] parent = new int[vertices]; for (int i = 0; i < vertices; i++) parent[i] = i;
  edges.sort(Comparator.comparingInt(edge -> edge[2])); int cost = 0;
  for (int[] edge : edges) {
    int from = find(parent, edge[0]), to = find(parent, edge[1]);
    if (from != to) { parent[from] = to; cost += edge[2]; }
  }
  return cost;
}
static int find(int[] parent, int node) { return parent[node] == node ? node : (parent[node] = find(parent, parent[node])); }`,
  python: `def kruskal(vertices, edges):
    parent = list(range(vertices))
    def find(node):
        if parent[node] != node: parent[node] = find(parent[node])
        return parent[node]
    cost = 0
    for start, end, weight in sorted(edges, key=lambda edge: edge[2]):
        if find(start) != find(end):
            parent[find(start)] = find(end)
            cost += weight
    return cost`,
  javascript: `function kruskal(vertices, edges) {
  const parent = Array.from({ length: vertices }, (_, index) => index)
  const find = (node) => parent[node] === node ? node : (parent[node] = find(parent[node]))
  let cost = 0
  for (const [from, to, weight] of [...edges].sort((a, b) => a[2] - b[2])) {
    if (find(from) !== find(to)) { parent[find(from)] = find(to); cost += weight }
  }
  return cost
}`,
}

export const GREEDY_ALGORITHMS = [
  createAlgorithm({
    id: 'activity-selection', name: 'Activity Selection', summary: 'Choose the maximum number of non-overlapping activities by earliest finish time.',
    introduction: 'A classic interval-scheduling problem that shows why a local choice can yield a globally optimal result.',
    problemStatement: 'Choose the largest subset of activities in which no selected intervals overlap.',
    greedyStrategy: 'Sort by finish time and accept every activity compatible with the last selected one.',
    explanation: 'An earliest-finishing compatible activity leaves the most time for all future choices.', timeComplexity: 'O(n log n)', spaceComplexity: 'O(1) auxiliary',
    advantages: ['Optimal for unweighted intervals', 'One sorted scan'], limitations: ['Not for weighted intervals', 'Needs a clear overlap rule'], applications: ['Meeting rooms', 'Reservations', 'Resource scheduling'], edgeCases: ['No activities', 'Equal finishes', 'Touching endpoints', 'All overlap'], interviewQuestions: ['Why is earliest finish safe?', 'How does weighted scheduling differ?', 'How do multiple rooms change it?'],
    dryRun: [['Input', 'Order (1,2), (3,4), (0,6), (5,7), (8,9), (5,9) by finish time.'], ['Choose (1,2)', 'It leaves the widest remaining time window.'], ['Choose (3,4)', 'Start 3 is compatible with finish 2.'], ['Skip (0,6)', 'It overlaps the selected activity.'], ['Finish', 'Choose (5,7) and (8,9): four activities total.']], code: activitySelection,
  }),
  createAlgorithm({
    id: 'fractional-knapsack', name: 'Fractional Knapsack', summary: 'Maximize value by taking the best value-to-weight ratio first.',
    introduction: 'A greedy optimization problem in which items may be split into fractions.', problemStatement: 'Fill capacity W with item fractions for maximum value.', greedyStrategy: 'Sort by value/weight ratio and take each item fully or partially.', explanation: 'Every capacity unit should be assigned to the currently most valuable unit of weight.', timeComplexity: 'O(n log n)', spaceComplexity: 'O(1) auxiliary',
    advantages: ['Optimal when fractions are allowed', 'Simple ranking rule'], limitations: ['Wrong for 0/1 Knapsack', 'Weights must be positive'], applications: ['Cargo loading', 'Budget allocation', 'Bandwidth allocation'], edgeCases: ['Zero capacity', 'Zero-value item', 'Zero-weight item', 'Excess capacity'], interviewQuestions: ['Why not 0/1 Knapsack?', 'How handle zero weight?', 'Can equal ratios tie?'],
    dryRun: [['Input', 'Capacity 50; items (60,10), (100,20), (120,30), with ratios 6, 5, 4.'], ['Take item 1', 'Value 60, remaining capacity 40.'], ['Take item 2', 'Value 160, remaining capacity 20.'], ['Take fraction', 'Take 20/30 of item 3, add 80.'], ['Finish', 'Maximum value is 240.']], code: fractionalKnapsack,
  }),
  createAlgorithm({
    id: 'huffman-coding', name: 'Huffman Coding', summary: 'Build an optimal prefix-code tree by merging the two least frequent nodes.',
    introduction: 'A lossless compression method that gives common symbols shorter prefix codes.', problemStatement: 'Build a minimum weighted-path-length binary prefix code from symbol frequencies.', greedyStrategy: 'Repeatedly merge the two smallest-frequency nodes in a min-heap.', explanation: 'The least frequent symbols can occupy deepest sibling positions in an optimal tree.', timeComplexity: 'O(n log n)', spaceComplexity: 'O(n)',
    advantages: ['Optimal static prefix code', 'Lossless compression'], limitations: ['Needs frequencies first', 'Static tree does not adapt'], applications: ['File compression', 'Image formats', 'Network encoding'], edgeCases: ['Empty input', 'One symbol', 'Equal frequencies', 'Large totals'], interviewQuestions: ['Why is it prefix-free?', 'How generate bits?', 'What is adaptive Huffman?'],
    dryRun: [['Input', 'A:5, B:9, C:12, D:13, E:16, F:45.'], ['Merge A+B', 'Insert AB with frequency 14.'], ['Merge C+D', 'Insert CD with frequency 25; then merge AB+E = 30.'], ['Finish tree', 'Merge the remaining nodes and label left/right edges 0/1.']], code: huffmanCoding,
  }),
  createAlgorithm({
    id: 'job-sequencing', name: 'Job Sequencing', summary: 'Schedule profitable unit-time jobs before their deadlines.',
    introduction: 'A deadline scheduling problem with one job per time slot and a profit for each completed job.', problemStatement: 'Select and schedule unit-time jobs to maximize profit before deadlines.', greedyStrategy: 'Process highest-profit jobs first and put each in its latest free valid slot.', explanation: 'Latest placement preserves earlier slots for jobs that have tighter deadlines.', timeComplexity: 'O(n²)', spaceComplexity: 'O(n)',
    advantages: ['Easy for unit-duration jobs', 'Late placement preserves flexibility'], limitations: ['Assumes unit duration', 'Naive slot scan is slower'], applications: ['Batch processing', 'Ad allocation', 'Task selection'], edgeCases: ['Deadline one', 'Equal profits', 'Large deadlines', 'No free slot'], interviewQuestions: ['Why latest slot?', 'How does DSU improve it?', 'What about variable duration?'],
    dryRun: [['Input', 'a(2,100), b(1,19), c(2,27), d(1,25), e(3,15).'], ['Order', 'Sort as a, c, d, b, e by profit.'], ['Place a', 'Use slot 2.'], ['Place c', 'Use slot 1; d and b cannot fit.'], ['Finish', 'Place e in slot 3. Profit is 142.']], code: jobSequencing,
  }),
  createAlgorithm({
    id: 'dijkstra', name: "Dijkstra's Algorithm", summary: 'Find shortest distances from one source with non-negative weights.',
    introduction: 'A single-source shortest-path algorithm that grows a settled set of distances.', problemStatement: 'Find each reachable vertex’s shortest distance from a source in a non-negative weighted graph.', greedyStrategy: 'Settle the smallest tentative distance and relax its outgoing edges.', explanation: 'A smallest tentative distance cannot improve later when every edge weight is non-negative.', timeComplexity: 'O((V + E) log V)', spaceComplexity: 'O(V)',
    advantages: ['Efficient on sparse graphs', 'Can reconstruct paths'], limitations: ['Fails on negative edges', 'One source per run'], applications: ['GPS routing', 'Network routing', 'Pathfinding'], edgeCases: ['Unreachable nodes', 'Zero weights', 'Parallel edges', 'Negative edges'], interviewQuestions: ['Why no negatives?', 'How recover paths?', 'When Bellman-Ford?'],
    dryRun: [['Start', 'A=0; B, C, D are infinity.'], ['Settle A', 'A→B(4), A→C(1): B=4, C=1.'], ['Settle C', 'C→B(2), C→D(5): B=3, D=6.'], ['Finish', 'Settle B and relax B→D(1): D=4.']], code: dijkstra,
  }),
  createAlgorithm({
    id: 'prim', name: "Prim's Algorithm", summary: 'Grow a minimum spanning tree by choosing the lightest edge to a new vertex.',
    introduction: 'An MST algorithm that expands a single connected tree from any starting vertex.', problemStatement: 'Connect all vertices of a weighted undirected graph with minimum total weight and no cycle.', greedyStrategy: 'Choose the lightest edge crossing from the current tree to an unvisited vertex.', explanation: 'The cut property guarantees that the lightest crossing edge is safe for an MST.', timeComplexity: 'O((V + E) log V)', spaceComplexity: 'O(V + E)',
    advantages: ['Incremental tree construction', 'Works well with adjacency lists'], limitations: ['Needs connectivity for one tree', 'Not a shortest-path algorithm'], applications: ['Network design', 'Circuit layout', 'Clustering'], edgeCases: ['One vertex', 'Disconnected graph', 'Equal weights', 'Self-loops'], interviewQuestions: ['Prim vs Dijkstra?', 'What is the cut property?', 'How return a forest?'],
    dryRun: [['Start', 'At A: candidates A-B(1), A-C(4).'], ['Choose A-B', 'Add weight 1.'], ['Update', 'Candidates include B-C(2), B-D(5), A-C(4).'], ['Finish', 'Choose B-C(2), then C-D(3): cost 6.']], code: prim,
  }),
  createAlgorithm({
    id: 'kruskal', name: "Kruskal's Algorithm", summary: 'Build a minimum spanning tree from globally lightest safe edges.',
    introduction: 'An MST algorithm that processes every edge from lightest to heaviest.', problemStatement: 'Choose minimum-weight edges that connect all vertices without creating cycles.', greedyStrategy: 'Sort edges and add an edge only when its endpoints are in different components.', explanation: 'Union-find checks cycles efficiently while the cut property validates each safe edge.', timeComplexity: 'O(E log E)', spaceComplexity: 'O(V)',
    advantages: ['Excellent for sparse graphs', 'Naturally returns a forest'], limitations: ['Sorts all edges', 'Not a shortest-path algorithm'], applications: ['Network design', 'Image segmentation', 'Single-link clustering'], edgeCases: ['Disconnected graph', 'Parallel edges', 'Equal ties', 'Self-loops'], interviewQuestions: ['Why union-find?', 'Kruskal vs Prim?', 'When stop early?'],
    dryRun: [['Order', 'A-B(1), B-C(2), C-D(3), A-C(4), B-D(5).'], ['Add A-B', 'Different components, so accept it.'], ['Add B-C and C-D', 'Both are safe; cost is 6.'], ['Skip A-C', 'Its endpoints are already connected, so it creates a cycle.']], code: kruskal,
  }),
]

export const DEFAULT_GREEDY_ALGORITHM = GREEDY_ALGORITHMS[0]
