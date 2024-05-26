import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';

function find(searchPath: string, fileToFind: string, allFilesFound: string[] = []): string[] | false {
    try {
        const dir = fs.readdirSync(searchPath);

        for (const item of dir) {
            const fullPath = path.join(searchPath, item);
            const itemStat = fs.statSync(fullPath);

            if (itemStat.isDirectory()) {
                find(fullPath, fileToFind, allFilesFound);
            } else if (item == fileToFind && !allFilesFound.includes(fullPath)) {
                allFilesFound.push(item);
                console.log(chalk.blue(`Found instance of ${fileToFind} at ${fullPath}`));
            }
        }

        return allFilesFound;
    } catch {
        return false;
    }   
}


// Example
find(`C:\\Users`, `index.ts`);