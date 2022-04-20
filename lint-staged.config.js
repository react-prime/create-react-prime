export default {
  // Type check TypeScript files
  '**/*.(js|ts)': (filenames) => [
    'npm run typecheck',
    // Lint and format js/ts files
    `npx eslint --fix ${filenames.join(' ')}`,
    `npx prettier --write ${filenames.join(' ')}`,
  ],

  // Format MarkDown and JSON
  '**/*.(md|json)': (filenames) =>
    `npx prettier --write ${filenames.join(' ')}`,
};
