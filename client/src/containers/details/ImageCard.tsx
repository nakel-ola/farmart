import React from "react";

const ImageCard = ({ image,name }: { image: any; name: string }) => {
  return (
    <div className="w-[95%] mt-2 md:mt-0 md:w-[80%] h-full max-h-[300px] md:max-h-[400px] rounded-lg overflow-hidden">
      <img
        src={image.url}
        alt={name}
        className="h-full w-full object-cover md:rounded-lg md:hover:scale-125 transition-all duration-300 ease"
      />
    </div>
  );
};

export default ImageCard;
