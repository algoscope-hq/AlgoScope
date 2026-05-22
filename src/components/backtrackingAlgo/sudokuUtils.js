export const DEFAULT_PUZZLE = [
  ['5', '3', '.', '.', '7', '.', '.', '.', '.'],
  ['6', '.', '.', '1', '9', '5', '.', '.', '.'],
  ['.', '9', '8', '.', '.', '.', '.', '6', '.'],
  ['8', '.', '.', '.', '6', '.', '.', '.', '3'],
  ['4', '.', '.', '8', '.', '3', '.', '.', '1'],
  ['7', '.', '.', '.', '2', '.', '.', '.', '6'],
  ['.', '6', '.', '.', '.', '.', '2', '8', '.'],
  ['.', '.', '.', '4', '1', '9', '.', '.', '5'],
  ['.', '.', '.', '.', '8', '.', '.', '7', '9'],
]

const MAX_FRAMES = 800

export function generateSudokuFrames(puzzle) {
  const board = puzzle.map((row) => [...row])
  const given = puzzle.map((row) => row.map((c) => c !== '.'))
  const frames = []
  let tries = 0
  let backtracks = 0

  function isValid(r, c, num) {
    const ch = String(num)

    for (let i = 0; i < 9; i++) {
      if (board[r][i] === ch || board[i][c] === ch) return false
    }

    const br = Math.floor(r / 3) * 3
    const bc = Math.floor(c / 3) * 3

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[br + i][bc + j] === ch) return false
      }
    }

    return true
  }

  function snap(type, r, c, message) {
    if (frames.length >= MAX_FRAMES) return

    frames.push({
      board: board.map((row) => [...row]),
      given,
      activeR: r,
      activeC: c,
      type,
      message,
      tries,
      backtracks,
    })
  }

  function solve() {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] === '.') {
          for (let n = 1; n <= 9; n++) {
            tries++

            if (isValid(r, c, n)) {
              board[r][c] = String(n)

              snap('place', r, c, `(${r + 1},${c + 1}): placed ${n}`)

              if (solve()) return true

              board[r][c] = '.'
              backtracks++

              snap('backtrack', r, c, `(${r + 1},${c + 1}): backtrack`)
            }
          }

          return false
        }
      }
    }

    snap('solution', -1, -1, '✓ Sudoku solved!')
    return true
  }

  solve()

  return frames
}
