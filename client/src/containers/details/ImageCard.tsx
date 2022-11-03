/* eslint-disable @next/next/no-img-element */
import React from "react";

const ImageCard = ({
  image,
  name,
  stock
}: {
  image: any;
  name: string;
  stock: number;
}) => {
  return (
    <div className="relative w-[95%] mt-2 md:mt-0 md:w-[80%] h-full max-h-[250px] md:max-h-[400px] rounded-lg overflow-hidden">
      <img
        src={image.url}
        alt={name}
        className="relative h-full w-full object-cover md:rounded-lg md:hover:scale-125 transition-all duration-300 ease"
      />

      {stock === 0 && (
        <div className="absolute bottom-0 bg-red-600 w-full text-center">
          <p className="text-white text-xl">Out of stock</p>
        </div>
      )}
    </div>
  );
};

export default ImageCard;
