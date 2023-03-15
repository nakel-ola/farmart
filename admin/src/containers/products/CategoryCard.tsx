import { gql, useMutation } from "@apollo/client";
import clsx from "clsx";
import { CloseCircle, TickCircle, Warning2 } from "iconsax-react";
import { ChangeEvent, FormEvent, ReactNode, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/Button";
import InputField from "../../components/InputField";
import LoadingCard from "../../components/LoadingCard";
import PopupTemplate from "../../components/PopupTemplate";
import { selectCatagory } from "../../redux/features/categorySlice";
import { remove } from "../../redux/features/dialogSlice";

const CreateQuery = gql`
  mutation CreateCategories($categories: [String!]!) {
    createCategories(categories: $categories) {
      message
    }
  }
`;

const DeleteQuery = gql`
  mutation DeleteCategories($categories: [String!]!) {
    deleteCategories(categories: $categories) {
      message
    }
  }
`;

interface Props {
  onClose(): void;
}

const CategoryCard: React.FC<Props> = ({ onClose }) => {

  const [createCategories] = useMutation(CreateQuery);
  const [deleteCategories] = useMutation(DeleteQuery);

  const [input, setInput] = useState<string>("");
  const [toggle, setToggle] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [deleteList, setDeleteList] = useState<string[]>([]);
  const storedCategories = useSelector(selectCatagory);

  const handleCreate = async () => {
    setLoading(true);
    await createCategories({
      variables: { categories },
      onCompleted: () => {
        setLoading(false);
        onClose();
      },
      onError: (err) => {
        setLoading(false);
        console.table(err);
      },
    });
  };

  const handleDelete = async () => {
    setLoading(true);
    await deleteCategories({
      variables: { categories: deleteList },
      onCompleted: (data) => {
        setLoading(false);
        onClose();
      },
      onError: (err) => {
        setLoading(false);
        console.table(err);
      },
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input) {
      setCategories([...categories, input]);
      setInput("");
    }
  };

  const handleRemove = (text: string) => {
    const newCategories = [...categories];
    let index = newCategories.findIndex((c) => c === text);
    newCategories.splice(index, 1);
    setCategories(newCategories);
  };

  return (
    <PopupTemplate
      title="Categories"
      onOutsideClick={onClose}
      showEditButton
      buttonText={
        !loading ? (
          <button
            className={` px-3 font-medium rounded-full py-[4px] transition-all hover:scale-105 active:scale-95 ${
              toggle
                ? "text-green-600 hover:bg-green-600/10"
                : "text-red-600 hover:bg-red-600/10"
            }`}
            onClick={() => setToggle(!toggle)}
          >
            {toggle ? "Create" : "Delete"}
          </button>
        ) : null
      }
    >
      {!loading ? (
        <div className="pb-[10px] grid place-items-center">
          {toggle ? (
            <div className="w-[90%] mt-5 bg-slate-100 dark:bg-neutral-800 rounded-lg flex items-center flex-wrap">
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
              className="w-[90%] mt-5 bg-slate-100 dark:bg-neutral-800 rounded-lg flex items-center flex-wrap"
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
            <div className="flex items-center mt-2">
              <Warning2 size={20} variant="Bold" className="text-yellow-400" />
              <p className="text-yellow-400 ml-2 font-medium">
                This can&apos;t be undone
              </p>
            </div>
          )}

          <div className="flex items-center justify-center mt-5">
            <Button
              type="button"
              className="bg-slate-100 dark:bg-neutral-800 text-black dark:text-white mx-2"
              onClick={onClose}
            >
              Cancel
            </Button>

            <Button
              type="button"
              disabled={
                toggle ? deleteList.length === 0 : categories.length === 0
              }
              className={clsx(
                "text-white mx-2",
                toggle ? "bg-red-600 " : "bg-primary "
              )}
              onClick={toggle ? handleDelete : handleCreate}
            >
              {toggle ? "Delete" : "Create"}
            </Button>
          </div>
        </div>
      ) : (
        <LoadingCard
          title={toggle ? "Delete categories" : "Creating categories"}
        />
      )}
    </PopupTemplate>
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
