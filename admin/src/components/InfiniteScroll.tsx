import { ReactNode, Fragment, useRef, RefObject } from "react";
import useEvent from "../hooks/useEvent";

interface Props {
  className?: string;
  style?: any;
  children: ReactNode[];
  next?: () => void;
  loader?: ReactNode;
  containerRef?: any;
  hasMore?: boolean;
}
const InfiniteScroll = (props: Props) => {
  const { children, next, className, style, loader, containerRef, hasMore } =
    props;
  const ref = useRef(null) as RefObject<HTMLDivElement>;

  const handleScroll = () => {
    if (hasMore) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

      if (scrollTop + clientHeight >= scrollHeight - 100) {
        next?.();
      }
    }
  };

  useEvent(containerRef, "scroll", handleScroll);

  return (
    <Fragment>
      <div
        ref={ref}
        onScroll={handleScroll}
        style={style}
        className={className}
      >
        {children}
      </div>

      {hasMore && loader}
    </Fragment>
  );
};

export default InfiniteScroll;
