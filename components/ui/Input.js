'use client';

import { forwardRef } from 'react';

const Input = forwardRef(function Input(
  { label, error, helperText, type = 'text', placeholder, disabled, className = '', ...rest },
  ref
) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full px-3 py-2.5 rounded-lg border text-sm text-gray-900
          placeholder-gray-400 bg-white
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
          transition-colors
          ${error ? 'border-red-400 focus:ring-red-500' : 'border-gray-300'}
          ${className}
        `}
        {...rest}
      />
      {error && (
        <p className="text-xs text-red-500 mt-0.5">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-xs text-gray-400 mt-0.5">{helperText}</p>
      )}
    </div>
  );
});

export default Input;
