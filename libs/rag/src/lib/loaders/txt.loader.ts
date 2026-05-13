import fs from 'node:fs/promises';

export class TxtLoader {
  async load(path: string): Promise<string> {
    return fs.readFile(path, 'utf-8');
  }
}
