// A minimal alternative to the classnames npm package
// (https://www.npmjs.com/package/classnames)
export default (classObj) => {
  return (
    Object.keys(classObj)
      // Filter class names to only those with a corresponding truthy value
      .filter((className) => classObj[className])
      .join(' ')
  );
};
