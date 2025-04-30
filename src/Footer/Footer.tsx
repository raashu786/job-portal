/* eslint-disable jsx-a11y/anchor-is-valid */
import { 
  IconBrandFacebook, 
  IconBrandInstagram, 
  IconBrandX,
  IconMenu2,
  IconX,
  IconHome,
  IconBriefcase,
  IconUsers,
  IconInfoCircle,
  IconAnchor,
  IconCircleCheck,
} from '@tabler/icons-react';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Collapse, List, ThemeIcon } from '@mantine/core';
import { VisitorCounter } from './VisitorCounter';

const Footer = () => {
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);

  const footerLinks = [
    {
      title: "Quick Links",
      links: ["Home", "Find Jobs", "Companies", "About Us"],
      icon: <IconHome size={20} />
    },
    {
      title: "For Job Seekers",
      links: ["Browse Jobs", "Create Profile", "Job Alerts", "Career Advice"],
      icon: <IconBriefcase size={20} />
    },
    {
      title: "For Employers",
      links: ["Post Jobs", "Candidates", "Pricing", "Help Center"],
      icon: <IconUsers size={20} />
    },
    {
      title: "About Us",
      links: ["Contact Us", "Privacy Policy", "Terms of Service", "FAQ"],
      icon: <IconInfoCircle size={20} />
    }
  ];

  if (location.pathname === "/signup" || location.pathname === "/login") {
    return null;
  }

  return (
    <>
      {/* Desktop/Large Tablet Footer (hidden on mobile) */}
      <footer className="hidden sm:block bg-mine-shaft-950 text-mine-shaft-300 font-['poppins']">
        <div className="container mx-auto px-4 py-4  border-t border-mine-shaft-800 shadow-md">
          <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-6 gap-4 lg:gap-8">
            {/* Brand Info - Full width on mobile, 2 cols on tablet, 2 cols on desktop */}
            <div className="col-span-2 md:col-span-3 lg:col-span-2 space-y-4 lg:space-y-6">
            <h1 className="text-xl sm:text-2xl font-bold tracking-wider text-bright-sun-400 flex items-center">
          <IconAnchor className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 mr-2 text-bright-sun-400 font-bold" stroke={2.5} />
          <span className="hidden sm:inline">AKHSH JOB</span>
          <span className="sm:hidden text-sm">AKHSH JOB</span>
        </h1>
              <p className="text-xs sm:text-sm">
                Job portal with user profiles, skills updates, certification, work experience and admin job postings.
              </p>
              <div className="flex gap-3 lg:gap-4">
                <a href="#" className="text-bright-sun-400 bg-mine-shaft-900 p-2 shadaw-md hover:bg-mine-shaft-700 transition-colors duration-300">
                  <IconBrandFacebook size={18} className="w-4 h-4 lg:w-5 lg:h-5" />
                </a>
                <a href="#" className="text-bright-sun-400 bg-mine-shaft-900 p-2 shadaw-md hover:bg-mine-shaft-700 transition-colors duration-300">
                  <IconBrandInstagram size={18} className="w-4 h-4 lg:w-5 lg:h-5" />
                </a>
                <a href="#" className="text-bright-sun-400 bg-mine-shaft-900 p-2 shadaw-md hover:bg-mine-shaft-700 transition-colors duration-300">
                  <IconBrandX size={18} className="w-4 h-4 lg:w-5 lg:h-5" />
                </a>
              </div>
            </div>

            {/* Footer Links - Responsive columns */}
            {footerLinks.map((item, index) => (
              <div key={index} className="space-y-2 lg:space-y-4">
               <h3 className="text-base flex items-center gap-1 lg:text-lg font-semibold text-bright-sun-400">{item.icon} {item.title}</h3>

             
    <List
      spacing="xs"
      size="sm"
      center
      icon={
        <ThemeIcon color="#635D4F" size={20} radius="0">
          <IconCircleCheck size={16} />
        </ThemeIcon>
      }
    >                  {item.links.map((link, idx) => (
                    <List.Item key={idx}>
                      <a 
                        href="#" 
                        className="text-xs lg:text-sm hover:text-bright-sun-400 transition-colors duration-300 block hover:translate-x-1"
                      >
                        {link}
                      </a>
                      </List.Item>
                  ))}
              </List>
              </div>
            ))}
          </div>
          

          {/* Copyright - Responsive spacing */}
          <div className="border-t border-mine-shaft-700 mt-6 lg:mt-10 pt-3 lg:pt-4 text-xs lg:text-sm flex justify-between items-center px-4">
  <p>&copy; {new Date().getFullYear()} AKHSH JOB. All rights reserved.</p>
  <VisitorCounter targetCount={12453} />
</div>
        </div>
      </footer>

      {/* Mobile Footer (shown only on small devices) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-mine-shaft-900">
        {/* Collapsible Content */}
        <Collapse 
          in={expanded} 
          transitionDuration={300} 
          animateOpacity
          className="shadow-lg"
        >
          <div className="bg-mine-shaft-850 text-mine-shaft-300 p-4 border-t border-mine-shaft-800 max-h-[60vh] overflow-y-auto">
            {/* Mobile Brand Info */}
            <div className="mb-4">
             <h1 className="text-lg font-bold text-bright-sun-400 mb-2">AKHSH JOB</h1>
              <p className="text-xs text-mine-shaft-400 mb-1">
                Job portal with user profiles and job postings.
              </p>
            </div>
            
            {/* Mobile Links - 2 columns */}
            <div className="grid grid-cols-2 gap-4">
              {footerLinks.map((item, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="text-sm font-semibold text-bright-sun-400 flex items-center gap-1">
                    {item.icon}
                    {item.title}
                  </h3>
                  <List
      spacing="xs"
      size="sm"
      center
      icon={
        <ThemeIcon color="bright-sun.4" size={15} radius="0">
          <IconCircleCheck size={10} />
        </ThemeIcon>
      }
    >
                    {item.links.map((link, idx) => (
                      <List.Item key={idx}>
                     <a 
                          href="#" 
                          className="text-xs hover:text-bright-sun-400 transition-colors duration-300"
                        >
                          {link}
                        </a>
                        
                        </List.Item>
                    ))}
                 </List>
                </div>
              ))}
            </div>

            {/* Mobile Copyright */}
            <div className="border-t border-mine-shaft-700 mt-6 flex  text-xs justify-between items-center px-4">
  <p className='text-xs'>&copy; {new Date().getFullYear()} AKHSH JOB</p>
  <VisitorCounter targetCount={12453} />
</div>
          </div>
        </Collapse>

        {/* Mobile Footer Trigger Bar */}
        <div className="bg-mine-shaft-950 p-2 flex justify-around items-center border-t border-mine-shaft-800">
          <a href="#" className="text-bright-sun-400 p-2 bg-mine-shaft-800">
            <IconBrandFacebook size={20} />
          </a>
          <a href="#" className="text-bright-sun-400 p-2 bg-mine-shaft-800">
            <IconBrandInstagram size={20} />
          </a>
          <a href="#" className="text-bright-sun-400 p-2 bg-mine-shaft-800">
            <IconBrandX size={20} />
          </a>
          <button 
            onClick={() => setExpanded(!expanded)}
            className="text-bright-sun-400 p-2  bg-mine-shaft-800 hover:bg-mine-shaft-700 transition-colors"
            aria-label={expanded ? "Close footer" : "Open footer"}
          >
            {expanded ? <IconX size={20} /> : <IconMenu2 size={20} />}
          </button>
        </div>
      </div>
    </>
  );
};
export default Footer;