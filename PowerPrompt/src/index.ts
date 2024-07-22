import * as readline from 'readline';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcrypt';
import { homedir } from 'os';

interface User {
    username: string;
    password: string;
    admin: boolean;
}

export interface Command {
    name: string;
    description: string;
    requiresAdmin: boolean;
    usage?: string;
    aliases?: string[];
    execute: (args: string[], context: Context) => void;
}

export interface Context {
    user: User;
    directory: string;
    commands: Set<Command>;
    PowerPrompt: PowerPrompt;
}

class PowerPrompt {
    private privateOutput: string = '';
    private user: User | null = null;
    private commands: Set<Command> = new Set();
    private lastRunCommand: string = '';
    public directory: string = homedir();
    public clipboard: string = ''; // Placeholder for plugins to use
    public history: string[] = [];

    constructor() {
        if (!fs.existsSync(path.join(__dirname, 'accounts.json'))) {
            console.log(`Welcome to PowerPrompt!`);
            console.log(`You haven't created an account yet, so let's make one now quickly.`);

            this.makeFirstAccount();
        } else {
            this.login();
        }
    }

    async makeFirstAccount(): Promise<void> {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question(`Enter your username: `, async (username) => {
            rl.close();
            
            const password = await this.privatePrompt('Enter your password: ');
            const confirmPassword = await this.privatePrompt('Confirm your password: ');

            if (password !== confirmPassword) {
                process.stdout.write(`\x1Bc`);
                console.log(`Passwords do not match!`);
                return this.makeFirstAccount();
            }

            if (await this.createAccount(username, password, true)) {
                console.log(`Account created successfully!`);
                console.log(`You can now login.`);
                console.log(`Press any key to continue...`);
                await this.waitForKeypress();
                console.clear();
                await this.login();
            } else {
                console.log(`An error occurred while creating your account.`);
            }
        });
    }

    async promptCommand(): Promise<void> {
        this.publicPrompt(`${this.user?.username}@ ${this.directory} ~: `).then(async (command) => {
            await this.handleCommand(command);
            
            this.promptCommand();
        });
    }

    waitForKeypress(): Promise<void> {
        return new Promise<void>((resolve) => {
            process.stdin.setRawMode(true);
            process.stdin.resume();
            process.stdin.on('keypress', () => {
                process.stdin.pause();
                resolve();
            });
        });
    }

    async login() {
        const username = await this.publicPrompt('Username: ');
        const password = await this.privatePrompt('Password: ');

        if (await this.attemptLogin(username, password)) {
            console.log(`Welcome, ${this.user?.username}!`);
            this.loadCommands();

            this.promptCommand();
        } else {
            console.clear();
            console.log(`Invalid credentials!`);
            this.login();
        }        
    }

