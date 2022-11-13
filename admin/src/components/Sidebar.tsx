import React from "react";
import SidebarContent from "./SidebarContent";


function Sidebar({ toggle }: { toggle: boolean }) {
  return (
    <div
      className="hidden lg:flex px-[5px] py-[20px] flex-col justify-between 2xl:justify-start  bg-white dark:bg-dark h-[calc(100vh-55px)] transition-all duration-300 ease-in-out w-[260px]  max-w-[260px]"
    >
      <SidebarContent />
    </div>
  );
}

export default Sidebar;
