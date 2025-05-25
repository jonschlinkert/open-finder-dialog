# open-finder-dialog [![NPM version](https://img.shields.io/npm/v/open-finder-dialog.svg?style=flat)](https://www.npmjs.com/package/open-finder-dialog) [![NPM monthly downloads](https://img.shields.io/npm/dm/open-finder-dialog.svg?style=flat)](https://npmjs.org/package/open-finder-dialog) [![NPM total downloads](https://img.shields.io/npm/dt/open-finder-dialog.svg?style=flat)](https://npmjs.org/package/open-finder-dialog)

> Open a finder dialog window (finder prompt) programmatically. Only works on MacOS.

Please consider following this project's author, [Jon Schlinkert](https://github.com/jonschlinkert), and consider starring the project to show your :heart: and support.

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save open-finder-dialog
```

## Usage

**Heads up!**: release v1.0.0 introduced breaking changes. Please see the [release history](#history) for details.

```typescript
import { openFinderDialog } from 'open-finder-dialog';
// or
import openFinderDialog from 'open-finder-dialog';

// Open the dialog in the current working directory
const { files, canceled } = await openFinderDialog();
console.log('Selected files:', files);
// You can use the `canceled` property to determine if the user
// canceled the dialog intentionally, so you can customize messaging
// or logic accordingly.
```

## API

Signature:

```typescript
export const openFinderDialog = async (
  initialDirectory?: string,
  options?: {
    filters?: string[];
    limit?: number;
    terminal?: string;
  }
): Promise<{ files: string[]; canceled: boolean; }>;
```

**Returns**

A promise that resolves to an object:

* `files`: an array of absolute POSIX file paths (as strings) that the user selected.
* `canceled`: `true` if the user canceled the dialog, otherwise `false`.

### Example usage

```ts
// Open the dialog in the current working directory
const { files, canceled } = await openFinderDialog();
console.log('Selected files:', files);

if (canceled) {
  console.log('User canceled the dialog');
}
```

Example with custom options:

```ts
const { files } = await openFinderDialog('/Users/alex/Pictures', {
  limit: 2,
  filters: ['jpeg', 'png', 'json'],
  terminal: 'iTerm'
});

console.log('Selected files:', files);
```

Opens a Finder dialog to select one or more files and returns the paths of selected files. Handles single and multiple selections, ensures correct focus return to the terminal, and uses macOS native dialogs.

### Params

**initialDirectory** (optional)

The initial directory where the dialog should open. Defaults to the current working directory.

```ts
const output = await openFinderDialog('/some/directory');
```

**options** (optional)

Options for the file dialog:

* **filters**: `string[]` — File UTI types or extensions to filter (e.g. [`public.jpeg`, `public.png`] or file extensions depending on macOS support).
* **limit**: `number` — Maximum number of files that can be selected (minimum 1, default: 100).
* **terminal**: `string` — Optionally specify your terminal app name, so focus returns to it after closing the dialog. If not set, [detect-terminal](https://www.npmjs.com/package/detect-terminal) is used.

```ts
const output = await openFinderDialog(process.cwd(), {
  filters: ['public.jpeg'],
  limit: 1,
  terminal: 'iTerm'
});
```

**Notes about "limit"**

If you set a limit other than `1`, finder will not (cannot) prevent over-selection in the dialog. Meaning the user will potentially be able to select more than `limit` files. This is a limitation of the macOS Finder dialog, so the limit is enforced programmatically (by the applescript) after selection.

AFAIK this is the only way it can be done, but I would love to have a better solution if someone wants to do a PR or open an issue to discuss.

## History

### v0.0.1

Initial release

### v0.0.2

Added support for specifying the terminal app.

### v1.0.0

* **BREAKING CHANGE**: Functions now return an object with `files` and `canceled` properties, instead of just the selected files.
* Added `filters` and `limit` options.

## Related

You might also be interested in:

* [open-file-manager](https://www.npmjs.com/package/open-file-manager): Cross-platform utility to open a file or directory in the system's default file manager (Finder… [more](https://github.com/jonschlinkert/open-file-manager) | [homepage](https://github.com/jonschlinkert/open-file-manager "Cross-platform utility to open a file or directory in the system's default file manager (Finder, Explorer, Nautilus, etc.)")
* [open-linux-file-dialog](https://www.npmjs.com/package/open-linux-file-dialog): Open a file dialog window programmatically to allow the user to select one or more… [more](https://github.com/jonschlinkert/open-linux-file-dialog) | [homepage](https://github.com/jonschlinkert/open-linux-file-dialog "Open a file dialog window programmatically to allow the user to select one or more files. Only works on Linux. No dependencies. Supports zenity (GNOME), kdialog (KDE), yad (Yet Another Dialog), qarma (Qt-based), matedialog (MATE), rofi (window switcher wi")
* [open-windows-file-dialog](https://www.npmjs.com/package/open-windows-file-dialog): Programmatically open a file dialog window (explorer) for picking files. Only works on Windows. Also… [more](https://github.com/jonschlinkert/open-windows-file-dialog) | [homepage](https://github.com/jonschlinkert/open-windows-file-dialog "Programmatically open a file dialog window (explorer) for picking files. Only works on Windows. Also see: open-finder-dialog, open-linux-file-dialog, and open-file-manager-dialog for other platforms.")

## About

<details>
<summary><strong>Contributing</strong></summary>

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](../../issues/new).

</details>

<details>
<summary><strong>Running Tests</strong></summary>

Running and reviewing unit tests is a great way to get familiarized with a library and its API. You can install dependencies and run tests with the following command:

```sh
$ npm install && npm test
```

</details>

<details>
<summary><strong>Building docs</strong></summary>

_(This project's readme.md is generated by [verb](https://github.com/verbose/verb-generate-readme), please don't edit the readme directly. Any changes to the readme must be made in the [.verb.md](.verb.md) readme template.)_

To generate the readme, run the following command:

```sh
$ npm install -g verbose/verb#dev verb-generate-readme && verb
```

</details>

### Author

**Jon Schlinkert**

* [GitHub Profile](https://github.com/jonschlinkert)
* [Twitter Profile](https://twitter.com/jonschlinkert)
* [LinkedIn Profile](https://linkedin.com/in/jonschlinkert)

### License

Copyright © 2025, [Jon Schlinkert](https://github.com/jonschlinkert).
Released under the [MIT License](LICENSE).

***

_This file was generated by [verb-generate-readme](https://github.com/verbose/verb-generate-readme), v0.8.0, on May 25, 2025._