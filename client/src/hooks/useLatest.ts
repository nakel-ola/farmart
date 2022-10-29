import React from 'react';
import useIsomorphicLayoutEffect from './useIsomorphicLayoutEffect';


function useLatest(value: any) {
  var ref = React.useRef(value);
  useIsomorphicLayoutEffect(() => {
    ref.current = value;
  });
  return ref;
};

export default useLatest;
