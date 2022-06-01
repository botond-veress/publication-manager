import React from 'react';
import { Transition } from '@headlessui/react';
import classnames from 'classnames';

interface LoadingProps {
  visible: boolean;
  className?: string;
}

export const Loading = ({ visible, className, children }: React.PropsWithChildren<LoadingProps>) => (
  <Transition
    show={visible}
    enter="transition-opacity duration-300"
    enterFrom="opacity-0"
    enterTo="opacity-100"
    leave="transition-opacity duration-300"
    leaveFrom="opacity-100"
    leaveTo="opacity-0"
    {...{ className, children }}
  />
);

interface LoadingIndicatorProps {
  className?: string;
}

export const LoadingIndicator = ({ className }: React.PropsWithChildren<LoadingIndicatorProps>) => (
  <svg
    className={classnames('block animate-spin', className)}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

interface LoadingMessageProps {
  center?: boolean;
  className?: string;
}

export const LoadingMessage = ({ center, className, children }: React.PropsWithChildren<LoadingMessageProps>) => (
  <div
    className={classnames(
      'flex items-center space-x-2 text-sm font-medium select-none',
      { 'justify-center': center },
      className
    )}
  >
    {children}
  </div>
);

interface LoadingOverlayProps {
  className?: string;
}

export const LoadingOverlay = ({ className, children }: React.PropsWithChildren<LoadingOverlayProps>) => (
  <div className={classnames('flex items-center justify-center bg-opacity-90 bg-white', className)}>{children}</div>
);
