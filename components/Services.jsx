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
        <h1 className="text-white">Nurturing Your</h1>
        <div className="flex flex-col items-center sm:ml-1 ml-2 mt-[35px]">
          <h1 className="text-[#6CDDC2]">Digital Growth</h1>
          <Image src={line} className="mt-1" />
        </div>
      </div>
      <div className="flex justify-center items-center p-4">
        <h1 className="text-white text-[20px] text-center">
          Collaborate with us to leverage cutting-edge IT solutions that support
          your company's expansion. Our customized services are crafted to steer
          your digital transformation and drive success.
        </h1>
      </div>
      <div className="sm:grid sm:grid-rows-3 sm:gap-5 sm:justify-center flex justify-evenly mt-8">
        {/* card 1 */}
        <div className="border-2 border-[#6CDDC2] h-[470px] sm:h-[450px] w-[300px] rounded-2xl p-4">
            <h1 className="text-[#6CDDC2] text-center text-[25px]">Build Website</h1>
            <Image src={build} alt='build' className="pt-4" />
            <p className="text-white pt-4">Crafting custom, user-friendly websites designed to elevate your brand and enhance your online presence. Our expert team ensures your website is visually appealing, responsive, and tailored to your business needs.</p>
        </div>

        {/* card 2 */}

        <div className="border-2 border-[#6CDDC2] h-[470px] sm:h-[450px] w-[300px] rounded-2xl p-4">
            <h1 className="text-[#6CDDC2] text-center text-[25px]">Social Media Branding</h1>
            <Image src={social} alt='build' className="pt-4" />
            <p className="text-white pt-4">Engage your audience with professional social media branding services. From custom Instagram posts to stunning logos, we create compelling visuals that build your brand identity and attract followers.</p>
        </div>

        {/* card 3 */}

        <div className="border-2 border-[#6CDDC2] h-[470px] sm:h-[450px] w-[300px] rounded-2xl p-4">
            <h1 className="text-[#6CDDC2] text-center text-[25px]">SEO</h1>
            <Image src={seo} alt='build' className="pt-4" />
            <p className="text-white pt-4">Boost your online visibility with our expert SEO services. We implement effective strategies to improve your search engine rankings, drive organic traffic, and increase your online presence, ensuring your business stands out.</p>
        </div>

      </div>
    </div>
  );
};

export default Services;
