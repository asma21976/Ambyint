import * as fs from 'fs-extra';

export async function loadFile(filename: string): Promise<string[]> {
    try {
        const data = await fs.readFile(filename, 'utf8');
        return data.split('\n');
    } catch (error) {
        console.error(`Error reading file ${filename}:`, error);
        throw error;
    }
}

export async function saveFile(filename: string, data: string): Promise<void> {
    try {
        await fs.outputFile(filename, data);
        console.log(`File saved: ${filename}`);
    } catch (error) {
        console.error(`Error saving file ${filename}:`, error);
        throw error;
    }
}
