import Image from "next/image";
import React from "react";
import nifse from '../Assets/nifse.svg'
import heera from '../Assets/heera.svg'

const Work = () => {

 
  return (
    <div id="work" className=" w-full py-20 scroll-mt-20 ">
      <div className="">
        <h1 className="text-[#6CDDC2] text-[25px] text-center">Our Work</h1>
        <div className="flex justify-center items-center">
          <p className="text-white px-20 sm:px-10 mt-2 text-center">
            At Dev Foster Tech, we pride ourselves on delivering exceptional IT
            solutions that drive business success. Explore our portfolio to see
            how we've helped clients achieve their digital goals through
            innovative website design, effective SEO strategies, and impactful
            social media branding.
          </p>
        </div>
      </div>
      <div className="mt-4 p-6 sm:grid sm:grid-rows-2 flex sm:justify-center justify-evenly gap-[10px]">
        {/* nifse */}
        <div className="flex flex-col justify-center">
            <Image src={nifse} alt="nifse" className="sm:w-auto w-[500px]"/>
            <h1 className="text-white text-center pt-4 text-[25px]">NIFSE Gorakhpur</h1>
        </div>

        {/* heera health */}
        <div className="">
            <Image src={heera} alt="heera health care" className="sm:w-auto w-[500px]" />
            <h1 className="text-white text-center pt-4 text-[25px]">Heera Health care</h1>
        </div>

      </div>
    </div>
  );
};

export default Work;
