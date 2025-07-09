import React, { useState } from 'react';
import SearchBar from '../FindJobs/SearchBar';
import Jobs from '../FindJobs/Jobs';
import { useMediaQuery } from '@mantine/hooks';
import { Button, Collapse, Divider, Transition } from '@mantine/core';
import { IconMenu2 } from '@tabler/icons-react';
const FindJobs = () => {
   const isMobile = useMediaQuery('(max-width: 640px)');
    const [filterOpen, setFilterOpen] = useState(false);
  return (
    <div className="min-h-screen bg-mine-shaft-950 font-['Poppins']">
       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              {isMobile && (
                <div>
                  <Button
  color="bright-sun.4"
  size="xs"
  m="sm"
  variant="outline"
  className="w-full transition-all duration-300 ease-in-out hover:bg-bright-sun-500 hover:text-white hover:scale-[1.02]"
  onClick={() => setFilterOpen((prev) => !prev)}
  leftSection={<IconMenu2 size={20} />}
>
  {filterOpen ? 'Close Filters' : 'Open Filters'}
</Button>

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
        <Jobs />
      </div>
    </div>
  );
};

export default FindJobs;


