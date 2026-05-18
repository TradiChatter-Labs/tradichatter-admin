export function Tabs({ children, defaultValue, className = '' }) {
  return <div className={className}>{children}</div>;
}
export function TabsList({ children, className = '' }) {
  return <div className={`flex border-b ${className}`}>{children}</div>;
}
export function TabsTrigger({ children, value, className = '' }) {
  return <button className={`px-4 py-2 text-sm font-medium ${className}`}>{children}</button>;
}
export function TabsContent({ children, value, className = '' }) {
  return <div className={className}>{children}</div>;
}
