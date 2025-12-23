const Loader = ({ size = 'md', text = 'Chargement...' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div
        className={`${sizeClasses[size]} border-4 border-sand border-t-orange rounded-full animate-spin`}
      ></div>
      {text && <p className="mt-4 text-text font-inter">{text}</p>}
    </div>
  );
};

export default Loader;
