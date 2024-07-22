import { Command } from '../index';

const command: Command = {
    name: 'cls',
    description: 'Clears the console screen.',
    aliases: ['clear'],
    requiresAdmin: false,
    execute: async (args: string[], context) => {
        process.stdout.write('\x1Bc');
    }
}

module.exports = command;