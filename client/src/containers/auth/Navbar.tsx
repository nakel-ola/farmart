/* eslint-disable @next/next/no-img-element */
import { useRouter } from 'next/router';
import React from 'react'
import { IoChevronBack } from 'react-icons/io5';

function Navbar({ title, onClick }: any) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between bg-white dark:bg-black/50 shadow-md">
      <div className='flex items-center'>
        <span className="w-[35px] h-[35px] rounded-full flex items-center justify-center m-[5px]" onClick={() => router.back()}>
          <IoChevronBack />
        </span>

        <div className='max-w-[130px] max-h-[50px] pl-[5px] pb-[5px]'>
          <img 
            className='w-full h-full pt-[5px] pr-[5px] object-cover'
            src="http://localhost:4000/images/WujoTransparentLogo.png"
            alt=""
          />
        </div>
      </div>

      <div className='flex items-center justify-center p-[8px] cursor-pointer' onClick={onClick}>
        <p className='text-[#155263] text-[1.2rem]'> {title} </p>
      </div>
    </div>
  );
}

export default Navbar
