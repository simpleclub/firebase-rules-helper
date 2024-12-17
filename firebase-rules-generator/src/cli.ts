#!/usr/bin/env node

import meow from 'meow';
import * as path from 'path';
import {buildFile} from './build.js';

const cli = meow(
  `
	Usage
	  $ firebase-build-rules <input>

	Options
	  --output, -o      Where the final rules file should be saved.
	  --source-map, -s  Whether to generate source maps or not (default: true).

	Examples
	  $ firebase-build-rules rules/index.rules --output firestore.rules
	  $ firebase-build-rules rules/index.rules --no-source-map --output storage.rules
`,
  {
    importMeta: import.meta,
    flags: {
      output: {
        type: 'string',
        shortFlag: 'o',
        isRequired: true,
      },
      sourceMap: {
        type: 'boolean',
        shortFlag: 's',
        default: true,
      },
    },
  },
);

function run(srcFile: string | undefined) {
  if (!srcFile) {
    console.error(
      `Missing required <input>
   Use: firebase-build-rules <input>`,
    );
    return;
  }
  buildFile(
    path.resolve(srcFile),
    path.resolve(cli.flags.output),
    cli.flags.sourceMap,
  );
}

run(cli.input[0]);
