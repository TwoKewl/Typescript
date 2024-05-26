import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import chalk from 'chalk';

function findByFileExtension(searchPath: string, extensionToFind: string, allFilesFound: string[] = []): string[] | false {
    const dir = fs.readdirSync(searchPath);

    for (const item of dir) {
        const fullPath = path.join(searchPath, item);
        try {
            const fileStat = fs.statSync(fullPath);
            if (fileStat.isDirectory()){
                findByFileExtension(path.join(searchPath, item), extensionToFind, allFilesFound);
            } else {
                const extension = path.extname(fullPath);
                if (fileStat.isFile() && extension){
                    if (extension == extensionToFind) {
                        console.log(chalk.blue(`File found ending in ${extension} found: ${fullPath}`));
                        allFilesFound.push(fullPath);
                    }
                }
            }            
        } catch (err) {
            console.log(chalk.red(`Error while finding files ending ${extensionToFind}: ${err}`));
        }
    }

    return allFilesFound;
}

function findByFilename(searchPath: string, fileNameToFind: string, allFilesFound: string[] = []): string[] | false {
    const dir = fs.readdirSync(searchPath);

    for (const item of dir) {
        const fullPath = path.join(searchPath, item);
        try {
            const itemStat = fs.statSync(fullPath);
            if (itemStat.isDirectory()) {
                findByFilename(fullPath, fileNameToFind, allFilesFound);
            } else {
                const extension = path.extname(fullPath);

                if (itemStat.isFile() && item.split(extension)[0] == fileNameToFind) {
                    console.log(chalk.blue(`File with name ${fileNameToFind} found: ${fullPath}`));
                    allFilesFound.push(fullPath);
                }
            }
        } catch (err) {
            console.log(`Error while finding files named ${fileNameToFind}: ${err}`);
        }
    }

    return allFilesFound;
}

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

rl.question("1. Search by filename \n2. Search by file extension \n3. Search by both \nInput: ", (result) => {
    switch (result.toString()) {
        case "1":
            rl.question("Enter filename to search for : ", (filename) => {
                rl.question("Enter path to search in : ", (searchPath) => {
                    findByFilename(searchPath, filename);

                    rl.close();
                })
            })
        case "2":
            rl.question("Enter extension to search for : ", (searchExt) => {
                rl.question("Enter path to search in : ", (searchPath) => {
                    findByFileExtension(searchPath, searchExt);
                    
                    rl.close();
                });
            });
        case "3":
            rl.question("Enter file to search for : ", (searchFile) => {
                rl.question("Enter path to search in : ", (searchPath) => {
                    find(searchPath, searchFile);
            
                    rl.close();
                });
            });
        default:
            console.log(chalk.red(`Invalid input.`));
            rl.close();
    }    
})
