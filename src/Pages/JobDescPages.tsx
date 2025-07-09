import { Button } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import JobDesc from '../JobsDesc/JobDesc';
import RecommendedJob from '../JobsDesc/RecommendedJob';
import { getJob } from '../Services/JobService';

const JobDescPages = () => {
  const {id}=useParams();
  const [job,setJob]=useState<any>(null);
  useEffect(()=>{
    window.scrollTo(0,0);
    getJob(id).then((res)=>{
      setJob(res)
    }).catch((err)=>{
      console.log(err);
    })
  }, [id])
  return (
    <div className="min-h-screen bg-mine-shaft-950 font-['Poppins'] p-4">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="flex justify-start mb-4">
          <Link className="inline-block" to="/find-jobs">
            <Button
              leftSection={<IconArrowLeft size={20} />}
              color="bright-sun.4"
              variant="light"
            >
              Back
            </Button>
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-10">
          {/* Left Section (JobDesc) */}
          <div className="lg:w-3/4">
            <div className="flex flex-col gap-5">
              <JobDesc {...job}/>
            </div>
          </div>

          {/* Right Section (RecommendedJob) */}
          <div className="lg:w-1/4 mt-5 lg:mt-0">
            <div className="flex flex-col gap-5">
              <RecommendedJob />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDescPages;
