
const forEvery = (collection: any[], per: number,  callback?: (element: any[], index: number,elements: any[]) => any) => {
  const newCollection: any[] = [];

  const newArrayLength = roundUp(Math.abs(collection.length / per));

  let totalSlash = 0;

  for (let i = 0; i < newArrayLength; i++) {
    const slashArray = collection.slice(totalSlash, per + totalSlash);
    newCollection.push(slashArray);
    totalSlash += per;
  }

  if(typeof callback === 'function') {
    return newCollection.map((elements: any[],index: number,collections: any[]) => callback(elements,index,collections));
  }
  return newCollection;
};


const roundUp = (num: number) => {
    const string = num.toString().split(".");
  if(string.length > 1) {
    return Number(string[0]) + 1
  }else {
    return Number(num);
  }
}

export default forEvery;