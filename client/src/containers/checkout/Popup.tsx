import PopupTemplate from "../../components/PopupTemplate";
import Items from "../../data/address.json";

interface Props {
  setDeliveryMethod: React.Dispatch<
    React.SetStateAction<"Door Delivery" | "Pickup Station">
  >;
  deliveryMethod: "Door Delivery" | "Pickup Station";
  setPickup: React.Dispatch<React.SetStateAction<string | null>>;
  pickup: string | null;
  onClose(): void;
}
const Popup: React.FC<Props> = (props) => {
  const { setDeliveryMethod, pickup, setPickup, onClose } = props;

  const handleClick = (name: string) => {
    setDeliveryMethod("Pickup Station");
    setPickup(name);
    onClose();
  };

  return (
    <PopupTemplate title="Select Area" onOutsideClick={onClose}>
      <div className="h-[85vh] overflow-x-hidden overflow-y-scroll scrollbar-style">
        {Items.map(({ name, zip }, inx) => (
          <div
            className="flex items-center justify-between px-[10px] py-2 m-[5px] cursor-pointer hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-lg"
            key={inx}
            onClick={() => handleClick(`${name} - ${zip}`)}
          >
            <p className="font-[1rem] text-[#212121] dark:text-white">
              {name} - {zip}
            </p>

            <div className="w-[25px] h-[25px] rounded-full flex items-center justify-center">
              <div
                className={`w-[18px] h-[18px] rounded-full relative overflow-hidden ring-[2px] ${
                  pickup === `${name} - ${zip}`
                    ? "ring-[#212121] dark:ring-white"
                    : "ring-gray-500"
                }`}
              >
                {pickup === `${name} - ${zip}` && (
                  <span
                    className={`absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[15px] h-[15px] rounded-full ${
                      pickup === `${name} - ${zip}`
                        ? "bg-[#212121] dark:bg-white"
                        : "bg-gray-800"
                    }`}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </PopupTemplate>
  );
};

export default Popup;
