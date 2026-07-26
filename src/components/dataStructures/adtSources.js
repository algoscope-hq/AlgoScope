export const adtSources = {
  stack: {
    'standard stack': {
      javascript: `class Stack {
  constructor() {
    this.items = [];
  }

  push(element) {
    this.items.push(element);
  }

  pop() {
    if (this.items.length === 0) return "Underflow";
    return this.items.pop();
  }

  peek() {
    return this.items[this.items.length - 1];
  }
}`,
      python: `class Stack:
    def __init__(self):
        self.items = []

    def push(self, item):
        self.items.append(item)

    def pop(self):
        if not self.items:
            return "Underflow"
        return self.items.pop()

    def peek(self):
        return self.items[-1] if self.items else None`,
      cpp: `#include <iostream>
#include <vector>

class Stack {
private:
    std::vector<int> items;

public:
    void push(int element) {
        items.push_back(element);
    }

    void pop() {
        if (!items.empty()) items.pop_back();
    }

    int peek() {
        return items.empty() ? -1 : items.back();
    }
};`,
      java: `import java.util.Stack;

Stack<Integer> stack = new Stack<>();
stack.push(element);
stack.pop();
int top = stack.peek();`,
      c: `#define MAX 100
int stack[MAX];
int top = -1;

void push(int x) {
    if (top < MAX - 1) stack[++top] = x;
}

int pop() {
    if (top >= 0) return stack[top--];
    return -1;
}`,
      rust: `let mut stack = Vec::new();
stack.push(element);
let popped = stack.pop();`,
      go: `var stack []int
stack = append(stack, element)
popped := stack[len(stack)-1]
stack = stack[:len(stack)-1]`,
    },
    'browser history': {
      javascript: `const backStack = [];
const forwardStack = [];

function visit(url) {
  backStack.push(url);
  forwardStack.length = 0; 
}

function back() {
  if (backStack.length > 1) {
    forwardStack.push(backStack.pop());
    return backStack[backStack.length - 1];
  }
  return null;
}`,
      python: `back_stack = []
forward_stack = []

def visit(url):
    back_stack.append(url)
    forward_stack.clear()

def back():
    if len(back_stack) > 1:
        forward_stack.append(back_stack.pop())
        return back_stack[-1]
    return None`,
      cpp: `#include <stack>
#include <string>

std::stack<std::string> backStack;
std::stack<std::string> forwardStack;

void visit(std::string url) {
    backStack.push(url);
    while(!forwardStack.empty()) forwardStack.pop();
}`,
      java: `import java.util.Stack;

Stack<String> backStack = new Stack<>();
Stack<String> forwardStack = new Stack<>();

void visit(String url) {
    backStack.push(url);
    forwardStack.clear();
}`,
      c: `char backStack[100][50], forwardStack[100][50];
int topBack = -1, topForward = -1;`,
      rust: `let mut back_stack: Vec<String> = Vec::new();
let mut forward_stack: Vec<String> = Vec::new();`,
      go: `var backStack []string
var forwardStack []string`,
    },
    'string reversal': {
      javascript: `function reverseString(str) {
  const stack = [];
  for (let char of str) stack.push(char);
   
  let reversed = "";
  while (stack.length > 0) {
    reversed += stack.pop();
  }
  return reversed;
}`,
      python: `def reverse_string(text):
    stack = list(text)
    reversed_text = ""
    while stack:
        reversed_text += stack.pop()
    return reversed_text`,
      cpp: `std::string reverseString(std::string s) {
    std::stack<char> st;
    for(char c : s) st.push(c);
     
    std::string reversed = "";
    while(!st.empty()) {
        reversed += st.top();
        st.pop();
    }
    return reversed;
}`,
      java: `public String reverse(String str) {
    Stack<Character> s = new Stack<>();
    for(char c : str.toCharArray()) s.push(c);
     
    StringBuilder sb = new StringBuilder();
    while(!s.isEmpty()) sb.append(s.pop());
    return sb.toString();
}`,
      c: `void reverse(char str[]) {
    int n = strlen(str);
    for(int i = 0; i < n; i++) push(str[i]);
    for(int i = 0; i < n; i++) str[i] = pop();
}`,
      rust: `fn reverse(s: &str) -> String {
    let mut stack: Vec<char> = s.chars().collect();
    let mut rev = String::new();
    while let Some(c) = stack.pop() { rev.push(c); }
    rev
}`,
      go: `func reverse(s string) string {
    var stack []rune
    for _, r := range s { stack = append(stack, r) }
    var res []rune
    for len(stack) > 0 {
        res = append(res, stack[len(stack)-1])
        stack = stack[:len(stack)-1]
    }
    return string(res)
}`,
    },
    'parentheses checker': {
      javascript: `function isValid(str) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
   
  for (let char of str) {
    if (['(', '{', '['].includes(char)) {
      stack.push(char);
    } else if (stack.pop() !== map[char]) {
      return false;
    }
  }
  return stack.length === 0;
}`,
      python: `def is_valid(expr):
    stack = []
    mapping = {")": "(", "}": "{", "]": "["}
    for char in expr:
        if char in mapping.values():
            stack.append(char)
        elif char in mapping:
            if not stack or stack.pop() != mapping[char]:
                return False
    return len(stack) == 0`,
      cpp: `bool isValid(string s) {
    stack<char> st;
    for(char c : s) {
        if(c=='(' || c=='{' || c=='[') st.push(c);
        else {
            if(st.empty()) return false;
            if(c==')' && st.top()!='(') return false;
            if(c=='}' && st.top()!='{') return false;
            if(c==']' && st.top()!='[') return false;
            st.pop();
        }
    }
    return st.empty();
}`,
      java: `public boolean isValid(String s) {
    java.util.Stack<Character> st = new java.util.Stack<>();
    for(char c : s.toCharArray()) {
        if(c == '(' || c == '{' || c == '[') st.push(c);
        else {
            if(st.isEmpty()) return false;
            char top = st.pop();
            if(c == ')' && top != '(') return false;
            if(c == '}' && top != '{') return false;
            if(c == ']' && top != '[') return false;
        }
    }
    return st.isEmpty();
}`,
      c: `int isValid(char* s) {
    char stack[100];
    int top = -1;
    for(int i=0; s[i]!='\\0'; i++) {
        if(s[i]=='(' || s[i]=='{' || s[i]=='[') stack[++top] = s[i];
        else {
            if(top == -1) return 0;
            if(s[i]==')' && stack[top]!='(') return 0;
            if(s[i]=='}' && stack[top]!='{') return 0;
            if(s[i]==']' && stack[top]!='[') return 0;
            top--;
        }
    }
    return top == -1;
}`,
      rust: `fn is_valid(s: String) -> bool {
    let mut stack = Vec::new();
    for c in s.chars() {
        match c {
            '(' | '{' | '[' => stack.push(c),
            _ => {
                if stack.is_empty() { return false; }
                stack.pop();
            }
        }
    }
    stack.is_empty()
}`,
      go: `func isValid(s string) bool {
    var stack []rune
    for _, c := range s {
        if c == '(' || c == '{' || c == '[' {
            stack = append(stack, c)
        } else {
            if len(stack) == 0 { return false }
            stack = stack[:len(stack)-1]
        }
    }
    return len(stack) == 0
}`,
    },
    'postfix evaluator': {
      javascript: `function evaluatePostfix(expr) {
  const stack = [];
  for (let char of expr) {
    if (!isNaN(char)) stack.push(Number(char));
    else {
      let val1 = stack.pop();
      let val2 = stack.pop();
      switch (char) {
        case '+': stack.push(val2 + val1); break;
        case '-': stack.push(val2 - val1); break;
        case '*': stack.push(val2 * val1); break;
        case '/': stack.push(val2 / val1); break;
      }
    }
  }
  return stack.pop();
}`,
      python: `def evaluate_postfix(expr):
    stack = []
    for char in expr:
        if char.isdigit():
            stack.append(int(char))
        else:
            val1 = stack.pop()
            val2 = stack.pop()
            if char == '+': stack.append(val2 + val1)
            elif char == '-': stack.append(val2 - val1)
            elif char == '*': stack.append(val2 * val1)
            elif char == '/': stack.append(val2 / val1)
    return stack.pop()`,
      cpp: `int evaluate(string s) {
    stack<int> st;
    for(char c : s) {
        if(isdigit(c)) st.push(c - '0');
        else {
            int v1 = st.top(); st.pop();
            int v2 = st.top(); st.pop();
            if(c=='+') st.push(v2+v1);
            if(c=='-') st.push(v2-v1);
            if(c=='*') st.push(v2*v1);
            if(c=='/') st.push(v2/v1);
        }
    }
    return st.top();
}`,
      java: `public int evaluate(String s) {
    java.util.Stack<Integer> st = new java.util.Stack<>();
    for(char c : s.toCharArray()) {
        if(Character.isDigit(c)) st.push(c - '0');
        else {
            int v1 = st.pop();
            int v2 = st.pop();
            if(c=='+') st.push(v2+v1);
            if(c=='-') st.push(v2-v1);
        }
    }
    return st.pop();
}`,
      c: `int eval(char exp[]) {
    int stack[100], top = -1;
    for(int i=0; exp[i]!='\\0'; i++) {
        if(isdigit(exp[i])) stack[++top] = exp[i] - '0';
    }
    return stack[top];
}`,
      rust: `fn eval(s: String) -> i32 {
    let mut stack = Vec::new();
    for c in s.chars() {
        if c.is_digit(10) { stack.push(c.to_digit(10).unwrap() as i32); }
    }
    stack.pop().unwrap_or(0)
}`,
      go: `func eval(s string) int {
    var stack []int
    for _, c := range s {
        if c >= '0' && c <= '9' { stack = append(stack, int(c-'0')) }
    }
    return stack[0]
}`,
    },
  },
  queue: {
    'standard queue': {
      javascript: `class Queue {
  constructor() {
    this.items = [];
  }

  enqueue(element) {
    this.items.push(element);
  }

  dequeue() {
    if (this.items.length === 0) return "Underflow";
    return this.items.shift();
  }

  front() {
    return this.items[0];
  }
}`,
      python: `from collections import deque

class Queue:
    def __init__(self):
        self.items = deque()

    def enqueue(self, item):
        self.items.append(item)

    def dequeue(self):
        return self.items.popleft() if self.items else "Underflow"`,
      cpp: `#include <queue>

std::queue<int> q;
q.push(element);
q.pop();`,
      java: `import java.util.LinkedList;
import java.util.Queue;

Queue<Integer> q = new LinkedList<>();
q.add(element);
q.remove();`,
      c: `#define MAX 100
int queue[MAX], front = 0, rear = -1;

void enqueue(int x) {
    if (rear < MAX - 1) queue[++rear] = x;
}

int dequeue() {
    if (front <= rear) return queue[front++];
    return -1;
}`,
      rust: `use std::collections::VecDeque;
let mut queue = VecDeque::new();
queue.push_back(element);
let front = queue.pop_front();`,
      go: `var queue []int
queue = append(queue, element)
element = queue[0]
queue = queue[1:]`,
    },
  },
  tree: {
    inorder: {
      javascript: `function inorder(node) {
  if (node !== null) {
    inorder(node.left);
    console.log(node.value);
    inorder(node.right);
  }
}`,
      python: `def inorder(root):
    if root:
        inorder(root.left)
        print(root.value)
        inorder(root.right)`,
      cpp: `void inorder(Node* root) {
    if (root == nullptr) return;
    inorder(root->left);
    std::cout << root->value << " ";
    inorder(root->right);
}`,
      java: `void inorder(Node root) {
    if (root == null) return;
    inorder(root.left);
    System.out.print(root.value + " ");
    inorder(root.right);
}`,
      c: `void inorder(struct Node* root) {
    if (root == NULL) return;
    inorder(root->left);
    printf("%d ", root->value);
    inorder(root->right);
}`,
      rust: `fn inorder(root: &Option<Box<Node>>) {
    if let Some(node) = root {
        inorder(&node.left);
        println!("{}", node.value);
        inorder(&node.right);
    }
}`,
      go: `func inorder(root *Node) {
    if root == nil { return }
    inorder(root.Left)
    fmt.Println(root.Value)
    inorder(root.Right)
}`,
    },
    preorder: {
      javascript: `function preorder(node) {
  if (node !== null) {
    console.log(node.value);
    preorder(node.left);
    preorder(node.right);
  }
}`,
      python: `def preorder(root):
    if root:
        print(root.value)
        preorder(root.left)
        preorder(root.right)`,
      cpp: `void preorder(Node* root) {
    if (root == nullptr) return;
    std::cout << root->value << " ";
    preorder(root->left);
    preorder(root->right);
}`,
      java: `void preorder(Node root) {
    if (root == null) return;
    System.out.print(root.value + " ");
    preorder(root.left);
    preorder(root.right);
}`,
      c: `void preorder(struct Node* root) {
    if (root == NULL) return;
    printf("%d ", root->value);
    preorder(root->left);
    preorder(root->right);
}`,
      rust: `fn preorder(root: &Option<Box<Node>>) {
    if let Some(node) = root {
        println!("{}", node.value);
        preorder(&node.left);
        preorder(&node.right);
    }
}`,
      go: `func preorder(root *Node) {
    if root == nil { return }
    fmt.Println(root.Value)
    preorder(root.Left)
    preorder(root.Right)
}`,
    },
    postorder: {
      javascript: `function postorder(node) {
  if (node !== null) {
    postorder(node.left);
    postorder(node.right);
    console.log(node.value);
  }
}`,
      python: `def postorder(root):
    if root:
        postorder(root.left)
        postorder(root.right)
        print(root.value)`,
      cpp: `void postorder(Node* root) {
    if (root == nullptr) return;
    postorder(root->left);
    postorder(root->right);
    std::cout << root->value << " ";
}`,
      java: `void postorder(Node root) {
    if (root == null) return;
    postorder(root.left);
    postorder(root.right);
    System.out.print(root.value + " ");
}`,
      c: `void postorder(struct Node* root) {
    if (root == NULL) return;
    postorder(root->left);
    postorder(root->right);
    printf("%d ", root->value);
}`,
      rust: `fn postorder(root: &Option<Box<Node>>) {
    if let Some(node) = root {
        postorder(&node.left);
        postorder(&node.right);
        println!("{}", node.value);
    }
}`,
      go: `func postorder(root *Node) {
    if root == nil { return }
    postorder(root.Left)
    postorder(root.Right)
    fmt.Println(root.Value)
}`,
    },
  },
  heap: {
    'binary heap': {
      javascript: `class BinaryHeap {
  constructor(compareFn = (a, b) => a > b) {
    this.data = [];
    this.compare = compareFn;
  }
  
  insert(val) {
    this.data.push(val);
    this.up(this.data.length - 1);
  }
  
  extract() {
    if (this.data.length === 0) return null;
    const top = this.data[0];
    const bottom = this.data.pop();
    if (this.data.length > 0) {
      this.data[0] = bottom;
      this.down(0);
    }
    return top;
  }
  
  up(i) {
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (!this.compare(this.data[i], this.data[p])) break;
      [this.data[i], this.data[p]] = [this.data[p], this.data[i]];
      i = p;
    }
  }
  
  down(i) {
    const len = this.data.length;
    while (2 * i + 1 < len) {
      let child = 2 * i + 1;
      if (child + 1 < len && this.compare(this.data[child + 1], this.data[child])) {
        child++;
      }
      if (!this.compare(this.data[child], this.data[i])) break;
      [this.data[i], this.data[child]] = [this.data[child], this.data[i]];
      i = child;
    }
  }
}`,
      python: `import heapq

# Python's built-in heapq is a min-heap by default
heap = []
heapq.heappush(heap, element)
peak = heapq.heappop(heap)`,
      cpp: `#include <queue>
#include <vector>

// C++ std::priority_queue is a max-heap by default
std::priority_queue<int> maxHeap;
maxHeap.push(10);
int maxVal = maxHeap.top();
maxHeap.pop();

// Min-heap declaration
std::priority_queue<int, std::vector<int>, std::greater<int>> minHeap;`,
      java: `import java.util.PriorityQueue;

// Java PriorityQueue is a min-heap by default
PriorityQueue<Integer> minHeap = new PriorityQueue<>();
minHeap.add(10);
int minVal = minHeap.poll();`,
      c: `#define MAX 100
int heap[MAX];
int size = 0;

void heapifyUp(int i) {
    while (i > 0 && heap[i] > heap[(i - 1) / 2]) {
        int temp = heap[i];
        heap[i] = heap[(i - 1) / 2];
        heap[(i - 1) / 2] = temp;
        i = (i - 1) / 2;
    }
}`,
      rust: `use std::collections::BinaryHeap;

// Rust BinaryHeap is a Max-Heap by default
let mut heap = BinaryHeap::new();
heap.push(10);
let max_val = heap.pop();`,
      go: `package main

import (
	"container/heap"
	"fmt"
)

// IntHeap is a min-heap of ints.
type IntHeap []int

func (h IntHeap) Len() int           { return len(h) }
func (h IntHeap) Less(i, j int) bool { return h[i] < h[j] }
func (h IntHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }

func (h *IntHeap) Push(x interface{}) {
	*h = append(*h, x.(int))
}

func (h *IntHeap) Pop() interface{} {
	old := *h
	n := len(old)
	x := old[n-1]
	*h = old[0 : n-1]
	return x
}

func main() {
	h := &IntHeap{2, 1, 5}
	heap.Init(h)
	heap.Push(h, 3)
	fmt.Printf("minimum: %d\n", (*h)[0])
	for h.Len() > 0 {
		fmt.Printf("%d ", heap.Pop(h))
	}
}`,
    },
  },
  priorityQueue: {
    'priority queue': {
      javascript: `class PriorityQueue {
  constructor() {
    this.heap = [];
  }
  
  enqueue(value, priority) {
    this.heap.push({ value, priority });
    this.bubbleUp(this.heap.length - 1);
  }
  
  dequeue() {
    if (this.heap.length === 0) return null;
    const peak = this.heap[0];
    const bottom = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = bottom;
      this.bubbleDown(0);
    }
    return peak;
  }
  
  bubbleUp(i) {
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (this.heap[i].priority >= this.heap[p].priority) break;
      [this.heap[i], this.heap[p]] = [this.heap[p], this.heap[i]];
      i = p;
    }
  }
  
  bubbleDown(i) {
    const len = this.heap.length;
    while (2 * i + 1 < len) {
      let child = 2 * i + 1;
      if (child + 1 < len && this.heap[child + 1].priority < this.heap[child].priority) {
        child++;
      }
      if (this.heap[i].priority <= this.heap[child].priority) break;
      [this.heap[i], this.heap[child]] = [this.heap[child], this.heap[i]];
      i = child;
    }
  }
}`,
      python: `import heapq

# Priority Queue using tuple (priority, item) in heapq
pq = []
heapq.heappush(pq, (3, "Task A"))
heapq.heappush(pq, (1, "Task B"))
prio, task = heapq.heappop(pq) # yields Task B first`,
      cpp: `#include <queue>
#include <string>

struct Task {
    int priority;
    std::string name;
    bool operator<(const Task& other) const {
        return priority < other.priority; // max-priority
    }
};

std::priority_queue<Task> pq;
pq.push({5, "Process A"});`,
      java: `import java.util.PriorityQueue;

class Task implements Comparable<Task> {
    String name;
    int priority;
    
    public int compareTo(Task other) {
        return Integer.compare(this.priority, other.priority);
    }
}

PriorityQueue<Task> pq = new PriorityQueue<>();`,
      c: `#include <stdio.h>
#include <string.h>

struct Element {
    char value[20];
    int priority;
};

struct Element pq[100];
int size = 0;

void enqueue(char* val, int prio) {
    int i = size - 1;
    struct Element newElem;
    strcpy(newElem.value, val);
    newElem.priority = prio;
    
    // Position by shifting lower priority elements
    while (i >= 0 && pq[i].priority > prio) {
        pq[i + 1] = pq[i];
        i--;
    }
    pq[i + 1] = newElem;
    size++;
}

struct Element dequeue() {
    struct Element first = pq[0];
    for (int i = 1; i < size; i++) {
        pq[i - 1] = pq[i];
    }
    size--;
    return first;
}`,
      rust: `use std::collections::BinaryHeap;
use std::cmp::Ordering;

#[derive(Eq, PartialEq)]
struct Task {
    priority: i32,
    name: String,
}

impl Ord for Task {
    fn cmp(&self, other: &Self) -> Ordering {
        other.priority.cmp(&self.priority) // min-priority
    }
}

impl PartialOrd for Task {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(self.cmp(other))
    }
}`,
      go: `package main

import (
	"container/heap"
	"fmt"
)

type Item struct {
	value    string
	priority int
	index    int
}

type PriorityQueue []*Item

func (pq PriorityQueue) Len() int           { return len(pq) }
func (pq PriorityQueue) Less(i, j int) bool { return pq[i].priority < pq[j].priority }
func (pq PriorityQueue) Swap(i, j int)      { pq[i], pq[j] = pq[j], pq[i] }

func (pq *PriorityQueue) Push(x interface{}) {
	item := x.(*Item)
	item.index = len(*pq)
	*pq = append(*pq, item)
}

func (pq *PriorityQueue) Pop() interface{} {
	old := *pq
	n := len(old)
	item := old[n-1]
	old[n-1] = nil
	*pq = old[0 : n-1]
	return item
}

func main() {
	pq := make(PriorityQueue, 0)
	heap.Init(&pq)
	heap.Push(&pq, &Item{value: "Task A", priority: 3})
	heap.Push(&pq, &Item{value: "Task B", priority: 1})
	
	popped := heap.Pop(&pq).(*Item)
	fmt.Printf("Popped: %s (priority %d)\\n", popped.value, popped.priority)
}`,
    },
  },
  linkedList: {
    'singly linked list': {
      javascript: `class Node {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

class LinkedList {
  constructor() { this.head = null; }

  insertAtBeginning(val) {
    const node = new Node(val);
    node.next = this.head;
    this.head = node;
  }

  insertAtEnd(val) {
    const node = new Node(val);
    if (!this.head) { this.head = node; return; }
    let cur = this.head;
    while (cur.next) cur = cur.next;
    cur.next = node;
  }

  delete(val) {
    if (!this.head) return;
    if (this.head.val === val) { this.head = this.head.next; return; }
    let cur = this.head;
    while (cur.next && cur.next.val !== val) cur = cur.next;
    if (cur.next) cur.next = cur.next.next;
  }

  search(val) {
    let cur = this.head, idx = 0;
    while (cur) {
      if (cur.val === val) return idx;
      cur = cur.next; idx++;
    }
    return -1;
  }
}`,
      python: `class Node:
    def __init__(self, val):
        self.val = val
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None

    def insert_beginning(self, val):
        node = Node(val)
        node.next = self.head
        self.head = node

    def insert_end(self, val):
        node = Node(val)
        if not self.head:
            self.head = node
            return
        cur = self.head
        while cur.next:
            cur = cur.next
        cur.next = node

    def delete(self, val):
        if not self.head: return
        if self.head.val == val:
            self.head = self.head.next
            return
        cur = self.head
        while cur.next and cur.next.val != val:
            cur = cur.next
        if cur.next:
            cur.next = cur.next.next

    def search(self, val):
        cur, idx = self.head, 0
        while cur:
            if cur.val == val: return idx
            cur = cur.next
            idx += 1
        return -1`,
      cpp: `#include <iostream>
using namespace std;

struct Node {
    int val;
    Node* next;
    Node(int v) : val(v), next(nullptr) {}
};

class LinkedList {
public:
    Node* head = nullptr;

    void insertAtBeginning(int val) {
        Node* node = new Node(val);
        node->next = head;
        head = node;
    }

    void insertAtEnd(int val) {
        Node* node = new Node(val);
        if (!head) { head = node; return; }
        Node* cur = head;
        while (cur->next) cur = cur->next;
        cur->next = node;
    }

    void deleteNode(int val) {
        if (!head) return;
        if (head->val == val) { head = head->next; return; }
        Node* cur = head;
        while (cur->next && cur->next->val != val) cur = cur->next;
        if (cur->next) cur->next = cur->next->next;
    }

    int search(int val) {
        Node* cur = head; int idx = 0;
        while (cur) {
            if (cur->val == val) return idx;
            cur = cur->next; idx++;
        }
        return -1;
    }
};`,
      java: `class Node {
    int val;
    Node next;
    Node(int v) { val = v; next = null; }
}

class LinkedList {
    Node head = null;

    void insertAtBeginning(int val) {
        Node node = new Node(val);
        node.next = head;
        head = node;
    }

    void insertAtEnd(int val) {
        Node node = new Node(val);
        if (head == null) { head = node; return; }
        Node cur = head;
        while (cur.next != null) cur = cur.next;
        cur.next = node;
    }

    void delete(int val) {
        if (head == null) return;
        if (head.val == val) { head = head.next; return; }
        Node cur = head;
        while (cur.next != null && cur.next.val != val) cur = cur.next;
        if (cur.next != null) cur.next = cur.next.next;
    }

    int search(int val) {
        Node cur = head; int idx = 0;
        while (cur != null) {
            if (cur.val == val) return idx;
            cur = cur.next; idx++;
        }
        return -1;
    }
}`,
      c: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int val;
    struct Node* next;
};

struct Node* newNode(int val) {
    struct Node* node = malloc(sizeof(struct Node));
    node->val = val;
    node->next = NULL;
    return node;
}

void insertAtBeginning(struct Node** head, int val) {
    struct Node* node = newNode(val);
    node->next = *head;
    *head = node;
}

void insertAtEnd(struct Node** head, int val) {
    struct Node* node = newNode(val);
    if (!*head) { *head = node; return; }
    struct Node* cur = *head;
    while (cur->next) cur = cur->next;
    cur->next = node;
}

void deleteNode(struct Node** head, int val) {
    if (!*head) return;
    if ((*head)->val == val) { *head = (*head)->next; return; }
    struct Node* cur = *head;
    while (cur->next && cur->next->val != val) cur = cur->next;
    if (cur->next) cur->next = cur->next->next;
}

struct Node* search(struct Node* head, int val) {
    struct Node* cur = head;
    while (cur) {
        if (cur->val == val) return cur;
        cur = cur->next;
    }
    return NULL;
}`,
      rust: `struct Node {
    val: i32,
    next: Option<Box<Node>>,
}

struct LinkedList {
    head: Option<Box<Node>>,
}

impl LinkedList {
    fn new() -> Self { LinkedList { head: None } }

    fn insert_at_beginning(&mut self, val: i32) {
        let node = Box::new(Node {
            val,
            next: self.head.take(),
        });
        self.head = Some(node);
    }

    fn insert_at_end(&mut self, val: i32) {
        let new_node = Box::new(Node { val, next: None });
        let mut cur = &mut self.head;
        while cur.is_some() {
            cur = &mut cur.as_mut().unwrap().next;
        }
        *cur = Some(new_node);
    }

    fn delete_by_value(&mut self, val: i32) {
        let mut cur = &mut self.head;
        loop {
            match cur {
                None => break,
                Some(node) if node.val == val => {
                    *cur = node.next.take();
                    break;
                }
                Some(node) => cur = &mut node.next,
            }
        }
    }

    fn search_by_value(&self, val: i32) -> Option<usize> {
        let mut cur = &self.head;
        let mut idx = 0;
        while let Some(node) = cur {
            if node.val == val { return Some(idx); }
            cur = &node.next;
            idx += 1;
        }
        None
    }
}`,
      go: `package main

import "fmt"

type Node struct {
    val  int
    next *Node
}

type LinkedList struct {
    head *Node
}

func (l *LinkedList) InsertAtBeginning(val int) {
    node := &Node{val: val, next: l.head}
    l.head = node
}

func (l *LinkedList) InsertAtEnd(val int) {
    node := &Node{val: val}
    if l.head == nil { l.head = node; return }
    cur := l.head
    for cur.next != nil { cur = cur.next }
    cur.next = node
}

func (l *LinkedList) Delete(val int) {
    if l.head == nil { return }
    if l.head.val == val { l.head = l.head.next; return }
    cur := l.head
    for cur.next != nil && cur.next.val != val { cur = cur.next }
    if cur.next != nil { cur.next = cur.next.next }
}

func (l *LinkedList) Search(val int) int {
    cur := l.head
    for idx := 0; cur != nil; idx++ {
        if cur.val == val { return idx }
        cur = cur.next
    }
    return -1
}`,
    },
  },
  dsu: {
    'union find': {
      javascript: `// Alternative optimization: Union by Size tracks subtree sizes
// instead of ranks and always attaches the smaller tree to the
// larger tree. Path compression can still be used alongside it.
class DisjointSetUnion {
  constructor(n) {
    this.parent = Array(n);
    this.rank = Array(n);
    for (let i = 0; i < n; i++) {
      this.parent[i] = i;
      this.rank[i] = 0;
    }
  }

  find(x) {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  union(x, y) {
    const rootX = this.find(x);
    const rootY = this.find(y);
    
    if (rootX === rootY) return false;
    
    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
    } else {
      this.parent[rootY] = rootX;
      this.rank[rootX]++;
    }
    return true;
  }
}`,
      python: `class DisjointSetUnion:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
    
    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x, y):
        root_x = self.find(x)
        root_y = self.find(y)
        
        if root_x == root_y:
            return False
        
        if self.rank[root_x] < self.rank[root_y]:
            self.parent[root_x] = root_y
        elif self.rank[root_x] > self.rank[root_y]:
            self.parent[root_y] = root_x
        else:
            self.parent[root_y] = root_x
            self.rank[root_x] += 1
        return True`,
      cpp: `#include <vector>

class DisjointSetUnion {
private:
    std::vector<int> parent, rank;
    
public:
    DisjointSetUnion(int n) {
        parent.resize(n);
        rank.resize(n, 0);
        for (int i = 0; i < n; i++) {
            parent[i] = i;
        }
    }
    
    int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }
    
    bool unionSets(int x, int y) {
        int rootX = find(x);
        int rootY = find(y);
        
        if (rootX == rootY) return false;
        
        if (rank[rootX] < rank[rootY]) {
            parent[rootX] = rootY;
        } else if (rank[rootX] > rank[rootY]) {
            parent[rootY] = rootX;
        } else {
            parent[rootY] = rootX;
            rank[rootX]++;
        }
        return true;
    }
};`,
      java: `class DisjointSetUnion {
    private int[] parent;
    private int[] rank;
    
    public DisjointSetUnion(int n) {
        parent = new int[n];
        rank = new int[n];
        for (int i = 0; i < n; i++) {
            parent[i] = i;
            rank[i] = 0;
        }
    }
    
    public int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }
    
    public boolean union(int x, int y) {
        int rootX = find(x);
        int rootY = find(y);
        
        if (rootX == rootY) return false;
        
        if (rank[rootX] < rank[rootY]) {
            parent[rootX] = rootY;
        } else if (rank[rootX] > rank[rootY]) {
            parent[rootY] = rootX;
        } else {
            parent[rootY] = rootX;
            rank[rootX]++;
        }
        return true;
    }
}`,
      c: `#include <stdlib.h>

