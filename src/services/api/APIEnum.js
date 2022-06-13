const requireComponent = require.context(
  // Look for files in the current directory
  '.',
  // Do not look in subdirectories
  false,
  // Only include "_base-" prefixed .vue files
  /[\w]+\.js$/
);

const apis = [];
// For each matching file name...
requireComponent.keys().forEach((fileName) => {
  // Get the component config
  if (fileName.search(/\.\/(?:(index|API|APIEnum))\.js$/g)) {
    if (fileName.match(/\.\/(\w+)\.js$/)) {
      apis.push(fileName.match(/\.\/(\w+)\.js$/)[1]);
    }
  }
});

export default apis.reduce((acc, curr) => {
  acc[curr] = curr + '';
  return acc;
}, {});
