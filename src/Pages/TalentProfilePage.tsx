import { Button } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Profile from '../TalenProfile/Profile';
import { profile } from '../Data/TalentData';
import RecommendedTalent from '../TalenProfile/RecommendedTalent';
import { getAllProfile } from '../Services/ProfileService';

const TalentProfilePage = () => {
  const navigate =useNavigate();
  const [talents , setTalent]=useState<any[]>([]);
  useEffect(()=>{
    getAllProfile().then((res)=>{
      setTalent(res);
    }).catch((err)=>{
      console.log(err);
    })
  }, [])
  return (
    <div className="min-h-screen bg-mine-shaft-950 font-['Poppins'] p-4">
     
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
          <Button
            leftSection={<IconArrowLeft size={20} />}
            color="bright-sun.4"
            variant="light"
            my="sm"
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
        
        <div className="flex flex-col lg:flex-row lg:gap-5">
          {/* Profile Section */}
          <div className="w-full lg:w-2/3">
            <Profile {...profile} />
          </div>

          {/* Recommended Talent Section */}
          <div className="w-full lg:w-1/3 mt-10 lg:mt-0">
            <RecommendedTalent talents={talents} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TalentProfilePage;
