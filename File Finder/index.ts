import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import chalk from 'chalk';

function find(searchPath: string, fileToFind: string, allFilesFound: string[] = []): string[] | false {
    const dir = fs.readdirSync(searchPath);

    for (const item of dir) {
        const fullPath = path.join(searchPath, item);
        try {
            const itemStat = fs.statSync(fullPath);

            if (itemStat.isDirectory()) {
                find(fullPath, fileToFind, allFilesFound);
            } else if (item == fileToFind && !allFilesFound.includes(fullPath)) {
                allFilesFound.push(item);
                console.log(chalk.blue(`Found instance of ${fileToFind} at ${fullPath}`));
            }
        } catch (err) {
            console.log(chalk.red(`Error while finding ${fileToFind}: ${err}`));
        } 
    }

    return allFilesFound;
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Enter file to search for : ", (searchFile) => {
    rl.question("Enter path to search in : ", (searchPath) => {
        find(searchPath, searchFile);
    })
})