import { Star1 } from "iconsax-react";
import { useState } from "react";

interface Props {
  onClick?(value: number): void;
  value?: number;
}

// Fresh products 🥰🥰🥰
// not bad product was found
const StarRating = (props: Props) => {
  const { onClick, value = null } = props;
  const [state, setState] = useState<number | null>(value);
  const [active, setActive] = useState<number | null>(value);

  const getVarient = (i: number): "Outline" | "Bold" => {
    if (state && i <= state) {
      return "Bold";
    }

    if (active && i <= active) {
      return "Bold";
    }

    return "Outline";
  };

  return (
    <span className="flex items-center">
      {Array(5)
        .fill(0)
        .map((_, i) => {
          return (
            <button
              key={i}
              type="button"
              className="mx-1"
              onMouseEnter={() => setState(i)}
              onMouseLeave={() => setState(value)}
              onClick={() => {
                setActive(i);
                onClick?.(i);
              }}
            >
              <Star1
                size={25}
                variant={getVarient(i)}
                className="text-yellow"
              />
            </button>
          );
        })}
    </span>
  );
};

export default StarRating;
