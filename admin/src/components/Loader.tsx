const Loader = () => {
  return (
    <div className="min-h-[20px] w-full flex items-center justify-center p-[10px]">
      <div className="md:w-[15%] w-fit rounded-full flex items-center justify-center bg-primary/10 md:hover:scale-110 transition-transform duration-300 ease">
        <p className="p-2 text-teal-500"> Loading More...</p>
      </div>
    </div>
  );
};

export default Loader;
