import { ReactNode } from "react";
import CardTemplate from "../../components/CardTemplate";

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
    <CardTemplate title={title} className="mt-8 pb-2">
      <>

        {list.map((item, index: number) => (
          <div key={index} className="flex justify-between mt-3 mb-2">
            {item.map((prop: ItemDetails, i: number) => (
              <div key={i} className="py-[5px] pl-[25px] cursor-pointer md:flex-1 w-[50%]">
                <strong className="text-lg font-medium text-black dark:text-white">
                  {prop.name}
                </strong>
                {(typeof prop.value !== "object") ? (
                  <p
                    className={` break-all pr-2 ${
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
    </CardTemplate>
  );
};

export default DetailsTemplate;
