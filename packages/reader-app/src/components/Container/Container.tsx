import React from 'react';
import classnames from 'classnames';

interface Props {
  className?: string;
}

export const Container = (props: React.PropsWithChildren<Props>) => (
  <div {...props} className={classnames('max-w-7xl mx-auto', props.className)} />
);
