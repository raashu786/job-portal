import React, { useEffect, useState } from 'react';
import Sort from './Sort';
import JobCards from './JobCards';
import { getAllJobs } from '../Services/JobService';
import { useDispatch, useSelector } from 'react-redux';
import { resetFilter } from '../Slices/FilterSlice';
import { IconUserOff } from '@tabler/icons-react';
import { Card, Text, Pagination, Box, Skeleton, Divider, } from '@mantine/core';
import { resetSort } from '../Slices/SortSlice';
import { useMediaQuery } from '@mantine/hooks';

const Jobs = () => {
  const dispatch = useDispatch();
  const [jobList, setJobList] = useState<any>([]);
  const [filteredJobs, setFilteredJobs] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  const [activePage, setActivePage] = useState(1);
  const [jobsPerPage, setJobsPerPage] = useState(8);

  const filter = useSelector((state: any) => state.filter);
  const sort = useSelector((state: any) => state.sort);

  const isMobile = useMediaQuery('(max-width: 640px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');

  useEffect(() => {
    if (isMobile) {
      setJobsPerPage(4);
    } else if (isTablet) {
      setJobsPerPage(6);
    } else {
      setJobsPerPage(8);
    }
  }, [isMobile, isTablet]);

  useEffect(() => {
    dispatch(resetFilter());
    dispatch(resetSort());
    setLoading(true);
    getAllJobs()
      .then((res) => {
        const activeJobs = res.filter((job: any) => job.jobStatus === 'ACTIVE');
        setJobList(activeJobs);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (sort === 'Most Recent') {
      setJobList([...jobList].sort((a: any, b: any) => new Date(b.postTime).getTime() - new Date(a.postTime).getTime()));
    } else if (sort === 'Salary: Low to High') {
      setJobList([...jobList].sort((a: any, b: any) => a.packageOffered - b.packageOffered));
    } else if (sort === 'Salary: High to Low') {
      setJobList([...jobList].sort((a: any, b: any) => b.packageOffered - a.packageOffered));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort]);

  useEffect(() => {
    let filterTJobs = jobList;
    if (filter['Job Title']?.length > 0) {
      filterTJobs = filterTJobs.filter((job: any) =>
        filter['Job Title'].some((title: any) =>
          job.jobTitle.toLowerCase().includes(title.toLowerCase())
        )
      );
    }
    if (filter.Location?.length > 0) {
      filterTJobs = filterTJobs.filter((job: any) =>
        filter.Location.some((x: any) =>
          job.location.toLowerCase().includes(x.toLowerCase())
        )
      );
    }
    if (filter.Experience?.length > 0) {
      filterTJobs = filterTJobs.filter((job: any) =>
        filter.Experience.some((x: any) =>
          job.experiences?.toLowerCase().includes(x.toLowerCase())
        )
      );
    }
    if (filter['Job Type']?.length > 0) {
      filterTJobs = filterTJobs.filter((job: any) =>
        filter['Job Type'].some((x: any) =>
          job.jobType?.toLowerCase().includes(x.toLowerCase())
        )
      );
    }
    if (filter.salary?.length > 0) {
      filterTJobs = filterTJobs.filter((job: any) =>
        filter.salary[0] <= job.packageOffered &&
        job.packageOffered <= filter.salary[1]
      );
    }

    setFilteredJobs(filterTJobs);
    setActivePage(1);
  }, [filter, jobList]);

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const paginatedJobs = filteredJobs.slice(
    (activePage - 1) * jobsPerPage,
    activePage * jobsPerPage
  );

  return (
    <div className="p-2">
      <div className="flex flex-row items-center justify-between gap-4">
      <div className="text-xl sm-mx:text-sm font-semibold whitespace-nowrap">
          🔍 Recommended Jobs
        </div>
        <div className="w-full sm:w-auto min-w-[80px]">
          <Sort sort="job" />
        </div>
      </div>
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {loading ? (
          Array(jobsPerPage).fill(0).map((_, i) => (
             <div className="bg-mine-shaft-900 shadow-md p-4 w-full max-w-full sm:max-w-sm md:max-w-md lg:max-w-sm flex flex-col gap-4">
                                <div className="flex justify-between items-center">
                                  <div className="flex gap-2 items-center">
                                    <Skeleton height={40} width={40} />
                                    <div className="space-y-2">
                                      <Skeleton height={16} width={120} />
                                      <Skeleton height={12} width={180} />
                                    </div>
                                  </div>
                                  <Skeleton height={24} width={24} />
                                </div>
                                <div className="flex gap-2">
                                  <Skeleton height={24} width={60} />
                                  <Skeleton height={24} width={60} />
                                  <Skeleton height={24} width={60} />
                                </div>
                                <div className="space-y-2">
                                  <Skeleton height={12} width="100%" />
                                  <Skeleton height={12} width="90%" />
                                  <Skeleton height={12} width="80%" />
                                </div>
                                <Divider size="xs" color="mine-shaft.7" />
                                <div className="flex justify-between items-center">
                                  <Skeleton height={16} width={80} />
                                  <div className="flex items-center gap-1">
                                    <Skeleton height={20} width={20} circle />
                                    <Skeleton height={12} width={100} />
                                  </div>
                                </div>
                               <div className="flex items-center gap-1">
                                <Skeleton height={36} width="100%" />
                                
                                </div>
                              </div>
          ))
        ) : paginatedJobs.length > 0 ? (
          paginatedJobs.map((job: any, index: number) => (
            <JobCards key={index} {...job} />
          ))
        ) : (
          <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            className="flex flex-col items-center justify-center"
          >
            <IconUserOff size={40} stroke={1.5} color="green" />
            <Text className="text-2xl font-semibold">No Jobs Found</Text>
          </Card>
        )}
      </div>
      {!loading && filteredJobs.length > jobsPerPage && (
        <Box className="mb-20 mt-10 flex justify-center">
          <Pagination
            value={activePage}
            onChange={setActivePage}
            total={totalPages}
            color="bright-sun.4"
            radius="md"
            size={isMobile ? 'sm' : 'md'}
            withEdges
            siblings={isMobile ? 0 : 1}
          />
        </Box>
      )}
    </div>
  );
};

export default Jobs;
