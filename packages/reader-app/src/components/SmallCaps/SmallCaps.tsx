import React from 'react';
import classnames from 'classnames';

interface Props {
  className?: string;
}

export const SmallCaps: React.FC<React.PropsWithChildren<Props>> = (props) => (
  <div
    {...props}
    className={classnames('tracking-wide uppercase text-gray-400 text-xs font-medium', props.className)}
  />
);
