import { ActionIcon } from '@mantine/core'
import { IconDeviceFloppy, IconPencil, IconPlus } from '@tabler/icons-react'
import React, { useState } from 'react'
import CertiCards from './CertiCards'
import CertiInput from './CertiInput'
import { useSelector } from 'react-redux'

const Certification = () => {
    const [addCerti, setAddCerti] = useState(false);
    const profile = useSelector((state:any)=>state.profile);
    const [edit , setEdit] = useState(false);
    const handleEdit = () =>{
        setEdit(!edit)
    }
  return (
    <div>
        <div>
        <div className="text-lg sm:text-xl lg:text-2xl font-semibold mb-5 flex justify-between">Certifications<div className='flex gap-2'>

<ActionIcon onClick={()=>setAddCerti(true)} color='bright-sun.4' variant="subtle" aria-label="Settings" size="lg">
<div className="h-8 w-8 flex items-center sm-mx:h-6 sm-mx:w-6 justify-center bright-mine-shaft-400 shadow-md bg-mine-shaft-800">
<IconPlus className='h-4/5 w-4/5'/>
</div>
  
</ActionIcon>
<ActionIcon onClick={handleEdit} color='bright-sun.4' variant="subtle" aria-label="Settings" size="lg">
<div className="h-8 w-8 flex items-center sm-mx:h-6 sm-mx:w-6 justify-center bright-mine-shaft-400 shadow-md bg-mine-shaft-800">
  {edit?  <IconDeviceFloppy className='h-4/5 w-4/5'/>:<IconPencil  className='h-4/5 w-4/5'  />}
</div>
</ActionIcon>
  </div>
</div>
        <div className="flex flex-col gap-8">
          {profile?.certification?.map((certi: any, index: number) => (
            <CertiCards key={index} index={index} edit={edit} {...certi} />
          ))}
          {addCerti && <CertiInput setEdit = {setAddCerti}/>}
        </div>
      </div>
      
    </div>
  )
}

export default Certification
