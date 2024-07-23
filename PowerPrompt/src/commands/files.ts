import { Command, Context } from '../index';
import * as fs from 'fs';
import * as path from 'path';

const rm: Command = {
    name: "rm",
    description: "Remove a file",
    requiresAdmin: false,
    execute: (args: string[], context: Context) => {
        if (args.length == 0) { console.log("Usage: rm <file>"); return; }
        const filename = args[0];
        const filePath = path.join(context.directory, filename);

        if (!fs.existsSync(filePath)) {
            console.log(`File ${filename} does not exist`);
            return;
        }

        fs.unlinkSync(filePath);
        console.log(`Removed file ${filename}.`);
    }
}

const rmdir: Command = {
    name: "rmdir",
    description: "Remove a directory",
    requiresAdmin: false,
    execute: (args: string[], context: Context) => {
        if (args.length == 0) { console.log("Usage: rmdir <directory>"); return; }
        const folderName = args[0];
        const folderPath = path.join(context.directory, folderName);

        if (!fs.existsSync(folderPath)) {
            console.log(`Directory ${folderName} does not exist`);
            return;
        }

        fs.rmdirSync(folderPath, { recursive: true });
        console.log(`Removed directory ${folderName}.`);
    }
}

const mk: Command = {
    name: "mk",
    description: "Create a file",
    requiresAdmin: false,
    execute: (args: string[], context: Context) => {
        if (args.length == 0) { console.log("Usage: mk <file>"); return; }
        const filename = args[0];
        const filePath = path.join(context.directory, filename);

        if (fs.existsSync(filePath)) {
            console.log(`File ${filename} already exists`);
        } else {
            fs.writeFileSync(filePath, "");
            console.log(`Created file ${filename}.`);
        }
    }
}

const mkdir: Command = {
    name: "mkdir",
    description: "Create a directory",
    requiresAdmin: false,
    execute: (args: string[], context: Context) => {
        if (args.length == 0) { console.log("Usage: mkdir <directory>"); return; }
        const folderName = args[0];
        const folderPath = path.join(context.directory, folderName);

        if (fs.existsSync(folderPath)) {
            console.log(`Directory ${folderName} already exists`);
        } else {
            fs.mkdirSync(folderPath);
            console.log(`Created directory ${folderName}.`);
        }
    }
}

module.exports = [rm, rmdir, mk, mkdir];