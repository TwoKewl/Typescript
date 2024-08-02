import * as fs from 'fs';

interface Token {
    type: string,
    value: string,
    index: number
}

const inputData = fs.readFileSync(process.argv[2], 'utf-8');

function Tokenize(input: string): Token[] {
    const tokens: Token[] = [];
    var index: number = 0;

    input.replace(/\s+/g, '');

    for (const char of input.split('')) {
        if (!'<>+-[],.'.includes(char)) {
            console.log(`Unexpected Token: ${char}`);
            throw new Error;
        }

        var token: Token;

        switch (char) {
            case "<":
            case ">":
                token = { type: "move", value: char, index };
                break;
            case "+":
            case "-":
                token = { type: "operation", value: char, index };
                break;
            case "[":
                token = { type: "openloop", value: char, index };
                break;
            case "]":
                token = { type: "closeloop", value: char, index };
                break;
            case ",":
                token = { type: "input", value: char, index };
                break;
            case ".":
                token = { type: "log", value: char, index };
                break;
            default:
                console.log(`Unexpected Token: ${char}`);
                throw new Error;
        }

        index++;
        tokens.push(token);
    }

    if (tokens.filter(token => token.value === '[').length !== tokens.filter(token => token.value === ']').length) {
        console.log('Unclosed Loop');
        throw new Error;
    }

    return tokens;
}

function Interpret(tokens: Token[]) {
    var memory: number[] = new Array(5).fill(0);
    var pointer: number = 0;

    for (let i = 0; i < tokens.length; i++) {
        const { memory: newMemory, pointer: newPointer } = ParseToken(tokens[i], memory, pointer, tokens);
        memory = newMemory;
        pointer = newPointer;

        if (tokens[i].type == 'openloop') {
            const closeLoop = tokens.find(token => token.type === 'closeloop' && token.index > i);
            if (closeLoop) i = closeLoop.index;
        }
    }
}

function Loop(tokens: Token[], memory: number[], pointer: number): { memory: number[], pointer: number } {
    for (const token of tokens) {
        try {
            if (memory[pointer] === 0) throw new Error;
            if (token.type == 'closeloop') return Loop(tokens, memory, pointer);

            const { memory: newMemory, pointer: newPointer } = ParseToken(token, memory, pointer, tokens);

            memory = newMemory;
            pointer = newPointer;
        } catch {
            return { memory, pointer };
        }        
    }

    return { memory, pointer };
}

function ParseToken(token: Token, memory: number[], pointer: number, tokens: Token[]): { memory: number[], pointer: number } {
    switch (token.type) {
        case "move":
            pointer += token.value === '>' ? 1 : -1;
            break;
        case "operation":
            memory[pointer] += token.value === '+' ? 1 : -1;
            break;
        case "openloop":
            const { memory: newMemory, pointer: newPointer } = Loop(tokens.slice(token.index + 1), memory, pointer);
            memory = newMemory;
            pointer = newPointer;
            break;
        case "input":
            const input = process.stdin.read(1);
            memory[pointer] = input.charCodeAt(0);
            break;
        case "log":
            process.stdout.write(memory[pointer].toString());
            break;
    }

    // logMemory(memory);

    return { memory, pointer };
}

const logMemory = (memory: number[]) => {
    var memoryString: string = '';

    memory.forEach((cell) => {
        memoryString += cell.toString().padEnd(3, ' ');
    });

    console.log(memoryString);
}

Interpret(Tokenize(inputData));