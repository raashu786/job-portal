import React from 'react'
import { work } from '../Data/Data'
import { Avatar } from 'antd'

const Working = () => {
  return (
    <div className="mt-20 xs-mx:mt-5 xs-mx:pb-2 pb-5">
        <div className="text-4xl font-bold text-mine-shaft-100 xs-mx:text-2xl text-center mb-3">
          How it <span className='text-bright-sun-400'>Work</span>
        </div>
      
        <div className='text-lg text-mine-shaft-300 mb-12 text-center xs-mx:text-sm mx-auto w-full sm:w-1/2'>
          Effortless navigate through the process and land your dream job.
        </div>
        
        {/* Section with image and content side by side */}
        <div className='flex flex-col md:flex-row gap-10 px-8 md:px-16 justify-center items-center'>
          
          {/* Left Section: Image and Avatar */}
          <div className='relative w-full md:w-1/2'>
            <div><img className='w-full md:w-[30rem]' src='/Working/Girl.png' alt='girl'></img></div>

            <div className='w-36 right-0 flex flex-col items-center gap-1 xs-mx:py-2 border border-bright-sun-400 py-3 px-1 backdrop-blur-md xs-mx:top-[25%] top-[18%] right-[18%] xs-mx:right-[-5%] absolute'>
              <Avatar className='!h-16 !w-16' src="avatar-8.png" alt="it's me" />
              <div className='text-sm font-semibold text-mine-shaft-200 text-center'>Complete your profile</div>
              <div className='text-xs text-mine-shaft-300'>70% Completed</div>
            </div>
          </div>

          {/* Right Section: Process Steps */}
          <div className='flex flex-col gap-10 w-full md:w-1/2 justify-center'>
            {
              work.map((item, index) => (
                <div key={index} className='flex items-center gap-4'>
                  <div className='bg-bright-sun-400 p-3 xs-mx:p-2'>
                  <img
                       className='h-12 w-12 xs-mx:h-8 xs-mx:w-8'
                       src={`/Working/${item.name.split(" ")[0]}.png`}
                       alt={item.name}
                  />
                  </div>
                  <div>
                    <div className='text-mine-shaft-200 text-xl xs-mx:text-md font-semibold'>{item.name}</div>
                    <div className='text-mine-shaft-300 xs-mx:text-xs'>{item.desc}</div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
    </div>
  )
}

export default Working
