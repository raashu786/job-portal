import React, { JSX } from 'react';
import {
  IconSearch,
  IconBriefcase,
  IconUserPlus,
  IconSettings,
  IconHistory,
  IconLogin,
} from '@tabler/icons-react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

interface NavLinksProps {
  mobile?: boolean;
  onLinkClick?: () => void;
}

const NavLinks = ({ mobile = false, onLinkClick }: NavLinksProps) => {
  const location = useLocation();
  const user = useSelector((state: any) => state.user);
  const userType = user?.accountType;

  const mainLinks = [
    userType === 'APPLICANT' && { name: 'Find Jobs', icon: <IconSearch size={18} />, url: 'find-jobs' },
    userType === 'APPLICANT' && { name: 'Job History', icon: <IconHistory size={14} />, url: 'job-history' },
    userType === 'EMPLOYER' &&  { name: 'Find Talent', icon: <IconBriefcase size={18} />, url: 'find-talent' },
    userType === 'EMPLOYER' && { name: 'Post Job', icon: <IconUserPlus size={14} />, url: 'post-job/0' },
    userType === 'EMPLOYER' && { name: 'Posted Jobs', icon: <IconSettings size={14} />, url: 'posted-job/0' },
    
    
    !user && { name: 'Sign Up', icon: <IconLogin size={18} />, url: 'signup' },
  ].filter(Boolean) as { name: string; icon: JSX.Element; url: string }[];

  // Combine all links (including previously dropdown ones)
  const allLinks = mainLinks;

  // Mobile layout
  if (mobile) {
    return (
      <nav className="flex flex-col gap-4 py-4" aria-label="Mobile Navigation">
        {allLinks.map(({ name, icon, url }) => {
          const isActive = location.pathname === `/${url}`;
          return (
            <Link
              key={name}
              to={`/${url}`}
              onClick={onLinkClick}
              className={`flex items-center gap-3 text-xl ${
                isActive ? 'text-bright-sun-400' : 'text-mine-shaft-100'
              } hover:text-gray-300 p-2 rounded-lg hover:bg-mine-shaft-800`}
            >
              {icon}
              {name}
            </Link>
          );
        })}
      </nav>
    );
  }

  // Desktop layout with all icons inline
  return (
    <nav className="flex items-center gap-2 lg:gap-4 xl:gap-6" aria-label="Main Navigation">
      {allLinks.map(({ name, icon, url }) => {
        const isActive = location.pathname === `/${url}`;
        return (
          <Link
            key={name}
            to={`/${url}`}
            className={`relative flex items-center gap-1 lg:gap-2 group ${
              isActive ? 'text-bright-sun-400' : 'text-mine-shaft-100'
            } hover:text-gray-300 px-2 py-1 transition-colors`}
          >
            <span className="hidden sm:block text-bright-sun-400 p-2 bg-mine-shaft-800">
              {icon}
            </span>
            <span className="relative text-sm sm:text-base lg:text-lg font-medium">
              {name}
              <span
                className={`absolute left-0 top-full w-full h-[2px] bg-bright-sun-400 transition-transform duration-300 ${
                  isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-75'
                }`}
              ></span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

export default NavLinks;
