module.exports = [
  ...require('gts'),
  {
    rules: {
      'n/no-unpublished-import': [
        'error',
        {
          allowModules: ['ts-jest', '@jest/globals'],
        },
      ],
    },
  },
  {
    ignores: ['build/'],
  },
];
