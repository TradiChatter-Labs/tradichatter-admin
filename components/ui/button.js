export function Button({ children, onClick, className = '', variant = 'default', ...props }) {
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
    destructive: 'bg-red-600 text-white hover:bg-red-700',
  };
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium ${variants[variant] || variants.default} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