    async attemptLogin(username: string, password: string): Promise<boolean> {
        const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'accounts.json')).toString());
        const user = users.find((user: User) => user.username === username) as User;

        if (user) {
            try {
                if (await this.checkPassword(password, user.password)) {
                    this.user = user;
                } else return false;
            } catch { return false; }
            
            return true;
        } else return false;
    }

    publicPrompt(query: string): Promise<string> {
        return new Promise<string>((resolve) => {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            rl.question(query, (answer) => {
                rl.close();
                resolve(answer);
            });
        });
    }

    privatePrompt(query: string): Promise<string> {
        process.stdout.write(query);
        return new Promise<string>((resolve) => {
            
            const handleKeypress = (key: any) => {
                switch (key.name ? key.name : key.sequence) {
                    case "return":
                        process.stdin.removeAllListeners('keypress');
                        process.stdin.pause();

                        console.log();
                        resolve(this.privateOutput);
                        this.privateOutput = '';
                        return;
                    case "space":
                        this.privateOutput += ' ';
                        break;
                    case "backspace":
                        this.privateOutput = this.privateOutput.slice(0, -1);
                        break;
                    default:
                        var keyPressed = key.name ? key.name : key.sequence;
                        try { if (key.shift) keyPressed = keyPressed.toUpperCase(); } catch (err) { }
                        this.privateOutput += keyPressed;
                        break;
                }

                process.stdout.write(`\x1b[2K\x1b[0G` + query + '•'.repeat(this.privateOutput.length));
            };

            process.stdin.setRawMode(true);
            process.stdin.resume();

            process.stdin.on('keypress', (str, key) => {
                handleKeypress(key);
            });
        });
    }

    async createAccount(username: string, password: string, adminAccount: boolean): Promise<boolean> {
        try {
            if (!fs.existsSync(path.join(__dirname, 'accounts.json'))) fs.writeFileSync(path.join(__dirname, 'accounts.json'), '[]', 'utf8');
            const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'accounts.json')).toString());
            const hashed = await this.hashPassword(password);

            users.push({ username, password: hashed, admin: adminAccount });

            fs.writeFileSync(path.join(__dirname, 'accounts.json'), JSON.stringify(users, null, 4), 'utf8');

            return true;
        } catch { return false; }
    }

    async checkPassword(password: string, hash: string): Promise<boolean> {
        try {
            const result = await bcrypt.compare(password, hash);
            return result;
        } catch { return false; }
    }

    async hashPassword(password: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) reject(err);
                resolve(hash);
            });
        });
    }

    async handleCommand(command: string) {
        const args = command.split(' ').map(arg => arg.toLowerCase());
        const cmd = args.shift();

        const foundCommand = Array.from(this.commands).find((c: Command) => c.name?.toLowerCase() === cmd?.toLowerCase());

        if (foundCommand) {
            foundCommand.execute(args, { user: this.user as User, directory: this.directory, commands: this.commands, PowerPrompt: this });
            this.history.push(command);
        } else {
            const foundAlias = Array.from(this.commands).find((c: Command) => c.aliases?.includes(cmd as string));
            
            if (foundAlias) {
                foundAlias.execute(args, { user: this.user as User, directory: this.directory, commands: this.commands, PowerPrompt: this });
                this.history.push(command);
            } else {
                console.log(`Command not found!`);
            }
        }

        if (this.history.length > 15) this.history.shift();
    }

    async loadCommands() {
        const commandsPath = path.join(__dirname, 'commands');
        const commands = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));

        for (const command of commands) {
            const commandPath = path.join(commandsPath, command);
            const commandModule: Command | Array<Command> = require(commandPath);

            if (!commandModule) process.stdout.write(`[WARNING] Cannot load command module: ${commandPath}.`);
            else {
                if (Array.isArray(commandModule)) {
                    this.commands = new Set([...this.commands, ...commandModule]);
                } else this.commands.add(commandModule);
            }
        }

        this.addBuiltInCommands();
    }

    addBuiltInCommands(): void {
        this.addUser();
        this.setAdmin();
        this.cd();
    }

    addUser() {
        const command: Command = {
            name: 'adduser',
            description: 'Adds a new non-admin user.',
            requiresAdmin: true,
            async execute(args: string[], context: Context) {
                const username = await context.PowerPrompt.publicPrompt('Enter the username, or leave blank to cancel: ');
                if (username === '') return;
                const userData = fs.readFileSync(path.join(__dirname, 'accounts.json'));
                const userFound = JSON.parse(userData.toString()).find((user: User) => user.username === username);
                if (userFound) { console.log(`User already exists!`); return; }
        
                const password = await context.PowerPrompt.privatePrompt('Enter the password: ');
                const confirmPassword = await context.PowerPrompt.privatePrompt('Confirm the password: ');
        
                if (password !== confirmPassword) {
                    console.log(`Passwords do not match!`);
                    return;
                }
        
                if (await context.PowerPrompt.createAccount(username, password, false)) {
                    console.log(`User added successfully!`);
                } else {
                    console.log(`An error occurred while adding the user.`);
                }
            }
        }
        
        this.commands.add(command);
    }

    setAdmin() {
        const command: Command = {
            name: "setadmin",
            description: "Sets the admin status of a user.",
            requiresAdmin: true,
            async execute(args: string[], context: Context) {
                const username = await context.PowerPrompt.publicPrompt('Enter the username: ');
                const adminRes = await context.PowerPrompt.publicPrompt('Set as admin? (y/n): ');
                const admin = adminRes.toLowerCase() === 'y';
                const userData = fs.readFileSync(path.join(__dirname, 'accounts.json'));
                const users = JSON.parse(userData.toString());
                const user = users.find((user: User) => user.username === username);
        
                if (user) {
                    user.admin = admin;
                    fs.writeFileSync(path.join(__dirname, 'accounts.json'), JSON.stringify(users, null, 4), 'utf8');
                    console.log(`User ${user.username} is now ${admin ? 'an admin' : 'not an admin'}.`);
                } else {
                    console.log(`User ${user.username} not found`);
                }
            }
        }

        this.commands.add(command);
    }

    cd() {
        const command: Command = {
            name: 'cd',
            description: 'Changes the current directory.',
            requiresAdmin: false,
            execute: async (args: string[], context: Context) => {
                if (args.length === 0) {
                    console.log(`Usage: cd <directory>`);
                    return;
                }

                const newDirectory = path.join(context.directory, args[0]);
                if (fs.existsSync(newDirectory)) {
                    context.PowerPrompt.directory = context.PowerPrompt.correctPathCase(newDirectory);
                } else {
                    console.log(`Directory not found!`);
                }
            }
        }

        this.commands.add(command);
    }

    public correctPathCase(inputPath: string): string {
        const segments = inputPath.split(path.sep);
        let currentPath = '';
    
        for (const segment of segments) {
            if (!currentPath) {
                currentPath = segment;
                continue;
            }
            
            try {
                const entries = fs.readdirSync(currentPath);
                const correctSegment = entries.find(entry => entry.toLowerCase() === segment.toLowerCase());
                if (correctSegment) {
                    currentPath = path.join(currentPath, correctSegment);
                } else {
                    currentPath = path.join(currentPath, segment);
                }
            } catch (err) {
                console.error(`Error reading directory: ${currentPath}`, err);
                return inputPath;
            }
        }
    
        return currentPath;
    }
}

const pp = new PowerPrompt();