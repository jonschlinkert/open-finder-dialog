import readline from 'node:readline';
import { openFinderDialog } from '../index';

/**
 * In this example we limit the selection to only one file.
 * The user can select a file, and the selected file will be printed to the console.
 *
 * Note that the "filters" option is used to limit the selection to only markdown files.
 * This is arbitrary. You can change the filters to any other file types you want.
 */

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
    const result = await openFinderDialog(process.cwd(), { filters: ['md', 'json'], limit: 1 });

    if (result.canceled) {
      rl.close();
      console.log('Canceled');
      return;
    }

    console.log('files:', result.files);
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
