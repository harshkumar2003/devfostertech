import React from 'react'

function Why() {
  return (
    <div id='why' className='w-full py-12 scroll-mt-20  '>

        <div>
            <h1 className='text-[#6CDDC2] text-center text-[25px]  pb-8'>Why Choose Us</h1>
        </div>

        <div className='sm:flex sm:flex-col sm:justify-center gap-8 items-center mt-8 grid grid-cols-3 justify-items-center'>
            <div className='border-2 border-white rounded-2xl w-[210px]  '>
                <p className='text-[#6CDDC2] text-center p-2'>Execution-first team with practical experience in website delivery, SEO implementation, and growth systems.</p>
            </div>

            <div className='border-2 border-white rounded-2xl w-[210px]  '>
                <p className='text-[#6CDDC2] text-center p-2'>Custom strategy for each business model, audience type, and market stage.</p>
            </div>

            <div className='border-2 border-white rounded-2xl w-[210px]  '>
                <p className='text-[#6CDDC2] text-center p-2'>Transparent process, measurable outcomes, and clear communication at every step.</p>
            </div>

            <div className='border-2 border-white rounded-2xl w-[210px]  '>
                <p className='text-[#6CDDC2] text-center p-2'>Long-term support mindset, not one-time project delivery.</p>
            </div>
        </div>
      
    </div>
  )
}

export default Why
