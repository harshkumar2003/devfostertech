// import Image from "next/image";
'use client'
import NavBar from '../components/Navbar'
import Hero from '../components/Hero'
import Services from '../components/Services'
import Work from '../components/Work'
import About from '../components/About'
import Why from '../components/Why'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
export default function Home() {

  return (
    <>

    <NavBar/>
    <Hero/>
    <Services/>
    <Work/>
    <About/>
    <Why/>
    <Contact/>
    <Footer/>


    </>
  );
}
