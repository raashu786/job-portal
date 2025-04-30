import React, { useEffect, useState } from 'react'
import JobCards from '../FindJobs/JobCards'
import { useParams } from 'react-router-dom';
import { getAllJobs } from '../Services/JobService';

const RecommendedJob = () => {
  const {id}=useParams();
  const [jobList , setJobList]=useState<any>(null);
  useEffect(()=>{
    getAllJobs().then((res) => {
      setJobList(res);
    }).catch((err) => {
      console.log(err);
    });

  },[])

    return (
      <div>
        <div className="text-lg sm:text-xl font-semibold mb-5">Recommended Jobs</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
        {jobList?.map(
  (job: any, index: number) => index < 4 && job.id !== Number(id) && <JobCards key={index} {...job} />
)}
        </div>
      </div>
    );
  };
  

export default RecommendedJob
