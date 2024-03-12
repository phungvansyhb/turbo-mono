import { cn } from '~/shared/lib/utils';
import React from 'react';

type Props = {
  title: string,
  className?: string
}
function PageTitle(props: Props) {
  return (
    <h1 className={cn('text-center font-bold tracking-tight text-gray-900  text-4xl sm:text-6xl my-8 lg:my-10', props.className)}>{props.title}</h1>
  );
}

export default PageTitle;
