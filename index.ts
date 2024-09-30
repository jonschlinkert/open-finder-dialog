import cp from 'node:child_process';
import { detectTerminal } from 'detect-terminal';

const escapeQuotedPath = (input: string): string => {
  return input.replace(/(?<!\\(?<!\\))"/g, '\\$&');
};

export const openFinderDialog = async (
  filepath: string = process.cwd(),
  terminal: string = detectTerminal()
): Promise<string> => {
  return new Promise(resolve => {
    const escapedPath = escapeQuotedPath(filepath);
    const appleScript = `
      set defaultPath to POSIX file "${escapedPath}"

      try
        -- Open the file dialog within SystemUIServer to bring it to focus
        tell application "SystemUIServer"
          activate
          delay 0.2 -- Allow SystemUIServer to activate
          set file_list to choose file with prompt "Select files to open" default location defaultPath with multiple selections allowed
        end tell

        -- Process the selected files
        set posixPaths to {}

        repeat with aFile in file_list
          set end of posixPaths to POSIX path of aFile
        end repeat
        set text item delimiters to linefeed
        set posixPathsString to posixPaths as string

        -- Return focus to iTerm2
        tell application "iTerm2"
          activate
        end tell

        return posixPathsString
      on error
        -- Return focus to terminal app even if the dialog is canceled
        tell application "${terminal}"
          activate
        end tell
        return ""
      end try
    `;

    const child = cp.exec('osascript -', (error, stdout) => {
      if (error) {
        console.error(`Execution error: ${error.message}`);
        resolve('');
        return;
      }

      resolve(stdout.trim());
    });

    child.stdin.write(appleScript);
    child.stdin.end();
  });
};

export default openFinderDialog;
