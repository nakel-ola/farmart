import { Login } from "iconsax-react";
import { useRouter } from "next/router";
import React from "react";
import Button from "./Button";

const LoginCard = () => {
  const router = useRouter();
  return (
    <div className="h-[80%] w-full grid place-items-center">
      <div className="flex items-center justify-center flex-col">
        <Login
          size={100}
          variant="Bold"
          className="text-neutral-700 dark:text-neutral-400"
        />
        <p className="text-black dark:text-white text-lg">Sign in to your account to continue...</p>
        <Button
          onClick={() => router.push("/auth")}
          className="my-2"
        >
          Sign In
        </Button>
      </div>
    </div>
  );
};

export default LoginCard;
