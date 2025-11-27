import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface HeaderProps {
  subtitle?: string;
  action?: React.ReactNode;
}

const Header = ({ subtitle: propSubtitle, action: propAction }: HeaderProps) => {
  const location = useLocation();
  const pathname = location.pathname;

  let subtitle = propSubtitle;
  let action = propAction;

  // Route-based customization
  if (pathname === '/test') {
    subtitle = "Compliance Risk Score Tool";
    action = (
      <Link to="/" className="text-gray-600 font-medium hover:text-gray-900">
        Exit
      </Link>
    );
  }

  return (
    <header className="w-full bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-12 flex-shrink-0">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {/* Logo */}
          <img
            src="/logo.png"
            alt="Theraptly Logo"
            width={32}
            height={32}
            className="w-8 h-8"
          />
          {/* Logo Text */}
          <span className="text-[#0D25FF] font-bold text-xl tracking-tight">Theraptly</span>
        </div>

        {subtitle && (
          <div className="hidden md:flex items-center">
            <div className="h-6 w-px bg-gray-300 mx-2"></div>
            <span className="text-gray-700 font-medium text-sm md:text-base">{subtitle}</span>
          </div>
        )}
      </div>

      {action && (
        <div>
          {action}
        </div>
      )}
    </header>
  );
};

export default Header;
