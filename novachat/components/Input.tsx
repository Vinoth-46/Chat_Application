import React from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className, ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        className={clsx(
          "w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-offset-1 transition-all duration-200 outline-none",
          error
            ? "border-red-500 focus:ring-red-200"
            : "border-gray-300 focus:border-primary-500 focus:ring-primary-200",
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};
