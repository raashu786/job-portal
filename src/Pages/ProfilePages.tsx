import React from 'react'
import Profile from '../Profile/Profile'
import { Link } from 'react-router-dom';
import { Button } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';



const ProfilePages = () => {
  return (
    <div className="min-h-screen bg-mine-shaft-950 font-['Poppins'] p-2">
     
      <div className="mx-auto sm:px-2 lg:px-8">
        <Link className="my-4 inline-block" to="/find-talent">
          <Button
            leftSection={<IconArrowLeft size={20} />}
            color="bright-sun.4"
            variant="light"
          >
            Back
          </Button>
        </Link>

        <div className="flex flex-col lg:flex-row lg:gap-2">
          {/* Profile Section */}
          <div className="w-full mx-auto">
            <Profile />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePages
