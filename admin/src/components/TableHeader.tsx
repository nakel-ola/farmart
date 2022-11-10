import { ArrowDown2, CloseCircle, SearchNormal1 } from "iconsax-react";
import React, {
  ChangeEvent,
  FormEvent,
  MouseEvent,
  ReactNode,
  useRef,
  useState,
} from "react";
import { Popover } from "react-tiny-popover";

type Props = {
  tableList?: string[];
  sortList?: string[];
  activeSort?: string;
  showSearch?: boolean;
  title?: string;
  toggle?: boolean;
  disableHead?: boolean;
  placeholder?: string;
  leftComponent?: ReactNode;
  searchValue?: string;
  onSearchSubmit?: (e: FormEvent) => void;
  onSearchChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onSortClick?: (event: MouseEvent<HTMLDivElement>, selected: string) => void;
};

const TableHeader = ({
  sortList = [],
  tableList = [],
  showSearch = true,
  disableHead = false,
  placeholder,
  title = "",
  onSortClick,
  leftComponent,
  searchValue,
  onSearchChange,
  onSearchSubmit,
  activeSort,
}: Props) => {
  const [active, setActive] = useState<string>(activeSort ?? sortList[0]);
  const [open, setOpen] = useState<boolean>(false);

  const ref = useRef<HTMLDivElement>(null);

  const handleClick = (e: MouseEvent<HTMLDivElement>, selected: string) => {
    setActive(selected);
    onSortClick?.(e, selected);
    setOpen(false);
  };
  return (
    <div className="w-full shrink-0 md:grid md:place-items-center bg-white dark:bg-dark rounded-lg shadow-sm">
      {!disableHead && (
        <div className="py-[5px] w-full flex items-center justify-between">
          <p className="text-[1.5rem] ml-[10px] font-[600] text-black dark:text-white">
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
              <div
                ref={ref}
                className="relative flex items-center my-auto bg-slate-100 dark:bg-neutral-800 rounded-full overflow-hidden mr-[10px]"
              >
                <Popover
                  isOpen={open}
                  positions={["bottom", "left"]}
                  padding={10}
                  parentElement={ref.current!}
                  boundaryElement={ref.current!}
                  align="center"
                  reposition={true}
                  onClickOutside={() => setOpen(false)}
                  content={
                    <MenuCard sortList={sortList} onClick={handleClick} />
                  }
                >
                  <div
                    className={`flex items-center p-[3px] transitions-all ease duration-300cursor-pointer relative cursor-pointer`}
                    onClick={() => setOpen(!open)}
                  >
                    <p
                      className={`text-neutral-600 dark:text-neutral-300 m-[3px] mx-[8px] text-sm font-semibold ml-[10px]`}
                    >
                      {active}
                    </p>
                    <div className="mx-2">
                      <ArrowDown2
                        size={20}
                        className="text-black dark:text-white"
                      />
                    </div>
                  </div>
                </Popover>
              </div>
            )}

            {leftComponent}
          </div>
        </div>
      )}

      {tableList && (
        <div className="md:w-full flex items-center justify-around">
          {tableList.map((item: string, index: number) =>
            item ? (
              <div
                key={index}
                className={`m-[8px] ml-[15px] md:ml-[12px] w-[150px] md:w-[120px] md:flex-[1] flex items-start justify-start pl-2`}
              >
                <p className="text-base font-medium text-black dark:text-white whitespace-nowrap">
                  {item}
                </p>
              </div>
            ) : (
              <div key={index} className="w-[35px]"></div>
            )
          )}
        </div>
      )}
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
  <div className="w-[120px] max-h-[200px] overflow-scroll bg-white dark:bg-dark shadow-md shadow-slate-300 dark:shadow-black/10 rounded-lg scrollbar-hide">
    {sortList.map((item: string, index: number) => (
      <div
        key={index}
        className="flex items-center p-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-neutral-800"
        onClick={(e) => onClick(e, item)}
      >
        <p className="pl-1 text-black dark:text-white font-medium">{item}</p>
      </div>
    ))}
  </div>
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
      className={`bg-slate-100 dark:bg-neutral-800  items-center py-[5px] px-[10px] rounded-full transition-all duration-300 ease flex mx-2 ml-auto ${
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

export default TableHeader;
