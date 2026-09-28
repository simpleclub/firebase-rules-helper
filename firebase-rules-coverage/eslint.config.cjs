'use strict';

// ESLint 9 flat config for gts 7. `.cjs` because package.json sets "type": "module".
module.exports = [
  {ignores: ['build/', 'coverage/']},
  ...require('gts'),
  {
    rules: {
      'n/no-unpublished-import': [
        'error',
        {allowModules: ['ts-jest', '@jest/globals']},
      ],
    },
  },
];
