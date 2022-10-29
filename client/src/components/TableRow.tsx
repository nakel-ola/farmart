import React, { ReactNode } from 'react'

const TableRow = ({ children, ...others }: {children: ReactNode, [key: string]: any}) => {
  return (
    <div  className='w-full flex items-center justify-around overflow-hidden bg-transparent active:scale-95 transition-all duration-300 cursor-pointer select-none shrink-0' {...others}>
      {children}
    </div>
  )
}

export default TableRow
