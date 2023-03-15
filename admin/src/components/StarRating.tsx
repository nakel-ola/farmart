import clsx from "clsx";
import { Star1 } from "iconsax-react";
import { useState } from "react";

type Variant = "Outline" | "Bold";
type Disable = {
  click?: boolean;
  hover?: boolean;
};
interface Props {
  onClick?(value: number): void;
  value?: number;
  size?: number | string;
  activeColor?: string;
  color?: string;
  activeVariant?: Variant;
  variant?: Variant;
  disabled?: boolean | Disable;
  spacing?: number;
}

// Fresh products 🥰🥰🥰
// not bad product was found
const StarRating = (props: Props) => {
  const {
    onClick,
    value = null,
    size = 25,
    activeColor = "#f8b808",
    color = "#f8b808",
    activeVariant = "Bold",
    variant = "Outline",
    disabled = false,
    spacing = 4,
  } = props;
  const [state, setState] = useState<number | null>(value);
  const [active, setActive] = useState<number | null>(value);

  const getActive = (i: number) => {
    if (state && i <= state) return true;

    if (active && i <= active) return true;

    return false;
  };

  const isBoolean = typeof disabled === "boolean";

  const disableHover = isBoolean ? disabled : disabled?.hover;
  const disableClick = isBoolean ? disabled : disabled?.click;

  const isDisabled = isBoolean ? disabled : disableClick;

  return (
    <span className="flex items-center">
      {Array(5)
        .fill(0)
        .map((_, i) => {
          return (
            <button
              key={i}
              type="button"
              style={{
                marginLeft: spacing + "px",
                marginRight: spacing + "px",
              }}
              disabled={isDisabled}
              onMouseEnter={() => !disableHover && setState(i)}
              onMouseLeave={() => !disableHover && setState(value)}
              onClick={() => {
                if (disableClick) return;
                setActive(i);
                onClick?.(i);
              }}
            >
              <Star1
                size={size}
                variant={getActive(i) ? activeVariant : variant}
                color={getActive(i) ? activeColor : color}
              />
            </button>
          );
        })}
    </span>
  );
};

export default StarRating;
