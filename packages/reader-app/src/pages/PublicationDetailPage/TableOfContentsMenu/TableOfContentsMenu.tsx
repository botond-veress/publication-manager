import React from 'react';
import classnames from 'classnames';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/solid';
import { MenuIcon } from '@heroicons/react/outline';

import { PublicationTOCItem } from '@botondveress/publication-core';

interface Props {
  items: PublicationTOCItem[];
  onNavigate(item: PublicationTOCItem): void;
}

export const TableOfContentsMenu: React.FC<Props> = ({ items, onNavigate }) => (
  <Menu as="div" className="relative inline-block text-left">
    <div>
      <Menu.Button className="w-full justify-center px-4 py-2 rounded text-sm font-medium bg-gray-100 bg-opacity-10 text-white hover:bg-gray-900 hover:text-white">
        <div className="hidden items-center sm:flex">
          Table of contents
          <ChevronDownIcon className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <MenuIcon className="-mx-2 h-5 w-5 sm:hidden" />
        </div>
      </Menu.Button>
    </div>

    <Transition
      as={React.Fragment}
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
    >
      <Menu.Items className="absolute right-0 mt-2 w-64 origin-top-right divide-y divide-gray-100 rounded bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className="px-1 py-1 ">
          {items.map((item, index) => (
            <Menu.Item key={index}>
              {({ active }) => (
                <button
                  className={classnames('w-full px-2 py-2 rounded text-sm text-left capitalize', {
                    'bg-gray-800 text-white': active,
                    'bg-white text-gray-800': !active
                  })}
                  onClick={() => onNavigate(item)}
                >
                  <div className="truncate">
                    {index + 1}. {item.title.toLowerCase()}
                  </div>
                </button>
              )}
            </Menu.Item>
          ))}
        </div>
      </Menu.Items>
    </Transition>
  </Menu>
);
