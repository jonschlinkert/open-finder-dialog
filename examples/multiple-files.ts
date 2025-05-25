import readline from 'node:readline';
import { openFinderDialog } from '../index';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Press Ctrl+O to open a file.');

readline.emitKeypressEvents(process.stdin);

if (process.stdin.isTTY) {
  process.stdin.setRawMode(true);
}

const files = [];

process.stdin.on('keypress', async (str, key) => {
  if (key.ctrl && key.name === 'o') {
    const result = await openFinderDialog(process.cwd(), { filters: ['md', 'json'] });
    console.log(result);

    if (result.canceled) {
      rl.close();
      console.log('Canceled');
      return;
    }

    files.push(...result.files);
    return;
  }

  if (key.ctrl && key.name === 'p') {
    console.log(files);
    return;
  }

  if (key.name === 'return') {
    console.log(files);
    rl.close();
    return;
  }

  if (key.ctrl && key.name === 'c') {
    console.log('Exiting...');
    process.exit();
  }
});
