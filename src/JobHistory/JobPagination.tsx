import { Box, Pagination } from '@mantine/core';
import { useState } from 'react';
import JobHistoryCard from './JobHistoryCard';
import { useMediaQuery } from '@mantine/hooks';

type JobPaginationProps = {
  jobList: any[];  // Replace with a specific Job type if available
  activeTab: string;
};

const JobPagination = ({ jobList, activeTab }: JobPaginationProps) => {
  const itemsPerPage = 4;
  const [page, setPage] = useState(1);
  const startIdx = (page - 1) * itemsPerPage;
  const paginatedList = jobList.slice(startIdx, startIdx + itemsPerPage);
  const isMobile = useMediaQuery('(max-width: 640px)');

  return (
    <>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {paginatedList.map((job, index) => (
          <JobHistoryCard key={index} {...job} {...{ [activeTab.toLowerCase()]: true }} />
        ))}
      </div>
      <div className="flex justify-center mt-6">


  <Box className="mt-10 flex justify-center mb-4">
          <Pagination
           value={page}
            onChange={setPage}
            total={Math.ceil(jobList.length / itemsPerPage)}
            color="bright-sun.4"
            radius="md"
            size={isMobile ? 'sm' : 'md'}
            withEdges
            siblings={isMobile ? 0 : 1}
          />
        </Box>
      </div>
    </>
  );
};

export default JobPagination;
