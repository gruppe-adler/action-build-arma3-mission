import * as exec from '@actions/exec';
import { join } from 'path';

const ARMAKE_PATH = join(__dirname, 'steamcmd.exe');

async function execArmake(command: string, args: string[] = []): Promise<void> {
    await exec.exec(ARMAKE_PATH, [command, ...args]);
}

interface PackOptions {
    /** Enable verbose output. */
    verbose?: boolean;

    /** Overwrite the target file/folder if it already exists. */
    force?: boolean;

    /** Glob pattern to exclude from PBO. */
    exclude?: string[];

    /** Signature path to use when signing the PBO. */
    signature?: string;

    /** Extension to add to PBO header. */
    headerExtensions?: { key: string; value: string }[];

    /** Sign the PBO with the given private key. */
    privateKey?: string;
}

interface BuildOptions extends PackOptions {
    /** Warning to disable */
    disabledWarnings?: string[];

    /** Directories to search for includes, defaults to CWD. */
    includeDir?: string[];
}

function packOptsToArgs(options?: PackOptions): string[] {
    return [
        options?.verbose ? '-v' : [],
        options?.force ? '-f' : [],
        options?.exclude?.flatMap(x => ['-x', x]) ?? [],
        options?.headerExtensions?.flatMap(({ key, value }) => [
            '-e',
            `${key}=${value}`,
        ]) ?? [],
        options?.privateKey ? ['-k', options.privateKey] : [],
        options?.signature ? ['-s', options.signature] : [],
    ].flat();
}

export async function packPBO(
    srcPath: string,
    targetPath?: string,
    options?: PackOptions,
): Promise<void> {
    const args = [...packOptsToArgs(options), srcPath, targetPath ?? []].flat();

    return await execArmake('pack', args);
}

export async function buildPBO(
    srcPath: string,
    targetPath?: string,
    options?: BuildOptions,
): Promise<void> {
    const args = [
        ...packOptsToArgs(options),
        options?.disabledWarnings?.flatMap(x => ['-w', x]) ?? [],
        options?.includeDir?.flatMap(x => ['-i', x]) ?? [],
        srcPath,
        targetPath ?? [],
    ].flat();

    return await execArmake('build', args);
}
