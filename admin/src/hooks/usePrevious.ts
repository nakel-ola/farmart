/*import { useRef, useEffect } from 'react'

function usePrevious(value) {
  const ref = useRef()
  useEffect(() => {
    ref.current = value //assign the value of ref to the argument
  }, [value]) //this code will run when the value of 'value' changes
  return ref.current //in the end, return the current ref value.
}
*/
import * as React from 'react'

function usePrevious<T extends any>(value: T, initialValue: T): T
function usePrevious<T extends any>(value: T): T | undefined
function usePrevious<T extends any>(value: T, initialValue?: T): T | undefined {
  const storedValue = React.useRef(initialValue)
  React.useEffect(() => {
    storedValue.current = value
  }, [value])
  return storedValue.current
}

export default usePrevious
