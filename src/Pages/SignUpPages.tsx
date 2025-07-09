import { IconAnchor, IconArrowLeft } from '@tabler/icons-react';
import React from 'react';
import SignUp from '../SignUpLogin/SignUp';
import Login from '../SignUpLogin/Login';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@mantine/core';

const SignUpPages = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isSignupPage = location.pathname === '/signup';
  return (
    <div className="min-h-screen  bg-mine-shaft-950 font-['Poppins'] overflow-hidden flex ">
                   
                   <Button
                      onClick={() => navigate("/")}
                      leftSection={<IconArrowLeft size={20} />}
                      color="bright-sun.4"
                      variant="light"
                      className="!absolute left-5 z-10 mt-5"
                    >
                      Home
                    </Button>        
      <div
        className={`w-full h-full xs-mx:hidden  flex flex-col sm:flex-row [&>*]:flex-shrink-0 transition-all ease-in-out duration-1000 ${
          location.pathname === '/signup' ? 'md:-translate-x-1/2' : 'translate-x-0'
        }`}
      >
                    
        {/* Left Side */}
        <div className="w-full md:w-1/2 xs-mx:h-full  flex flex-col items-center justify-center p-5">
          <Login />
        </div>

        {/* Right Side */}
        <div className="w-full md:w-1/2 min-h-screen xs-mx:hidden  bg-mine-shaft-900 flex flex-col items-center justify-center gap-3">
          <div className="flex items-center gap-3">
            <IconAnchor
              className="h-12 w-12 sm-mx:h-10 sm-mx:w-10  md:h-16 md:w-16 text-bright-sun-400 font-bold"
              stroke={2.5}
            />
            <h1 className="text-4xl sm-mx:text-2xl md:text-4xl font-bold tracking-wider text-bright-sun-400">
              AKHSH JOB
            </h1>
          </div>
          <div className="text-lg md:text-xl sm-mx:text-md text-mine-shaft-200 font-semibold text-center">
            Find the job made for you
          </div>
        </div>

        <div className="w-full md:w-1/2 xs-mx:h-full  flex flex-col items-center justify-center p-2">
        <SignUp />
        </div>
       
      </div>
      
      <div className="flex md:hidden w-full min-h-screen items-center justify-center p-5">
        {isSignupPage ? <SignUp /> : <Login />}
      </div>
    </div>

    
  );
};

export default SignUpPages;



