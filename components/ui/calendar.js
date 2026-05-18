export function Calendar({ className = '', ...props }) {
  return <input type="date" className={`px-3 py-2 border border-gray-300 rounded-md text-sm ${className}`} {...props} />;
}
export default Calendar;
