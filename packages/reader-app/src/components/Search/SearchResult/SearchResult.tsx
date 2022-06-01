import React from 'react';
import classnames from 'classnames';

export type AsComponent = keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>;

interface RequiredProps<C extends AsComponent> {
  as: C;
  highlighted?: boolean;
}

type Props<C extends AsComponent> = Omit<React.ComponentProps<C>, keyof RequiredProps<C>> & RequiredProps<C>;

export const SearchResult = React.forwardRef(function SearchResult<C extends AsComponent>(
  { as: Component, highlighted, ...props }: React.PropsWithChildren<Props<C>>,
  ref: React.Ref<any>
) {
  return (
    // @ts-ignore
    <Component
      {...props}
      {...{ ref: ref as any }}
      className={classnames(
        'px-3 py-2 flex space-x-2 cursor-pointer hover:bg-gray-100',
        { 'bg-gray-100': highlighted },
        props.className
      )}
    />
  );
}) as <C extends AsComponent>(p: Props<C> & { ref?: React.Ref<C> }) => React.ReactElement;
