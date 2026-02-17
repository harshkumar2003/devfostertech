import React from 'react'
import hero from '../Assets/hero.svg'
import Image from 'next/image'
import Link from 'next/link'

const Hero = () => {
  return (
    <div id='#top' className='sm:flex sm:flex-col flex justify-around sm:px-0 px-12 py-32 scroll-mt-20 '>
        <div className='sm:pl-7 md:pt-6 lg:pt-6'>
            <p className='text-[#6CDDC2] text-sm tracking-[0.18em] uppercase font-semibold'>Web Development · SEO · Branding</p>
            <h1 className='text-[#6CDDC2] font-bold sm:text-pretty sm:text-[40px] md:text-[40px] lg:text-[40px] text-[75px] text-balance xl:leading-snug 2xl:leading-snug'>Build a Website That Drives Real Business Growth</h1>
            <h2 className='text-white sm:text-pretty sm:text-[25px] md:text-[20px]  lg:text-[20px] pt-4 xl:pt-2 2xl:pt-2 text-[45px] text-balance'>We help startups and businesses scale with fast websites, practical SEO strategy, and high-converting digital branding.</h2>
            <div className='pt-8 md:pt-12 lg:pt-12 flex gap-3 sm:flex-wrap'>
                <a href="#work" className='items-center px-8 py-4 rounded-full font-bold bg-[#6CDDC2] border-2 border-[#6CDDC2] text-black'>View Case Studies</a>
                <Link href="/blog" className='items-center px-8 py-4 rounded-full font-bold border-2 border-[#6CDDC2] text-white'>Read Insights</Link>
            </div>
        </div>

        <div className='flex justify-center justify-items-center '>
            <Image src={hero}  alt='hero image' className='w-[1000px] md:w-[800px] lg:w-[800px] sm:w-auto'/>
        </div>
      
    </div>
  )
}

export default Hero
