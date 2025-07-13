import Image from 'next/image'
import React, { use, useEffect, useRef, useState } from 'react'
import logo from '../Assets/logo.svg'
import close from '../Assets/close.svg'
import menu from '../Assets/menu.svg'

const Navbar = () => {
  const [isScroll, setIsScroll] = useState(false);
  const sideMenuRef = useRef();
  const openMenu = ()=>
  {
    sideMenuRef.current.style.transform = 'translateX(-16rem)'
  }
  const closeMenu = ()=>
    {
      sideMenuRef.current.style.transform = 'translateX(16rem)'
    }

    useEffect(()=>{
      window.addEventListener('scroll',()=>{
        if(window.scrollY > 50)
        {
            setIsScroll(true)

        }
        else
        {
            setIsScroll(false)

        }
      })

    },[])


  return (
    // <div className='py-5 px-5 sm:px-12 sm:py-12'>
    //   <div className='flex'>
    //     <Image src={logo} width={100}  alt='Logo' className='w-[130px] sm:w-auto'/>
    //     {/* <button className='flex items-center gap-2 font-medium py-1 px-3 sm:py-3 '></button> */}
        
    //   </div>
    //   <div>

    //   </div>
    // </div>
    <nav className={`w-full px-7 pt-4 pb-1 md:px-5  flex justify-between items-center fixed z-50 ${isScroll ? "bg-black    shadow-sm " : ""}`}>
        <a href='#top'>
            <Image src={logo} width={100}  alt='Logo' className='w-[130px] md:w-[100px] sm:w-[120px] cursor-pointer'/>
        </a>
        <ul className={`flex space-x-16 md:space-x-12 bg-[#6CDDC2] rounded-full w-[600px] md:w-[500px] h-[50px] items-center p-7 md:p-3 font-medium sm:hidden ${isScroll ? '' : ""}`}>
          <li><a href="#top">Home</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#work">Our Work</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#why">Why Us</a></li>
        </ul>

        <div className='flex items-center md:pl-1 '>
          <a href="#contact" className='text-white sm:hidden px-5 py-5 md:px-3 md:py-3 h-[50px]  rounded-full font-medium bg-black border-2 border-[#6CDDC2] items-center justify-items-center flex'>Contact Us</a>

          <button className='md:hidden lg:hidden xl:hidden 2xl:hidden' onClick={openMenu}>
              <Image src={menu} alt='menu' className='w-6 text-white'/>
          </button>
        </div>


        {/* mobile */}

        <ul ref={sideMenuRef} className='md:hidden lg:hidden xl:hidden 2xl:hidden flex flex-col gap-4 py-20 px-10 fixed -right-64 top-0 bottom-0 w-64 z-50 h-screen bg-[#6CDDC2] transition duration-500'>
          <div className='absolute right-6 top-6' onClick={closeMenu}>
              <Image src={close} alt='' className='w-5 cursor-pointer'/>
          </div>
          <li><a onClick={closeMenu} href="#top">Home</a></li>
          <li><a onClick={closeMenu} href="#services">Services</a></li>
          <li><a onClick={closeMenu} href="#work">Our Work</a></li>
          <li><a onClick={closeMenu} href="#about">About</a></li>
          <li><a onClick={closeMenu} href="#why">Why Us</a></li>
          <div className='flex items-center' >
          <a onClick={closeMenu} href="#contact" className='text-white md:hidden lg:hidden xl:hidden 2xl:hidden px-5 py-5  h-[50px]  rounded-full font-medium bg-black border-2 border-[#6CDDC2] items-center justify-items-center flex'>Contact Us</a>
          </div>
        </ul>
        

    </nav>
  )
}

export default Navbar