#define MAX 1000

typedef struct {
    int parent[MAX];
    int rank[MAX];
} DisjointSetUnion;

void init(DisjointSetUnion* dsu, int n) {
    for (int i = 0; i < n; i++) {
        dsu->parent[i] = i;
        dsu->rank[i] = 0;
    }
}

int find(DisjointSetUnion* dsu, int x) {
    if (dsu->parent[x] != x) {
        dsu->parent[x] = find(dsu, dsu->parent[x]);
    }
    return dsu->parent[x];
}

int unionSets(DisjointSetUnion* dsu, int x, int y) {
    int rootX = find(dsu, x);
    int rootY = find(dsu, y);
    
    if (rootX == rootY) return 0;
    
    if (dsu->rank[rootX] < dsu->rank[rootY]) {
        dsu->parent[rootX] = rootY;
    } else if (dsu->rank[rootX] > dsu->rank[rootY]) {
        dsu->parent[rootY] = rootX;
    } else {
        dsu->parent[rootY] = rootX;
        dsu->rank[rootX]++;
    }
    return 1;
}`,
      rust: `struct DisjointSetUnion {
    parent: Vec<usize>,
    rank: Vec<usize>,
}

impl DisjointSetUnion {
    fn new(n: usize) -> Self {
        DisjointSetUnion {
            parent: (0..n).collect(),
            rank: vec![0; n],
        }
    }
    
