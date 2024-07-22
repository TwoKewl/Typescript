import { Command, Context } from '../index';

const command: Command = {
    name: "history",
    description: "Prints the command history",
    requiresAdmin: false,
    execute: (args: string[], context: Context) => {
        const history = context.PowerPrompt.history;
        const historyString = history.map((command, index) => `${index + 1}: ${command}`).join('\n');
        console.log(historyString);
    }
}

module.exports = command;