module.exports = {
  baseUrl: '.',
  include: ['src/**/*', 'tests/**/*'],
  compilerOptions: {
    baseUrl: '.',
    target: 'es6',
    module: 'es6',
    // ...
    // `paths` will be automatically generated using aliases.config.js
    // ...
  },
  exclude: ['node_modules', 'target', 'build', 'public', 'dist', 'output'],
};
