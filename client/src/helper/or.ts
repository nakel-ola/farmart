const or = (...args: any[]) => {
  const newArgs = args.map((arg) => !!arg);

  if (newArgs.some((a) => a === true)) return true;
  return false;
};
export default or;
