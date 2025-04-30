import React, { useState } from 'react'
import fields from '../Data/Profile'
import { ActionIcon, NumberInput, TextInput } from '@mantine/core';
import { IconBriefcase, IconCheck, IconExposure, IconInbox, IconMapPin, IconPencil, IconPhone, IconPhoneCall, IconRecordMail, IconX } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { useDispatch, useSelector } from 'react-redux';
import   SelectInput from './SelectInput';
import { changeProfile } from '../Slices/ProfileSlice';
import { SuccessNotification } from '../Services/Notification';
const Info = () => {
    const dispatch=useDispatch();
    const select = fields;
    const user = useSelector((state:any)=>state.user);
    const profile = useSelector((state:any)=>state.profile);
    const [edit, setEdit]=useState(false);
    const handleClick=(index:any)=>{
        if(!edit){
            setEdit(true);
            form.setValues({
              name: profile.name?profile.name:user.name || '', 
              jobTitle: profile.jobTitle || '',
              company: profile.company || '',
              location: profile.location || '',
              totalExp: profile.totalExp || 1,
            });
        }else{
            setEdit(false);
        }
    }
    const form = useForm({
        mode: 'controlled',
        initialValues: {name:'', jobTitle: '', company: '',location:'',totalExp:1 },
      });
      const handleSave=()=>{
        setEdit(false);
        let updatedProfile={...profile, ...form.getValues()}
            dispatch(changeProfile(updatedProfile));
            SuccessNotification("success","Profile updated successfully")
      }
  return<>
    <div>
      <div className="flex justify-between items-center">
        <div className="text-xl sm:text-2xl lg:text-3xl font-bold">{profile?.name?profile?.name:user.name}</div>
         <div>
         {edit&&<ActionIcon onClick={handleSave} variant="subtle" color='bright-sun.4' aria-label="Settings" size="lg">
              <div
                className="h-8 w-8 flex items-center sm-mx:h-6 sm-mx:w-6 justify-center bright-mine-shaft-400 shadow-md bg-mine-shaft-800"
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
         </ActionIcon>
        </div>
           </div>
        {
          edit?<><div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-4">
            <TextInput
             label="Name"
             name="name"
             {...form.getInputProps("name")}
             withAsterisk
           />
          <SelectInput form={form} name="jobTitle" {...select[0]} />
          <NumberInput 
        label="Experiance" 
        name='totalExp' 
        {...form.getInputProps("totalExp")} 
        hideControls
        clampBehavior='strict'
        min={1}
        max={50}
        withAsterisk

        />
          
        </div>
       



        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SelectInput form={form} name="location" {...select[2]} />
        <SelectInput form={form} name="company" {...select[1]} />
        
              

        </div></>:<><div className="text-sm sm:text-xs-mx lg:text-lg flex gap-1 items-center mt-2">
               <div
                className="h-8 w-8 flex items-center sm-mx:h-6 sm-mx:w-6 justify-center text-mine-shaft-400 shadow-md bg-mine-shaft-800"
              >
               <IconBriefcase />
              </div>   <div className='text-md sm-mx:text-sm text-mine-shaft-300 font-bold'>{profile?.jobTitle} </div> &bull; <div className='text-sm text-mine-shaft-400 font-semibold'>{profile?.company} </div>
        </div>
        <div className="text-xs sm:text-sm lg:text-sm flex gap-1 items-center text-mine-shaft-300 mt-1">
        <div
                className="h-8 w-8 flex items-center sm-mx:h-6 sm-mx:w-6 justify-center text-mine-shaft-400 shadow-md bg-mine-shaft-800"
              >
              <IconMapPin className="h-5 w-5" stroke={1.5} />
              </div>
          
              <div className='text-sm text-mine-shaft-400 font-semibold'>{profile?.location} </div>
        </div>

        <div className="text-xs sm:text-sm lg:text-sm flex gap-1 items-center text-mine-shaft-300 mt-1">
        <div
                className="h-8 w-8 flex items-center sm-mx:h-6 sm-mx:w-6 justify-center text-mine-shaft-400 shadow-md bg-mine-shaft-800"
              >
               <IconExposure className="h-5 w-5" stroke={1.5} />
              </div>
              <div className='text-sm text-mine-shaft-400 font-semibold'>Experiance </div>
          

          <div
                className="h-8 w-8 flex items-center sm-mx:h-6 text-bright-sun-400 text-sm font-bold sm-mx:w-6 justify-center bright-mine-shaft-400 shadow-md bg-mine-shaft-800"
              >
            {profile?.totalExp}
              </div>
        <div className='text-xs text-mine-shaft-400 font-semibold'>Years</div>
        
        </div>

        <div className="text-xs sm:text-sm lg:text-sm flex gap-1 items-center text-mine-shaft-300 mt-1">
        <div
                className="h-8 w-8 flex items-center sm-mx:h-6 sm-mx:w-6 justify-center text-mine-shaft-400 shadow-md bg-mine-shaft-800"
              >
               <IconRecordMail className="h-5 w-5" stroke={1.5} />
              </div>
              <div className='text-sm text-mine-shaft-400'>{profile?.email}✅ </div>
             
        
        
        </div>
        <div className="text-xs sm:text-sm lg:text-sm flex gap-1 items-center text-mine-shaft-300 mt-1">
        
        <div
                className="h-8 w-8 flex items-center sm-mx:h-6 sm-mx:w-6 justify-center text-mine-shaft-400 shadow-md bg-mine-shaft-800"
              >
               <IconPhoneCall className="h-5 w-5" stroke={1.5} />
              </div>
              <div className='text-sm text-mine-shaft-400'>+91{profile?.mobile}✅ </div>
        
        </div>
        </>
        }
      
    </div>
    </>
}
export default Info