    fn find(&mut self, x: usize) -> usize {
        if self.parent[x] != x {
            self.parent[x] = self.find(self.parent[x]);
        }
        self.parent[x]
    }
    
    fn union(&mut self, x: usize, y: usize) -> bool {
        let root_x = self.find(x);
        let root_y = self.find(y);
        
        if root_x == root_y {
            return false;
        }
        
        match self.rank[root_x].cmp(&self.rank[root_y]) {
            std::cmp::Ordering::Less => self.parent[root_x] = root_y,
            std::cmp::Ordering::Greater => self.parent[root_y] = root_x,
            std::cmp::Ordering::Equal => {
                self.parent[root_y] = root_x;
                self.rank[root_x] += 1;
            }
        }
        true
    }
}`,
      go: `package main

type DisjointSetUnion struct {
    parent []int
    rank   []int
}

func NewDSU(n int) *DisjointSetUnion {
    parent := make([]int, n)
    rank := make([]int, n)
    for i := 0; i < n; i++ {
        parent[i] = i
    }
    return &DisjointSetUnion{
        parent: parent,
        rank:   rank,
    }
}

func (dsu *DisjointSetUnion) Find(x int) int {
    if dsu.parent[x] != x {
        dsu.parent[x] = dsu.Find(dsu.parent[x])
    }
    return dsu.parent[x]
}

