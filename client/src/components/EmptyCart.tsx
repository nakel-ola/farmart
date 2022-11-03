import { ShoppingCart } from "iconsax-react";
import { useRouter } from "next/router";
import Button from "./Button";

const EmptyCart = ({ disabled = false }: { disabled?: boolean }) => {
  const router = useRouter();
  return (
    <div className="grid h-[80%] place-items-center">
      <div className="flex items-center justify-center flex-col">
        <ShoppingCart
          size={100}
          className="text-neutral-700 dark:text-neutral-400"
        />
        <p className="text-neutral-700 dark:text-neutral-400 text-lg font-semibold my-1">Cart Empty</p>

        {!disabled && (
          <Button onClick={() => router.push("/")}>
            <p>Go To Home</p>
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmptyCart;
