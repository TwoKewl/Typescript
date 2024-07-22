import { Command, Context } from "../index";
import { existsSync } from "fs";
import { join } from "path";

const command: Command = {
    name: "checkExists",
    description: "Checks if a file exists",
    requiresAdmin: false,
    aliases: ["fileExists", "exists?"],
    execute: (args: string[], context: Context) => {
        if (args[0]) {
            const path = join(context.PowerPrompt.directory, args[0]);
            if (existsSync(path)) {
                console.log(`File ${args[0]} exists.`);
            } else {
                console.log(`File ${args[0]} does not exist.`);
            }
        } else console.log("Usage: checkExists <file>");        
    }
}

module.exports = command;