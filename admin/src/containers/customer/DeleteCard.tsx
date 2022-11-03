import { gql, useMutation } from "@apollo/client";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/Button";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import { remove, selectDialog } from "../../redux/features/dialogSlice";


const DeleteMutation = gql`
  mutation DeleteCoupon($id: ID!) {
    deleteCoupon(id: $id) {
      msg
    }
  }
`;

const DeleteCard = ({ func }: {func: any}) => {
  const ref = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();

  useOnClickOutside(ref, () => dispatch(remove({ type: "couponDelete"})));

  const deleteState = useSelector(selectDialog);

  const [deleteCoupon] = useMutation(DeleteMutation, {
    onCompleted: (data) => console.log(data),
    onError: (data) => console.table(data),
  });

  const handleDelete = async () => {
    await deleteCoupon({
      variables: { id: deleteState.couponDelete.data?.id },
      onCompleted: () => {
        func?.()
        dispatch(remove({ type: "couponDelete"}))

      }
    });
  }


  return (
    <div className="fixed top-0 w-full h-full bg-black/70 grid place-items-center z-[99999999]">
      <div
        ref={ref}
        className="w-[300px] h-[150px] bg-white dark:bg-dark rounded-xl shadow grid place-items-center"
      >
        <p className="text-lg text-dark dark:text-white text-center mx-2">Are you sure you want to delete coupon with code: <strong className="text-red-600">{deleteState.couponDelete.data.coupon}</strong> ?</p>

        <div className="flex items-center justify-center">
          <Button
            type="button"
            className="bg-slate-100 dark:bg-neutral-800 text-black dark:text-white"
            onClick={() => dispatch(remove({ type: "couponDelete"}))}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-primary text-white disabled:opacity-40"
            onClick={handleDelete}
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCard;
