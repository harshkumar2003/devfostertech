import Image from "next/image";
import React from "react";
import line from "../Assets/line.svg";
import build from "../Assets/build.svg";
import social from "../Assets/social.svg";
import seo from "../Assets/seo.svg";

const Services = () => {
  return (
    <div className="w-full  py-10 scroll-mt-20 " id="services">
      <div className="flex items-center text-[30px] sm:text-[25px] sm:font-normal font-bold justify-center">
        <h1 className="text-white">Services That Accelerate</h1>
        <div className="flex flex-col items-center sm:ml-1 ml-2 mt-[35px]">
          <h1 className="text-[#6CDDC2]">Digital Growth</h1>
          <Image src={line} className="mt-1" />
        </div>
      </div>
      <div className="flex justify-center items-center p-4">
        <h1 className="text-white text-[20px] text-center">
          From custom websites to strategic SEO and branding, we deliver focused
          digital execution that improves visibility, leads, and conversions.
        </h1>
      </div>
      <div className="sm:grid sm:grid-rows-3 sm:gap-5 sm:justify-center flex justify-evenly mt-8">
        {/* card 1 */}
        <div className="border-2 border-[#6CDDC2] h-[470px] sm:h-[450px] w-[300px] rounded-2xl p-4">
            <h1 className="text-[#6CDDC2] text-center text-[25px]">Website Development</h1>
            <Image src={build} alt='build' className="pt-4" />
            <p className="text-white pt-4">We design and build high-performance websites that are responsive, scalable, and built to convert visitors into customers.</p>
        </div>

        {/* card 2 */}

        <div className="border-2 border-[#6CDDC2] h-[470px] sm:h-[450px] w-[300px] rounded-2xl p-4">
            <h1 className="text-[#6CDDC2] text-center text-[25px]">Social Media Branding</h1>
            <Image src={social} alt='build' className="pt-4" />
            <p className="text-white pt-4">Build a consistent brand identity with professional social creatives, campaign visuals, and platform-ready brand assets.</p>
        </div>

        {/* card 3 */}

        <div className="border-2 border-[#6CDDC2] h-[470px] sm:h-[450px] w-[300px] rounded-2xl p-4">
            <h1 className="text-[#6CDDC2] text-center text-[25px]">SEO Services</h1>
            <Image src={seo} alt='build' className="pt-4" />
            <p className="text-white pt-4">Grow organic traffic with technical SEO, content optimization, and on-page strategy aligned with your business goals.</p>
        </div>

      </div>
    </div>
  );
};

export default Services;
