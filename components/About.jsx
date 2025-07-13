import Image from 'next/image'
import React from 'react'
import about from '../Assets/about.svg'

const About = () => {
  return (
    <div id='about' className='w-full py-10 scroll-mt-20 '>
        <div>
            <h1 className='text-[#6CDDC2] text-center text-[25px]'>About Dev Foster Tech</h1>
        </div>

        <div className='sm:flex sm:flex-col sm:justify-normal flex justify-between sm:mt-8 px-8'>
            <div className='sm:flex sm:flex-col justify-center pt-4'>
                <div className='pt-4 border-1 border-transparent px-4'>
                    <h1 className='text-[#6CDDC2] text-center text-[20px]'>Mission</h1>
                    <p className='text-white text-pretty px-12 pt-2'>Our mission is to provide cutting-edge IT solutions that support business success and generate enduring value for our clients.</p>
                </div>
                <div className='pt-4 border-1 border-transparent px-4'>
                    <h1 className='text-[#6CDDC2] text-center text-[20px]'>Vision</h1>
                    <p className='text-white text-pretty px-12 pt-2'>We aim to become the preferred partner for businesses looking to harness technology for advancement and creativity.</p>
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
