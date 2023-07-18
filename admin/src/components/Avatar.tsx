/* eslint-disable @next/next/no-img-element */
import React, { useMemo } from "react";
import clsx from "clsx";
import useImageLoader from "../hooks/useImageLoader";
import { twMerge } from "tailwind-merge";

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

interface Color {
  id: string;
  color: string;
}

let selectedColors: Color[] = [];

interface AvatarProps {
  [key: string]: any;
  src: string;
  alt?: string;
  className?: string;
  bgColor?: string;
}

const num = () => Math.floor(Math.random() * colors.length);

function Avatar({
  src,
  alt,
  className,
  bgColor,
  randomBg,
  ...other
}: AvatarProps) {

  const getColor = useMemo(() => {
    if (randomBg) {
      return colors[num()];
    }

    const findId = selectedColors.findIndex((c) => c.id === src);

    
    if (findId !== -1) {
      return selectedColors[findId].color;
    } else {
      const color = colors[num()];
      selectedColors.push({
        id: src,
        color,
      });

      return color;
    }
  }, [randomBg,src]);

  const color = getColor;

  const loaded = useImageLoader({ src });

  return (
    <div
      {...other}
      className={twMerge(
        bgColor ?? color,
        `shrink-0 w-[40px] h-[40px] rounded-full overflow-hidden`,
        !src && "bg-[#999999]",
        className
      )}
    >
      <img
        alt={alt}
        src={loaded ? src : `/default-avatar.jpeg`}
        className="w-full h-full object-cover shrink-0"
      />
    </div>
  );
}

export default Avatar;
