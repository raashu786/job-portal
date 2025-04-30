

import React from 'react';
import DreamJobs from "../LandingPages/DreamJobs";
import Companies from "../LandingPages/Companies";
import JobCategory from "../LandingPages/JobCategory";
import Working from "../LandingPages/Working";
import Testimonial from "../LandingPages/Testimonial";
import Subscribe from "../LandingPages/Subscribe";


const HomePages: React.FC = (): React.ReactElement => {
  return (
    <div className="min-h-[100vh] bg-mine-shaft-950 font-['poppins']">
     
      <DreamJobs/>
      <Companies/>
      <JobCategory/>
      <Working/>
      <Testimonial/>
      <Subscribe/>
      
    </div>
  );
};

export default HomePages;

