import { ApolloQueryResult } from "@apollo/client";
import clsx from "clsx";
import { Star1 } from "iconsax-react";
import React from "react";
import { useDispatch } from "react-redux";
import { ProductType } from "../../../typing";
import Button from "../../components/Button";
import { add } from "../../redux/features/dialogSlice";

type Props = {
  data: ProductType;
  canEdit: boolean;
};

const ProductDetails = ({ data, canEdit }: Props) => {
  const dispatch = useDispatch();

  const items = [
    {
      name: "Name",
      value: data.title,
    },
    {
      name: "Price",
      value: data.currency.symbol + "" + data.price,
    },
    {
      name: "Category",
      value: data.category,
    },
    {
      name: "Description",
      value: data.description,
    },
    {
      name: "Stock",
      value: (
        <p
          className={clsx(
            " md:pl-2 flex-1",
            data.stock > 0
              ? "text-neutral-700 dark:text-neutral-400"
              : "text-red-600"
          )}
        >
          {data.stock > 0 ? data.stock : "Out of stock"}
        </p>
      ),
    },
    {
      name: "Rating",
      value: (
        <div className="text-neutral-700 dark:text-neutral-400 flex-1 flex itesm-center">
          {data.rating > 0 ? (
            <>
              <RenderStar value={data.rating} active={true} />
              <RenderStar value={5 - data.rating} active={false} />
            </>
          ) : (
            <RenderStar value={5} active={false} />
          )}
        </div>
      ),
    },
    {
      name: "Created At",
      value: new Date(data.createdAt).toDateString(),
    },
    {
      name: "Last Updated",
      value: new Date(data.updatedAt).toDateString(),
    },
  ];

  return (
    <div className="w-[95%] md:w-[80%] rounded-lg dark:bg-dark dark:shadow-black/30 bg-white shadow-sm overflow-hidden pb-2 mt-8">
      <div className="w-full border-b-[1px] border-b-neutral-100 dark:border-b-neutral-800 flex items-center justify-between">
        <p className="py-[8px] pl-[15px] text-[1.2rem] text-black font-[600] dark:text-white">
          General Infomation
        </p>

        {canEdit && (
          <Button
            className="text-green-600 bg-green-600/10 mr-2"
            onClick={() =>
              dispatch(add({ open: true, data, type: "edit" }))
            }
          >
            Edit
          </Button>
        )}
      </div>

      {items.map((item, index: number) => (
        <div key={index} className="py-2 pl-[25px] flex md:flex-row flex-col">
          <strong className="text-lg font-medium text-black dark:text-white flex-[0.3]">
            {item.name}
          </strong>
          {typeof item.value !== "object" ? (
            <p className="text-neutral-700 dark:text-neutral-400 md:pl-2 flex-1">
              {item.value}
            </p>
          ) : (
            item.value
          )}
        </div>
      ))}
    </div>
  );
};

type RenderStarProps = {
  value: number;
  active: boolean;
};

const RenderStar = (props: RenderStarProps) => {
  const { active, value } = props;
  return (
    <>
      {Array(value)
        .fill(0)
        .map((_, i) => (
          <Star1
            key={i}
            size={25}
            variant={active ? "Bold" : "Outline"}
            className={`${active ? "text-[#f8b808]" : "text-[#bdbdbd]"}`}
          />
        ))}
    </>
  );
};

export default ProductDetails;
