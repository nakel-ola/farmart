import React from "react";
import Button from "./Button";
import LoadingCard from "./LoadingCard";
import PopupTemplate from "./PopupTemplate";

interface Props {
  onClose(): void;
  onDelete(): void;
  loading: boolean;
  message: string;
  title?: string;
}

const DeleteCard: React.FC<Props> = (props) => {
  const { onClose, loading, onDelete, message, title = "Delete" } = props;

  return (
    <PopupTemplate title={title} onOutsideClick={onClose}>
      {loading ? (
        <LoadingCard title="Loading..." />
      ) : (
        <>
          <p className="font-medium text-dark dark:text-white text-center p-4">
            {message}
          </p>

          <div className="flex items-center justify-center mb-2">
            <Button
              type="button"
              className="bg-slate-100 dark:bg-neutral-800 text-black dark:text-white mx-2"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="text-red-600  bg-red-600/10 mx-2"
              onClick={onDelete}
            >
              Delete
            </Button>
          </div>
        </>
      )}
    </PopupTemplate>
  );
};

export default DeleteCard;
