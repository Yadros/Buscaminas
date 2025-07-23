// Define la estructura de cada celda del tablero
export interface Cell {
  hasMine: boolean;       // ¿Tiene mina?
  revealed: boolean;      // ¿Está revelada?
  adjacentMines: number;  // Minas adyacentes
  flagged?: boolean;      // ¿Tiene bandera? (opcional)
}
