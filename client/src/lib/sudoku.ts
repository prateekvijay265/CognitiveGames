// @ts-nocheck
/* ---------- Sudoku engine ---------- */

export type SudokuCell = { value: number; fixed: boolean; notes?: number[] };
export type SudokuBoard = SudokuCell[][];

export const BLANK = 0;

export function newBoard(): SudokuBoard {
  const b = Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => ({ value: BLANK, fixed: false } as SudokuCell)),
  );
  return b;
}

export function clone(board: SudokuBoard): SudokuBoard {
  return board.map((r) => r.map((c) => ({ value: c.value, fixed: c.fixed, notes: c.notes ? [...c.notes] : undefined })));
}

function validRow(b: SudokuBoard, r: number, v: number): boolean {
  for (let c = 0; c < 9; c++) if (b[r][c].value === v) return false;
  return true;
}
function validCol(b: SudokuBoard, c: number, v: number): boolean {
  for (let r = 0; r < 9; r++) if (b[r][c].value === v) return false;
  return true;
}
function validBox(b: SudokuBoard, r: number, c: number, v: number): boolean {
  const sr = Math.floor(r / 3) * 3;
  const sc = Math.floor(c / 3) * 3;
  for (let rr = 0; rr < 3; rr++) for (let cc = 0; cc < 3; cc++) if (b[sr + rr][sc + cc].value === v) return false;
  return true;
}
export function isValidMove(b: SudokuBoard, r: number, c: number, v: number): boolean {
  if (v === BLANK) return true;
  return validRow(b, r, v) && validCol(b, c, v) && validBox(b, r, c, v);
}

function solve(b: SudokuBoard, cells: [number, number][]): boolean {
  if (cells.length === 0) return true;
  const [r, c] = cells[0];
  if (b[r][c].value !== BLANK) return solve(b, cells.slice(1));
  for (let v = 1; v <= 9; v++) {
    if (!validRow(b, r, v) || !validCol(b, c, v) || !validBox(b, r, c, v)) continue;
    b[r][c].value = v;
    if (solve(b, cells.slice(1))) return true;
    b[r][c].value = BLANK;
  }
  return false;
}

/* Generate a full solved board then hide cells for difficulty */
export function generate(board: SudokuBoard, difficulty: number): SudokuBoard {
  // start from blank and solve by random trials — faster for our needs
  const solved = newBoard();
  const cells: [number, number][] = [];
  for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) cells.push([r, c]);
  // Fisher-Yates shuffle order
  for (let i = cells.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cells[i], cells[j]] = [cells[j], cells[i]];
  }
  solve(solved, cells);

  // hide cells based on difficulty
  const hideCount = difficulty === 1 ? 36 : difficulty === 2 ? 48 : 56;
  const hidden = new Set<string>();
  const order: string[] = [];
  for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) order.push(`${r},${c}`);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  for (let i = 0; i < hideCount && i < order.length; i++) hidden.add(order[i]);

  for (const key of hidden) {
    const [rStr, cStr] = key.split(",");
    const r = parseInt(rStr, 10);
    const c = parseInt(cStr, 10);
    board[r][c] = { value: solved[r][c].value, fixed: false };
  }
  for (const key of hidden) {
    const [rStr, cStr] = key.split(",");
    const r = parseInt(rStr, 10);
    const c = parseInt(cStr, 10);
    board[r][c].fixed = false;
  }
  // set fixed for visible cells
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c].value !== BLANK && !hidden.has(`${r},${c}`)) {
        board[r][c].fixed = true;
      }
    }
  }
  return board;
}

export function checkComplete(b: SudokuBoard): boolean {
  for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) if (b[r][c].value === BLANK) return false;
  return true;
}

export function notesFor(b: SudokuBoard, r: number, c: number): number[] {
  if (b[r][c].value !== BLANK) return [];
  const notes: number[] = [];
  for (let v = 1; v <= 9; v++) {
    if (isValidMove(b, r, c, v)) notes.push(v);
  }
  return notes;
}
