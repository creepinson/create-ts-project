import { Argv } from "yargs";

import {
  commandHandler,
  cliOptions,
  CliOptions,
  CliError,
  log,
} from "@jtbennett/ts-project-cli-utils";

import { Package } from "../Package";
import { existsSync } from "fs-extra";
import { join } from "path";
import { execSync } from "child_process";

const handler = commandHandler<
  CliOptions & {
    pkgNames: string[];
    setVersion: string;
    access: "public" | "restricted";
    tag: string;
    otp: string;
  }
>((args) => {
  const all = Package.loadAll();

  args.pkgNames.forEach((pkgName) => {
    const pkg = all.find((pkg) => pkg.packageJson!.name === pkgName);

    if (!pkg) {
      throw new CliError(
        `Package "${pkgName}" was not found. The value must match the "name" property in package.json.`,
      );
    }

    if (!existsSync(join(pkg.path, "lib"))) {
      throw new CliError(
        `./lib folder for package ${pkgName} not found. Package must be built before releasing.`,
      );
    }

    log.success(`Publishing ${pkg.name}@${args.setVersion} to npm...`);

    pkg.setVersion(args.setVersion);

    const publishCommand =
      `npm publish` +
      (args.dryRun ? " --dry-run" : "") +
      (args.access ? ` --access ${args.access}` : "") +
      (args.tag ? ` --tag ${args.tag}` : "") +
      (args.otp ? ` --otp ${args.otp}` : "");

    execSync(publishCommand, { stdio: "inherit" });

    log.success("Publish complete.");
  });
});

export const releasePackages = {
  command: "release <pkg-names..>",
  describe: "Publish the packages to npm with the specified version.",

  builder: (yargs: Argv) =>
    yargs
      .positional("pkg-names", {
        desc: "Name of the packages to publish",
        type: "string",
      })
      .options({
        "set-version": {
          alias: ["set", "ver"],
          string: true,
          default: "",
          describe: "Version to assign to the packages when publishing.",
          demand: true,
        },
        access: { string: true, describe: "Passed directly to `npm publish`" },
        tag: { string: true, describe: "Passed directly to `npm publish`" },
        otp: { string: true, describe: "Passed directly to `npm publish`" },
        ...cliOptions,
      }),

  handler,
};