/* eslint-disable jsx-a11y/alt-text */
import { Avatar, TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import React from 'react';

const DreamJobs = () => {
  return (
    <div className="flex flex-col-reverse lg:flex-row items-center lg:px-20 px-6 py-10 gap-10">
      {/* Text Section */}
      <div className="flex flex-col w-full lg:w-[45%] gap-6 text-center lg:text-left">
        <div className="text-3xl md:text-5xl lg:text-6xl font-bold text-mine-shaft-100 [&>span]:text-bright-sun-400">
          Find Your <span>Dream Jobs</span> with US
        </div>
        <div className="text-sm md:text-base lg:text-lg text-mine-shaft-100">
          Good Life begins with good Company. Start exploring thousands of jobs in one place.
        </div>

        <div className="flex flex-wrap gap-3 mt-5 justify-center lg:justify-start">
          <TextInput
            label="Job Title"
            className="flex-1 min-w-[45%] md:min-w-[30%] bg-mine-shaft-900 p-1 px-2 text-mine-shaft-100 [&_input]:text-mine-shaft-100"
            variant="unstyled"
            placeholder="Software Engineer"
          />
          <TextInput
            label="Job Type"
            className="flex-1 min-w-[45%] md:min-w-[30%] bg-mine-shaft-900 p-1 px-2 text-mine-shaft-100 [&_input]:text-mine-shaft-100"
            variant="unstyled"
            placeholder="Full Time"
          />
          <div className="flex items-center justify-center h-15 w-20 bg-bright-sun-400 text-mine-shaft-100  p-2 hover:bg-bright-sun-500 cursor-pointer">
            <IconSearch className="h-[80%] w-[80%]" />
          </div>
        </div>
      </div>

      {/* Image Section */}
      <div className="flex w-full lg:w-[55%] items-center justify-center">
        <div className="w-full md:w-[25rem] lg:w-[30rem] relative">
          <img src="/Boy.png" alt="boy" className="w-full" />

          {/* Overlay: Job Statistics */}
          <div className="absolute -right-5 md:-right-8 lg:-right-10 w-fit border-bright-sun-400 border  p-2 backdrop-blur-md top-[50%]">
            <div className="text-center mb-1 text-xs md:text-sm text-mine-shaft-100">10k+ got job</div>
            <Avatar.Group>
              <Avatar src="avatar-7.png" />
              <Avatar src="avatar-8.png" />
              <Avatar src="avatar-9.png" />
              <Avatar>+9k</Avatar>
            </Avatar.Group>
          </div>

          {/* Overlay: Job Card */}
          <div className="flex flex-col gap-2 items-start absolute -left-5 md:-left-8 lg:-left-10 w-fit border-bright-sun-400 border p-2 backdrop-blur-md top-[27%]">
            <div className="flex gap-2 items-center">
              <div className="h-10 w-10 md:h-12 md:w-12 p-1 bg-mine-shaft-900">
                <img src="/Google.png" alt="Google logo" />
              </div>
              <div className="text-xs md:text-sm text-mine-shaft-100">
                <div>Software Engineer</div>
                <div className="text-mine-shaft">New Delhi</div>
              </div>
            </div>
            <div className="flex gap-4 text-mine-shaft-200 text-xs justify-around">
              <span>1 day ago</span>
              <span>120 Applicants</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DreamJobs;