func (dsu *DisjointSetUnion) Union(x, y int) bool {
    rootX := dsu.Find(x)
    rootY := dsu.Find(y)
    
    if rootX == rootY {
        return false
    }
    
    if dsu.rank[rootX] < dsu.rank[rootY] {
        dsu.parent[rootX] = rootY
    } else if dsu.rank[rootX] > dsu.rank[rootY] {
        dsu.parent[rootY] = rootX
    } else {
        dsu.parent[rootY] = rootX
        dsu.rank[rootX]++
    }
    return true
}`,
    },
  },
  trie: {
    'prefix tree': {
      javascript: `class TrieNode {
  constructor() {
    this.children = {};
    this.isEnd = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word) {
    let node = this.root;
    for (const char of word) {
      if (!node.children[char])
        node.children[char] = new TrieNode();
      node = node.children[char];
    }
    node.isEnd = true;
  }

  search(word) {
    let node = this.root;
    for (const char of word) {
      if (!node.children[char]) return false;
      node = node.children[char];
    }
    return node.isEnd;
  }

  startsWith(prefix) {
    let node = this.root;
    for (const char of prefix) {
      if (!node.children[char]) return false;
      node = node.children[char];
    }
    return true;
  }
}`,
      python: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end = True

    def search(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                return False
            node = node.children[char]
        return node.is_end

    def starts_with(self, prefix):
        node = self.root
        for char in prefix:
            if char not in node.children:
                return False
            node = node.children[char]
        return True`,
      cpp: `#include <unordered_map>
#include <string>

struct TrieNode {
    std::unordered_map<char, TrieNode*> children;
    bool isEnd = false;
};

class Trie {
    TrieNode* root;
public:
    Trie() { root = new TrieNode(); }

    void insert(std::string word) {
        TrieNode* node = root;
        for (char c : word) {
            if (!node->children.count(c))
                node->children[c] = new TrieNode();
            node = node->children[c];
        }
        node->isEnd = true;
    }

    bool search(std::string word) {
        TrieNode* node = root;
        for (char c : word) {
            if (!node->children.count(c)) return false;
            node = node->children[c];
        }
        return node->isEnd;
    }

    bool startsWith(std::string prefix) {
        TrieNode* node = root;
        for (char c : prefix) {
            if (!node->children.count(c)) return false;
            node = node->children[c];
        }
        return true;
    }
};`,
      java: `import java.util.HashMap;

class TrieNode {
    HashMap<Character, TrieNode> children = new HashMap<>();
    boolean isEnd = false;
}

class Trie {
    TrieNode root = new TrieNode();

    public void insert(String word) {
        TrieNode node = root;
        for (char c : word.toCharArray()) {
            node.children.putIfAbsent(c, new TrieNode());
            node = node.children.get(c);
        }
        node.isEnd = true;
    }

    public boolean search(String word) {
        TrieNode node = root;
        for (char c : word.toCharArray()) {
            if (!node.children.containsKey(c)) return false;
            node = node.children.get(c);
        }
        return node.isEnd;
    }

    public boolean startsWith(String prefix) {
        TrieNode node = root;
        for (char c : prefix.toCharArray()) {
            if (!node.children.containsKey(c)) return false;
            node = node.children.get(c);
        }
        return true;
    }
}`,
      c: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define ALPHA 26

