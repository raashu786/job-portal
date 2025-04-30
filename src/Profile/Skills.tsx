import { ActionIcon, TagsInput } from '@mantine/core'
import { IconCheck, IconPencil, IconX } from '@tabler/icons-react'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { changeProfile } from '../Slices/ProfileSlice';
import { SuccessNotification } from '../Services/Notification';

const Skills = () => {
    const dispatch=useDispatch();
    const profile = useSelector((state:any)=>state.profile);
        const [skills, setSkills] = useState<string[]>([]);
        const [edit, setEdit]=useState(false);
    const handleClick=(index:any)=>{
          
        if(!edit){
            setEdit(true);
            setSkills(profile.skills);
           
        }else{
            setEdit(false);
            
        }
    }
    const handleSave=()=>{
        setEdit(false);
        let updatedProfile={...profile,skills:skills }
            dispatch(changeProfile(updatedProfile));
            SuccessNotification("success","About updated successfully")
      }

  return (
    <div>
        <div className="flex justify-between items-center">
        <div className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 flex justify-between">Skills </div><div>{edit&&<ActionIcon onClick={handleSave} variant="subtle" color='bright-sun.4' aria-label="Settings" size="lg">
        <div
                className="h-8 w-8 flex items-center sm-mx:h-6 sm-mx:w-6 justify-center text-mine-shaft-400 shadow-md bg-mine-shaft-800"
              >
                <IconCheck  className='h-4/5 w-4/5' stroke={1.5} />
              </div>
           
         </ActionIcon>}
         <ActionIcon onClick={handleClick} variant="subtle" color={edit?"red.4":"bright-sun.4"}aria-label="Settings" size="lg">
         
          
           <div
                className="h-8 w-8 flex items-center sm-mx:h-6 sm-mx:w-6 justify-center bright-mine-shaft-400 shadow-md bg-mine-shaft-800"
              >
               {edit?<IconX  className='h-4/5 w-4/5' stroke={1.5} />:<IconPencil  className='h-4/5 w-4/5' stroke={1.5} />}
              </div>
         </ActionIcon></div></div>
         {
          edit?<><TagsInput    
          placeholder="Add Skills"
          splitChars={[',', ' ', '|']}
          value={skills}
          onChange={setSkills}
        
         /></>:<> <div className="flex flex-wrap gap-2">
         {profile?.skills?.map((skill: any, index: number) => (
         <div
             key={index}
             className="text-bright-sun-400 shadow-md bg-mine-shaft-800 text-xs sm:text-xs lg:text-xs px-3 py-1"
           >
             {skill}  
           </div>  
         ))}
       </div></>
         }
    </div>
  )
}
export default Skills
