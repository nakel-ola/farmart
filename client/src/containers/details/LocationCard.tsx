import { BackSquare, Truck } from "iconsax-react";
import CardTemplate from "../../components/CardTemplate";

function LocationCard() {
  return (
    <CardTemplate
      title="Delivery Details"
      className="mt-8"
    >
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
    </CardTemplate>
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
