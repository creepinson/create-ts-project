import { CliError } from "./CliError";
import { CliOptions } from "./cliOptions";
import { log, logAndExit } from "./log";

export const commandHandler = <TArgs extends Pick<CliOptions, "verbose">>(
  commandFunc: (args: TArgs) => any,
) => (args: TArgs) => {
  if (args.verbose) {
    log.verbose(`cwd: ${process.cwd()}`);
    log.verbose(`args: ${JSON.stringify(args)}`);
  }

  try {
    return commandFunc(args);
  } catch (err) {
    logAndExit(err, err.name === new CliError("").name);
  }
};
