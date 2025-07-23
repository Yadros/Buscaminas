"use strict";
// src/juego/index.ts
Object.defineProperty(exports, "__esModule", { value: true });
const promptSync = require('prompt-sync');
const prompt = promptSync();
const estructura_1 = require("../estructura");
const filas = 5;
const columnas = 5;
const minas = 5;
const board = new estructura_1.Board(filas, columnas, minas);
function imprimirTablero(board, mostrarMinas = false) {
    const cells = board.getCells();
    for (let i = 0; i < cells.length; i++) {
        let filaStr = '';
        for (let j = 0; j < cells[i].length; j++) {
            const cell = cells[i][j];
            if (cell.revealed || mostrarMinas) {
                if (cell.hasMine) {
                    filaStr += ' * ';
                }
                else {
                    filaStr += ` ${cell.adjacentMines} `;
                }
            }
            else if (cell.flagged) {
                filaStr += ' F ';
            }
            else {
                filaStr += ' . ';
            }
        }
        console.log(filaStr);
    }
}
while (!board.isGameOver()) {
    console.clear();
    imprimirTablero(board);
    const input = prompt("Ingresá coordenadas (fila columna), o 'salir': ");
    if (input.toLowerCase() === 'salir') {
        console.log("👋 Saliste del juego.");
        break;
    }
    const [filaStr, colStr] = input.trim().split(" ");
    const fila = parseInt(filaStr, 10);
    const col = parseInt(colStr, 10);
    if (isNaN(fila) || isNaN(col) ||
        fila < 0 || fila >= filas ||
        col < 0 || col >= columnas) {
        console.log("¡Qué salame! Coordenadas inválidas. Usá números dentro del rango.");
        prompt("Presioná ENTER para continuar...");
        continue;
    }
    board.revealCell(fila, col);
    if (board.isGameOver()) {
        console.clear();
        imprimirTablero(board, true);
        console.log("¡Cagaste! ¡Pisaste una mina! Fin del juego.");
        break;
    }
    if (board.checkWin()) {
        console.clear();
        imprimirTablero(board, true);
        console.log("¡Bien, putito! ¡Ganaste! Completaste el tablero.");
        break;
    }
} // <--- Asegurate de que este cierre de llave exista aquí