typedef struct TrieNode {
    struct TrieNode* children[ALPHA];
    int isEnd;
} TrieNode;

TrieNode* newNode() {
    TrieNode* node = calloc(1, sizeof(TrieNode));
    node->isEnd = 0;
    return node;
}

static int charIndex(char c) {
    int idx = c - 'a';
    return (idx >= 0 && idx < ALPHA) ? idx : -1;
}

void insert(TrieNode* root, char* word) {
    TrieNode* node = root;
    for (int i = 0; word[i]; i++) {
        int idx = charIndex(word[i]);
        if (idx < 0) return;
        if (!node->children[idx])
            node->children[idx] = newNode();
        node = node->children[idx];
    }
    node->isEnd = 1;
}

int search(TrieNode* root, char* word) {
    TrieNode* node = root;
    for (int i = 0; word[i]; i++) {
        int idx = charIndex(word[i]);
        if (idx < 0 || !node->children[idx]) return 0;
        node = node->children[idx];
    }
    return node->isEnd;
}

int startsWith(TrieNode* root, char* prefix) {
    TrieNode* node = root;
    for (int i = 0; prefix[i]; i++) {
        int idx = charIndex(prefix[i]);
        if (idx < 0 || !node->children[idx]) return 0;
        node = node->children[idx];
    }
    return 1;
}`,
      rust: `use std::collections::HashMap;

