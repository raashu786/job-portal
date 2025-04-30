import { ActionIcon, Avatar } from '@mantine/core'
import { IconExternalLink } from '@tabler/icons-react'

import React from 'react'

const CompanyCards = (props:any) => {
  return (
    <div className='bg-mine-shaft-900 p-4 w-full sm:w-92 lg:w-92 flex flex-col gap-4 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-102 hover:shadow-sm hover:shadow-bright-sun-400 hover:translate-y-[-5px]  cursor-pointer'>
    <div className='flex justify-between'>
      <div className='flex gap-2 items-center'>
        <div className='p-2 bg-mine-shaft-800 rounded-lg'>
          <Avatar  size="lg" src={`/Icons/${props.name}.png`} alt="Company Logo" />
        </div>
        <div>
          <div className='font-semibold text-lg'>{props.name}</div>
          <div className='text-xs text-mine-shaft-300'>{props.employees} &#x2022; Employees</div>
        </div>
      </div>
      <ActionIcon  color="bright-sun.4" variant="subtle">
        <IconExternalLink />

      </ActionIcon>
      
    </div>
      
    </div>
  )
}

export default CompanyCards
