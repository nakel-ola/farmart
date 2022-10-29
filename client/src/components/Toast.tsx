/* importing required files and packages */
import {
  IoClose,
  IoCheckmarkCircleOutline,
  IoWarningOutline,
} from "react-icons/io5";
import { MdErrorOutline } from "react-icons/md";
import useInterval from "../hooks/useInterval";

const Toast = (props: any) => {
  const {
    open = false,
    position = "bottom",
    severity,
    message,
    delay = 0,
    onClose = () => {},
  } = props;

  useInterval(() => {
    onClose();
  }, delay);

  return (
    <div
      className={`fixed w-full grid place-items-center z-[5] ${
        position === "top" && "top-5"
      } ${position === "bottom" && "bottom-5"} ${
        open ? "mb-0 opacity-100" : "mb-[-60px] opacity-30"
      } transition-all duration-300 ease`}
    >
      <div
        className={`w-[90%] md:w-fit rounded-md h-[45px] mt-[8px] mr-[8px] flex items-center justify-between ${
          severity === "success" && "bg-green-500"
        } ${severity === "error" && "bg-red-500"} ${
          severity === "warning" && "bg-yellow-400"
        } ${severity !== "success" && severity !== "error" && "bg-white"}`}
      >
        <div className="flex items-center justify-between">
          {severity === "success" && (
            <span className="h-[35px] w-[35px] flex items-center justify-center m-[5px]">
              <IoCheckmarkCircleOutline className="text-[25px] text-white" />
            </span>
          )}
          {severity === "error" && (
            <span className="h-[35px] w-[35px] flex items-center justify-center m-[5px]">
              <MdErrorOutline className="text-[25px] text-white" />
            </span>
          )}
          {severity === "warning" && (
            <span className="h-[35px] w-[35px] flex items-center justify-center m-[5px]">
              <IoWarningOutline className="text-[25px] text-white" />
            </span>
          )}
          <p className="text-white text-[1rem]">{message}</p>
        </div>

        <span
          className="h-[35px] w-[35px] flex items-center justify-center m-[5px]"
          onClick={onClose}
        >
          <IoClose className="text-[25px] text-white" />
        </span>
      </div>
    </div>
  );
};

export default Toast;