#[derive(Default)]
struct TrieNode {
    children: HashMap<char, TrieNode>,
    is_end: bool,
}

struct Trie {
    root: TrieNode,
}

impl Trie {
    fn new() -> Self { Trie { root: TrieNode::default() } }

    fn insert(&mut self, word: &str) {
        let mut node = &mut self.root;
        for c in word.chars() {
            node = node.children.entry(c).or_default();
        }
        node.is_end = true;
    }

    fn search(&self, word: &str) -> bool {
        let mut node = &self.root;
        for c in word.chars() {
            match node.children.get(&c) {
                None => return false,
                Some(n) => node = n,
            }
        }
        node.is_end
    }

    fn starts_with(&self, prefix: &str) -> bool {
        let mut node = &self.root;
        for c in prefix.chars() {
            match node.children.get(&c) {
                None => return false,
                Some(n) => node = n,
            }
        }
        true
    }
}`,
      go: `package main

type TrieNode struct {
    children map[rune]*TrieNode
    isEnd    bool
}

func newTrieNode() *TrieNode {
    return &TrieNode{children: make(map[rune]*TrieNode)}
}

type Trie struct{ root *TrieNode }

func NewTrie() *Trie { return &Trie{root: newTrieNode()} }

func (t *Trie) Insert(word string) {
    node := t.root
    for _, c := range word {
        if _, ok := node.children[c]; !ok {
            node.children[c] = newTrieNode()
        }
        node = node.children[c]
    }
    node.isEnd = true
}

