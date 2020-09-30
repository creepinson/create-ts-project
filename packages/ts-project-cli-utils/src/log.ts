import { gray, green, yellow, red } from "chalk";
import { CliError } from "./CliError";

let verbose = false;

export const setVerbose = (value: boolean) => {
    verbose = value;
};

export const log = {
    verbose: (message: string) => {
        if (verbose) {
            console.log(gray(message));
        }
    },
    info: (message: string) => console.log(message),
    success: (message: string) => console.log(green(message)),
    warn: (message: string) => console.log(yellow(`WARNING: ${message}`)),
    error: (message: string) => console.log(red(`ERROR: ${message}`)),
};

export const logAndExit = (error: Error) => {
    const message =
        error instanceof CliError
            ? error.message
            : error.stack || error.message;
    log.error(message);

    process.exit(1);
};
