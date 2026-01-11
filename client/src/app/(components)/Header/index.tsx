import React from 'react';

// Define the types for the component's props
type HeaderProps = {
  name: string;
  subtitle?: string; // Add subtitle as an optional string prop
};

const Header = ({ name, subtitle }: HeaderProps) => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">{name}</h1>
      {/* Conditionally render the subtitle only if it exists */}
      {subtitle && <p className="mt-1 text-md text-gray-500">{subtitle}</p>}
    </div>
  );
};

export default Header;