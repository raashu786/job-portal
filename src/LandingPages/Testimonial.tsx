import { Avatar, Rating } from '@mantine/core'
import React from 'react'
import { testimonials } from '../Data/Data'
import { Carousel } from '@mantine/carousel'
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react'

const Testimonial = () => {
  
  return (
    <div className="mt-20 pb-5 xs-mx:mt-10 xs-mx:pb-2">
        <div className="text-4xl font-bold text-mine-shaft-100 xs-mx:text-2xl text-center mb-3">
          What <span className='text-bright-sun-400'>User</span> say about us?
        </div>

        <div className='flex flex-wrap justify-center gap-6'>
          <Carousel 
            slideSize={{ base: '100%', sm: '50%', md: '33%', lg: '22%' }}
            slideGap="md" 
            loop 
            align="start"
            className='focus-visible:[&_button]:!outline-none [&_button]:!bg-bright-sun-400 [&_button]:border-none [&_button]:hover:opacity-75 [&_button]:opacity-0 hover:[&_button]:opacity-100 w-full  mx-auto'
            nextControlIcon={<IconArrowRight className='h-8 w-8' />}
            previousControlIcon={<IconArrowLeft className='h-8 w-8' />}
           
          >
            {testimonials.map((data, index) => (
              <Carousel.Slide key={index}>
                <div className="flex flex-col gap-3 w-full p-3 border border-bright-sun-400 bg-mine-shaft-900 shadow-xl h-full">
                  <div className="flex gap-3 items-center">
                    <Avatar className="!h-16 !w-16" src="avatar-8.png" alt="it's me" />
                    <div>
                      <div className="text-lg text-mine-shaft-100 font-semibold">
                        {data.name}
                      </div>
                      <Rating value={data.rating} fractions={2} readOnly />
                    </div>
                  </div>
                  <div className="text-xs text-mine-shaft-300">{data.testimonial}</div>
                </div>
              </Carousel.Slide>
            ))}
          </Carousel>
        </div>
    </div>
  )
}

export default Testimonial