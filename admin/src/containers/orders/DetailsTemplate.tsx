import { ReactNode } from "react";

export type ItemDetails = {
  name: string;
  value: string | ReactNode | number;
  color?: string;
  bold?: boolean;
};

type Props = {
  title: string;
  list: ItemDetails[][];
};
const DetailsTemplate = (props: Props) => {
  const { title, list } = props;

  return (
    <div className="mt-8 w-[95%] md:w-[80%] rounded-lg dark:bg-dark dark:shadow-black/30 bg-white shadow-sm overflow-hidden pb-2">
      <>
        <div className="w-full border-b-[1px] border-b-neutral-100 dark:border-b-neutral-800">
          <p className="py-[8px] pl-[15px] text-[1.2rem] text-black font-[600] dark:text-white">
            {title}
          </p>
        </div>

        {list.map((item, index: number) => (
          <div key={index} className="flex justify-between mt-3 mb-2">
            {item.map((prop: ItemDetails, i: number) => (
              <div key={i} className="py-[5px] pl-[25px] cursor-pointer md:flex-1 w-[50%]">
                <strong className="text-lg font-medium text-black dark:text-white">
                  {prop.name}
                </strong>
                {(typeof prop.value !== "object") ? (
                  <p
                    className={` break-all ${
                      prop.color ?? "text-neutral-700 dark:text-neutral-400"
                    } ${prop.bold && "font-medium"}`}
                  >
                    {" "}
                    {prop?.value}
                  </p>
                ) : (
                  prop.value
                )}
              </div>
            ))}
            {item.length === 1 && (
              <div className="py-[5px] pl-[25px] cursor-pointer flex-1"></div>
            )}
          </div>
        ))}
      </>
    </div>
  );
};

export default DetailsTemplate;
