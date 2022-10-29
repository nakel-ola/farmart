import { gql, useMutation } from "@apollo/client";
import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/Button";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import { remove, selectDialog } from "../../redux/features/dialogSlice";

const BlockMutation = gql`
  mutation BlockUser($input: BlockUserInput!) {
    blockUser(input: $input) {
      msg
    }
  }
`;

const BlockCard = ({ func, blocked }: { func: any; blocked: boolean }) => {
  const ref = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();

  const blockState = useSelector(selectDialog);

  const [blockUser] = useMutation(BlockMutation);

  const handleBlock = async () => {
    await blockUser({
      variables: { input: blockState.block.product },
      onCompleted: () => func(),
    });
    dispatch(remove({ type: "block" }));
  };

  useOnClickOutside(ref, () => dispatch(remove({ type: "block" })));

  return (
    <div className="fixed top-0 w-full h-full bg-black/70 grid place-items-center z-[99999999]">
      <div
        ref={ref}
        className="w-[300px] h-[150px] bg-white dark:bg-dark rounded-xl shadow grid place-items-center"
      >
        <p className="text-lg text-dark dark:text-white text-center mx-2">
          Are u sure you want to{" "}
          <strong className="text-red-600">
            {blocked ? "unblock" : "block"} this user ?
          </strong>
        </p>

        <div className="flex items-center justify-center">
          <Button
            type="button"
            className="bg-slate-100 dark:bg-neutral-800 text-black dark:text-white"
            onClick={() => dispatch(remove({ type: "block" }))}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-primary text-white"
            onClick={handleBlock}
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BlockCard;
