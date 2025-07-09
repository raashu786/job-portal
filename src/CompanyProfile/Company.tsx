import { Avatar, Divider, Tabs } from '@mantine/core';
import { IconMapPin } from '@tabler/icons-react';
import React from 'react';
import AboutCompany from './AboutCompany';
import CompanyJob from './CompanyJob';
import CompanyEmployees from './CompanyEmployees';

const Company = () => {
  return (
    <div>
      <div className="relative flex flex-col gap-4">
        <img className="rounded-t-2xl w-full" src="/Profile/banner.jpg" alt="Banner" />
        <img
          className="rounded-3xl w-28 sm:w-32 h-28 sm:h-32 p-2 -bottom-12 absolute left-4 sm:left-6 border-4 bg-mine-shaft-950 border-mine-shaft-950"
          src="/Icons/Google.png"
          alt="Google Logo"
        />
      </div>
      <div className="px-4 mt-16 sm:mt-24">
        <div className="flex justify-between items-center">
          <div className="text-xl sm:text-2xl lg:text-3xl font-bold">Google</div>
          <Avatar.Group>
            <Avatar src="avatar-7.png" />
            <Avatar src="avatar-8.png" />
            <Avatar src="avatar-9.png" />
            <Avatar>+10k</Avatar>
          </Avatar.Group>
        </div>
        <div className="text-sm sm:text-base flex gap-1 items-center text-mine-shaft-300 mt-2">
          <IconMapPin className="h-5 w-5" stroke={1.5} />
          New Delhi, India
        </div>
      </div>
      <Divider mx="md" className="my-4" />
      <div>
        <Tabs defaultValue="about">
          {/* Use responsive classes to manage layout */}
          <Tabs.List className="[&_button]:!flex [&_button]:!flex-col [&_button]:!sm:flex-row [&_button]:!gap-2 [&_button]:!text-lg font-semibold [&_button[data-active='true']]:text-bright-sun-400">
            <Tabs.Tab value="about">
              About
            </Tabs.Tab>
            <Tabs.Tab value="job">
              Jobs
            </Tabs.Tab>
            <Tabs.Tab value="employee">
              Employees
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="about" className="mt-4">
           <AboutCompany/>
          </Tabs.Panel>
          <Tabs.Panel value="job" className="mt-4">
            <CompanyJob/>
          </Tabs.Panel>
          <Tabs.Panel value="employee" className="mt-4">
            <CompanyEmployees/>
          </Tabs.Panel>
        </Tabs>
      </div>
    </div>
  );
};

export default Company;
