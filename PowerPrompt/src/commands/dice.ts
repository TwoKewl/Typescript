import { Command, Context } from '../index';

const command: Command = {
    name: 'dice',
    description: 'Roll a dice',
    requiresAdmin: false,
    execute: (args: string[], context: Context) => {
        const dice = Math.floor(Math.random() * 6) + 1;
        console.log(`You rolled a ${dice}!`);
    }
}