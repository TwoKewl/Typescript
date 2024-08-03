
export class Board {
    constructor(ctx) {
        this.ctx = ctx;
    }

    renderBoard() {
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                this.ctx.fillStyle = (x + y) % 2 === 0 ? '#f0d9b5' : '#b58863';
                this.ctx.fillRect(x * 100, y * 100, 100, 100);
            }
        }

        this.renderPieces();
    }

    renderPieces() {
        
    }
}