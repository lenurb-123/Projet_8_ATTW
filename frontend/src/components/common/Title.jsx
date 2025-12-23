const Title = ({ children, className = '', color = '#0A1F33' }) => {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* Barre verticale */}
      <div 
        className="w-1.5 h-12 rounded-full"
        style={{ backgroundColor: color }}
      />
      
      {/* Texte du titre */}
      <h2 
        className="text-3xl md:text-4xl font-bold font-poppins"
        style={{ color: color }}
      >
        {children}
      </h2>
    </div>
  );
};

export default Title;
