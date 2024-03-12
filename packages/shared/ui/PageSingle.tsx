import React from 'react';
import {Button, Result} from 'antd';
import Link from 'next/link';
import Loading from './Loading';

interface PageProps {
  isLoading: boolean;
  data: any;
  children: React.ReactNode;
}

function PageSingleton(props: PageProps) {
  if (props.isLoading)
    return (
      <div className='flex h-[100vh] w-full items-center justify-center'>
        <Loading />
      </div>
    );

  if (!props.isLoading && !props.data)
    return (
      <Result
        status='404'
        title='404'
        subTitle="Trang không tìm thấy"
        extra={
          <Button type='primary'>
            <Link href={'/'}>Trở về trang chủ</Link>{' '}
          </Button>
        }
      />
    );
  return props.children;
}

export default PageSingleton;
