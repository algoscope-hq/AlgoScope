export const backtrackingSources = {
  nqueens: {
    javascript: {
      code: `function solveNQueens(n) {
  const board = Array.from({ length: n }, () => Array(n).fill('.'))
  const results = []

  function isSafe(row, col) {
    for (let i = 0; i < row; i++)
      if (board[i][col] === 'Q') return false
    for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--)
      if (board[i][j] === 'Q') return false
    for (let i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++)
      if (board[i][j] === 'Q') return false
    return true
  }

  function solve(row) {
    if (row === n) {
      results.push(board.map(r => r.join('')))
      return
    }
    for (let col = 0; col < n; col++) {
      if (isSafe(row, col)) {
        board[row][col] = 'Q'
        solve(row + 1)
        board[row][col] = '.'  // backtrack
      }
    }
  }

  solve(0)
  return results
}`,
    },
    python: {
      code: `def solve_n_queens(n):
    board = [['.' for _ in range(n)] for _ in range(n)]
    results = []

    def is_safe(row, col):
        for i in range(row):
            if board[i][col] == 'Q': return False
        i, j = row - 1, col - 1
        while i >= 0 and j >= 0:
            if board[i][j] == 'Q': return False
            i -= 1; j -= 1
        i, j = row - 1, col + 1
        while i >= 0 and j < n:
            if board[i][j] == 'Q': return False
            i -= 1; j += 1
        return True

    def solve(row):
        if row == n:
            results.append([''.join(r) for r in board])
            return
        for col in range(n):
            if is_safe(row, col):
                board[row][col] = 'Q'
                solve(row + 1)
                board[row][col] = '.'  # backtrack

    solve(0)
    return results`,
    },
    cpp: {
      code: `#include <vector>
#include <string>
using namespace std;

bool isSafe(vector<string>& b, int row, int col, int n) {
    for (int i = 0; i < row; i++)
        if (b[i][col] == 'Q') return false;
    for (int i=row-1,j=col-1; i>=0&&j>=0; i--,j--)
        if (b[i][j] == 'Q') return false;
    for (int i=row-1,j=col+1; i>=0&&j<n; i--,j++)
        if (b[i][j] == 'Q') return false;
    return true;
}

void solve(vector<string>& board, int row, int n,
           vector<vector<string>>& res) {
    if (row == n) { res.push_back(board); return; }
    for (int col = 0; col < n; col++) {
        if (isSafe(board, row, col, n)) {
            board[row][col] = 'Q';
            solve(board, row + 1, n, res);
            board[row][col] = '.';  // backtrack
        }
    }
}`,
    },
    java: {
      code: `import java.util.*;

public class NQueens {
    static List<List<String>> results = new ArrayList<>();

    static boolean isSafe(char[][] b, int row, int col, int n) {
        for (int i = 0; i < row; i++)
            if (b[i][col] == 'Q') return false;
        for (int i=row-1,j=col-1; i>=0&&j>=0; i--,j--)
            if (b[i][j] == 'Q') return false;
        for (int i=row-1,j=col+1; i>=0&&j<n; i--,j++)
            if (b[i][j] == 'Q') return false;
        return true;
    }

    static void solve(char[][] b, int row, int n) {
        if (row == n) {
            List<String> sol = new ArrayList<>();
            for (char[] r : b) sol.add(new String(r));
            results.add(sol);
            return;
        }
        for (int col = 0; col < n; col++) {
            if (isSafe(b, row, col, n)) {
                b[row][col] = 'Q';
                solve(b, row + 1, n);
                b[row][col] = '.';  // backtrack
            }
        }
    }
}`,
    },
    c: {
      code: `#include <string.h>
#define MAXN 8
char board[MAXN][MAXN+1];
int count = 0, N;

int isSafe(int row, int col) {
    for (int i = 0; i < row; i++)
        if (board[i][col] == 'Q') return 0;
    for (int i=row-1,j=col-1; i>=0&&j>=0; i--,j--)
        if (board[i][j] == 'Q') return 0;
    for (int i=row-1,j=col+1; i>=0&&j<N; i--,j++)
        if (board[i][j] == 'Q') return 0;
    return 1;
}

void solve(int row) {
    if (row == N) { count++; return; }
    for (int col = 0; col < N; col++) {
        if (isSafe(row, col)) {
            board[row][col] = 'Q';
            solve(row + 1);
            board[row][col] = '.';  // backtrack
        }
    }
}`,
    },
    rust: {
      code: `fn is_safe(board: &[Vec<char>], row: usize, col: usize, n: usize) -> bool {
    for i in 0..row {
        if board[i][col] == 'Q' { return false; }
    }
    let (mut i, mut j) = (row as i32 - 1, col as i32 - 1);
    while i >= 0 && j >= 0 {
        if board[i as usize][j as usize] == 'Q' { return false; }
        i -= 1; j -= 1;
    }
    let (mut i, mut j) = (row as i32 - 1, col as i32 + 1);
    while i >= 0 && j < n as i32 {
        if board[i as usize][j as usize] == 'Q' { return false; }
        i -= 1; j += 1;
    }
    true
}

fn solve(board: &mut Vec<Vec<char>>, row: usize, n: usize,
         results: &mut Vec<Vec<String>>) {
    if row == n {
        results.push(board.iter().map(|r| r.iter().collect()).collect());
        return;
    }
    for col in 0..n {
        if is_safe(board, row, col, n) {
            board[row][col] = 'Q';
            solve(board, row + 1, n, results);
            board[row][col] = '.';  // backtrack
        }
    }
}`,
    },
    go: {
      code: `package main

func isSafe(board [][]rune, row, col, n int) bool {
    for i := 0; i < row; i++ {
        if board[i][col] == 'Q' { return false }
    }
    for i, j := row-1, col-1; i >= 0 && j >= 0; i, j = i-1, j-1 {
        if board[i][j] == 'Q' { return false }
    }
    for i, j := row-1, col+1; i >= 0 && j < n; i, j = i-1, j+1 {
        if board[i][j] == 'Q' { return false }
    }
    return true
}

func solve(board [][]rune, row, n int, results *[][]string) {
    if row == n {
        sol := make([]string, n)
        for i, r := range board { sol[i] = string(r) }
        *results = append(*results, sol)
        return
    }
    for col := 0; col < n; col++ {
        if isSafe(board, row, col, n) {
            board[row][col] = 'Q'
            solve(board, row+1, n, results)
            board[row][col] = '.'  // backtrack
        }
    }
}`,
    },
  },

  hanoi: {
    javascript: {
      code: `function towerOfHanoi(n, source, auxiliary, destination) {
  if (n <= 0) {
    return;
  }

  if (n === 1) {
    console.log(\`Move disk 1 from \${source} to \${destination}\`);
    return;
  }

  towerOfHanoi(n - 1, source, destination, auxiliary);
  console.log(\`Move disk \${n} from \${source} to \${destination}\`);
  towerOfHanoi(n - 1, auxiliary, source, destination);
}

towerOfHanoi(4, 'A', 'B', 'C');`,
    },
    python: {
      code: `def tower_of_hanoi(n, source, auxiliary, destination):
    if n <= 0:
        return

    if n == 1:
        print(f"Move disk 1 from {source} to {destination}")
        return

    tower_of_hanoi(n - 1, source, destination, auxiliary)
    print(f"Move disk {n} from {source} to {destination}")
    tower_of_hanoi(n - 1, auxiliary, source, destination)

tower_of_hanoi(4, 'A', 'B', 'C')`,
    },
    cpp: {
      code: `#include <iostream>
using namespace std;

void towerOfHanoi(int n, char source, char auxiliary, char destination) {
    if (n <= 0) {
        return;
    }

    if (n == 1) {
        cout << "Move disk 1 from " << source << " to " << destination << endl;
        return;
    }

    towerOfHanoi(n - 1, source, destination, auxiliary);
    cout << "Move disk " << n << " from " << source << " to " << destination << endl;
    towerOfHanoi(n - 1, auxiliary, source, destination);
}

int main() {
    towerOfHanoi(4, 'A', 'B', 'C');
}`,
    },
    java: {
      code: `public class TowerOfHanoi {
    static void solve(int n, char source, char auxiliary, char destination) {
        if (n <= 0) {
            return;
        }

        if (n == 1) {
            System.out.println("Move disk 1 from " + source + " to " + destination);
            return;
        }

        solve(n - 1, source, destination, auxiliary);
        System.out.println("Move disk " + n + " from " + source + " to " + destination);
        solve(n - 1, auxiliary, source, destination);
    }

    public static void main(String[] args) {
        solve(4, 'A', 'B', 'C');
    }
}`,
    },
    c: {
      code: `#include <stdio.h>

void towerOfHanoi(int n, char source, char auxiliary, char destination) {
    if (n <= 0) {
        return;
    }

    if (n == 1) {
        printf("Move disk 1 from %c to %c\\n", source, destination);
        return;
    }

    towerOfHanoi(n - 1, source, destination, auxiliary);
    printf("Move disk %d from %c to %c\\n", n, source, destination);
    towerOfHanoi(n - 1, auxiliary, source, destination);
}

int main() {
    towerOfHanoi(4, 'A', 'B', 'C');
    return 0;
}`,
    },
    rust: {
      code: `fn tower_of_hanoi(n: u32, source: char, auxiliary: char, destination: char) {
    if n == 0 {
        return;
    }

    if n == 1 {
        println!("Move disk 1 from {} to {}", source, destination);
        return;
    }

    tower_of_hanoi(n - 1, source, destination, auxiliary);
    println!("Move disk {} from {} to {}", n, source, destination);
    tower_of_hanoi(n - 1, auxiliary, source, destination);
}

fn main() {
    tower_of_hanoi(4, 'A', 'B', 'C');
}`,
    },
    go: {
      code: `package main

import "fmt"

func towerOfHanoi(n int, source, auxiliary, destination string) {
    if n <= 0 {
        return
    }

    if n == 1 {
        fmt.Printf("Move disk 1 from %s to %s\\n", source, destination)
        return
    }

    towerOfHanoi(n-1, source, destination, auxiliary)
    fmt.Printf("Move disk %d from %s to %s\\n", n, source, destination)
    towerOfHanoi(n-1, auxiliary, source, destination)
}

func main() {
    towerOfHanoi(4, "A", "B", "C")
}`,
    },
  },

  sudoku: {
    javascript: {
      code: `function solveSudoku(board) {
  function isValid(row, col, num) {
    const ch = String(num)
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === ch) return false
      if (board[i][col] === ch) return false
    }
    const br = Math.floor(row / 3) * 3
    const bc = Math.floor(col / 3) * 3
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++)
        if (board[br + i][bc + j] === ch) return false
    return true
  }

  function solve() {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] === '.') {
          for (let n = 1; n <= 9; n++) {
            if (isValid(r, c, n)) {
              board[r][c] = String(n)
              if (solve()) return true
              board[r][c] = '.'  // backtrack
            }
          }
          return false
        }
      }
    }
    return true
  }

  solve()
  return board
}`,
    },
    python: {
      code: `def solve_sudoku(board):
    def is_valid(row, col, num):
        ch = str(num)
        if ch in board[row]: return False
        if ch in [board[i][col] for i in range(9)]: return False
        br, bc = (row // 3) * 3, (col // 3) * 3
        for i in range(3):
            for j in range(3):
                if board[br+i][bc+j] == ch: return False
        return True

    def solve():
        for r in range(9):
            for c in range(9):
                if board[r][c] == '.':
                    for n in range(1, 10):
                        if is_valid(r, c, n):
                            board[r][c] = str(n)
                            if solve(): return True
                            board[r][c] = '.'  # backtrack
                    return False
        return True

    solve()
    return board`,
    },
    cpp: {
      code: `#include <vector>
#include <string>
using namespace std;

bool isValid(vector<string>& b, int r, int c, char num) {
    for (int i = 0; i < 9; i++) {
        if (b[r][i] == num || b[i][c] == num) return false;
    }
    int br = (r/3)*3, bc = (c/3)*3;
    for (int i = 0; i < 3; i++)
        for (int j = 0; j < 3; j++)
            if (b[br+i][bc+j] == num) return false;
    return true;
}

bool solve(vector<string>& board) {
    for (int r = 0; r < 9; r++) {
        for (int c = 0; c < 9; c++) {
            if (board[r][c] == '.') {
                for (char n = '1'; n <= '9'; n++) {
                    if (isValid(board, r, c, n)) {
                        board[r][c] = n;
                        if (solve(board)) return true;
                        board[r][c] = '.';  // backtrack
                    }
                }
                return false;
            }
        }
    }
    return true;
}`,
    },
    java: {
      code: `public class SudokuSolver {
    static boolean isValid(char[][] b, int r, int c, char num) {
        for (int i = 0; i < 9; i++) {
            if (b[r][i] == num || b[i][c] == num) return false;
        }
        int br = (r/3)*3, bc = (c/3)*3;
        for (int i = 0; i < 3; i++)
            for (int j = 0; j < 3; j++)
                if (b[br+i][bc+j] == num) return false;
        return true;
    }

    static boolean solve(char[][] board) {
        for (int r = 0; r < 9; r++) {
            for (int c = 0; c < 9; c++) {
                if (board[r][c] == '.') {
                    for (char n = '1'; n <= '9'; n++) {
                        if (isValid(board, r, c, n)) {
                            board[r][c] = n;
                            if (solve(board)) return true;
                            board[r][c] = '.';  // backtrack
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }
}`,
    },
    c: {
      code: `#include <string.h>
char board[9][10];

int isValid(int r, int c, char num) {
    for (int i = 0; i < 9; i++) {
        if (board[r][i] == num || board[i][c] == num) return 0;
    }
    int br = (r/3)*3, bc = (c/3)*3;
    for (int i = 0; i < 3; i++)
        for (int j = 0; j < 3; j++)
            if (board[br+i][bc+j] == num) return 0;
    return 1;
}

int solve() {
    for (int r = 0; r < 9; r++) {
        for (int c = 0; c < 9; c++) {
            if (board[r][c] == '.') {
                for (char n = '1'; n <= '9'; n++) {
                    if (isValid(r, c, n)) {
                        board[r][c] = n;
                        if (solve()) return 1;
                        board[r][c] = '.';  // backtrack
                    }
                }
                return 0;
            }
        }
    }
    return 1;
}`,
    },
    rust: {
      code: `fn is_valid(board: &[Vec<char>], r: usize, c: usize, num: char) -> bool {
    for i in 0..9 {
        if board[r][i] == num || board[i][c] == num { return false; }
    }
    let (br, bc) = ((r / 3) * 3, (c / 3) * 3);
    for i in 0..3 {
        for j in 0..3 {
            if board[br+i][bc+j] == num { return false; }
        }
    }
    true
}

fn solve(board: &mut Vec<Vec<char>>) -> bool {
    for r in 0..9 {
        for c in 0..9 {
            if board[r][c] == '.' {
                for n in '1'..='9' {
                    if is_valid(board, r, c, n) {
                        board[r][c] = n;
                        if solve(board) { return true; }
                        board[r][c] = '.';  // backtrack
                    }
                }
                return false;
            }
        }
    }
    true
}`,
    },
    go: {
      code: `package main

func isValid(board [][]byte, r, c int, num byte) bool {
    for i := 0; i < 9; i++ {
        if board[r][i] == num || board[i][c] == num { return false }
    }
    br, bc := (r/3)*3, (c/3)*3
    for i := 0; i < 3; i++ {
        for j := 0; j < 3; j++ {
            if board[br+i][bc+j] == num { return false }
        }
    }
    return true
}

func solve(board [][]byte) bool {
    for r := 0; r < 9; r++ {
        for c := 0; c < 9; c++ {
            if board[r][c] == '.' {
                for n := byte('1'); n <= '9'; n++ {
                    if isValid(board, r, c, n) {
                        board[r][c] = n
                        if solve(board) { return true }
                        board[r][c] = '.'  // backtrack
                    }
                }
                return false
            }
        }
    }
    return true
}`,
    },
  },
}

export const getBacktrackingSource = (algo, language) =>
  backtrackingSources[algo]?.[language]?.code ??
  '// No implementation available'
