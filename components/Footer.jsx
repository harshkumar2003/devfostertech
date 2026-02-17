import insta from '../Assets/Instagram.svg'
import linke from '../Assets/Linkedin.svg'
import x from '../Assets/x.svg'
import Image from 'next/image'
import Link from 'next/link'

const Footer = () => {
  return (
    <div id='footer' className='border-t-[1px] pt-10'>
      <div>
        <ul className='flex justify-center text-white gap-4 text-[20px]'>
          <li><Link href='/blog'>Blog</Link></li>
          <li><a href='mailto:hello@devfostertech.com'>Support</a></li>
          <li><a href='/#contact'>Contact</a></li>
        </ul>

        <ul className='flex gap-4 justify-center pt-4'>
          <li><a href='https://www.instagram.com/devfostertech' target='_blank' rel='noopener noreferrer'><Image src={insta} alt='Instagram' /></a></li>
          <li><a href='https://x.com' target='_blank' rel='noopener noreferrer'><Image src={x} alt='X' className='w-[50px]' /></a></li>
          <li><a href='https://www.linkedin.com' target='_blank' rel='noopener noreferrer'><Image src={linke} alt='LinkedIn' /></a></li>
        </ul>

        <p className='text-center text-white pt-4 text-[18px]'>© 2026 Dev Foster Tech. All rights reserved.</p>
      </div>
    </div>
  )
}

export default Footer

