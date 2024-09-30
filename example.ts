import readline from 'node:readline';
import { openFinderDialog, openFinder } from '.';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Press Ctrl + O to open a file.');
// console.log('Press Ctrl + F to open Finder in the current directory.');

readline.emitKeypressEvents(process.stdin);

if (process.stdin.isTTY) {
  process.stdin.setRawMode(true);
}

const files = [];

process.stdin.on('keypress', async (str, key) => {
  if (key.ctrl && key.name === 'o') {
    files.push(...(await openFinderDialog()).split(/(?<!\\)\s/));
    return;
  }

  if (key.ctrl && key.name === 'f') {
    await openFinder('foo bar');
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

rl.on('close', () => {
  process.exit(0);
});
