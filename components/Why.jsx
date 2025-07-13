import React from 'react'

function Why() {
  return (
    <div id='why' className='w-full py-12 scroll-mt-20  '>

        <div>
            <h1 className='text-[#6CDDC2] text-center text-[25px]  pb-8'>Why Choose Us</h1>
        </div>

        <div className='sm:flex sm:flex-col sm:justify-center gap-8 items-center mt-8 grid grid-cols-3 justify-items-center'>
            <div className='border-2 border-white rounded-2xl w-[210px]  '>
                <p className='text-[#6CDDC2] text-center p-2'>Our team combines extensive knowledge and hands-on experience to address IT challenges strategically and deliver effective solutions.</p>
            </div>

            <div className='border-2 border-white rounded-2xl w-[210px]  '>
                <p className='text-[#6CDDC2] text-center p-2'>We understand that each business is unique, which is why we create personalized IT strategies tailored to your specific objectives.</p>
            </div>

            <div className='border-2 border-white rounded-2xl w-[210px]  '>
                <p className='text-[#6CDDC2] text-center p-2'>Our primary focus is on delivering solutions that yield tangible benefits for our clients, aiming for measurable improvements.</p>
            </div>

            <div className='border-2 border-white rounded-2xl w-[210px]  '>
                <p className='text-[#6CDDC2] text-center p-2'>We prioritize understanding your business requirements and offering timely, supportive assistance to ensure a productive and positive collaboration.</p>
            </div>
        </div>
      
    </div>
  )
}

export default Why
