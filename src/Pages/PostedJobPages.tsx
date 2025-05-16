import React, { useEffect, useState } from 'react';
import PostedJob from '../PostedJobs/PostedJob';
import PostedJobDesc from '../PostedJobs/PostedJobDesc';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getJobPostedBy } from '../Services/JobService';
import MobilePostedJobs from '../PostedJobs/MobilePostedJobs';


const PostedJobPages = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = useSelector((state: any) => state.user);
  const [jobList, setJobList] = useState<any[]>([]);
  const [job, setJob] = useState<any>({});

  useEffect(() => {
    window.scrollTo(0, 0);
    getJobPostedBy(user.profileId)
      .then((res) => {
        setJobList(res);
        if (res && res.length > 0 && Number(id) == 0) navigate(`/posted-job/${res[0].id}`);
        setJob(res.find((item: any) => item.id == id));
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  return (
    <div className="min-h-screen bg-mine-shaft-950 font-['Poppins']">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Drawer for mobile view (jobs list) */}
        <MobilePostedJobs job={job} jobList={jobList} />
  
        {/* Mobile View: Full-width Job Description */}
        <div className="block lg:hidden">
          <PostedJobDesc {...job} />
        </div>
  
        {/* Desktop View: Two-column layout */}
        <div className="hidden lg:flex flex-col lg:flex-row lg:gap-4">
          {/* Left Panel: Jobs List */}
          <div className="lg:w-1/3">
            <PostedJob job={job} jobList={jobList} />
          </div>
  
          {/* Right Panel: Job Description */}
          <div className="lg:w-3/4">
            <PostedJobDesc {...job} />
          </div>
        </div>
      </div>
    </div>
  );
}
export default PostedJobPages;
