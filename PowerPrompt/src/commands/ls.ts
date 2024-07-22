import * as fs from 'fs';
import * as path from 'path';
import { Command, Context } from '../index';

const command: Command = {
    name: 'ls',
    description: 'Lists all files in the current directory.',
    aliases: ['dir'],
    requiresAdmin: false,
    execute: async (args: string[], context: Context) => {
        const contextPath = context.directory;

        const everything = fs.readdirSync(contextPath);
        const files = everything.filter(file => {
            const filePath = path.join(contextPath, file);
            return fs.statSync(filePath).isFile();
        });
        const folders = everything.filter(folder => !files.includes(folder));

        const sortedFiles: string[] = [];
        files.forEach((file) => {
            if (path.extname(file as string) == '') { sortedFiles.push(file); files.splice(files.indexOf(file), 1); }
        });

        files.sort((a, b) => { return path.extname(a).localeCompare(path.extname(b)); });
        sortedFiles.concat(files);

        if (args[0] != 'files' && args[0] != 'file') {
            folders.forEach((folder) => {
                console.log(`[FOLDER]: ${folder}`);
            });
        }
        
        if (args[0] != 'folders' && args[0] != 'folder') {
            files.forEach((file) => {
                console.log(`[FILE]: ${file}`);
            });
        }
    }
}

module.exports = command;