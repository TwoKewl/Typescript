import { Command, Context } from '../index';

const command: Command = {
    name: 'pwd',
    description: 'Print the current working directory',
    requiresAdmin: false,
    execute: (args: string[], context: Context) => {
        console.log(`Directory: ${context.directory}`);
    }
}

module.exports = command;