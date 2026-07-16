import React from "react";

interface GreetingProps {
  name: string;
  greeting: string;
}

export const Greeting: React.FC<GreetingProps> = ({ name, greeting }) => {
  return (
    <div className="px-5 pt-6 pb-4">
      <p className="text-xs text-gray-500 font-medium tracking-wide">{greeting}</p>
      <h1 className="text-2xl font-extrabold text-gray-900 mt-1">
        Halo, {name}!
      </h1>
    </div>
  );
};
