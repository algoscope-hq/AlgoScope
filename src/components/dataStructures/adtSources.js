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
    Stack<Character> st = new Stack<>();
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
      java: `import java.util.Stack;
public int evaluate(String s) {
    Stack<Integer> st = new Stack<>();
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
}
