import Image from 'next/image'
import React from 'react'
import about from '../Assets/about.svg'

const About = () => {
  return (
    <div id='about' className='w-full py-10 scroll-mt-20 '>
        <div>
            <h1 className='text-[#6CDDC2] text-center text-[25px]'>About Dev Foster Tech</h1>
            <p className='text-white text-center mt-2 px-8'>We are a growth-focused digital partner helping businesses build, rank, and scale online.</p>
        </div>

        <div className='sm:flex sm:flex-col sm:justify-normal flex justify-between sm:mt-8 px-8'>
            <div className='sm:flex sm:flex-col justify-center pt-4'>
                <div className='pt-4 border-1 border-transparent px-4'>
                    <h1 className='text-[#6CDDC2] text-center text-[20px]'>Mission</h1>
                    <p className='text-white text-pretty px-12 pt-2'>Our mission is to deliver practical web, SEO, and branding solutions that create measurable business outcomes.</p>
                </div>
                <div className='pt-4 border-1 border-transparent px-4'>
                    <h1 className='text-[#6CDDC2] text-center text-[20px]'>Vision</h1>
                    <p className='text-white text-pretty px-12 pt-2'>Our vision is to become the go-to digital growth partner for businesses that value clarity, speed, and execution quality.</p>
                </div>

            </div>
            <div className='sm:mt-4 sm:flex sm:justify-center'>
                <Image src={about} className='sm:w-[300px]  w-[800px]'/>
            </div>
        </div>
      
    </div>
  )
}

export default About