func (t *Trie) Search(word string) bool {
    node := t.root
    for _, c := range word {
        if _, ok := node.children[c]; !ok {
            return false
        }
        node = node.children[c]
    }
    return node.isEnd
}

func (t *Trie) StartsWith(prefix string) bool {
    node := t.root
    for _, c := range prefix {
        if _, ok := node.children[c]; !ok {
            return false
        }
        node = node.children[c]
    }
 return true
}`,
    },
  },
  hashTable: {
    'hash map': {
      javascript: `class HashNode {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.next = null;
  }
}

class HashTable {
  constructor(size = 11) {
    this.size = size;
    this.buckets = Array(size).fill(null);
    this.count = 0;
  }

  hash(key) {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = (hash + key.charCodeAt(i)) % this.size;
    }
    return hash;
  }

  insert(key, value) {
    const index = this.hash(key);
    let node = this.buckets[index];
    while (node) {
      if (node.key === key) { node.value = value; return; }
      node = node.next;
    }
    const newNode = new HashNode(key, value);
    newNode.next = this.buckets[index];
    this.buckets[index] = newNode;
    this.count++;
  }

  search(key) {
    const index = this.hash(key);
    let node = this.buckets[index];
    while (node) {
      if (node.key === key) return node.value;
      node = node.next;
    }
    return null;
  }

  delete(key) {
    const index = this.hash(key);
    let node = this.buckets[index], prev = null;
    while (node) {
      if (node.key === key) {
        if (prev) prev.next = node.next;
        else this.buckets[index] = node.next;
        this.count--;
        return true;
      }
      prev = node;
      node = node.next;
    }
    return false;
  }
}`,
      python: `class HashNode:
    def __init__(self, key, value):
        self.key = key
        self.value = value
        self.next = None

class HashTable:
    def __init__(self, size=11):
        self.size = size
        self.buckets = [None] * size
        self.count = 0

    def _hash(self, key):
        return sum(ord(c) for c in key) % self.size

    def insert(self, key, value):
        index = self._hash(key)
        node = self.buckets[index]
        while node:
            if node.key == key:
                node.value = value
                return
            node = node.next
        new_node = HashNode(key, value)
        new_node.next = self.buckets[index]
        self.buckets[index] = new_node
        self.count += 1

    def search(self, key):
        index = self._hash(key)
        node = self.buckets[index]
        while node:
            if node.key == key:
                return node.value
            node = node.next
        return None

    def delete(self, key):
        index = self._hash(key)
        node = self.buckets[index]
        prev = None
        while node:
            if node.key == key:
                if prev:
                    prev.next = node.next
                else:
                    self.buckets[index] = node.next
                self.count -= 1
                return True
            prev = node
            node = node.next
        return False`,
      cpp: `#include <string>
using namespace std;

struct HashNode {
    string key, value;
    HashNode* next;
    HashNode(string k, string v) : key(k), value(v), next(nullptr) {}
};

class HashTable {
    int size;
    HashNode** buckets;
    int count;

    int hash(const string& key) {
        int h = 0;
        for (char c : key) h = (h + c) % size;
        return h;
    }

public:
    HashTable(int size = 11) : size(size), count(0) {
        buckets = new HashNode*[size]();
    }

    void insert(const string& key, const string& value) {
        int idx = hash(key);
        HashNode* node = buckets[idx];
        while (node) {
            if (node->key == key) { node->value = value; return; }
            node = node->next;
        }
        HashNode* newNode = new HashNode(key, value);
        newNode->next = buckets[idx];
        buckets[idx] = newNode;
        count++;
    }

