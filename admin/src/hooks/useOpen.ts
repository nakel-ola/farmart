import { useState } from 'react';


const useOpen = (id?: string) => {
    const [open, setOpen] = useState<boolean>(false);
    return [open,setOpen];
}
export default useOpen;