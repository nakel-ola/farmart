import React from 'react'

function DescriptionCard({ description }: { description: string}) {
  return (
    <div className="w-[95%] md:w-[80%] mt-[10px] dark:bg-dark dark:shadow-black/30 bg-white pl-[8px] pb-[8px] p-[5px] shadow-sm rounded-lg">
      <p className="py-[8px] pl-[15px] pr-[8px] text-[1rem] dark:text-white text-black font-[600]">
        Description
      </p>

      <div className="py-[8px] pl-[15px] pr-[8px]">
        <p className='text-[#212121] dark:text-white text-[0.8rem] font-[400] whitespace-pre-line'>{description}</p>
      </div>
    </div>
  );
}

export default DescriptionCard
