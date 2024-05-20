import * as fs from 'fs';
import * as path from 'path';

interface Task {
    task: string;
    completed: boolean;
}

function readTasks(path: string): string[] {
    const tasks: string[] = [];

    const data = JSON.parse(fs.readFileSync(path, 'utf8'));
    data.forEach((task: Task) => {
        tasks.push(task.task);
    });

    return tasks;
}

var tasks: string[] = readTasks(path.join(__dirname, '/todos.json'));

console.log(tasks);