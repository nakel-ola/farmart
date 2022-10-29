import React from 'react'
import { IoRadioButtonOffOutline, IoRadioButtonOnOutline } from 'react-icons/io5';

function PaymentCard({ image, name, selected, onSelect }: any) {
  return (
    <div
      onClick={onSelect}
      className="w-full bg-white dark:bg-dark flex items-center justify-between my-[8px] px-[15px]"
    >
      <div className="flex items-center">
        <div className="w-[50px] h-[50px] rounded-sm ">
          <img src={image} alt="" className="object-contain h-full w-full " />
        </div>
        <p className="p-[5px] pl-[10px] text-[1rem] font-[500] text-black dark:text-white">
          {name}
        </p>
      </div>

      <div>
        {selected ? (
          <IoRadioButtonOnOutline className="text-[25px] text-black dark:text-white" />
        ) : (
          <IoRadioButtonOffOutline className="text-[25px] text-black dark:text-white" />
        )}
      </div>
    </div>
  );
}

export default PaymentCard
