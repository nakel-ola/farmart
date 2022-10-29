import { useEffect, useState } from "react";


interface Props {
    src: string;
}

export default function useImageLoader({ src }: Props) {
  const [loaded, setLoaded] = useState<boolean | null>(null);

  useEffect(() => {
    if (!src) {
      return undefined;
    }

    setLoaded(false);

    let active = true;
    const image = new Image();
    image.onload = () => {
      if (!active) {
        return;
      }
      setLoaded(true);
    };
    image.onerror = () => {
      if (!active) {
        return;
      }
      setLoaded(false);
    };
    image.src = src;

    return () => {
      active = false;
    };
  }, [src]);

  return loaded;
}
