import React from 'react';
import { Transition } from '@headlessui/react';
import classnames from 'classnames';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
}

export const SearchMenu = React.forwardRef<HTMLDivElement, React.PropsWithChildren<Props>>(
  ({ isOpen, className, children, ...props }, ref) => (
    <Transition
      show={isOpen}
      as={React.Fragment}
      enter="transition ease-out duration-200"
      enterFrom="opacity-0 translate-y-1"
      enterTo="opacity-100 translate-y-0"
      leave="transition ease-in duration-150"
      leaveFrom="opacity-100 translate-y-0"
      leaveTo="opacity-0 translate-y-1"
    >
      <div className={classnames('absolute top-full right-0 z-10 w-full', className)} {...{ ref }} {...props}>
        <div className="mt-1 overflow-y-auto max-h-[80vh] bg-white text-gray-600 rounded shadow ring-1 ring-black ring-opacity-5 text-sm space-y-1 divide-y divide-solid divide-gray-200">
          {children}
        </div>
      </div>
    </Transition>
  )
);
