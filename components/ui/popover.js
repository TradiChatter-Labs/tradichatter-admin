export function Popover({ children }) { return <div>{children}</div>; }
export function PopoverTrigger({ children, asChild }) { return <div>{children}</div>; }
export function PopoverContent({ children, className = '' }) { return <div className={`absolute z-50 bg-white border rounded-lg shadow-lg p-4 ${className}`}>{children}</div>; }
export default Popover;
