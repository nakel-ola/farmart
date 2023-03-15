import { Icon } from "iconsax-react";
import { useRouter } from "next/router";
import React from "react";
import Button from "./Button";

interface Props {
  Icon: Icon;
  title: string;
  subtitle?: string;
}
const EmptyCard: React.FC<Props> = (props) => {
  const { Icon, title, subtitle } = props;

  const router = useRouter();
  return (
    <div className="grid place-items-center h-[80%]">
      <div className="flex flex-col items-center justify-center">
        <div className="w-[100px] h-[100px] rounded-full bg-teal-500/10 flex items-center justify-center">
          <Icon
            size={80}
            className="text-5xl text-neutral-700 dark:text-neutral-400"
          />
        </div>
        <p className="font-medium text-lg p-2">{title}</p>
        {subtitle && <p className="p-2">{subtitle}</p>}
        <Button onClick={() => router.push("/")}>Continue Shopping</Button>
      </div>
    </div>
  );
};

export default EmptyCard;
