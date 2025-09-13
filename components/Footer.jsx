// import React from 'react'
import insta from '../Assets/Instagram.svg'
import linke from '../Assets/Linkedin.svg'
import x from '../Assets/x.svg'
import Image from 'next/image'
import Link from 'next/link'

const Footer = () => {
  return (
    <div id='footer' className=' border-t-[1px] pt-10'>
        <div className=''>
            <ul className='flex justify-center text-white gap-4 text-[20px]'>
                {/* <li><a href="blog">Blog</a></li> */}
                {/* <Link href={`/blog/${post.id}`}> */}
                <li><Link href='blog'>Blog</Link></li>
                <li><a href="#blog">Support</a></li>
                <li><a href="#blog">Terms</a></li>
            </ul>
            <ul className='flex gap-4 justify-center pt-4'>
                <li><a href="https://www.instagram.com/devfostertech" target='_black'> <Image src={insta}/> </a></li>
                <li><a href=""><Image src={x} className='w-[50px]'/></a></li>
                <li><a href=""><Image src={linke}/></a></li>
            </ul>
            <p className="text-center text-white pt-4 text-[18px]">© 2024 Dev Foster Tech, Inc. All rights reserved.</p>

        </div>

      
    </div>
  )
}

export default Footer
