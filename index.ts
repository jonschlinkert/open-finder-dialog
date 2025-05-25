import cp from 'node:child_process';
import { detectTerminal } from 'detect-terminal';

const escapeQuotedPath = (input: string): string => {
  return input.replace(/(?<!\\(?<!\\))"/g, '\\$&');
};

const isCanceled = (v: string): boolean => /cancell?ed/i.test(v);

interface OpenDialogOptions {
  filters?: string[];
  limit?: number;
  terminal?: string;
}

/**
 * Builds the AppleScript 'choose file' command.
 * - allowMultiple: when limit is greater than 1, this will be true.
 * - filters: file type filters (e.g. {"public.jpeg", "public.png"}).
 */

const buildCommand = (
  allowMultiple: boolean,
  filters: string[]
): string => {
  const base = 'choose file';
  const withPrompt = ' with prompt "Select files to open"';
  const ofType = filters.length > 0
    ? ` of type {${filters.map(f => `"${f}"`).join(', ')}}`
    : '';
  const multi = allowMultiple ? ' with multiple selections allowed' : '';
  return base + withPrompt + ofType + multi;
};

/**
 * Opens a Finder dialog to select files.
 * @param initialDirectory - Directory dialog opens to.
 * @param options - Dialog config options.
 */

export const openFinderDialog = async (
  initialDirectory: string = process.cwd(),
  options: OpenDialogOptions = {}
): Promise<{ files: string[]; canceled: boolean }> => {
  return new Promise((resolve, reject) => {
    const { filters = [], terminal = detectTerminal(), limit = 100 } = options;

    const maxFiles = Math.max(1, limit);
    const command = buildCommand(limit > 1, filters);
    const escapedPath = escapeQuotedPath(initialDirectory);
    const pathSeparator = '<__PATH_SEPARATOR__>';

    const appleScript = `
      set defaultPath to POSIX file "${escapedPath}"
      set limit to ${maxFiles}

      try
        -- Open the file dialog within SystemUIServer to bring it to focus
        tell application "SystemUIServer"
          activate
          delay 0.2 -- Allow SystemUIServer to activate
          set file_list to ${command} default location defaultPath
          if limit = 1 then
            set file_list to {file_list}
          end if
        end tell

        -- Apply the maximum-files rule
        if limit > 0 and (count of file_list) > limit then
          set file_list to items 1 thru limit of file_list
        end if

        -- Process the selected files
        set posixPaths to {}

        repeat with aFile in file_list
          set end of posixPaths to POSIX path of aFile & "${pathSeparator}"
        end repeat

        -- Return focus to ${terminal}
        tell application "${terminal}"
          activate
        end tell

        set text item delimiters to ""
        set posixPathsString to posixPaths as string

        return posixPathsString
      on error
        -- Return focus to terminal app even if the dialog is canceled
        tell application "${terminal}"
          activate
        end tell
        return "CANCELLED"
      end try
    `;

    const child = cp.spawn('osascript', ['-']);

    let stdoutData = '';
    let stderrData = '';

    child.stdout.on('data', data => {
      stdoutData += data.toString();
    });

    child.stderr.on('data', data => {
      stderrData += data.toString();
    });

    child.on('close', code => {
      if (code !== 0 && stderrData) {
        reject(new Error(stderrData.trim()));
        return;
      }

      const output = stdoutData.trim();

      if (isCanceled(output)) {
        resolve({ files: [], canceled: true });
        return;
      }

      const files = output
        .split(pathSeparator)
        .map(s => s.trim())
        .filter(s => s !== '');

      resolve({ files, canceled: false });
    });

    // Write the AppleScript code to stdin
    child.stdin.write(appleScript);
    child.stdin.end();
  });
};

export default openFinderDialog;
