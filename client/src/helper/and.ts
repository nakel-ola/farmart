const and = (...args: any[]) => {
  const newArgs = args.map((arg) => !!arg);

  if (newArgs.every((a) => a === true)) return true;
  return false;
};
export default and;
