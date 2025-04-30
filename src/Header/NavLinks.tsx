import React, { JSX } from 'react';
import { Menu } from '@mantine/core';
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
  
  // Main navigation links
  const links = [
    { name: 'Find Jobs', icon: <IconSearch size={18} />, url: 'find-jobs' },
    { name: 'Find Talent', icon: <IconBriefcase size={18} />, url: 'find-talent' },
    !user ? { name: 'Sign Up', icon: <IconLogin size={18} />, url: 'signup' } : null,
  ].filter(Boolean) as { name: string; icon: JSX.Element; url: string }[];

  // Dropdown menu links (only shown on desktop)
  const dropdownLinks = [
    { name: 'Post Job', icon: <IconUserPlus size={14} />, url: 'post-job/0' },
    { name: 'Posted Jobs', icon: <IconSettings size={14} />, url: 'posted-job/0' },
    { name: 'Job History', icon: <IconHistory size={14} />, url: 'job-history' },
  ];

  // Mobile view styling
  if (mobile) {
    return (
      <nav className="flex flex-col gap-4 py-4" aria-label="Mobile Navigation">
        {links.map(({ name, icon, url }) => {
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

        {/* Mobile dropdown as expanded list */}
        {user && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-mine-shaft-300 px-2 mb-2">Jobs</h3>
            <div className="flex flex-col gap-1">
              {dropdownLinks.map(({ name, icon, url }) => {
                const isActive = location.pathname === `/${url}`;
                return (
                  <Link
                    key={name}
                    to={`/${url}`}
                    onClick={onLinkClick}  // Close drawer when link is clicked
                    className={`flex items-center gap-3 text-lg ${
                      isActive ? 'text-bright-sun-400 font-medium' : 'text-mine-shaft-100'
                    } hover:text-gray-300 p-2 rounded-lg hover:bg-mine-shaft-800`}
                  >
                    {icon}
                    {name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    );
  }

  // Desktop view
  return (
    <nav className="flex items-center gap-2 lg:gap-4 xl:gap-6" aria-label="Main Navigation">
      {links.map(({ name, icon, url }) => {
        const isActive = location.pathname === `/${url}`;
        return (
          <Link
            key={name}
            to={`/${url}`}
            className={`relative flex items-center gap-1 lg:gap-2 group ${
              isActive ? 'text-bright-sun-400' : 'text-mine-shaft-100'
            } hover:text-gray-300 px-2 py-1 rounded transition-colors`}
          >
            <span className="hidden sm:block text-bright-sun-400 p-2 bg-mine-shaft-800">{icon}</span>
            <span className="relative text-sm sm:text-base lg:text-lg font-medium">
              {name}
              <span
                className={`absolute left-0 top-full w-full h-[2px] bg-bright-sun-400 rounded transition-transform duration-300 ${
                  isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-75'
                }`}
              ></span>
            </span>
          </Link>
        );
      })}

      {/* Desktop Dropdown Menu */}
      {user && (
        <Menu 
          shadow="md" 
          width={200} 
          withArrow 
          transitionProps={{ transition: 'rotate-right', duration: 200 }}
          position="bottom"
          offset={10}
        >
          <Menu.Target>
            <div className="relative flex items-center gap-1 lg:gap-2 group cursor-pointer text-mine-shaft-100 hover:text-gray-300 px-2 py-1 rounded transition-colors">
              <span className="hidden sm:block">
                <IconUserPlus size={35} className='text-bright-sun-400 p-2 bg-mine-shaft-800' />
              </span>
              <span className="relative text-sm sm:text-base lg:text-lg font-medium">
                Jobs
                <span className="absolute left-0 top-full w-full h-[2px] bg-bright-sun-400 rounded scale-x-0 group-hover:scale-x-75 transition-transform duration-300"></span>
              </span>
            </div>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>Jobs</Menu.Label>
            {dropdownLinks.map(({ name, icon, url }) => {
              const isActive = location.pathname === `/${url}`;
              return (
                <Menu.Item
                  key={name}
                  component={Link}
                  to={`/${url}`}
                  leftSection={React.cloneElement(icon, { size: 16 })}
                  className={`${isActive ? '!text-bright-sun-400 !bg-mine-shaft-800' : ''} hover:!bg-mine-shaft-800`}
                >
                  {name}
                </Menu.Item>
              );
            })}
          </Menu.Dropdown>
        </Menu>
      )}
    </nav>
  );
};

export default NavLinks;