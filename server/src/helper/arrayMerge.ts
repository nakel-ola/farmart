function arrayMerge<T = any>(arr1: any[], arr2: any[], type: string = "id"): T[] {

  const seen = new Set();

  const data = [...arr1, ...arr2];

  const result = data.filter((el) => {
    const duplicate = seen.has(el);
    seen.add(el);
    return !duplicate;
  });

  return result;
}

export default arrayMerge;
