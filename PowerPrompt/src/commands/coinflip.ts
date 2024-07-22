import { Command } from '../index';

const command: Command = {
    name: "coinflip",
    description: "Flips a coin",
    requiresAdmin: false,
    execute: (args: string[], context) => {
        console.log(`The coin landed on ${Math.random() > 0.5 ? 'heads' : 'tails'}.`);
    }
}

module.exports = command;