    string search(const string& key) {
        int idx = hash(key);
        HashNode* node = buckets[idx];
        while (node) {
            if (node->key == key) return node->value;
            node = node->next;
        }
        return "";
    }

    bool deleteKey(const string& key) {
        int idx = hash(key);
        HashNode* node = buckets[idx];
        HashNode* prev = nullptr;
        while (node) {
            if (node->key == key) {
                if (prev) prev->next = node->next;
                else buckets[idx] = node->next;
                delete node;
                count--;
                return true;
            }
            prev = node;
            node = node->next;
        }
        return false;
    }
};`,
      java: `import java.util.LinkedList;

class HashTable<K, V> {
    private static class Entry<K, V> {
        K key; V value;
        Entry(K k, V v) { key = k; value = v; }
    }

    private final int size;
    private final LinkedList<Entry<K, V>>[] buckets;
    private int count;

    @SuppressWarnings("unchecked")
    public HashTable(int size) {
        this.size = size;
        buckets = new LinkedList[size];
        for (int i = 0; i < size; i++)
            buckets[i] = new LinkedList<>();
    }

    private int hash(K key) {
        int h = 0;
        for (char c : key.toString().toCharArray())
            h = (h + c) % size;
        return h;
    }

    public void insert(K key, V value) {
        int idx = hash(key);
        for (Entry<K, V> e : buckets[idx]) {
            if (e.key.equals(key)) { e.value = value; return; }
        }
        buckets[idx].addFirst(new Entry<>(key, value));
        count++;
    }

    public V search(K key) {
        for (Entry<K, V> e : buckets[hash(key)])
            if (e.key.equals(key)) return e.value;
        return null;
    }

    public boolean delete(K key) {
        int idx = hash(key);
        for (Entry<K, V> e : buckets[idx]) {
            if (e.key.equals(key)) {
                buckets[idx].remove(e);
                count--;
                return true;
            }
        }
        return false;
    }
}`,
      c: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define SIZE 11

typedef struct HashNode {
    char key[64];
    char value[64];
    struct HashNode* next;
} HashNode;

typedef struct {
    HashNode* buckets[SIZE];
    int count;
} HashTable;

static int hash(const char* key) {
    int h = 0;
    for (int i = 0; key[i]; i++)
        h = (h + (unsigned char)key[i]) % SIZE;
    return h;
}

void insert(HashTable* ht, const char* key, const char* value) {
    int idx = hash(key);
    HashNode* node = ht->buckets[idx];
    while (node) {
        if (strcmp(node->key, key) == 0) {
            strncpy(node->value, value, 63);
            return;
        }
        node = node->next;
    }
    HashNode* newNode = calloc(1, sizeof(HashNode));
    strncpy(newNode->key, key, 63);
    strncpy(newNode->value, value, 63);
    newNode->next = ht->buckets[idx];
    ht->buckets[idx] = newNode;
    ht->count++;
}

const char* search(HashTable* ht, const char* key) {
    int idx = hash(key);
    HashNode* node = ht->buckets[idx];
    while (node) {
        if (strcmp(node->key, key) == 0) return node->value;
        node = node->next;
    }
    return NULL;
}

int deleteKey(HashTable* ht, const char* key) {
    int idx = hash(key);
    HashNode* node = ht->buckets[idx];
    HashNode* prev = NULL;
    while (node) {
        if (strcmp(node->key, key) == 0) {
            if (prev) prev->next = node->next;
            else ht->buckets[idx] = node->next;
            free(node);
            ht->count--;
            return 1;
        }
        prev = node;
        node = node->next;
    }
    return 0;
}`,
      rust: `use std::collections::LinkedList;

struct Entry {
    key: String,
    value: String,
}

struct HashTable {
    size: usize,
    buckets: Vec<LinkedList<Entry>>,
    count: usize,
}

impl HashTable {
    fn new(size: usize) -> Self {
        let mut buckets = Vec::with_capacity(size);
        for _ in 0..size { buckets.push(LinkedList::new()); }
        HashTable { size, buckets, count: 0 }
    }

    fn hash(&self, key: &str) -> usize {
        key.chars().fold(0usize, |acc, c| (acc + c as usize) % self.size)
    }

    fn insert(&mut self, key: String, value: String) {
        let idx = self.hash(&key);
        for entry in &mut self.buckets[idx] {
            if entry.key == key { entry.value = value; return; }
        }
        self.buckets[idx].push_front(Entry { key, value });
        self.count += 1;
    }

    fn search(&self, key: &str) -> Option<&str> {
        let idx = self.hash(key);
        for entry in &self.buckets[idx] {
            if entry.key == key { return Some(&entry.value); }
        }
        None
    }

    fn delete(&mut self, key: &str) -> bool {
        let idx = self.hash(key);
        let before = self.buckets[idx].len();
        self.buckets[idx].retain(|e| e.key != key);
        let deleted = self.buckets[idx].len() < before;
        if deleted { self.count -= 1; }
        deleted
    }
}`,
      go: `package main

type Entry struct {
    key, value string
    next       *Entry
}

type HashTable struct {
    size    int
    buckets []*Entry
    count   int
}

func NewHashTable(size int) *HashTable {
    return &HashTable{size: size, buckets: make([]*Entry, size)}
}

func (ht *HashTable) hash(key string) int {
    h := 0
    for _, c := range key {
        h = (h + int(c)) % ht.size
    }
    return h
}

func (ht *HashTable) Insert(key, value string) {
    idx := ht.hash(key)
    for node := ht.buckets[idx]; node != nil; node = node.next {
        if node.key == key { node.value = value; return }
    }
    ht.buckets[idx] = &Entry{key, value, ht.buckets[idx]}
    ht.count++
}

func (ht *HashTable) Search(key string) (string, bool) {
    for node := ht.buckets[ht.hash(key)]; node != nil; node = node.next {
        if node.key == key { return node.value, true }
    }
    return "", false
}

func (ht *HashTable) Delete(key string) bool {
    idx := ht.hash(key)
    var prev *Entry
    for node := ht.buckets[idx]; node != nil; node = node.next {
        if node.key == key {
            if prev != nil { prev.next = node.next } else { ht.buckets[idx] = node.next }
            ht.count--
            return true
        }
        prev = node
    }
    return false
}`,
    },
  },
}
