import React from 'react';
import { SearchIcon, XIcon } from '@heroicons/react/outline';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear(): void;
}

export const SearchInput = React.forwardRef<HTMLInputElement, Props>(({ value, onClear, ...props }, ref) => (
  <div className="relative">
    <SearchIcon className="absolute top-1/2 left-3 w-4 h-full -translate-y-1/2 pointer-events-none" />

    <input {...{ ref, value }} {...props} className="w-full px-9 py-2 rounded text-sm sm:py-4" />

    {!!value && (
      <button
        className="absolute top-1/2 right-0 -translate-y-1/2 inline-flex items-center justify-center w-10 h-full"
        onClick={onClear}
      >
        <XIcon className="w-4 h-4" />
      </button>
    )}
  </div>
));
