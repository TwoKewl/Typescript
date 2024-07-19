import { File } from "./index";
import * as path from "path";
import * as fs from "fs";

export const getAllFiles = (searchPath: string, filterString: string): File[] => {
    const filesFound: File[] = [];
    const filteredFiles: File[] = [];
    const files = fs.readdirSync(searchPath);

    files.forEach(file => {
        const fileStat = fs.statSync(path.join(searchPath, file));

        filesFound.push({ filename: file, extension: fileStat.isFile() ? file.split('.')[1] : '', path: path.join(searchPath, file), isFolder: fileStat.isDirectory() });
    });

    filesFound.forEach((file) => {
        if (file.filename.toLowerCase().includes(filterString.toLowerCase())) {
            filteredFiles.push(file);
        }
    });
    
    return filteredFiles;
}