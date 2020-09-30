import { Options } from "yargs";

import { CliOptions } from "@throw-out-error/ts-project-cli-utils";

export interface TspScriptsOptions extends CliOptions {
    yarn: boolean;
}

export const tspScriptsOptions: { [key: string]: Options } = {
    yarn: {
        boolean: true,
        describe:
            "Run yarn after the command completes. Disable with --no-yarn.",
        default: true,
    },
};
