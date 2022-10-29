import React from 'react'
import ReactLoading from "react-loading";


function PageLoader() {
  return (
    <div className="fixed top-0 z-10 transition-all duration-500 ease-in-out left-0 w-full h-full bg-[rgba(0,0,0,0.6)] grid place-items-center">
      <div className="flex items-center justify-center flex-col">
        <ReactLoading type='spinningBubbles' />
        
        <p className="text-white text-[1.2rem] p-[8px]">
          Loading
        </p>
      </div>
    </div>
  );
}

export default PageLoader
