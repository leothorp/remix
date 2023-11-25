import { join, resolve } from "node:path";
import execa from "execa";
import fse from "fs-extra";
import { pathToFileURL } from "node:url";

import { detectPackageManager } from "./detectPackageManager";
import { logger } from "./tux";

export type InitFlags = {
  deleteScript?: boolean;
  showInstallOutput?: boolean;
};

export async function importEsmOrCjsModule(modulePath: string) {
  try {
    // Attempt ESM dynamic import using pathToFileURL to support absolute paths on Windows
    return await import(pathToFileURL(modulePath).href);
  } catch (esmError) {
    try {
      // Fall back to CommonJS require
      return require(modulePath);
    } catch (cjsError) {
      throw new Error(
        "Unable to import remix.init module.\n" +
          `ESM error: ${esmError}\n` +
          `CJS error: ${cjsError}`
      );
    }
  }
}

export async function init(
  projectDir: string,
  { deleteScript = true, showInstallOutput = false }: Required<InitFlags>
) {
  let initScriptDir = join(projectDir, "remix.init");
  let initScriptFilePath = resolve(initScriptDir, "index.js");

  if (!(await fse.pathExists(initScriptFilePath))) {
    return;
  }

  let initPackageJson = resolve(initScriptDir, "package.json");
  let packageManager = detectPackageManager() ?? "npm";

  if (await fse.pathExists(initPackageJson)) {
    try {
      await execa(packageManager, [`install`], {
        cwd: initScriptDir,
        stdio: showInstallOutput ? "inherit" : "ignore",
      });
    } catch (err) {
      logger.error(
        "Oh no! Failed to install dependencies for template init script."
      );
      throw err;
    }
  }

  logger.info("");
  logger.info("Running template's remix.init script...\n");

  let importedInitModule = await importEsmOrCjsModule(initScriptFilePath);
  let initFn =
    typeof importedInitModule === "function"
      ? importedInitModule
      : importedInitModule.default;

  if (typeof initFn !== "function") {
    throw new Error("remix.init/index.js must export an init function.");
  }
  try {
    await initFn({ packageManager, rootDirectory: projectDir });

    if (deleteScript) {
      await fse.remove(initScriptDir);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      error.message = `▲  Oh no! Template's remix.init script failed\n\n${error.message}`;
    }
    throw error;
  }

  logger.info("");
  logger.info("Template's remix.init script complete");
}

export const unusedFunctionToTreeshake = () => {
  return 37.37;
};
