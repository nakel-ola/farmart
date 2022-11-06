import { gql, useMutation } from "@apollo/client";
import clsx from "clsx";
import { CloseCircle, TickCircle, Warning2 } from "iconsax-react";
import { ChangeEvent, FormEvent, ReactNode, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import InputField from "../../components/InputField";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import { selectCatagory } from "../../redux/features/categorySlice";
import { remove } from "../../redux/features/dialogSlice";

const CreateQuery = gql`
  mutation CreateCategories($categories: [String!]!) {
    createCategories(categories: $categories) {
      msg
    }
  }
`;

const DeleteQuery = gql`
  mutation DeleteCategories($categories: [String!]!) {
    deleteCategories(categories: $categories) {
      msg
    }
  }
`;

const CategoryCard = () => {
  const ref = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();

  useOnClickOutside(ref, () => dispatch(remove({ type: "category" })));

  const [createCategories] = useMutation(CreateQuery);
  const [deleteCategories] = useMutation(DeleteQuery);

  const [input, setInput] = useState<string>("");
  const [toggle, setToggle] = useState<boolean>(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [deleteList, setDeleteList] = useState<string[]>([]);
  const storedCategories = useSelector(selectCatagory);

  const handleCreate = async () => {
    await createCategories({
      variables: { categories },
      onCompleted: (data) => {
        console.log(data);
        dispatch(remove({ type: "category" }));
      },
      onError: (err) => {
        console.table(err);
      },
    });
  };

  const handleDelete = async () => {
    await deleteCategories({
      variables: { categories: deleteList },
      onCompleted: (data) => {
        console.log(data);
        dispatch(remove({ type: "category" }));
      },
      onError: (err) => {
        console.table(err);
      },
    })
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setCategories([...categories, input]);
    setInput("");
  };

  const handleRemove = (text: string) => {
    const newCategories = [...categories];
    let index = newCategories.findIndex((c) => c === text);
    newCategories.splice(index, 1);
    setCategories(newCategories);
  };

  return (
    <div className="fixed top-0 w-full h-full bg-black/70 grid place-items-center z-[99999999]">
      <div
        ref={ref}
        className="w-[300px] min-h-[150px] bg-white dark:bg-dark rounded-xl shadow grid place-items-center"
      >
        <div className="flex items-center justify-between w-[90%] my-2">
          <p className="text-lg text-dark dark:text-white">Categories </p>

          <button
            className={` px-3 font-medium rounded-full py-[4px] hover:scale-105 active:scale-95 ${
              toggle
                ? "text-green-600 hover:bg-green-600/10"
                : "text-red-600 hover:bg-red-600/10"
            }`}
            onClick={() => setToggle(!toggle)}
          >
            {toggle ? "Create" : "Delete"}
          </button>
        </div>

        {toggle ? (
          <div className="w-[90%] my-2 bg-slate-100 dark:bg-neutral-800 rounded-lg flex items-center flex-wrap">
            {storedCategories.map(
              (category: { name: string }, index: number) => {
                const isDelete = deleteList.includes(category.name);
                const handleClick = () => {
                  if (!isDelete) {
                    setDeleteList([...deleteList, category.name]);
                  } else {
                    const newDeleteList = [...deleteList];
                    let index = newDeleteList.findIndex(
                      (c) => c === category.name
                    );
                    newDeleteList.splice(index, 1);
                    setDeleteList(newDeleteList);
                  }
                };
                return (
                  <Chip
                    key={index}
                    text={category.name}
                    className={isDelete ? "bg-red-600/10 text-red-600" : ""}
                    action={
                      <div className="" onClick={handleClick}>
                        {isDelete ? (
                          <TickCircle
                            size={20}
                            variant="Bold"
                            className="text-red-600"
                          />
                        ) : (
                          <CloseCircle
                            size={20}
                            variant="Bold"
                            className="text-slate-400 dark:text-neutral-800"
                          />
                        )}
                      </div>
                    }
                  />
                );
              }
            )}
          </div>
        ) : (
          <form
            className="w-[90%] my-2 bg-slate-100 dark:bg-neutral-800 rounded-lg flex items-center flex-wrap"
            onSubmit={handleSubmit}
          >
            {categories.map((category: string, index: number) => (
              <Chip
                key={index}
                text={category}
                action={
                  <div className="" onClick={() => handleRemove(category)}>
                    <CloseCircle
                      size={20}
                      variant="Bold"
                      className="text-slate-400 dark:text-neutral-800"
                    />
                  </div>
                }
              />
            ))}

            <div className="mx-2 w-full my-[2px]">
              <InputField
                IconLeft="disabled"
                placeholder="Type here"
                className="mt-0 bg-transparent hover:shadow-none"
                value={input}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setInput(e.target.value)
                }
              />
            </div>
          </form>
        )}

        {toggle && (
          <div className="flex items-center">
            <Warning2 size={20} variant="Bold" className="text-yellow-400" />
            <p className="text-yellow-400 ml-2 font-medium">
              This can&apos;t be undone
            </p>
          </div>
        )}

        <div className="flex items-center justify-center mb-2">
          <button
            type="button"
            className="bg-slate-100 dark:bg-neutral-800 rounded-full px-3 py-[4px] mx-1 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center my-2 text-black dark:text-white"
            onClick={() => dispatch(remove({ type: "category" }))}
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={
              toggle ? deleteList.length === 0 : categories.length === 0
            }
            className={`rounded-full px-3 py-[4px] mx-1 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center my-2 text-white disabled:opacity-40 ${
              toggle ? "bg-red-600 " : "bg-primary "
            }`}
            onClick={toggle ? handleDelete : handleCreate}
          >
            {toggle ? "Delete" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

type ChipProps = {
  text: string;
  className?: string;
  action?: ReactNode;
};

const Chip = (props: ChipProps) => {
  return (
    <button
      type="button"
      className={clsx(
        "bg-slate-200 dark:bg-neutral-700 rounded-full flex items-center m-2 p-1 text-black dark:text-white ",
        props.className
      )}
    >
      <p className="px-2 text-sm">{props?.text}</p>
      {props.action}
    </button>
  );
};

export default CategoryCard;
