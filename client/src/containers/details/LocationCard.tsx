import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { BackSquare, Location, Truck } from "iconsax-react";
import React, { useState } from "react";
import InputField from "../../components/InputField";
import PopupCard from "./PopupCard";
import PopupField from "./PopupField";

function LocationCard({ error }: { error: any }) {
  const [address, setAddress] = useState<string>("");
  const [area, setArea] = useState<string>("");
  const [toggle, setToggle] = useState<boolean>(false);

  const handleClick = (name: string) => {
    setArea(name);
    setToggle(false);
  };
  return (
    <div className="w-[95%] md:w-[80%] mt-[10px] bg-white dark:bg-dark dark:shadow-black/30 pl-[8px] pb-[8px] p-[5px] shadow-sm rounded-lg">
      <p className="py-[8px] pr-[8px] pl-[15px] text-[1rem] text-black dark:text-white font-[600]">
        Delivery Details
      </p>
      {/* <div className="py-[12px] ml-[20px] w-full">
        <div className="w-[85%]">
          <InputField
            IconLeft={Location}
            value={address}
            error={error === "address" || error === "both"}
            onChange={(e: any) => setAddress(e.target.value)}
            placeholder="Enter your address"
            clearInput={() => setAddress("")}
          />
        </div>

        <PopupField
          value={area}
          error={error === "area" || error === "both"}
          toggle={toggle}
          onClick={() => setToggle(!toggle)}
          placeholder="Select Area"
        />
      </div> */}

      <Card
        Icon={Truck}
        title="Door Delivery"
        subtitle={`Delivery ₦ 850
    Ready for delivery between 4:30pm when you order within the next hour
  `}
      />
      <Card
        Icon={BackSquare}
        title="Return Policy"
        subtitle="No return policy for this product. "
      />

      <SwipeableDrawer
        anchor="bottom"
        open={toggle}
        disableSwipeToOpen={true}
        disableDiscovery={true}
        onClose={() => setToggle(false)}
        onOpen={() => setToggle(true)}
      >
        <PopupCard
          onClose={() => setToggle(false)}
          handleClick={handleClick}
          area={area}
        />
      </SwipeableDrawer>
    </div>
  );
}

const Card = ({
  Icon,
  title,
  subtitle,
}: {
  Icon: any;
  title: string;
  subtitle: string;
}) => (
  <div className="flex items-center py-[12px] pr-[12px] pl-[15px]">
    <div className="p-[10px] mb-auto">
      <Icon className="text-black dark:text-white" />
    </div>

    <div className="pr-[10px] flex-1 ">
      <p className="text-black text-[1rem] font-[500] dark:text-white">
        {title}
      </p>
      <p className="text-[#454545] font-[400] dark:text-white whitespace-pre-line">
        {subtitle}
      </p>
    </div>
  </div>
);

export default LocationCard;
