import { getAllFiles } from './fileLister';
import * as readline from 'readline';
import * as fs from 'fs';
import { execSync } from 'child_process';
import { homedir } from 'os';

export interface File {
    filename: string,
    extension: string,
    path: string;
    isFolder: boolean;
}

class Explorer {
    currentDirectory: string;
    filesInCurrentDirectory: File[];
    line: number;
    allFiles: File[];
    filterString: string;
    listeningForKeypress: boolean;
    readingFile: boolean;
    colours: any;

    constructor(currentDirectory: string) {
        this.currentDirectory = currentDirectory;
        this.filesInCurrentDirectory = [];
        this.line = 0;
        this.allFiles = [];
        this.filterString = '';
        this.listeningForKeypress = true;
        this.readingFile = false;

        this.colours = {
            reset: "\x1b[0m",
            red: "\x1b[31m",
            green: "\x1b[32m",
            yellow: "\x1b[33m",
            blue: "\x1b[34m",
            magenta: "\x1b[35m",
            cyan: "\x1b[36m",
            white: "\x1b[37m",
            gray: "\x1b[90m"
        }

        this.setUpKeypress();
    }

    displayDirectory(): void {
        this.clearScreen();
        process.stdout.write('\x1b[?25l');

        console.log('     ' + this.currentDirectory + '\n');

        if (this.filterString.length == 0) {
            console.log(`     \x1b[2mSearch\x1b[0m \n`)
        } else {
            console.log(`     \x1b[4m${this.filterString}\x1b[0m\n`);
        }

        this.allFiles = getAllFiles(this.currentDirectory, this.filterString);
        const fileShowCount = 9;

        if (this.allFiles.length == 0) {
            console.log(`     No files found.`);
            return;
        }

        for (let i = -Math.floor(fileShowCount / 2); i < Math.ceil(fileShowCount / 2); i++) {
            const line = this.line + i;

            if (line >= 0 && line < this.allFiles.length) {
                if (this.line == line) process.stdout.write('\x1b[1m>\x1b[0m ');
                else process.stdout.write('  ');

                if (this.allFiles[line].isFolder) process.stdout.write('📁 ');
                else process.stdout.write('   ');

                const file = this.allFiles[line];
                console.log(file.filename);
            }
        }
    }

    setUpKeypress(): void {
        readline.emitKeypressEvents(process.stdin);
        process.stdin.setRawMode(true);

        process.stdin.on('keypress', (str, key) => {
            if (key.ctrl && key.name == 'c') { this.clearScreen(); process.exit(); }
            if (this.listeningForKeypress && key.sequence == '.') { this.handleKeyPress(key.sequence); return; };
            if (this.listeningForKeypress || (this.readingFile && key.name == 'left')) this.handleKeyPress(key.name ? (key.shift ? key.name.toUpperCase() : key.name.toLowerCase()) : (key.shift ? key.toUpperCase() : key.toLowerCase()));
        });
    }

    handleKeyPress(keyPressed: string): void {
        if (keyPressed == 'down') {
            if (this.line >= this.allFiles.length - 1) return;
            this.line++;
            this.displayDirectory();

            return;
        }

        if (keyPressed == 'up') {
            if (this.line <= 0) return;
            this.line--;
            this.displayDirectory();

            return;
        }

        if (keyPressed == '.') {
            this.filterString = keyPressed;
            this.line = 0;

            this.displayDirectory();

            return;
        }

        if ('abcdefghijklmnopqrstuvwxyz1234567890'.includes(keyPressed.toLowerCase())) {
            this.filterString += keyPressed;
            this.line = 0;

            this.displayDirectory();

            return;
        }

        if (keyPressed == 'backspace') {
            this.filterString = this.filterString.slice(0, -1);
            this.line = 0;

            this.displayDirectory();

            return;
        }

        if (keyPressed == 'right') {
            const currentDirectory = this.currentDirectory;
            const line = this.line;
            const filterString = this.filterString;
            
            if (!this.allFiles[this.line]) return;

            if (this.allFiles[this.line].isFolder) {
                try {
                    this.currentDirectory = `${this.currentDirectory}\\${this.allFiles[this.line].filename}`;
                    this.line = 0;
                    this.filterString = '';
    
                    this.displayDirectory();
                } catch {
                    this.currentDirectory = currentDirectory;
                    this.line = line;
                    this.filterString = filterString;

                    this.displayDirectory();
                }
            } else {
                if (['txt', 'json'].includes(this.allFiles[this.line].extension)) {
                    this.openFile(this.allFiles[this.line]);
                } else {
                    console.log(`Cannot read file: ${this.allFiles[this.line].filename}`);
                }
            }

            return;
        }

        if (keyPressed == 'left') {
            if (this.readingFile) {
                this.readingFile = false;
                this.displayDirectory();
                return;
            }
            const currentDirectory = this.currentDirectory;
            const line = this.line;
            const filterString = this.filterString;

            try {
                const splitPath = this.currentDirectory.split('\\');
                splitPath.pop();
                this.currentDirectory = splitPath.join('\\');
                this.line = 0;
    
                this.displayDirectory();
            } catch {
                this.currentDirectory = currentDirectory;
                this.line = line;
                this.filterString = filterString;

                this.displayDirectory();
            }

            return;
        }
    }

    openFile(file: File): void {
        if (file.extension == 'json') {
            this.readingFile = true;

            const data = fs.readFileSync(file.path, 'utf8');
            this.clearScreen();
            const json = JSON.parse(data);
            this.highlightJson(json);
        } else {
            console.log(`File extension not supported.`);
        }
    }

    highlightJson(json: any) {
        var inString = false;
        var ignoreNextChar = false;
        var nextStringIsKey = true;

        return JSON.stringify(json, null, 2).split('').forEach((char: string) => {
            if (!ignoreNextChar) {
                if (char == '{' || char == '}') {
                    process.stdout.write(this.colours.magenta + char + this.colours.reset);

                    nextStringIsKey = true;
                } else if (char == '"') {
                    if (!inString) {
                        if (nextStringIsKey) {
                            process.stdout.write(this.colours.red + char);
                            nextStringIsKey = false;
                        } else {
                            process.stdout.write(this.colours.green + char);
                        }

                        inString = true;
                    } else {
                        process.stdout.write(char + this.colours.reset);
                        inString = false;
                    }
                } else if (char == '[' || char == ']') {
                    process.stdout.write(this.colours.cyan + char + this.colours.reset);
                } else if (char == '\\') {
                    ignoreNextChar = true;
                } else if (char == ',') {
                    process.stdout.write(this.colours.reset);
                    process.stdout.write(char);
                    nextStringIsKey = true;
                } else if (char == ':' && !inString) {
                    process.stdout.write(this.colours.reset + char + ' ' + '\x1b[38;2;77;136;232m');
                } else {
                    process.stdout.write(char);
                }
            } else {
                process.stdout.write(char);
                ignoreNextChar = false;
            }
        });
    }

    clearScreen() {
        try {
            const command = process.platform === 'win32' ? 'cls' : 'clear';
            execSync(command, { stdio: 'inherit' });
        } catch (error) {
            console.error(`Failed to clear console: ${error}`);
        }
    }
}

const explorer = new Explorer(homedir());
explorer.displayDirectory();