import * as React from "react";

function useApolloMerge(arr1: any[], arr2: any[]) {

  const seen = new Set();

  const data = [...arr1, ...arr2];

    const result = data.filter((el) => {
      const duplicate = seen.has(el.__ref);
      seen.add(el.__ref);
      return !duplicate;
    });

    return result;
}

export default useApolloMerge;
