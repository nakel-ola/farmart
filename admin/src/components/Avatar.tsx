import clsx from "clsx";
import React, { useMemo } from "react";

const colors = [
  "bg-red-100",
  "bg-pink-100",
  "bg-indigo-100",
  "bg-purple-100",
  "bg-blue-100",
  "bg-teal-100",
  "bg-green-100",
  "bg-yellow-100",
  "bg-cyan-100",
  "bg-orange-100",
  "bg-amber-100",
  "bg-gray-100",
];

let selectedColor: string;

interface AvatarProps {
  [key: string]: any;
  src: string;
  alt: string;
  className?: string;
  bgColor?: string;
}

const num = Math.floor(Math.random() * colors.length);

function Avatar({ src, alt, className, bgColor, ...other }: AvatarProps) {
  const getColor = useMemo(() => {
    if (!selectedColor) {
      selectedColor = colors[num];
      return selectedColor;
    }
    return colors[num];
  }, []);

  const color = getColor;

  return (
    <div
      {...other}
      className={clsx(
        `${
          bgColor ?? color
        } shrink-0 w-[100px] h-[40px] rounded-full overflow-hidden`,
        className
      )}
    >
      <img
        alt={alt}
        src={src ?? `http://localhost:4000/images/avatar-${1}.png`}
        className="w-full h-full object-cover shrink-0"
      />
    </div>
  );
}

export default Avatar;
