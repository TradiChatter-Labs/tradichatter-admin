export function Select({ children, className = '', ...props }) {
  return <select className={`w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`} {...props}>{children}</select>;
}
export function SelectTrigger({ children, className = '' }) {
  return <div className={`px-3 py-2 border border-gray-300 rounded-md text-sm ${className}`}>{children}</div>;
}
export function SelectContent({ children }) {
  return <div>{children}</div>;
}
export function SelectItem({ children, value }) {
  return <option value={value}>{children}</option>;
}
export function SelectValue({ placeholder }) {
  return <span className="text-gray-500">{placeholder}</span>;
}
export default Select;
