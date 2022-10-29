import React from 'react'

function AddressCard({name,street,city,state,country,phoneNumber}: any) {
  return (
    <div className="w-[90%] rounded-lg p-2 pl-[25px]">
      <div className="py-[5px] pl-[2px] cursor-pointer flex items-center">
        <strong className="text-base font-medium text-black dark:text-white">Name: </strong>
        <p className="text-black dark:text-white pl-2">{name}</p>
      </div>
      <div className="py-[5px] pl-[2px] cursor-pointer flex">
        <strong className="text-base font-medium text-black dark:text-white">Address: </strong>
        <p className="text-black dark:text-white pl-2">{[street,city,state,country].join(',')}.</p>
      </div>
      <div className="py-[5px] pl-[2px] cursor-pointer flex items-center">
        <strong className="text-base font-medium text-black dark:text-white">Phone Number: </strong>
        <p className="text-black dark:text-white pl-2">{phoneNumber}</p>
      </div>
    </div>
  );
}

export default AddressCard
