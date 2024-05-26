import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';

var categories: { [key: string]: string[] } = {
    Videos: ['.mp4', '.mov', '.gif', '.mkv'],
    Audio: ['.mp3', '.wav', '.ogg'],
    Pictures: ['.jpg', '.png', '.jpeg', '.webp', '.svg'],
    Compressed: ['.zip', '.rar', '.7z'],
    Docs: ['.pptx', '.docx', '.pdf'],
    Text: ['.txt'],
    Executables: ['.exe'],
    Code: ['.js', '.ts', '.java', '.py', '.cpp', '.cs', '.html', '.css', '.dll',  '.json']
}

function getCategory(extension: string): string {
    for (const category in categories){
        if (categories[category].includes(extension.toLowerCase())){
            return category;
        }
    }

    return 'Others';
}

function organizeDirectory(directory: string) {
    fs.readdirSync(directory).forEach(item => {
        const filePath = path.join(directory, item);
        const fileStat = fs.statSync(filePath);

        if (fileStat.isFile()){
            const fileExt = path.extname(item);
            const category = getCategory(fileExt);

            if (!fs.existsSync(`${directory}\\${category}`)) {
                fs.mkdirSync(`${directory}\\${category}`);
                console.log(chalk.green(`${category} has been created.`))
            }

            const newPath = path.join(`${directory}\\${category}`, path.basename(filePath));
            fs.renameSync(filePath, newPath);
            console.log(chalk.blue(`Moved ${item} to ${directory}\\${category}`));
        }
    });
}

organizeDirectory("Enter your directory here");