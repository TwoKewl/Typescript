import { Command, Context } from '../index';
import { uptime } from 'os';

const command: Command = {
    name: "uptime",
    description: "Prints the system uptime",
    requiresAdmin: false,
    execute: (args: string[], context: Context) => {
        const uptimeSeconds = uptime();
        const uptimeMinutes = Math.floor(uptimeSeconds / 60);
        const uptimeHours = Math.floor(uptimeMinutes / 60);
        const uptimeDays = Math.floor(uptimeHours / 24);

        console.log(`Your system has been running for ${uptimeDays != 0 ? `${uptimeDays} days, `: ''}${uptimeHours != 0 ? `${uptimeHours % 24} hours, `: ''}${uptimeMinutes % 60} minutes, and ${(uptimeSeconds % 60).toFixed(2)} seconds.`);
    }
}

module.exports = command;