import React from 'react'
import hero from '../Assets/hero.svg'
import Image from 'next/image'

const Hero = () => {
  return (
    <div id='#top' className='sm:flex sm:flex-col flex justify-around sm:px-0 px-12 py-32 scroll-mt-20 '>
        <div className='sm:pl-7 md:pt-6 lg:pt-6'>
            <h1 className='text-[#6CDDC2] font-bold sm:text-pretty sm:text-[40px] md:text-[40px] lg:text-[40px] text-[75px] text-balance xl:leading-snug 2xl:leading-snug'>Fostering Digital Transformation for Business Growth</h1>
            <h1 className='text-white sm:text-pretty sm:text-[25px] md:text-[20px]  lg:text-[20px] pt-4 xl:pt-2 2xl:pt-2 text-[45px] text-balance'>Expert IT services that enable your business to reach new heights.</h1>
            <div className='pt-8 md:pt-12 lg:pt-12'>
                <a href="#work" className='items-center  px-8 py-4   w-[150px] h-[50px]  rounded-full font-bold bg-[#6CDDC2] border-2 border-[#6CDDC2] '>Our Work</a>
            </div>
        </div>

        <div className='flex justify-center justify-items-center '>
            <Image src={hero}  alt='hero image' className='w-[1000px] md:w-[800px] lg:w-[800px] sm:w-auto'/>
        </div>
      
    </div>
  )
}

export default Hero
