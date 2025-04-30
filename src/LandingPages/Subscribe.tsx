import { Button, TextInput } from '@mantine/core'
import React from 'react'

const Subscribe = () => {
  return (
    <div className='mt-20 flex xs-mx:mt-10 flex-col sm:flex-row items-center bg-mine-shaft-900 px-4 sm:px-16 py-6  justify-between mb-20'>
        <div className="text-4xl xs-mx:text-xl sm:text-4xl text-center font-bold text-mine-shaft-100 mb-4 sm:mb-0 w-full sm:w-2/5">
          Never Wants to Miss Any<span className='text-bright-sun-400'>Job News?</span>
        </div>

        <div className='flex gap-1 bg-mine-shaft-700 px-3 border border-bright-sun-400 py-2 items-center w-full sm:w-auto'>
          <TextInput
  className="
    [&_input]:text-mine-shaft-100
    [&_input]:font-semibold
    [&_input]:text-sm
    sm:[&_input]:text-base
    md:[&_input]:text-lg
    lg:[&_input]:text-xl
  "
  variant="unstyled"
  placeholder="Your@mail.com"
/>
          <Button size='lg' className='!bg-bright-sun-400' variant="filled" color="brightSun.4">Subscribe</Button>
        </div>
    </div>
  )
}

export default Subscribe
