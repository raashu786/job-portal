import { Button } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import ApplyJobComp from '../ApplyJob/ApplyJobComp';
import { getJob  } from '../Services/JobService';



const ApplyJobPages = () => {
const navigate=useNavigate();
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
        <div className="flex justify-start mb-4">
          <Link className="inline-block" to="/jobs">
            <Button
              leftSection={<IconArrowLeft size={20} />}
              color="bright-sun.4"
              variant="light"
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
          </Link>
        </div>
        <div>
            <ApplyJobComp {...job}/>
        </div>
            
    
           
            </div>
        </div>
      );
}

export default ApplyJobPages
