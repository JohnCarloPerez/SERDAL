const LoaderFullScreen = () => {
  return (
    <div className="flex h-screen mt-15 justify-center bg-white">
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
    </div>
  );
};

const LoaderInline = () => {
  return (
    <div className="w-[100%] py-20 flex items-center justify-center">
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
    </div>
  );
};

export { LoaderFullScreen, LoaderInline };
