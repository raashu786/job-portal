import React, { useState } from 'react';
import SearchBar from '../FindTalents/SearchBar';
import Talent from '../FindTalents/Talent';
import { useMediaQuery } from '@mantine/hooks';
import { Button, Collapse, Divider, Transition } from '@mantine/core';

const FindTalentsPages = () => {
  const isMobile = useMediaQuery('(max-width: 640px)');
      const [filterOpen, setFilterOpen] = useState(false);
  return (
     <div className="min-h-screen bg-mine-shaft-950 font-['Poppins']">
           <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                  {isMobile && (
                    <div>
   <div className="flex justify-end">
  <Button
    color="bright-sun.4"
    size="xs"
    variant='outline'
    className="m-2 transition-all duration-300 ease-in-out hover:bg-bright-sun-500 hover:text-white hover:scale-[1.02] whitespace-nowrap border-0"
    onClick={() => setFilterOpen((prev) => !prev)}
  >
    {filterOpen ? 'Close Filters' : 'Open Filters'}
  </Button>
</div>
    
    <Divider size="xs" orientation="horizontal" />
    
    <Transition
      mounted={filterOpen}  
      transition="fade-up"
      duration={300}
      timingFunction="ease-in-out"
    >
      {(styles) => (
        <Collapse 
          in={filterOpen}  
          transitionDuration={300}
          transitionTimingFunction="ease-in-out"
          style={styles} 
        >
          <SearchBar />
        </Collapse>
      )}
    </Transition>
                </div>
                  )}
                  {!isMobile && (
                     <SearchBar />
                  )}
          <Talent />
      </div>
    </div>
  );
};

export default FindTalentsPages;
