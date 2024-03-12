import React from 'react';

function BlankLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className='relative w-full min-h-full m-auto'>
            <div className='min-h-screen grid place-items-center'>
                {children}
            </div>
        </div>
    );
}

export default BlankLayout;
