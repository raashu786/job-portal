import { Badge, Button, Divider } from '@mantine/core';
import { IconBriefcase, IconExposure, IconMapPin } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
import ExpCards from './ExpCards';
import CertiCards from './CertiCards';
import { useParams } from 'react-router-dom';
import { getProfile } from '../Services/ProfileService';
import { useSelector } from 'react-redux';

const Profile = (props: any) => {
  const {id}=useParams();
  const [profile , setProfile]= useState<any>({});
  const user = useSelector((state:any)=>state.user);
  useEffect(()=>{
    window.scrollTo(0,0);
    getProfile(id).then((res)=>{
      setProfile(res);
    }).catch((err)=>{
      console.log(err);
    })
  }, [id]);
  return (
    <div>
      <div className="relative">
        <img className="w-full" src="/Profile/banner.jpg" alt="" />
        <img
          className="w-32 sm:w-48 h-32 sm:h-48 -bottom-16 absolute left-4 sm:left-6"
          src={profile?.picture?`data:image/jpeg;base64,${profile?.picture}`:"/avatar-9.png"}
          alt=""
        />
      </div>

      <div className="px-3 mt-20 sm:mt-28">
        <div className="flex justify-between items-center">
          <div className="text-xl sm:text-2xl lg:text-3xl font-bold">{user?.name}</div>
          <Button color="bright-sun.4" variant="light">
            Message
          </Button>
        </div>
        <div className="text-sm sm:text-base lg:text-lg flex gap-1 items-center mt-2">
        <div
                className="h-8 w-8 flex items-center sm-mx:h-6 sm-mx:w-6 justify-center bright-mine-shaft-400 shadow-md bg-mine-shaft-800"
              >
              <IconBriefcase />
              </div>
              <div className='text-md sm-mx:text-sm text-mine-shaft-300 font-bold'>{profile?.jobTitle} </div> &bull; <div className='text-sm text-mine-shaft-400 font-semibold'>{profile?.company} </div>
        </div>
        <div className="text-sm sm:text-sm lg:text-base flex gap-1 items-center text-mine-shaft-300 mt-1">
        <div
                className="h-8 w-8 flex items-center sm-mx:h-6 sm-mx:w-6 justify-center bright-mine-shaft-400 shadow-md bg-mine-shaft-800 text-bright-sun.4"
              >
             <IconMapPin className="h-5 w-5" stroke={1.5} />
              </div>
              <div className='text-sm text-mine-shaft-400 font-semibold'>{profile?.location} </div>
          
        </div>
        <div className="text-sm sm:text-sm lg:text-base flex gap-1 items-center text-mine-shaft-300 mt-1">
          
          <div
                className="h-8 w-8 flex items-center text-bright-sun-400  sm-mx:h-6 sm-mx:w-6 justify-center bright-mine-shaft-400 shadow-md bg-mine-shaft-800"
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
      </div>

      <Divider my="xl" />
      <div>
        <div className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3">About</div>
        <div className="text-xs sm:text-sm lg:text-sm text-mine-shaft-300 text-justify">
        {profile?.about}
        </div>
      </div>

      <Divider my="xl" />
      <div>
        <div className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3">Skills</div>
        <div className="flex flex-wrap gap-2">
          {profile?.skills?.map((skill: any, index: any) => (
            <div
              key={index}
             className="text-bright-sun-400 shadow-md bg-mine-shaft-800 text-xs sm:text-xs lg:text-xs px-3 py-1"
            >
              {skill}
            </div>
          ))}
        </div>
      </div>

      <Divider my="xl" />
      <div>
        <div className="text-lg sm:text-xl lg:text-2xl font-semibold mb-5">Experience</div>
        <div className="flex flex-col gap-8">
          {profile?.experiances?.map((exp: any, index: any) => (
            <ExpCards key={index} {...exp} />
          ))}
        </div>
      </div>

      <Divider my="xl" />
      <div>
        <div className="text-lg sm:text-xl lg:text-2xl font-semibold mb-5">Certifications</div>
        <div className="flex flex-col gap-8">
          {profile?.certification?.map((certi: any, index: any) => (
            <CertiCards key={index} {...certi} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
