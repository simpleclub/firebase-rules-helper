#!/usr/bin/env node

import * as meow from 'meow';
import * as path from 'path';
import {generateLcovFile} from './convert';

const cli = meow(
  `
	Usage
	  $ firebase-rules-coverage <input>

	Options
	  --rules-file, -r    Where the rules file can be found that was analyzed.
	  --output, -o        Where the coverage file should be saved.
	  --project-root, -p  The root directory of the project.
	                      You can use this if the script is run in a sub-directory of your repo.
	                      If omitted the current working directory is assumed to be the project root.   

	Examples
	  $ firebase-rules-coverage firestore-coverage.json --rules-file firestore.rules  --output coverage
	  $ firebase-rules-coverage firestore-coverage.json --rules-file firestore.rules  --output coverage --project-root ../..
	  $ firebase-rules-coverage storage-coverage.json --rules-file storage.rules --output coverage
`,
  {
    flags: {
      projectRoot: {
        type: 'string',
        alias: 'p',
        default: '.',
      },
      rulesFile: {
        type: 'string',
        alias: 'r',
        isRequired: true,
      },
      output: {
        type: 'string',
        alias: 'o',
        isRequired: true,
      },
    },
  }
);

async function run(srcFile: string | undefined) {
  if (!srcFile) {
    console.error(
      `Missing required <input>
   Use: firebase-rules-coverage <input>`
    );
    return;
  }
  const projectRoot = cli.flags.projectRoot;
  await generateLcovFile(
    srcFile,
    path.resolve(projectRoot),
    path.resolve(cli.flags.rulesFile),
    cli.flags.output
  );
}

run(cli.input[0]).catch(console.error);
