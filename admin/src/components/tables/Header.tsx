import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown2,
  ArrowUp2,
  CloseCircle,
  SearchNormal1,
} from "iconsax-react";
import {
  ChangeEvent,
  FormEvent,
  MouseEvent,
  ReactNode,
  useRef,
  useState,
} from "react";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import Button from "../Button";

type Props = {
  sortList?: string[];
  activeSort?: string;
  showSearch?: boolean;
  title?: string;
  width?: string;
  toggle?: boolean;
  disableHead?: boolean;
  placeholder?: string;
  rightComponent?: ReactNode;
  searchValue?: string;
  onSearchSubmit?: (e: FormEvent) => void;
  onSearchChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onSortClick?: (event: MouseEvent<HTMLDivElement>, selected: string) => void;
};

const Header = (props: Props) => {
  const {
    title = "",
    width,
    showSearch = true,
    placeholder,
    searchValue,
    activeSort,
    rightComponent,
    sortList = [],
    onSearchChange,
    onSearchSubmit,
    onSortClick,
  } = props;
  const [active, setActive] = useState<string>(activeSort ?? sortList[0]);
  const [open, setOpen] = useState<boolean>(false);

  const ref = useRef<HTMLDivElement>(null);

  const handleClick = (e: MouseEvent<HTMLDivElement>, selected: string) => {
    setActive(selected);
    onSortClick?.(e, selected);
    setOpen(false);
  };

  return (
    <div
      className={clsx(
        "py-[5px] md:w-full flex items-center justify-between",
        width
      )}
    >
      <p className="text-[1.5rem] ml-[10px] font-[600] text-black dark:text-white whitespace-nowrap">
        {title}
      </p>

      <div className="flex items-center flex-1">
        <div className="ml-auto"></div>
        {showSearch && (
          <InputForm
            placeholder={placeholder}
            value={searchValue}
            onChange={onSearchChange}
            onSubmit={onSearchSubmit}
          />
        )}

        {sortList.length > 0 && (
          <SortCard
            active={active}
            sortList={sortList}
            handleClick={handleClick}
          />
        )}

        {rightComponent}
      </div>
    </div>
  );
};

interface SortProps {
  sortList: string[];
  active: string;
  handleClick(e: MouseEvent<HTMLDivElement>, selected: string): void;
}

const SortCard = (props: SortProps) => {
  const { sortList, handleClick, active } = props;

  const [open, setOpen] = useState<boolean>(false);

  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(ref, () => setOpen(false));

  return (
    <div ref={ref} className="relative">
      <Button
        className="relative text-neutral-600 dark:text-neutral-300 flex items-center my-auto bg-slate-100 dark:bg-neutral-800 rounded-full mr-[10px] ml-auto md:ml-0 p-[3px]"
        onClick={() => setOpen(!open)}
      >
        {active}
        {open ? (
          <ArrowUp2 size={20} className="text-black dark:text-white mx-2" />
        ) : (
          <ArrowDown2 size={20} className="text-black dark:text-white mx-2" />
        )}
      </Button>

      <AnimatePresence>
        {open && <MenuCard sortList={sortList} onClick={handleClick} />}
      </AnimatePresence>
    </div>
  );
};

const MenuCard = ({
  sortList,
  onClick,
}: {
  sortList: string[];
  onClick(e: any, value: string): void;
}) => (
  <motion.div
    initial={{ height: 0 }}
    animate={{ height: "fit-content" }}
    exit={{ height: 0 }}
    transition={{
      duration: 0.3
    }}
    className="absolute top-10 right-2 z-[10] w-[120px] max-h-[200px] overflow-scroll bg-white dark:bg-dark shadow-md shadow-slate-300 dark:shadow-black/10 rounded-lg scrollbar-hide"
  >
    {sortList.map((item: string, index: number) => (
      <div
        key={index}
        className="flex items-center p-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-neutral-800"
        onClick={(e) => onClick(e, item)}
      >
        <p className="pl-1 text-black dark:text-white font-medium">{item}</p>
      </div>
    ))}
  </motion.div>
);

const InputForm = ({
  placeholder,
  onSubmit,
  value,
  onChange,
}: {
  placeholder?: string;
  value?: string;
  onChange?(e: ChangeEvent<HTMLInputElement>): void;
  onSubmit?(e: FormEvent): void;
}) => {
  const [text, setText] = useState(value ?? "");
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit?.(e);
  };
  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-slate-100 dark:bg-neutral-800  items-center py-[5px] px-[10px] rounded-full transition-all duration-300 ease hidden md:flex mx-2 ml-auto ${
        text && "flex-[0.6]"
      }`}
    >
      <div className="mr-2">
        {!text && (
          <SearchNormal1
            size={20}
            className="text-slate-500 dark:text-slate-100/50 text-[1rem]"
          />
        )}
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          onChange?.(e);
        }}
        className="flex-1 outline-0 border-0 bg-transparent dark:text-slate-100 placeholder:dark:text-slate-100/50"
      />

      {text && (
        <CloseCircle
          variant="Bold"
          size={20}
          onClick={() => setText("")}
          className="text-slate-500 text-[1.2rem] dark:text-slate-100/50 "
        />
      )}

      <button
        type="submit"
        className="hidden"
        disabled={text.length < 1}
      ></button>
    </form>
  );
};

export default Header;
