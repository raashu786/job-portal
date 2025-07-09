import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { IconPencil, IconPlus, IconX } from '@tabler/icons-react';
import { ActionIcon } from '@mantine/core';
import ExpCards from './ExpCards';
import ExpInput from './ExpInput';

const Experience = () => {

    const profile = useSelector((state:any)=>state.profile);
        const [edit, setEdit]=useState(false);
        const [addExp, setAddExp] = useState(false);
        const handleClick=()=>{
          setEdit(!edit);    
        }
        
  return (
    <div>
        <div className="text-lg sm:text-xl lg:text-2xl font-semibold mb-5 flex justify-between">Experience
          <div className='flex gap-2'>
          <ActionIcon onClick={()=>setAddExp(true)} color='bright-sun.4' variant="subtle" aria-label="Settings" size="lg">
          <div
                className="h-8 w-8 flex items-center sm-mx:h-6 sm-mx:w-6 justify-center bright-mine-shaft-400 shadow-md bg-mine-shaft-800"
              >
                <IconPlus  className='h-4/5 w-4/5'  />
              </div>
           
         </ActionIcon>
    <div className="flex justify-between items-center">
        <div className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 flex justify-between"></div><div> 
         <ActionIcon onClick={handleClick} variant="subtle" color={edit?"red.4":"bright-sun.4"}aria-label="Settings" size="lg">
            <div className="h-8 w-8 flex items-center sm-mx:h-6 sm-mx:w-6 justify-center bright-mine-shaft-400 shadow-md bg-mine-shaft-800">
            {edit?<IconX  className='h-4/5 w-4/5' stroke={1.5} />:<IconPencil  className='h-4/5 w-4/5' stroke={1.5} />}</div>
         </ActionIcon></div></div>
          </div>
        </div>
        <div className="flex flex-col gap-8">
          {profile?.experiances?.map((exp: any, index: number) => (
            <ExpCards index={index} key={index} {...exp} edit={edit} />
          ))}
          {addExp && <ExpInput add={true} setEdit={setAddExp}/>}
        </div>
      </div>
  )
}
export default Experience
