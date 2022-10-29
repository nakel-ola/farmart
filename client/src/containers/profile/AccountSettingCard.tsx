import { useRouter } from "next/router";
import React from "react";
import CardTemplate from "../../components/CardTemplate";

function AccountSettingCard() {
  const router = useRouter();

  return (
    <>
      <CardTemplate title="Account" className="mt-4">
        <div
          className="py-[5px] pl-[25px] cursor-pointer hover:bg-slate-100 hover:dark:bg-neutral-800 transition-all duration-300"
          onClick={() => router.push("/inbox")}
        >
          <p className="text-neutral-700 dark:text-neutral-300 font-medium">
            Inbox
          </p>
        </div>
        <div
          className="py-[5px] pl-[25px] cursor-pointer hover:bg-slate-100 hover:dark:bg-neutral-800 transition-all duration-300"
          onClick={() => router.push("/coupons")}
        >
          <p className="text-neutral-700 dark:text-neutral-300 font-medium">
            Coupons
          </p>
        </div>
        <div
          className="py-[5px] pl-[25px] cursor-pointer hover:bg-slate-100 hover:dark:bg-neutral-800 transition-all duration-300"
          onClick={() => router.push("/address")}
        >
          <p className="text-neutral-700 dark:text-neutral-300 font-medium">
            Address Book
          </p>
        </div>
      </CardTemplate>
    </>
  );
}

export default AccountSettingCard;
