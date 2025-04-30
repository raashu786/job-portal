import { Carousel } from '@mantine/carousel'
import React from 'react'
import { jobCategory } from '../Data/Data'
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react'

const JobCategory = () => {
  return (
    <div className="mt-20 xs-mx:mt-5 xs-mx:pb-2 pb-5">
        <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-mine-shaft-100 text-center xs-mx:mb-5 mb-10">Browse <span className='text-bright-sun-400'>Job</span> Category</div>
      <div className='text-lg text-mine-shaft-300 mb-12 xs-mx:mb-5 text-center w-1/2 xs-mx:w-[400px] mx-auto xs-mx:text-sm'>Explore diverse job opportunities tailored to your skills. Start your career journey today!</div>
      <Carousel slideSize="22%" slideGap="md" loop className='focus-visible:[&_button]:!outline-none [&_button]:!bg-bright-sun-400 [&_button]:border-none  [&_button]:hover:opacity-75 [&_button]:opacity-0 hover:[&_button]:opacity-100'
      nextControlIcon={<IconArrowRight className='h-8 w-8' />}
      previousControlIcon={<IconArrowLeft className='h-8 w-8' />}>
        {
            jobCategory.map((category , index)=><Carousel.Slide>
                <div className='flex flex-col items-center w-64 xs-mx:w-60 gap-2 border border-bright-sun-400 p-5  hover:cursor-pointer hover:shadow-[0_0_5px_2px_black] my-5 transistion duration-300 ease-in-out !shadow-bright-sun-400'>
        <div className='p-2 bg-bright-sun-300 '>
            <img className='h-8 w-8 xs-mx:h-5 xs-mx:w-5'  src={`/Category/${category.name}.png`} alt={category.name}></img>

        </div>
        <div className='text-mine-shaft-100 text-xl xs-mx:text-md font-semibold'>{category.name}</div>
        <div className='text-sm text-mine-shaft-300 xs-mx:text-xs text-center'>{category.desc}</div>
        <div className='text-bright-sun-400 text-lg xs-mx:text-xs' >{category.jobs}+ New Jobs Posted</div>
      </div>

            </Carousel.Slide>)
        }
      
    </Carousel>
      
      
    </div>
  )
}
export default JobCategory
