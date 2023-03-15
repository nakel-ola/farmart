/* eslint-disable @next/next/no-img-element */
import React from "react";


interface Props {
  image: string;
  name: string;
}
const ImageCard: React.FC<Props> = ({ image,name }) => {
  return (
    <div className="w-[95%] md:w-[80%] h-full max-h-[300px] md:max-h-[400px] mt-2 md:mt-0 rounded-lg overflow-hidden">
      <img
        src={image}
        alt={name}
        className="h-full w-full object-cover md:rounded-lg md:hover:scale-125 transition-all duration-300 ease"
      />
    </div>
  );
};

export default ImageCard;
