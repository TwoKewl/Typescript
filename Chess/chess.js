const canvas = document.getElementById('chessBoard');
const ctx = canvas.getContext('2d');

import { Board } from "./board.js";

const b = new Board(ctx);
b.renderBoard();