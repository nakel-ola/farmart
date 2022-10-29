import React from 'react'
import { IoClose } from 'react-icons/io5';
import Items from "../../database/address.json";


interface Props {
  onClose: () => void;
  handleClick: (name: string) => void;
  area: string;
}

function PopupCard(props: Props) {
  // --- Destructing Props --- //
  const { onClose, handleClick, area } = props;

  return (
    <div className="bg-white dark:bg-dark rounded-t-xl w-full md:w-[50%]">
      <div className="w-full h-[40px] border-b-[1px] border-b-[#f0f2f5] dark:border-b-dark">
        <div className="flex items-center justify-between p-[8px]">
          <div />
          <p className="text-[1rem] text-black dark:text-white">Select Area</p>

          <div
            className="w-[25px] h-[25] rounded-full flex items-center justify-center"
            onClick={onClose}
          >
            <IoClose className="text-[25px] text-[#212121] dark:text-white/80" />
          </div>
        </div>
      </div>

      <div className="h-[85vh] overflow-x-hidden overflow-y-scroll scrollbar-style">
        {Items.map(({ name, zip }, inx) => (
          <div
            className="flex items-center justify-between px-[10px] m-[5px]"
            key={name + inx}
            onClick={() => handleClick(`${name} - ${zip}`)}
          >
            <p className="font-[1rem] text-[#212121] dark:text-white">
              {name} - {zip}
            </p>

            <div className="w-[25px] h-[25px] rounded-full flex items-center justify-center">
              <div
                className={`w-[18px] h-[18px] rounded-full relative overflow-hidden ring-[2px] ${
                  area === `${name} - ${zip}` ? "ring-[#212121] dark:ring-white" : "ring-gray-500"
                }`}
              >
                {area === `${name} - ${zip}` && (
                  <span className={`absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[15px] h-[15px] rounded-full ${area === `${name} - ${zip}` ? "bg-[#212121] dark:bg-white" : "bg-gray-800"}`} />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PopupCard
