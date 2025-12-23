const Alert = ({ type = 'info', message, onClose }) => {
  const typeStyles = {
    success: 'bg-cream border-orange text-navy',
    error: 'bg-cream border-red-500 text-navy',
    warning: 'bg-cream border-orange-dark text-navy',
    info: 'bg-cream border-navy text-text',
  };

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  if (!message) return null;

  return (
    <div className={`border-2 rounded-card p-4 mb-4 shadow-card ${typeStyles[type]}`}>
      <div className="flex items-start">
        <span className="text-xl mr-3">{icons[type]}</span>
        <div className="flex-1">
          <p className="text-sm font-inter">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-4 text-gray-warm hover:text-orange transition"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
