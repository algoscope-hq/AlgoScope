export const shortestPathSources = {
  dijkstra: {
    network: {
      javascript: {
        code: `function dijkstra(graph, start) {
  const dists = {};
  const pq = new PriorityQueue((a, b) => a.d < b.d);
  dists[start] = 0;
  pq.push({ node: start, d: 0 });
  while (!pq.isEmpty()) {
    const { node, d } = pq.pop();
    if (d > (dists[node] ?? Infinity)) continue;
    for (const [neighbor, weight] of Object.entries(graph[node])) {
      const newDist = d + weight;
      if (newDist < (dists[neighbor] ?? Infinity)) {
        dists[neighbor] = newDist;
        pq.push({ node: neighbor, d: newDist });
      }
    }
  }
  return dists;
}`,
      },
      python: {
        code: `import heapq
def dijkstra(graph, start):
    dists = {node: float('inf') for node in graph}
    dists[start] = 0
    pq = [(0, start)]
    while pq:
        d, u = heapq.heappop(pq)
        if d > dists[u]: continue
        for v, weight in graph[u].items():
            if dists[u] + weight < dists[v]:
                dists[v] = dists[u] + weight
                heapq.heappush(pq, (dists[v], v))
    return dists`,
      },
      cpp: {
        code: `#include <vector>
#include <queue>
#include <climits>
using namespace std;
vector<int> dijkstra(int n, vector<vector<pair<int, int>>>& adj, int start) {
    vector<int> dist(n, INT_MAX);
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
    dist[start] = 0;
    pq.push({0, start});
    while (!pq.empty()) {
        int d = pq.top().first; int u = pq.top().second; pq.pop();
        if (d > dist[u]) continue;
        for (auto& edge : adj[u]) {
            if (dist[u] + edge.second < dist[edge.first]) {
                dist[edge.first] = dist[u] + edge.second;
                pq.push({dist[edge.first], edge.first});
            }
        }
    }
    return dist;
}`,
      },
      java: {
        code: `import java.util.*;
public int[] dijkstra(int n, List<List<int[]>> adj, int start) {
    int[] dist = new int[n]; Arrays.fill(dist, Integer.MAX_VALUE);
    PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[1]));
    dist[start] = 0; pq.add(new int[]{start, 0});
    while (!pq.isEmpty()) {
        int[] curr = pq.poll(); int u = curr[0]; int d = curr[1];
        if (d > dist[u]) continue;
        for (int[] edge : adj.get(u)) {
            if (dist[u] + edge[1] < dist[edge[0]]) {
                dist[edge[0]] = dist[u] + edge[1];
                pq.add(new int[]{edge[0], dist[edge[0]]});
            }
        }
    }
    return dist;
}`,
      },
      c: {
        code: `void dijkstra(int n, int graph[100][100], int start, int* dist) {
    int visited[100] = {0};
    for(int i=0; i<n; i++) dist[i] = 1e9;
    dist[start] = 0;
    for(int count=0; count<n-1; count++) {
        int u = -1, min = 1e9;
        for(int v=0; v<n; v++) if(!visited[v] && dist[v] < min) { min = dist[v]; u = v; }
        if(u == -1) break; visited[u] = 1;
        for(int v=0; v<n; v++) if(graph[u][v] && !visited[v] && dist[u] + graph[u][v] < dist[v]) dist[v] = dist[u] + graph[u][v];
    }
}`,
      },
      rust: {
        code: `use std::collections::BinaryHeap;
use std::cmp::Ordering;
#[derive(Copy, Clone, Eq, PartialEq)] struct State { cost: usize, pos: usize }
impl Ord for State { fn cmp(&self, other: &Self) -> Ordering { other.cost.cmp(&self.cost) } }
impl PartialOrd for State { fn partial_cmp(&self, other: &Self) -> Option<Ordering> { Some(self.cmp(other)) } }
fn dijkstra(n: usize, adj: &Vec<Vec<(usize, usize)>>, start: usize) -> Vec<usize> {
    let mut dist = vec![usize::MAX; n];
    let mut pq = BinaryHeap::new();
    dist[start] = 0; pq.push(State { cost: 0, pos: start });
    while let Some(State { cost, pos }) = pq.pop() {
        if cost > dist[pos] { continue; }
        for &(next, weight) in &adj[pos] {
            if dist[pos] + weight < dist[next] {
                dist[next] = dist[pos] + weight;
                pq.push(State { cost: dist[next], pos: next });
            }
        }
    }
    dist
}`,
      },
      go: {
        code: `import "container/heap"
type Item struct { node, dist int }
type PriorityQueue []*Item
func (pq PriorityQueue) Len() int { return len(pq) }
func (pq PriorityQueue) Less(i, j int) bool { return pq[i].dist < pq[j].dist }
func (pq PriorityQueue) Swap(i, j int) { pq[i], pq[j] = pq[j], pq[i] }
func (pq *PriorityQueue) Push(x interface{}) { *pq = append(*pq, x.(*Item)) }
func (pq *PriorityQueue) Pop() interface{} { old := *pq; n := len(old); item := old[n-1]; *pq = old[0:n-1]; return item }
func dijkstra(n int, adj [][]struct{to, w int}, start int) []int {
    dist := make([]int, n); for i := range dist { dist[i] = 1e9 }; dist[start] = 0
    pq := &PriorityQueue{{start, 0}}; heap.Init(pq)
    for pq.Len() > 0 {
        curr := heap.Pop(pq).(*Item)
        if curr.dist > dist[curr.node] { continue }
        for _, edge := range adj[curr.node] {
            if dist[curr.node] + edge.w < dist[edge.to] {
                dist[edge.to] = dist[curr.node] + edge.w
                heap.Push(pq, &Item{edge.to, dist[edge.to]})
            }
        }
    }
    return dist
}`,
      },
    },
    grid: {
      javascript: {
        code: `function dijkstra(grid, start) {
  if (!Array.isArray(grid) || grid.length === 0 || !Array.isArray(grid[0]) || grid[0].length === 0) return [];
  const R = grid.length, C = grid[0].length;
  if (!start || start.r < 0 || start.r >= R || start.c < 0 || start.c >= C || grid[start.r][start.c] === 1) return [];
  const dist = Array.from({ length: R }, () => Array(C).fill(Infinity));
  const pq = new MinPriorityQueue();
  dist[start.r][start.c] = 0;
  pq.enqueue({ r: start.r, c: start.c, d: 0 }, 0);
  while (!pq.isEmpty()) {
    const { element } = pq.dequeue();
    const { r, c, d } = element;
    if (d > dist[r][c]) continue;
    [[0, 1], [0, -1], [1, 0], [-1, 0]].forEach(([dr, dc]) => {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < R && nc >= 0 && nc < C && grid[nr][nc] !== 1 && dist[r][c] + 1 < dist[nr][nc]) {
        dist[nr][nc] = dist[r][c] + 1;
        pq.enqueue({ r: nr, c: nc, d: dist[nr][nc] }, dist[nr][nc]);
      }
    });
  }
  return dist;
}`,
      },
      python: {
        code: `import heapq
def dijkstra(grid, start):
    if not grid or not grid[0]: return []
    R, C = len(grid), len(grid[0])
    if start[0] < 0 or start[0] >= R or start[1] < 0 or start[1] >= C or grid[start[0]][start[1]] == 1: return []
    dists = [[float('inf')] * C for _ in range(R)]
    dists[start[0]][start[1]] = 0
    pq = [(0, start[0], start[1])]
    while pq:
        d, r, c = heapq.heappop(pq)
        if d > dists[r][c]: continue
        for dr, dc in [[0, 1], [0, -1], [1, 0], [-1, 0]]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < R and 0 <= nc < C and grid[nr][nc] != 1 and d + 1 < dists[nr][nc]:
                dists[nr][nc] = d + 1
                heapq.heappush(pq, (dists[nr][nc], nr, nc))
    return dists`,
      },
      cpp: {
        code: `#include <vector>
#include <queue>
using namespace std;
vector<vector<int>> dijkstra(vector<vector<int>>& grid, pair<int, int> start) {
    if (grid.empty() || grid[0].empty()) return {};
    int R = grid.size(), C = grid[0].size();
    if (start.first < 0 || start.first >= R || start.second < 0 || start.second >= C || grid[start.first][start.second] == 1) return {};
    vector<vector<int>> dist(R, vector<int>(C, 1e9));
    priority_queue<pair<int, pair<int, int>>, vector<pair<int, pair<int, int>>>, greater<>> pq;
    dist[start.first][start.second] = 0; pq.push({0, start});
    while (!pq.empty()) {
        auto [d, curr] = pq.top(); pq.pop();
        int r = curr.first, c = curr.second;
        if (d > dist[r][c]) continue;
        for (auto [dr, dc] : vector<pair<int, int>>{{0, 1}, {0, -1}, {1, 0}, {-1, 0}}) {
            int nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < R && nc >= 0 && nc < C && grid[nr][nc] != 1 && dist[r][c] + 1 < dist[nr][nc]) {
                dist[nr][nc] = dist[r][c] + 1; pq.push({dist[nr][nc], {nr, nc}});
            }
        }
    }
    return dist;
}`,
      },
      java: {
        code: `import java.util.*;
public int[][] dijkstra(int[][] grid, int[] start) {
    if (grid == null || grid.length == 0 || grid[0].length == 0) return new int[0][0];
    int R = grid.length, C = grid[0].length;
    if (start[0] < 0 || start[0] >= R || start[1] < 0 || start[1] >= C || grid[start[0]][start[1]] == 1) return new int[0][0];
    int[][] dist = new int[R][C]; for (int[] row : dist) Arrays.fill(row, 1000000000);
    PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
    dist[start[0]][start[1]] = 0; pq.add(new int[]{0, start[0], start[1]});
    while (!pq.isEmpty()) {
        int[] curr = pq.poll(); int d = curr[0], r = curr[1], c = curr[2];
        if (d > dist[r][c]) continue;
        for (int[] dir : new int[][]{{0, 1}, {0, -1}, {1, 0}, {-1, 0}}) {
            int nr = r + dir[0], nc = c + dir[1];
            if (nr >= 0 && nr < R && nc >= 0 && nc < C && grid[nr][nc] != 1 && d + 1 < dist[nr][nc]) {
                dist[nr][nc] = d + 1; pq.add(new int[]{d + 1, nr, nc});
            }
        }
    }
    return dist;
}`,
      },
      c: {
        code: `void dijkstra(int R, int C, int grid[100][100], int startR, int startC, int dist[100][100]) {
    if (R <= 0 || C <= 0 || startR < 0 || startR >= R || startC < 0 || startC >= C || grid[startR][startC] == 1) return;
    for (int i = 0; i < R; i++) for (int j = 0; j < C; j++) dist[i][j] = 1e9;
    dist[startR][startC] = 0;
    for (int k = 0; k < R * C; k++) {
        for (int r = 0; r < R; r++) for (int c = 0; c < C; c++) {
            if (grid[r][c] == 1 || dist[r][c] == 1e9) continue;
            int dr[] = {0, 0, 1, -1}, dc[] = {1, -1, 0, 0};
            for (int i = 0; i < 4; i++) {
                int nr = r + dr[i], nc = c + dc[i];
                if (nr >= 0 && nr < R && nc >= 0 && nc < C && grid[nr][nc] != 1 && dist[r][c] + 1 < dist[nr][nc])
                    dist[nr][nc] = dist[r][c] + 1;
            }
        }
    }
}`,
      },
      rust: {
        code: `use std::collections::BinaryHeap;
fn dijkstra(grid: &Vec<Vec<i32>>, start: (usize, usize)) -> Vec<Vec<i32>> {
    if grid.is_empty() || grid[0].is_empty() { return vec![]; }
    let (R, C) = (grid.len(), grid[0].len());
    if start.0 >= R || start.1 >= C || grid[start.0][start.1] == 1 { return vec![]; }
    let mut dist = vec![vec![i32::MAX; C]; R];
    let mut pq = BinaryHeap::new();
    dist[start.0][start.1] = 0; pq.push((0, start.0, start.1));
    while let Some((d, r, c)) = pq.pop() {
        let d = -d;
        if d > dist[r][c] { continue; }
        for (dr, dc) in [(0, 1), (0, -1), (1, 0), (-1, 0)] {
            let (nr, nc) = (r as i32 + dr, c as i32 + dc);
            if nr >= 0 && nr < R as i32 && nc >= 0 && nc < C as i32 && grid[nr as usize][nc as usize] != 1 && d + 1 < dist[nr as usize][nc as usize] {
                dist[nr as usize][nc as usize] = d + 1; pq.push((-(d + 1), nr as usize, nc as usize));
            }
        }
    }
    dist
}`,
      },
      go: {
        code: `type GridItem struct { r, c, dist int }
type GridPQ []*GridItem
func (pq GridPQ) Len() int { return len(pq) }
func (pq GridPQ) Less(i, j int) bool { return pq[i].dist < pq[j].dist }
func (pq GridPQ) Swap(i, j int) { pq[i], pq[j] = pq[j], pq[i] }
func (pq *GridPQ) Push(x interface{}) { *pq = append(*pq, x.(*GridItem)) }
func (pq *GridPQ) Pop() interface{} { old := *pq; n := len(old); item := old[n-1]; *pq = old[0:n-1]; return item }
func dijkstra(grid [][]int, start [2]int) [][]int {
    if len(grid) == 0 || len(grid[0]) == 0 { return [][]int{} }
    R, C := len(grid), len(grid[0])
    if start[0] < 0 || start[0] >= R || start[1] < 0 || start[1] >= C || grid[start[0]][start[1]] == 1 { return [][]int{} }
    dist := make([][]int, R); for i := range dist { dist[i] = make([]int, C); for j := range dist[i] { dist[i][j] = 1e9 } }; dist[start[0]][start[1]] = 0
    pq := &GridPQ{{start[0], start[1], 0}}; heap.Init(pq)
    for pq.Len() > 0 {
        curr := heap.Pop(pq).(*GridItem)
        if curr.dist != dist[curr.r][curr.c] { continue }
        for _, d := range [][2]int{{0, 1}, {0, -1}, {1, 0}, {-1, 0}} {
            nr, nc := curr.r+d[0], curr.c+d[1]
            if nr >= 0 && nr < R && nc >= 0 && nc < C && grid[nr][nc] != 1 && dist[curr.r][curr.c]+1 < dist[nr][nc] {
                dist[nr][nc] = dist[curr.r][curr.c]+1; heap.Push(pq, &GridItem{nr, nc, dist[nr][nc]})
            }
        }
    }
    return dist
}`,
      },
    },
  },
  bellmanford: {
    network: {
      javascript: {
        code: `function bellmanFord(V, edges, src) {
  const dist = new Array(V).fill(Infinity);
  dist[src] = 0;
  for (let i = 0; i < V - 1; i++) {
    for (const [u, v, w] of edges) {
      if (dist[u] !== Infinity && dist[u] + w < dist[v]) dist[v] = dist[u] + w;
    }
  }
  for (const [u, v, w] of edges) {
    if (dist[u] !== Infinity && dist[u] + w < dist[v]) return null;
  }
  return dist;
}`,
      },
      python: {
        code: `def bellman_ford(V, edges, src):
    dist = [float('inf')] * V
    dist[src] = 0
    for _ in range(V - 1):
        for u, v, w in edges:
            if dist[u] != float('inf') and dist[u] + w < dist[v]: dist[v] = dist[u] + w
    for u, v, w in edges:
        if dist[u] != float('inf') and dist[u] + w < dist[v]: return None
    return dist`,
      },
      cpp: {
        code: `#include <vector>
using namespace std;
vector<int> bellman_ford(int V, vector<vector<int>>& edges, int src) {
    vector<int> dist(V, 1e9); dist[src] = 0;
    for (int i = 0; i < V - 1; i++)
        for (auto& e : edges)
            if (dist[e[0]] != 1e9 && dist[e[0]] + e[2] < dist[e[1]]) dist[e[1]] = dist[e[0]] + e[2];
    for (auto& e : edges)
        if (dist[e[0]] != 1e9 && dist[e[0]] + e[2] < dist[e[1]]) return {};
    return dist;
}`,
      },
      java: {
        code: `import java.util.*;
public int[] bellmanFord(int V, int[][] edges, int src) {
    int[] dist = new int[V]; Arrays.fill(dist, 1000000000);
    dist[src] = 0;
    for (int i = 0; i < V - 1; i++)
        for (int[] e : edges)
            if (dist[e[0]] != 1000000000 && dist[e[0]] + e[2] < dist[e[1]]) dist[e[1]] = dist[e[0]] + e[2];
    for (int[] e : edges)
        if (dist[e[0]] != 1000000000 && dist[e[0]] + e[2] < dist[e[1]]) return null;
    return dist;
}`,
      },
      c: {
        code: `int* bellman_ford(int V, int E, int edges[100][3], int src) {
    static int dist[100];
    for (int i = 0; i < V; i++) dist[i] = 1e9; dist[src] = 0;
    for (int i = 0; i < V - 1; i++)
        for (int j = 0; j < E; j++)
            if (dist[edges[j][0]] != 1e9 && dist[edges[j][0]] + edges[j][2] < dist[edges[j][1]]) dist[edges[j][1]] = dist[edges[j][0]] + edges[j][2];
    for (int j = 0; j < E; j++)
        if (dist[edges[j][0]] != 1e9 && dist[edges[j][0]] + edges[j][2] < dist[edges[j][1]]) return NULL;
    return dist;
}`,
      },
      rust: {
        code: `fn bellman_ford(v: usize, edges: &[(usize, usize, i32)], src: usize) -> Option<Vec<i32>> {
    let mut dist = vec![i32::MAX; v]; dist[src] = 0;
    for _ in 0..v - 1 {
        for &(u, v, w) in edges {
            if dist[u] != i32::MAX && dist[u] + w < dist[v] { dist[v] = dist[u] + w; }
        }
    }
    for &(u, v, w) in edges {
        if dist[u] != i32::MAX && dist[u] + w < dist[v] { return None; }
    }
    Some(dist)
}`,
      },
      go: {
        code: `func bellmanFord(V int, edges [][]int, src int) []int {
    dist := make([]int, V); for i := range dist { dist[i] = 1e9 }; dist[src] = 0
    for i := 0; i < V - 1; i++ {
        for _, e := range edges {
            if dist[e[0]] != 1e9 && dist[e[0]] + e[2] < dist[e[1]] { dist[e[1]] = dist[e[0]] + e[2] }
        }
    }
    for _, e := range edges {
        if dist[e[0]] != 1e9 && dist[e[0]] + e[2] < dist[e[1]] { return nil }
    }
    return dist
}`,
      },
    },
    grid: {
      javascript: {
        code: `function bellmanFord(grid, start) {
  if (!Array.isArray(grid) || grid.length === 0 || !Array.isArray(grid[0]) || grid[0].length === 0) return [];
  const R = grid.length, C = grid[0].length;
  if (!start || start.r < 0 || start.r >= R || start.c < 0 || start.c >= C || grid[start.r][start.c] === 1) return [];
  const dist = Array.from({ length: R }, () => Array(C).fill(Infinity));
  dist[start.r][start.c] = 0;
  for (let k = 0; k < R * C; k++) {
    for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
      if (grid[r][c] === 1 || dist[r][c] === Infinity) continue;
      [[0, 1], [0, -1], [1, 0], [-1, 0]].forEach(([dr, dc]) => {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < R && nc >= 0 && nc < C && grid[nr][nc] !== 1 && dist[r][c] + 1 < dist[nr][nc])
          dist[nr][nc] = dist[r][c] + 1;
      });
    }
  }
  return dist;
}`,
      },
      python: {
        code: `def bellman_ford(grid, start):
    if not grid or not grid[0]: return []
    R, C = len(grid), len(grid[0])
    if start[0] < 0 or start[0] >= R or start[1] < 0 or start[1] >= C or grid[start[0]][start[1]] == 1: return []
    dist = [[float('inf')] * C for _ in range(R)]
    dist[start[0]][start[1]] = 0
    for _ in range(R * C):
        for r in range(R):
            for c in range(C):
                if grid[r][c] == 1 or dist[r][c] == float('inf'): continue
                for dr, dc in [[0, 1], [0, -1], [1, 0], [-1, 0]]:
                    nr, nc = r + dr, c + dc
                    if 0 <= nr < R and 0 <= nc < C and grid[nr][nc] != 1 and dist[r][c] + 1 < dist[nr][nc]:
                        dist[nr][nc] = dist[r][c] + 1
    return dist`,
      },
      cpp: {
        code: `#include <vector>
using namespace std;
vector<vector<int>> bellman_ford(vector<vector<int>>& grid, pair<int, int> start) {
    if (grid.empty() || grid[0].empty()) return {};
    int R = grid.size(), C = grid[0].size();
    if (start.first < 0 || start.first >= R || start.second < 0 || start.second >= C || grid[start.first][start.second] == 1) return {};
    vector<vector<int>> dist(R, vector<int>(C, 1e9)); dist[start.first][start.second] = 0;
    for (int k = 0; k < R * C; k++)
        for (int r = 0; r < R; r++) for (int c = 0; c < C; c++)
            if (grid[r][c] != 1 && dist[r][c] != 1e9)
                for (auto [dr, dc] : vector<pair<int, int>>{{0, 1}, {0, -1}, {1, 0}, {-1, 0}}) {
                    int nr = r + dr, nc = c + dc;
                    if (nr >= 0 && nr < R && nc >= 0 && nc < C && grid[nr][nc] != 1 && dist[r][c] + 1 < dist[nr][nc])
                        dist[nr][nc] = dist[r][c] + 1;
                }
    return dist;
}`,
      },
      java: {
        code: `public int[][] bellmanFord(int[][] grid, int[] start) {
    if (grid == null || grid.length == 0 || grid[0].length == 0) return new int[0][0];
    int R = grid.length, C = grid[0].length;
    if (start[0] < 0 || start[0] >= R || start[1] < 0 || start[1] >= C || grid[start[0]][start[1]] == 1) return new int[0][0];
    int[][] dist = new int[R][C]; for (int[] row : dist) Arrays.fill(row, 1000000000);
    dist[start[0]][start[1]] = 0;
    for (int k = 0; k < R * C; k++)
        for (int r = 0; r < R; r++) for (int c = 0; c < C; c++)
            if (grid[r][c] != 1 && dist[r][c] != 1000000000)
                for (int[] d : new int[][]{{0, 1}, {0, -1}, {1, 0}, {-1, 0}}) {
                    int nr = r + d[0], nc = c + d[1];
                    if (nr >= 0 && nr < R && nc >= 0 && nc < C && grid[nr][nc] != 1 && dist[r][c] + 1 < dist[nr][nc])
                        dist[nr][nc] = dist[r][c] + 1;
                }
    return dist;
}`,
      },
      c: {
        code: `int** bellman_ford(int R, int C, int grid[100][100], int startR, int startC) {
    if (R <= 0 || C <= 0 || startR < 0 || startR >= R || startC < 0 || startC >= C || grid[startR][startC] == 1) return NULL;
    int** dist = malloc(R * sizeof(int*));
    for (int i = 0; i < R; i++) { dist[i] = malloc(C * sizeof(int)); for (int j = 0; j < C; j++) dist[i][j] = 1e9; }
    dist[startR][startC] = 0;
    for (int k = 0; k < R * C; k++) for (int r = 0; r < R; r++) for (int c = 0; c < C; c++) {
        if (grid[r][c] == 1 || dist[r][c] == 1e9) continue;
        int dr[] = {0, 0, 1, -1}, dc[] = {1, -1, 0, 0};
        for (int i = 0; i < 4; i++) {
            int nr = r + dr[i], nc = c + dc[i];
            if (nr >= 0 && nr < R && nc >= 0 && nc < C && grid[nr][nc] != 1 && dist[r][c] + 1 < dist[nr][nc])
                dist[nr][nc] = dist[r][c] + 1;
        }
    }
    return dist;
}`,
      },
      rust: {
        code: `fn bellman_ford(grid: &Vec<Vec<i32>>, start: (usize, usize)) -> Option<Vec<Vec<i32>>> {
    if grid.is_empty() || grid[0].is_empty() { return None; }
    let (R, C) = (grid.len(), grid[0].len());
    if start.0 >= R || start.1 >= C || grid[start.0][start.1] == 1 { return None; }
    let mut dist = vec![vec![1000000; C]; R]; dist[start.0][start.1] = 0;
    for _ in 0..R * C { for r in 0..R { for c in 0..C {
        if grid[r][c] == 1 || dist[r][c] == 1000000 { continue; }
        for (dr, dc) in [(0, 1), (0, -1), (1, 0), (-1, 0)] {
            let (nr, nc) = (r as i32 + dr, c as i32 + dc);
            if nr >= 0 && nr < R as i32 && nc >= 0 && nc < C as i32 && grid[nr as usize][nc as usize] != 1 && dist[r][c] + 1 < dist[nr as usize][nc as usize] {
                dist[nr as usize][nc as usize] = dist[r][c] + 1;
            }
        }
    }}}
    Some(dist)
}`,
      },
      go: {
        code: `func bellmanFord(grid [][]int, start [2]int) [][]int {
    if len(grid) == 0 || len(grid[0]) == 0 { return nil }
    R, C := len(grid), len(grid[0])
    if start[0] < 0 || start[0] >= R || start[1] < 0 || start[1] >= C || grid[start[0]][start[1]] == 1 { return nil }
    dist := make([][]int, R); for i := range dist { dist[i] = make([]int, C); for j := range dist[i] { dist[i][j] = 1e9 } }; dist[start[0]][start[1]] = 0
    for k := 0; k < R * C; k++ { for r := 0; r < R; r++ { for c := 0; c < C; c++ {
        if grid[r][c] == 1 || dist[r][c] == 1e9 { continue };
        for _, d := range [][2]int{{0, 1}, {0, -1}, {1, 0}, {-1, 0}} {
            nr, nc := r+d[0], c+d[1]
            if nr >= 0 && nr < R && nc >= 0 && nc < C && grid[nr][nc] != 1 && dist[r][c] + 1 < dist[nr][nc] { dist[nr][nc] = dist[r][c] + 1 }
        }
    }}}
    return dist
}`,
      },
    },
  },
  floydwarshall: {
    network: {
      javascript: {
        code: `function floydWarshall(V, graph) {
  let dist = graph.map(r => [...r]);
  for (let k = 0; k < V; k++)
    for (let i = 0; i < V; i++)
      for (let j = 0; j < V; j++)
        if (dist[i][k] !== Infinity && dist[k][j] !== Infinity)
            dist[i][j] = Math.min(dist[i][j], dist[i][k] + dist[k][j]);
  return dist;
}`,
      },
      python: {
        code: `def floyd_warshall(V, graph):
    dist = [row[:] for row in graph]
    for k in range(V):
        for i in range(V):
            for j in range(V):
                if dist[i][k] != float('inf') and dist[k][j] != float('inf'):
                    dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])
    return dist`,
      },
      cpp: {
        code: `#include <vector>
#include <algorithm>
using namespace std;
vector<vector<int>> floyd_warshall(int V, vector<vector<int>>& graph) {
    auto dist = graph;
    for (int k = 0; k < V; k++) for (int i = 0; i < V; i++) for (int j = 0; j < V; j++)
        if (dist[i][k] != 1e9 && dist[k][j] != 1e9)
            dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]);
    return dist;
}`,
      },
      java: {
        code: `public int[][] floydWarshall(int V, int[][] graph) {
    int[][] dist = new int[V][V]; for (int i = 0; i < V; i++) dist[i] = graph[i].clone();
    for (int k = 0; k < V; k++) for (int i = 0; i < V; i++) for (int j = 0; j < V; j++)
        if (dist[i][k] != 1000000000 && dist[k][j] != 1000000000)
            dist[i][j] = Math.min(dist[i][j], dist[i][k] + dist[k][j]);
    return dist;
}`,
      },
      c: {
        code: `void floyd_warshall(int V, int graph[100][100], int dist[100][100]) {
    for (int i = 0; i < V; i++) for (int j = 0; j < V; j++) dist[i][j] = graph[i][j];
    for (int k = 0; k < V; k++) for (int i = 0; i < V; i++) for (int j = 0; j < V; j++)
        if (dist[i][k] != 1e9 && dist[k][j] != 1e9 && dist[i][k] + dist[k][j] < dist[i][j]) dist[i][j] = dist[i][k] + dist[k][j];
}`,
      },
      rust: {
        code: `fn floyd_warshall(v: usize, graph: &Vec<Vec<i32>>) -> Vec<Vec<i32>> {
    let mut dist = graph.clone();
    for k in 0..v { for i in 0..v { for j in 0..v {
        if dist[i][k] != i32::MAX && dist[k][j] != i32::MAX {
            dist[i][j] = dist[i][j].min(dist[i][k] + dist[k][j]);
        }
    }}};
    dist
}`,
      },
      go: {
        code: `func floydWarshall(V int, graph [][]int) [][]int {
    dist := make([][]int, V); for i := range graph { dist[i] = append([]int(nil), graph[i]...) }
    for k := 0; k < V; k++ { for i := 0; i < V; i++ { for j := 0; j < V; j++ {
        if dist[i][k] != 1e9 && dist[k][j] != 1e9 && dist[i][k] + dist[k][j] < dist[i][j] { dist[i][j] = dist[i][k] + dist[k][j] }
    }}}
    return dist
}`,
      },
    },
    grid: {
      javascript: {
        code: `function floydWarshall(grid) {
  if (!Array.isArray(grid) || grid.length === 0 || !Array.isArray(grid[0]) || grid[0].length === 0) return [];
  const R = grid.length, C = grid[0].length, N = R * C;
  const dist = Array.from({ length: N }, () => Array(N).fill(Infinity));
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
    if (grid[r][c] === 1) continue;
    dist[r * C + c][r * C + c] = 0;
    [[0, 1], [0, -1], [1, 0], [-1, 0]].forEach(([dr, dc]) => {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < R && nc >= 0 && nc < C && grid[nr][nc] !== 1) dist[r * C + c][nr * C + nc] = 1;
    });
  }
  for (let k = 0; k < N; k++) for (let i = 0; i < N; i++) for (let j = 0; j < N; j++)
    if (dist[i][k] !== Infinity && dist[k][j] !== Infinity)
        dist[i][j] = Math.min(dist[i][j], dist[i][k] + dist[k][j]);
  return dist;
}`,
      },
      python: {
        code: `def floyd_warshall(grid):
    if not grid or not grid[0]: return []
    R, C = len(grid), len(grid[0])
    N = R * C
    dist = [[float('inf')] * N for _ in range(N)]
    for r in range(R):
        for c in range(C):
            if grid[r][c] == 1: continue
            dist[r * C + c][r * C + c] = 0
            for dr, dc in [[0, 1], [0, -1], [1, 0], [-1, 0]]:
                nr, nc = r + dr, c + dc
                if 0 <= nr < R and 0 <= nc < C and grid[nr][nc] != 1: dist[r * C + c][nr * C + nc] = 1
    for k in range(N):
        for i in range(N):
            for j in range(N):
                if dist[i][k] != float('inf') and dist[k][j] != float('inf'):
                    dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])
    return dist`,
      },
      cpp: {
        code: `#include <vector>
#include <algorithm>
using namespace std;
vector<vector<int>> floyd_warshall(vector<vector<int>>& grid) {
    if (grid.empty() || grid[0].empty()) return {};
    int R = grid.size(), C = grid[0].size(), N = R * C;
    vector<vector<int>> dist(N, vector<int>(N, 1e9));
    for (int r = 0; r < R; r++) for (int c = 0; c < C; c++) {
        if (grid[r][c] == 1) continue; dist[r * C + c][r * C + c] = 0;
        for (auto [dr, dc] : vector<pair<int, int>>{{0, 1}, {0, -1}, {1, 0}, {-1, 0}}) {
            int nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < R && nc >= 0 && nc < C && grid[nr][nc] != 1) dist[r * C + c][nr * C + nc] = 1;
        }
    }
    for (int k = 0; k < N; k++) for (int i = 0; i < N; i++) for (int j = 0; j < N; j++)
        if (dist[i][k] != 1e9 && dist[k][j] != 1e9) dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]);
    return dist;
}`,
      },
      java: {
        code: `public int[][] floydWarshall(int[][] grid) {
    if (grid == null || grid.length == 0 || grid[0].length == 0) return new int[0][0];
    int R = grid.length, C = grid[0].length, N = R * C;
    int[][] dist = new int[N][N]; for (int[] row : dist) Arrays.fill(row, 1000000000);
    for (int r = 0; r < R; r++) for (int c = 0; c < C; c++) {
        if (grid[r][c] == 1) continue; dist[r * C + c][r * C + c] = 0;
        for (int[] d : new int[][]{{0, 1}, {0, -1}, {1, 0}, {-1, 0}}) {
            int nr = r + d[0], nc = c + d[1];
            if (nr >= 0 && nr < R && nc >= 0 && nc < C && grid[nr][nc] != 1) dist[r * C + c][nr * C + nc] = 1;
        }
    }
    for (int k = 0; k < N; k++) for (int i = 0; i < N; i++) for (int j = 0; j < N; j++)
        if (dist[i][k] != 1000000000 && dist[k][j] != 1000000000) dist[i][j] = Math.min(dist[i][j], dist[i][k] + dist[k][j]);
    return dist;
}`,
      },
      c: {
        code: `#include <stdlib.h>
void floyd_warshall(int R, int C, int grid[100][100], int** dist) {
    if (R <= 0 || C <= 0) return;
    int N = R * C;
    int** d = malloc(N * sizeof(int*));
    for (int i = 0; i < N; i++) {
        d[i] = malloc(N * sizeof(int));
        for (int j = 0; j < N; j++) d[i][j] = 1e9;
    }
    for (int r = 0; r < R; r++) for (int c = 0; c < C; c++) {
        if (grid[r][c] == 1) continue; d[r * C + c][r * C + c] = 0;
        int dr[] = {0, 0, 1, -1}, dc[] = {1, -1, 0, 0};
        for (int i = 0; i < 4; i++) {
            int nr = r + dr[i], nc = c + dc[i];
            if (nr >= 0 && nr < R && nc >= 0 && nc < C && grid[nr][nc] != 1) d[r * C + c][nr * C + nc] = 1;
        }
    }
    for (int k = 0; k < N; k++) for (int i = 0; i < N; i++) for (int j = 0; j < N; j++)
        if (d[i][k] != 1e9 && d[k][j] != 1e9 && d[i][k] + d[k][j] < d[i][j]) d[i][j] = d[i][k] + d[k][j];
    for (int i = 0; i < N; i++) for (int j = 0; j < N; j++) dist[i][j] = d[i][j];
    for (int i = 0; i < N; i++) {
        free(d[i]);
    }
    free(d);
}`,
      },
      rust: {
        code: `fn floyd_warshall(grid: &Vec<Vec<i32>>) -> Vec<Vec<i32>> {
    if grid.is_empty() || grid[0].is_empty() { return vec![]; }
    let (R, C) = (grid.len(), grid[0].len()); let N = R * C;
    let mut dist = vec![vec![1000000; N]; N];
    for r in 0..R { for c in 0..C {
        if grid[r][c] == 1 { continue; } dist[r * C + c][r * C + c] = 0;
        for (dr, dc) in [(0, 1), (0, -1), (1, 0), (-1, 0)] {
            let (nr, nc) = (r as i32 + dr, c as i32 + dc);
            if nr >= 0 && nr < R as i32 && nc >= 0 && nc < C as i32 && grid[nr as usize][nc as usize] != 1 { dist[r * C + c][nr as usize * C + nc as usize] = 1; }
        }
    }}
    for k in 0..N { for i in 0..N { for j in 0..N {
        if dist[i][k] != 1000000 && dist[k][j] != 1000000 {
            dist[i][j] = dist[i][j].min(dist[i][k] + dist[k][j]);
        }
    }}}
    dist
}`,
      },
      go: {
        code: `func floydWarshall(grid [][]int) [][]int {
    if len(grid) == 0 || len(grid[0]) == 0 { return [][]int{} }
    R, C := len(grid), len(grid[0]); N := R * C
    dist := make([][]int, N); for i := range dist { dist[i] = make([]int, N); for j := range dist[i] { dist[i][j] = 1e9 } }
    for r := 0; r < R; r++ { for c := 0; c < C; c++ {
        if grid[r][c] == 1 { continue }; dist[r * C + c][r * C + c] = 0
        for _, d := range [][2]int{{0, 1}, {0, -1}, {1, 0}, {-1, 0}} {
            nr, nc := r+d[0], c+d[1]
            if nr >= 0 && nr < R && nc >= 0 && nc < C && grid[nr][nc] != 1 { dist[r * C + c][nr * C + nc] = 1 }
        }
    }}
    for k := 0; k < N; k++ { for i := 0; i < N; i++ { for j := 0; j < N; j++ {
        if dist[i][k] != 1e9 && dist[k][j] != 1e9 && dist[i][k] + dist[k][j] < dist[i][j] { dist[i][j] = dist[i][k] + dist[k][j] }
    }}}
    return dist
}`,
      },
    },
  },
  prim: {
    network: {
      javascript: {
        code: `function primMST(graph) {
  const parent = {};
  const key = {};
  const inMST = new Set();
  const heap = new MinHeap((a, b) => a.weight < b.weight);
  const nodes = Object.keys(graph);
  if (nodes.length === 0) return { parent, key };
  for (const node of nodes) {
    key[node] = Infinity;
  }

  const start = nodes[0];
  key[start] = 0;
  parent[start] = null;
  heap.push({ node: start, weight: 0 });

  while (!heap.isEmpty() && inMST.size < nodes.length) {
    const { node: u } = heap.pop();
    if (inMST.has(u)) continue;
    inMST.add(u);

    for (const [v, weight] of Object.entries(graph[u])) {
      if (!inMST.has(v) && weight < key[v]) {
        parent[v] = u;
        key[v] = weight;
        heap.push({ node: v, weight });
      }
    }
  }

  return { parent, key };
}`,
      },
      python: {
        code: `import heapq
def prim_mst(graph):
    mst_set = set()
    parent = {}
    keys = {node: float('inf') for node in graph}
    start = list(graph.keys())[0]
    keys[start] = 0
    parent[start] = None
    pq = [(0, start)]
    while pq:
        w, u = heapq.heappop(pq)
        if u in mst_set: continue
        mst_set.add(u)
        for v, weight in graph[u].items():
            if v not in mst_set and weight < keys[v]:
                keys[v] = weight
                parent[v] = u
                heapq.heappush(pq, (weight, v))
    return parent`,
      },
      cpp: {
        code: `#include <vector>
#include <queue>
#include <climits>
using namespace std;
vector<pair<int, int>> primMST(int V, vector<vector<pair<int, int>>>& adj) {
    vector<int> key(V, INT_MAX);
    vector<int> parent(V, -1);
    vector<bool> inMST(V, false);
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>> pq;
    key[0] = 0; pq.push({0, 0});
    while (!pq.empty()) {
        int u = pq.top().second; pq.pop();
        if (inMST[u]) continue;
        inMST[u] = true;
        for (auto& edge : adj[u]) {
            int v = edge.first; int w = edge.second;
            if (!inMST[v] && w < key[v]) {
                key[v] = w;
                pq.push({key[v], v});
                parent[v] = u;
            }
        }
    }
    vector<pair<int, int>> mst;
    for (int i = 1; i < V; i++) if (parent[i] != -1) mst.push_back({parent[i], i});
    return mst;
}`,
      },
      java: {
        code: `import java.util.*;
public int[] primMST(int V, List<List<int[]>> adj) {
    int[] key = new int[V]; Arrays.fill(key, Integer.MAX_VALUE);
    int[] parent = new int[V]; Arrays.fill(parent, -1);
    boolean[] inMST = new boolean[V];
    PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[1]));
    key[0] = 0; pq.add(new int[]{0, 0});
    while (!pq.isEmpty()) {
        int u = pq.poll()[0];
        if (inMST[u]) continue;
        inMST[u] = true;
        for (int[] edge : adj.get(u)) {
            int v = edge[0]; int w = edge[1];
            if (!inMST[v] && w < key[v]) {
                key[v] = w;
                parent[v] = u;
                pq.add(new int[]{v, key[v]});
            }
        }
    }
    return parent;
}`,
      },
      c: {
        code: `void primMST(int V, int graph[100][100], int parent[100]) {
    int key[100];
    int mstSet[100] = {0};
    for (int i = 0; i < V; i++) key[i] = 1e9, parent[i] = -1;
    key[0] = 0;
    for (int count = 0; count < V - 1; count++) {
        int u = -1, min = 1e9;
        for (int v = 0; v < V; v++) if (!mstSet[v] && key[v] < min) min = key[v], u = v;
        if (u == -1) break;
        mstSet[u] = 1;
        for (int v = 0; v < V; v++)
            if (graph[u][v] && !mstSet[v] && graph[u][v] < key[v])
                parent[v] = u, key[v] = graph[u][v];
    }
}`,
      },
      rust: {
        code: `use std::collections::BinaryHeap;
use std::cmp::Ordering;
#[derive(Copy, Clone, Eq, PartialEq)] struct State { key: i32, node: usize }
impl Ord for State { fn cmp(&self, other: &Self) -> Ordering { other.key.cmp(&self.key) } }
impl PartialOrd for State { fn partial_cmp(&self, other: &Self) -> Option<Ordering> { Some(self.cmp(other)) } }
fn prim_mst(v: usize, adj: &Vec<Vec<(usize, i32)>>) -> Vec<usize> {
    let mut key = vec![i32::MAX; v];
    let mut parent = vec![usize::MAX; v];
    let mut in_mst = vec![false; v];
    let mut pq = BinaryHeap::new();
    key[0] = 0; pq.push(State { key: 0, node: 0 });
    while let Some(State { node: u, .. }) = pq.pop() {
        if in_mst[u] { continue; }
        in_mst[u] = true;
        for &(v, w) in &adj[u] {
            if !in_mst[v] && w < key[v] {
                key[v] = w;
                parent[v] = u;
                pq.push(State { key: w, node: v });
            }
        }
    }
    parent
}`,
      },
      go: {
        code: `import "container/heap"
type Edge struct { to, weight int }
type HeapItem struct { node, key int }
type PriorityQueue []*HeapItem
func (pq PriorityQueue) Len() int { return len(pq) }
func (pq PriorityQueue) Less(i, j int) bool { return pq[i].key < pq[j].key }
func (pq PriorityQueue) Swap(i, j int) { pq[i], pq[j] = pq[j], pq[i] }
func (pq *PriorityQueue) Push(x interface{}) { *pq = append(*pq, x.(*HeapItem)) }
func (pq *PriorityQueue) Pop() interface{} { old := *pq; n := len(old); item := old[n-1]; *pq = old[0:n-1]; return item }
func primMST(V int, adj [][]Edge) []int {
    key := make([]int, V); for i := range key { key[i] = 1e9 }
    parent := make([]int, V); for i := range parent { parent[i] = -1 }
    inMST := make([]bool, V)
    key[0] = 0
    pq := &PriorityQueue{{0, 0}}; heap.Init(pq)
    for pq.Len() > 0 {
        u := heap.Pop(pq).(*HeapItem).node
        if inMST[u] { continue }
        inMST[u] = true
        for _, edge := range adj[u] {
            v, w := edge.to, edge.weight
            if !inMST[v] && w < key[v] {
                key[v] = w
                parent[v] = u
                heap.Push(pq, &HeapItem{v, w})
            }
        }
    }
    return parent
}`,
      },
    },
  },
  kruskal: {
    network: {
      javascript: {
        code: `function kruskalMST(V, edges) {
  const parent = Array.from({ length: V }, (_, i) => i);
  const find = (i) => {
    while (parent[i] !== i) i = parent[i];
    return i;
  };
  const union = (i, j) => {
    const rootI = find(i);
    const rootJ = find(j);
    if (rootI !== rootJ) {
      parent[rootI] = rootJ;
      return true;
    }
    return false;
  };
  const sortedEdges = [...edges].sort((a, b) => a.w - b.w);
  const mst = [];
  for (const edge of sortedEdges) {
    if (union(edge.u, edge.v)) {
      mst.push(edge);
      if (mst.length === V - 1) break;
    }
  }
  return mst;
}`,
      },
      python: {
        code: `def kruskal_mst(V, edges):
    parent = list(range(V))
    def find(i):
        while parent[i] != i:
            i = parent[i]
        return i
    def union(i, j):
        root_i = find(i)
        root_j = find(j)
        if root_i != root_j:
            parent[root_i] = root_j
            return True
        return False
    sorted_edges = sorted(edges, key=lambda item: item[2])
    mst = []
    for u, v, w in sorted_edges:
        if union(u, v):
            mst.append((u, v, w))
            if len(mst) == V - 1: break
    return mst`,
      },
      cpp: {
        code: `#include <vector>
#include <algorithm>
using namespace std;
struct Edge { int u, v, w; };
struct DSU {
    vector<int> parent;
    DSU(int n) { parent.resize(n); for(int i=0; i<n; i++) parent[i] = i; }
    int find(int i) { return parent[i] == i ? i : parent[i] = find(parent[i]); }
    bool unite(int i, int j) {
        int rI = find(i); int rJ = find(j);
        if (rI != rJ) { parent[rI] = rJ; return true; }
        return false;
    }
};
vector<Edge> kruskalMST(int V, vector<Edge>& edges) {
    sort(edges.begin(), edges.end(), [](Edge a, Edge b) { return a.w < b.w; });
    DSU dsu(V);
    vector<Edge> mst;
    for (auto& edge : edges) {
        if (dsu.unite(edge.u, edge.v)) {
            mst.push_back(edge);
            if (mst.size() == V - 1) break;
        }
    }
    return mst;
}`,
      },
      java: {
        code: `import java.util.*;
public class Kruskal {
    static class Edge implements Comparable<Edge> {
        int u, v, w;
        public int compareTo(Edge o) { return this.w - o.w; }
    }
    int[] parent;
    int find(int i) { return parent[i] == i ? i : (parent[i] = find(parent[i])); }
    boolean union(int i, int j) {
        int rI = find(i), rJ = find(j);
        if (rI != rJ) { parent[rI] = rJ; return true; }
        return false;
    }
    public List<Edge> kruskalMST(int V, List<Edge> edges) {
        Collections.sort(edges);
        parent = new int[V]; for (int i = 0; i < V; i++) parent[i] = i;
        List<Edge> mst = new ArrayList<>();
        for (Edge edge : edges) {
            if (union(edge.u, edge.v)) {
                mst.add(edge);
                if (mst.size() == V - 1) break;
            }
        }
        return mst;
    }
}`,
      },
      c: {
        code: `#include <stdlib.h>
struct Edge { int u, v, w; };
int compareEdges(const void* a, const void* b) { return ((struct Edge*)a)->w - ((struct Edge*)b)->w; }
int find(int parent[], int i) {
    if (parent[i] == i) return i;
    return parent[i] = find(parent, parent[i]);
}
int unite(int parent[], int i, int j) {
    int rootI = find(parent, i); int rootJ = find(parent, j);
    if (rootI != rootJ) { parent[rootI] = rootJ; return 1; }
    return 0;
}
void kruskalMST(int V, int E, struct Edge edges[], struct Edge mst[]) {
    qsort(edges, E, sizeof(struct Edge), compareEdges);
    int* parent = malloc(V * sizeof(int));
    for (int i = 0; i < V; i++) parent[i] = i;
    int mstSize = 0;
    for (int i = 0; i < E; i++) {
        if (unite(parent, edges[i].u, edges[i].v)) {
            mst[mstSize++] = edges[i];
            if (mstSize == V - 1) break;
        }
    }
    free(parent);
}`,
      },
      rust: {
        code: `struct Edge { u: usize, v: usize, w: i32 }
struct DSU { parent: Vec<usize> }
impl DSU {
    fn new(n: usize) -> Self { DSU { parent: (0..n).collect() } }
    fn find(&mut self, i: usize) -> usize {
        if self.parent[i] == i { return i; }
        self.parent[i] = self.find(self.parent[i]);
        self.parent[i]
    }
    fn union(&mut self, i: usize, j: usize) -> bool {
        let r_i = self.find(i); let r_j = self.find(j);
        if r_i != r_j { self.parent[r_i] = r_j; return true; }
        false
    }
}
fn kruskal_mst(v: usize, edges: &mut [Edge]) -> Vec<Edge> {
    edges.sort_by_key(|e| e.w);
    let mut dsu = DSU::new(v);
    let mut mst = Vec::new();
    for edge in edges {
        if dsu.union(edge.u, edge.v) {
            mst.push(Edge { u: edge.u, v: edge.v, w: edge.w });
            if mst.len() == v - 1 { break; }
        }
    }
    mst
}`,
      },
      go: {
        code: `import "sort"
type Edge struct { u, v, w int }
type DSU struct { parent []int }
func NewDSU(n int) *DSU {
    p := make([]int, n); for i := range p { p[i] = i }
    return &DSU{p}
}
func (dsu *DSU) Find(i int) int {
    if dsu.parent[i] == i { return i }
    dsu.parent[i] = dsu.Find(dsu.parent[i])
    return dsu.parent[i]
}
func (dsu *DSU) Union(i, j int) bool {
    rI, rJ := dsu.Find(i), dsu.Find(j)
    if rI != rJ { dsu.parent[rI] = rJ; return true }
    return false
}
func kruskalMST(V int, edges []Edge) []Edge {
    sort.Slice(edges, func(i, j int) bool { return edges[i].w < edges[j].w })
    dsu := NewDSU(V)
    var mst []Edge
    for _, edge := range edges {
        if dsu.Union(edge.u, edge.v) {
            mst = append(mst, edge)
            if len(mst) == V-1 { break }
        }
    }
    return mst
}`,
      },
    },
  },
}

export const getSource = (algorithm, viewMode, language) => {
  return shortestPathSources?.[algorithm]?.[viewMode]?.[language]?.code || ''
}
