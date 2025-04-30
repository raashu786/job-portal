import { Tabs, Pagination, Box } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import PostedJobsCards from './PostedJobsCards';
import { useMediaQuery } from '@mantine/hooks';

const ITEMS_PER_PAGE = 5;

const PostedJob = (props: any) => {
  const [activeTab, setActiveTab] = useState<string | null>('ACTIVE');
  const [currentPage, setCurrentPage] = useState(1);
 const isMobile = useMediaQuery('(max-width: 640px)');
  useEffect(() => {
    setActiveTab(props.job?.jobStatus || 'ACTIVE');
    setCurrentPage(1);
  }, [props.job]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const getFilteredJobs = () => {
    return props.jobList?.filter((job: any) => job?.jobStatus === activeTab) || [];
  };

  const filteredJobs = getFilteredJobs();
  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const renderTabPanel = () => (
    <div className="flex flex-col gap-5 mt-5">
      {paginatedJobs.map((item: any, index: number) => (
        <PostedJobsCards key={index} {...item} />
      ))}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <Box className="mt-10 flex justify-center">
                    <Pagination
                       total={totalPages}
                       value={currentPage}
                       onChange={setCurrentPage}
                      color="bright-sun.4"
                      radius="md"
                      size={isMobile ? 'sm' : 'md'}
                      withEdges
                      siblings={isMobile ? 0 : 1}
                    />
                  </Box>
         
        </div>
      )}
    </div>
  );
  return (
    <div className="mt-5 w-full">
      <div className="text-2xl font-semibold flex items-center text-white">Jobs</div>
      <Tabs
        autoContrast
        variant="pills"
        className="mt-5"
        value={activeTab}
        onChange={(tab) => setActiveTab(tab)}
      >
        <Tabs.List className="flex flex-wrap justify-between gap-2 bg-mine-shaft-900 p-2 font-medium">
          <Tabs.Tab value="ACTIVE" className="flex-1 text-center px-4 py-2 sm:flex-none">
            Active [{props.jobList?.filter((job: any) => job?.jobStatus === "ACTIVE").length}]
          </Tabs.Tab>
          <Tabs.Tab value="DRAFT" className="flex-1 text-center px-4 py-2 sm:flex-none">
            Draft [{props.jobList?.filter((job: any) => job?.jobStatus === "DRAFT").length}]
          </Tabs.Tab>
          <Tabs.Tab value="CLOSED" className="flex-1 text-center px-4 py-2 sm:flex-none">
            Close [{props.jobList?.filter((job: any) => job?.jobStatus === "CLOSED").length}]
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="ACTIVE" pt="xs">{renderTabPanel()}</Tabs.Panel>
        <Tabs.Panel value="DRAFT" pt="xs">{renderTabPanel()}</Tabs.Panel>
        <Tabs.Panel value="CLOSED" pt="xs">{renderTabPanel()}</Tabs.Panel>
      </Tabs>
    </div>
  );
};
export default PostedJob;
