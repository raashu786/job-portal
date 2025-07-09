import { IconBookmark, IconBookmarkFilled, IconClockHour3 } from '@tabler/icons-react';
import React from 'react';
import { Text, Divider, Button } from '@mantine/core';
import { Link } from 'react-router-dom';
import { timeAgo } from '../Services/Utilities';
import { useDispatch, useSelector } from 'react-redux';
import { changeProfile } from '../Slices/ProfileSlice';

const JobCards = (props:any) => {
  const profile = useSelector((state:any)=>state.profile);
  const dispatch=useDispatch();
  const handleSaveJob=()=>{
    let savedJobs:any=[...profile.savedJobs];
    if(savedJobs?.includes(props.id)){
      savedJobs=savedJobs?.filter((id:any)=>id!==props.id);
    }else{
      savedJobs=[...savedJobs, props.id];

    }
    let updatedProfile={...profile, savedJobs:savedJobs};
    dispatch(changeProfile(updatedProfile));
  }
  return (
    <div className='
  bg-mine-shaft-900 shadow-md p-2 w-full 
  xs:w-full sm:w-80 md:w-96 lg:w-90 
  flex flex-col gap-4
  transition-all duration-300 ease-in-out 
  transform hover:scale-[1.01] hover:shadow-sm 
  hover:shadow-bright-sun-400 hover:-translate-y-1 
  cursor-pointer
'>
  {/* Header */}
  <div className='flex justify-between items-center flex-wrap gap-2 sm:gap-0'>
    <div className='flex gap-2 items-center'>
      <div className='p-2 bg-mine-shaft-800 shadow-md'>
        <img className='w-6 xs:w-7 sm:w-8' src={`/Icons/${props.company}.png`} alt="Company Logo" />
      </div>
      <div>
        <div className='font-semibold text-white text-sm sm:text-base'>{props.jobTitle}</div>
        <div className='text-xs text-mine-shaft-300'>
          {props.company} • {props.applicants?.length || 0} Applicants
        </div>
      </div>
    </div>
    {profile.savedJobs?.includes(props.id) ? (
      <IconBookmarkFilled
        onClick={handleSaveJob}
        className='text-bright-sun-400 cursor-pointer transition-transform duration-200 hover:scale-110 hover:text-bright-sun-800'
      />
    ) : (
      <IconBookmark
        onClick={handleSaveJob}
        className='text-mine-shaft-300 cursor-pointer transition-transform duration-200 hover:scale-110 hover:text-bright-sun-400'
      />
    )}
  </div>

  {/* Tags */}
  <div className='flex flex-wrap justify-between gap-1 text-xs text-bright-sun-400'>
    <div className='shadow-lg py-1 px-2 bg-mine-shaft-800'>{props.experiences}</div>
    <div className='shadow-lg py-1 px-2 bg-mine-shaft-800'>{props.jobType}</div>
    <div className='shadow-lg py-1 px-2 bg-mine-shaft-800'>{props.location}</div>
  </div>

  {/* Description */}
  <div className='flex-grow'>
    <Text className='!text-xs text-justify text-mine-shaft-300' lineClamp={3}>{props.about}</Text>
  </div>

  <Divider size="xs" color='mine-shaft.7' />

  {/* Footer */}
  <div className='flex flex-wrap justify-between items-center gap-2'>
    <div className='font-semibold text-mine-shaft-200 text-sm'>&#8377; {props.packageOffered} LPA</div>
    <div className='flex gap-1 text-xs text-mine-shaft-400 items-center'>
      <IconClockHour3 className='h-4 w-4 sm:h-5 sm:w-5' stroke={1.5} />Posted {timeAgo(props.postTime)}
    </div>
  </div>

  {/* CTA Button */}
  <div className='mt-auto'>
    <Link to={`/jobs/${props.id}`}>
      <Button
        color="bright-sun.4"
        size="sm"
        fullWidth
        variant="outline"
        className="w-full transition-all duration-300 hover:bg-bright-sun-500 hover:text-white"
      >
        View Jobs
      </Button>
    </Link>
  </div>
</div>

  );
  
};
export default JobCards;


