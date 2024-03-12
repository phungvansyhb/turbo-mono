import React from 'react'

type Props = {}

export default function Loading({ }: Props) {
    return (
        <div className='absolute z-[9999] flex h-screen w-[calc(100vw_-_10px)] items-center justify-center bg-[#111827] '>
            <div className='flex flex-col items-center justify-center gap-2 px-4 font-[vietfont]'>
                <div className='w-10 h-10 border-primary border-4 animate-bounce '>

                </div>
                <h2 className="text-center text-white text-3xl font-bold mt-6">Chờ xíu</h2>
                <div className=" text-center text-white  text-xl ">Quá trình tải trang có thể tốn một chút thời gian ...</div>
            </div>
        </div >
    )
}