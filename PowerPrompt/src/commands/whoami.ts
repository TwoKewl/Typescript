import { Command, Context } from '../index';

const command: Command = {
    name: "whoami",
    description: "Prints the current user",
    requiresAdmin: false,
    execute: (args: string[], context: Context) => {
        console.log(`You are signed in as ${context.user.username}. ${context.user.admin ? `You have admin privileges.` : ''}`);
    }
}

module.exports = command;