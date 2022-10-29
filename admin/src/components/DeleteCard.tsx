import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import useOnClickOutside from "../hooks/useOnClickOutside";
import { remove, selectDialog } from "../redux/features/dialogSlice";
import Button from "./Button";

const DeleteCard = ({ func }: { func?: any }) => {
  const ref = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();

  const close = () => dispatch(remove({ type: "delete" }));

  useOnClickOutside(ref, close);

  const dialog = useSelector(selectDialog);

  const handleDelete = async () => {
    func?.();
    close();
  };

  return dialog.delete.open ? (
    <div className="fixed top-0 w-full h-full bg-black/70 grid place-items-center z-[99999999]">
      <div
        ref={ref}
        className="w-[300px] min-h-[150px] bg-white dark:bg-dark rounded-lg shadow grid place-items-center"
      >
        <p
          className="text-lg text-dark dark:text-white text-center px-2"
          dangerouslySetInnerHTML={{ __html: dialog.delete.product.message }}
        >
        </p>

        <div className="flex items-center justify-center">
          <Button
            type="button"
            className="bg-slate-100 dark:bg-neutral-800 text-black dark:text-white"
            onClick={close}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="text-red-600  bg-red-600/10"
            onClick={handleDelete}
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  ) : null;
};

export default DeleteCard;
