import React from "react";
import useControlled from "./useControlled";



export interface UsePaginationProps {
  /**
   * Number of always visible pages at the beginning and end
   * @default 1
   */
  boundaryCount?: number;
  /**
   * Th name of the component where this hooks is used.
   */
  componentName?: string;
  /**
   * The total number of pages
   * @default 1
   */
  count: number;
  /**
   * The page selected by default when the component is uncontrolled.
   * @default 1
   */
  defaultPage?: number;
  /**
   * If `true`, the component is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * Callback fired when the page is changed.
   *
   * @param {React.ChangeEvent<unknown>} event The event source of the callback.
   * @param {number} page The page selected.
   */
  onChange?: (event: React.ChangeEvent<unknown>, page: number) => void;
  /**
   * The current page
   */
  page?: number;
  /**
   * Number of always visible pages before and after the current page.
   * @default 1
   */
  siblingCount?: number;
}

export interface UsePaginationItem {
  onClick: React.ReactEventHandler;
  type: "page"
    | "start-ellipsis"
    | "end-ellipsis";
  page: number;
  selected: boolean;
  disabled: boolean;
}

export interface UsePaginationAction {
  onClick: React.ReactEventHandler;
  type: "first"
    | "last"
    | "next"
    | "previous";
  page: number;
  selected: boolean;
  disabled: boolean;
}

export interface UsePaginationResult {
  pages: UsePaginationItem[];
  next: UsePaginationAction;
  last: UsePaginationAction;
  previous: UsePaginationAction;
  first: UsePaginationAction;
}

export default function usePagination(
  props: UsePaginationProps
): UsePaginationResult;


export default function usePagination(props: UsePaginationProps): UsePaginationResult {
  const {
    boundaryCount = 1,
    componentName = "usePagination",
    count = 1,
    defaultPage = 1,
    disabled = false,
    onChange: handleChange,
    page: pageProp,
    siblingCount = 1,
  } = props;

  const [page, setPageState] = useControlled<number>({
    controlled: pageProp,
    default: defaultPage,
    name: componentName,
    state: "page",
  });

  const handleClick = (event:  React.ChangeEvent, value: number) => {
    if (!pageProp) {
      setPageState(value);
    }

    if (handleChange) {
      handleChange(event, value);
    }
  };

  const range = (start: number, end: number): number[] => {
    const length = end - start + 1;
    return Array.from(
      {
        length,
      },
      (_, i) => start + i
    );
  };

  const startPages = range(1, Math.min(boundaryCount, count));
  const endPages = range(
    Math.max(count - boundaryCount + 1, boundaryCount + 1),
    count
  );
  const siblingsStart = Math.max(
    Math.min(
      // Natural start
      page - siblingCount, // Lower boundary when page is high
      count - boundaryCount - siblingCount * 2 - 1
    ), // Greater than startPages
    boundaryCount + 2
  );
  const siblingsEnd = Math.min(
    Math.max(
      // Natural end
      page + siblingCount, // Upper boundary when page is low
      boundaryCount + siblingCount * 2 + 2
    ), // Less than endPages
    endPages.length > 0 ? endPages[0] - 2 : count - 1
  );

  const itemList = [
    ...startPages, // Start ellipsis
    // eslint-disable-next-line no-nested-ternary
    ...(siblingsStart > boundaryCount + 2
      ? ["start-ellipsis"]
      : boundaryCount + 1 < count - boundaryCount
      ? [boundaryCount + 1]
      : []), // Sibling pages
    ...range(siblingsStart, siblingsEnd), // End ellipsis
    // eslint-disable-next-line no-nested-ternary
    ...(siblingsEnd < count - boundaryCount - 1
      ? ["end-ellipsis"]
      : count - boundaryCount > boundaryCount
      ? [count - boundaryCount]
      : []),
    ...endPages
  ];

  const buttonPage = (type: UsePaginationAction["type"]): number => {
    switch (type) {
      case "first":
        return 1;

      case "previous":
        return page - 1;

      case "next":
        return page + 1;

      case "last":
        return count;
    }
  };

  const pages = itemList.map((item: number | string) => {
    return typeof item === 'number' ? {
      onClick: (event:  React.ChangeEvent) => {
        handleClick(event, item);
      },
      type: 'page',
      page: item,
      selected: item === page,
      disabled
    } : {
      onClick: (event: React.ChangeEvent) => {},
      type: item,
      page: null,
      selected: false,
      disabled: disabled || item.indexOf('ellipsis') === -1 && page <= 1
    };
  }) as UsePaginationItem[];

  const next = {
    onClick: (event: React.ChangeEvent) => {
      handleClick(event, buttonPage("next")!);
    },
    type: "next",
    page: buttonPage("next"),
    selected: false,
    disabled: disabled || page >= count
  } as UsePaginationAction;

  const last = {
    onClick: (event: React.ChangeEvent) => {
      handleClick(event, buttonPage("last")!);
    },
    type: "last",
    page: buttonPage("last"),
    selected: false,
    disabled: disabled || page >= count
  } as UsePaginationAction;

  const previous = {
    onClick: (event: React.ChangeEvent) => {
      handleClick(event, buttonPage("previous")!);
    },
    type: "previous",
    page: buttonPage("previous"),
    selected: false,
    disabled: disabled || page <= 1
  } as UsePaginationAction;

  const first = {
    onClick: (event: React.ChangeEvent) => {
      handleClick(event, buttonPage("first")!);
    },
    type: "first",
    page: buttonPage("first"),
    selected: false,
    disabled: disabled || page <= 1
  } as UsePaginationAction;

  return {
    pages,
    last,
    next,
    previous,
    first
  }
}
