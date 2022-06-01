import React from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/solid';
import classnames from 'classnames';

type ButtonType = 'previous' | 'next';

interface Props {
  type: ButtonType;
  onClick(): void;
}

const iconByType = {
  previous: ArrowLeftIcon,
  next: ArrowRightIcon
};

export const NavigationButton: React.FC<Props> = ({ type, onClick }) => {
  const Icon = iconByType[type];

  return (
    <div
      className={classnames('absolute top-1/2 -translate-y-1/2', {
        'left-0 xl:-translate-x-1/2': type === 'previous',
        'right-0 xl:translate-x-1/2': type === 'next'
      })}
    >
      <button
        className="flex items-center justify-center w-10 h-10 shadow rounded-full bg-white hover:bg-gray-900 hover:text-white xl:w-16 xl:h-16"
        {...{ onClick }}
      >
        <Icon className="w-4 h-4 xl:w-6 xl:h-6" />
      </button>
    </div>
  );
};
