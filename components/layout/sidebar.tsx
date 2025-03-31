'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-card hidden md:block sticky top-[61px] h-[calc(100vh-61px)] overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Menu</h2>
        <nav className="space-y-1">
          {navItems.map((item) => {
            // Check if the current path matches this navigation item
            const isActive = pathname === item.path;
            
            return (
              <Link 
                key={item.path} 
                href={item.path}
                className={`flex items-center px-4 py-2 rounded-md w-full hover:bg-muted transition-colors ${
                  isActive ? 'bg-primary/10 text-primary' : ''
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
} 