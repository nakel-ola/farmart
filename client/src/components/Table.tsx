import { ReactNode } from 'react'

const Table = ({ children}: { children: ReactNode}) => {
  return (
    <div className='grid place-items-center my-8 shrink-0 overflow-scroll rounded-r-lg'>
      {children}
    </div>
  )
}

export default Table
