import { useEffect, useState } from "react";
import window from "../window";


// const win = typeof window !== "undefined" ? window : {} as Window;

const win = window;

const useWindowResizeListener = () => {
    const [screenSize,setScreenSize] = useState(0);

    useEffect(() => {
        const handleResize = () => setScreenSize(win.innerWidth);


        win.addEventListener('resize', handleResize);

        handleResize();

        return () => win.removeEventListener('resize', handleResize);
    },[]);

    return screenSize;
}

export default useWindowResizeListener;