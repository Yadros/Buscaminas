import { Cell } from '../celdas'; // Importa el tipo Cell desde la carpeta "celdas"

// Clase que representa el tablero del buscaminas
export class Board {
  cells: Cell[][];           // Matriz de celdas del tablero
  rows: number;              // Número de filas
  cols: number;              // Número de columnas
  mineCount: number;         // Número de minas
  gameOver: boolean = false; // Estado del juego (true si perdiste)

  // Constructor: inicializa tamaño y minas, y crea el tablero
  constructor(rows: number, cols: number, mineCount: number) {
    this.rows = rows;
    this.cols = cols;
    this.mineCount = mineCount;
    this.cells = this.initializeBoard(); // Crea el tablero
  }

  // Crea la matriz vacía y pone minas y números
  initializeBoard(): Cell[][] {
    const board: Cell[][] = Array(this.rows)
      .fill(null)
      .map(() => Array(this.cols).fill(null));

    // Inicializa cada celda sin mina y sin revelar
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        board[i][j] = { hasMine: false, revealed: false, adjacentMines: 0 };
      }
    }

    this.placeMines(board);                    // Coloca minas aleatorias
    this.calculateAdjacentMines(board);  // Calcula minas cercanas

    return board;
  }

  // Coloca las minas en posiciones aleatorias sin repetir
  placeMines(board: Cell[][]): void {
    let placed = 0;
    while (placed < this.mineCount) {
      const row = Math.floor(Math.random() * this.rows);
      const col = Math.floor(Math.random() * this.cols);
      if (!board[row][col].hasMine) {
        board[row][col].hasMine = true; // Marca mina
        placed++;
      }
    }
  }

  // Para cada celda que no tenga mina, cuenta minas vecinas
  calculateAdjacentMines(board: Cell[][]): void {
    const directions = [-1, 0, 1]; // Posiciones relativas

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (board[row][col].hasMine) continue; // Si es mina, saltear

        let count = 0; // Contador de minas cercanas

        // Recorre vecinos (arriba, mismo nivel, abajo)
        for (let dx of directions) {
          for (let dy of directions) {
            if (dx === 0 && dy === 0) continue; // Ignorar la propia celda

            const newRow = row + dx;
            const newCol = col + dy;

            // Verifica límites y si hay mina
            if (
              newRow >= 0 && newRow < this.rows &&
              newCol >= 0 && newCol < this.cols &&
              board[newRow][newCol].hasMine
            ) {
              count++;
            }
          }
        }

        board[row][col].adjacentMines = count; // Guarda el conteo
      }
    }
  }

  // Retorna el estado actual del tablero
  getCells(): Cell[][] {
    return this.cells;
  }

  // Revela una celda (simula clic del jugador)
  revealCell(row: number, col: number): void {
    const cell = this.cells[row][col];

    // Ignora si ya fue revelada o tiene bandera
    if (cell.revealed || cell.flagged) return;

    cell.revealed = true; // Marca celda como revelada

    if (cell.hasMine) {
      console.log("¡Perdiste! Encontraste una mina.");
      this.gameOver = true; // Fin del juego
    } else if (cell.adjacentMines === 0) {
      // Si no tiene minas cerca, revela vecinos recursivamente
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          const newRow = row + i;
          const newCol = col + j;

          if (
            newRow >= 0 && newRow < this.rows &&
            newCol >= 0 && newCol < this.cols &&
            !(i === 0 && j === 0)
          ) {
            this.revealCell(newRow, newCol);
          }
        }
      }
    }
  }

  // Marca o desmarca una celda con bandera
  toggleFlag(row: number, col: number): void {
    const cell = this.cells[row][col];
    if (cell.revealed) return; // No marcar si ya está revelada

    cell.flagged = !cell.flagged; // Alterna bandera
  }

  // Verifica si ganaste: todas las celdas sin minas reveladas
  checkWin(): boolean {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const cell = this.cells[row][col];
        if (!cell.hasMine && !cell.revealed) {
          return false; // Si falta revelar alguna, no ganaste
        }
      }
    }
    return true; // Ganaste!
  }

  // Indica si el juego terminó (por pisar mina)
  isGameOver(): boolean {
    return this.gameOver;
  }
}
