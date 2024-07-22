import { Command, Context } from "../index";
import { join } from 'path';
import * as fs from "fs";

const copy: Command = {
    name: "copy",
    description: "Copies the specified file, and allows you to then paste it somewhere else.",
    requiresAdmin: false,
    execute: (args: string[], context: Context) => {
        const pp = context.PowerPrompt;
        if (args.length < 1) {
            console.log("Usage: copy <file>");
            return;
        }

        const file = args[0];
        const filePath = join(pp.directory, file);
        if (!fs.existsSync(filePath)) {
            console.log(`File ${file} not found.`);
            return;
        }

        pp.clipboard = filePath;
    }
}

const paste: Command = {
    name: "paste",
    description: "Pastes the file that was copied.",
    requiresAdmin: false,
    execute: (args: string[], context: Context) => {
        const pp = context.PowerPrompt;
        if (!pp.clipboard || pp.clipboard === "") {
            console.log("No file copied.");
            return;
        }

        if (!fs.existsSync(pp.clipboard)) {
            console.log(`File ${pp.clipboard} not found. It is possible that another plugin has interfered.`);
            return
        }

        const splitPath = pp.clipboard.split("\\");
        if (splitPath.length > 1) {
            const fileName: string = splitPath[splitPath.length - 1];
            fs.copyFileSync(pp.clipboard, join(pp.directory, fileName));
            console.log(`Copied ${fileName} to ${pp.directory}`);
        } else {
            console.log(`File ${pp.clipboard} not found. It is possible that another plugin has interfered.`)
        }
    }
}

module.exports = [copy, paste];