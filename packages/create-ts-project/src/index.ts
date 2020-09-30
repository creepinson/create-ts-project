#!/usr/bin/env node

import * as yargs from "yargs";

import {
    commandHandler,
    setVerbose,
    log,
    CliOptions,
} from "@throw-out-error/ts-project-cli-utils";

import { createTsProject } from "./createTsProject";

type CreateOptions = CliOptions & { projectName: string; yarn: boolean };

const handler = commandHandler<CreateOptions>(createTsProject);

(yargs as yargs.Argv<CreateOptions>)
    .usage("Usage: $0 <project-name> [--no-yarn]")

    .middleware((argv) => {
        setVerbose(!!argv.verbose);
        if (argv.verbose) {
            log.verbose("Verbose logging enabled.");
        }
    })

    .command({
        command: "* <project-name>",
        describe: "Create a new TypeScript project.",
        builder: (yargs) =>
            yargs
                .positional("project-name", {
                    desc:
                        "Name of the project. A folder will be created with this name. " +
                        "May also be an absolute or relative path (relative to the cwd).",
                    type: "string",
                })
                .options({
                    yarn: {
                        boolean: true,
                        describe:
                            "Run yarn after the command completes. Disable with --no-yarn.",
                        default: true,
                    },
                }),
        handler,
    })

    .help()
    .epilog(
        "More information available at:\nhttps://github.com/throw-out-error/create-ts-project",
    )
    .wrap(Math.min(90, yargs.terminalWidth())).argv;
