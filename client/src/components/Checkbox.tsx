import { TickSquare } from "iconsax-react";
import { useState,useEffect } from "react";
import usePrevious from "../hooks/usePrevious";

const Checkbox = ({
  checked,
  onClick,
}: {
  checked?: boolean;
  onClick?(): void;
}) => {
  const [open, setOpen] = useState(checked ?? false);

  const prevChecked = usePrevious(checked)

  useEffect(() => {
    if(checked !== prevChecked) {
      setOpen(checked)
    }
    
  }, [checked])
  
  return (
    <div
      className={`relative w-[20px] h-[20px] border-[1.5px] flex items-center justify-center rounded-md ${
        open ? "border-primary" : "border-neutral-400 dark:border-neutral-700 "
      }`}
      onClick={() => {
        onClick?.()
        setOpen(!open);
      }}
    >
      {open && <TickSquare variant="Bold" className="text-primary" />}
    </div>
  );
};

export default Checkbox;
