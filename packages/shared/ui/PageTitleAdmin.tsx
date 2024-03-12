import {cn} from '~/shared/lib/utils';
import React from 'react';

type Props = {
  title: string,
  className?: string
}
function PageTitleAdmin(props: Props) {
  return (
    <h1 className={cn('text-center font-bold tracking-tight text-gray-900 text-3xl', props.className)}>{props.title}</h1>
  );
}

export default PageTitleAdmin;
