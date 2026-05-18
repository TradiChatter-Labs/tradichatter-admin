import Link from 'next/link';
import { Truck, ShoppingCart, DollarSign, Shield, Package } from 'lucide-react';

export default function SourceHubIndex() {
  const sections = [
    { name: 'Suppliers', href: '/sourcehub/suppliers', icon: Truck, description: 'Manage B2B suppliers, verification, trust scores', color: 'bg-indigo-500' },
    { name: 'Wholesale Orders', href: '/sourcehub/orders', icon: ShoppingCart, description: 'Monitor all wholesale orders and status', color: 'bg-blue-500' },
    { name: 'Treasury & Escrow', href: '/sourcehub/treasury', icon: DollarSign, description: 'Platform balance, payouts, fee structure', color: 'bg-green-500' },
    { name: 'Disputes', href: '/sourcehub/disputes', icon: Shield, description: 'Review and resolve buyer-supplier disputes', color: 'bg-red-500' },
    { name: 'Logistics', href: '/sourcehub/logistics', icon: Package, description: 'Track shipments and logistics providers', color: 'bg-purple-500' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">SourceHub (B2B Marketplace)</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage the B2B sourcing marketplace — suppliers, wholesale orders, escrow, logistics, and treasury.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Link key={section.href} href={section.href}>
              <div className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
                <div className="flex items-center mb-3">
                  <div className={`${section.color} rounded-md p-2`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="ml-3 text-lg font-medium text-gray-900">{section.name}</h3>
                </div>
                <p className="text-sm text-gray-500">{section.description}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
