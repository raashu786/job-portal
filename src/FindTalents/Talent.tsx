import React, { useEffect, useState } from 'react';
import Sort from '../FindJobs/Sort';
import TalentsCards from './TalentsCards';
import { getAllProfile } from '../Services/ProfileService';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Text, Pagination, Skeleton, Box, Divider } from '@mantine/core';
import { IconUserOff } from '@tabler/icons-react';
import { resetFilter } from '../Slices/FilterSlice';
import { resetSort } from '../Slices/SortSlice';
import { useMediaQuery } from '@mantine/hooks';

const Talent = () => {
  const dispatch = useDispatch();
  const [talents, setTalents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const filter = useSelector((state: any) => state.filter);
  const sort = useSelector((state: any) => state.sort);
  const [filteredTalents, setFilteredTalents] = useState<any[]>([]);

  const [activePage, setActivePage] = useState(1);
  const [perPage, setPerPage] = useState(6);

  const isMobile = useMediaQuery('(max-width: 640px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');

  useEffect(() => {
    if (isMobile) setPerPage(4);
    else if (isTablet) setPerPage(6);
    else setPerPage(8);
  }, [isMobile, isTablet]);

  useEffect(() => {
    dispatch(resetFilter());
    dispatch(resetSort());
    setLoading(true);
    getAllProfile()
      .then((res) => {
        setTalents(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (sort === 'Experiance: Low to High') {
      setTalents([...talents].sort((a: any, b: any) => a.totalExp - b.totalExp));
    } else if (sort === 'Experiance: High to Low') {
      setTalents([...talents].sort((a: any, b: any) => b.totalExp - a.totalExp));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort]);

  useEffect(() => {
    let filterTalents = talents;

    if (filter.name) {
      filterTalents = filterTalents.filter((talent: any) =>
        talent.name?.toLowerCase().includes(filter.name.toLowerCase())
      );
    }

    if (filter['Job Title']?.length) {
      filterTalents = filterTalents.filter((talent: any) =>
        filter['Job Title'].some((title: any) =>
          talent.jobTitle?.toLowerCase().includes(title.toLowerCase())
        )
      );
    }

    if (filter['Location']?.length) {
      filterTalents = filterTalents.filter((talent: any) =>
        filter['Location'].some((x: any) =>
          talent.location?.toLowerCase().includes(x.toLowerCase())
        )
      );
    }

    if (filter['Skills']?.length) {
      filterTalents = filterTalents.filter((talent: any) =>
        filter['Skills'].some((skill: any) =>
          talent.skills?.some((talentSkill: any) =>
            talentSkill?.toLowerCase().includes(skill.toLowerCase())
          )
        )
      );
    }

    if (filter.exp?.length) {
      filterTalents = filterTalents.filter(
        (talent: any) =>
          talent.totalExp != null &&
          filter.exp[0] <= talent.totalExp &&
          talent.totalExp <= filter.exp[1]
      );
    }

    setFilteredTalents(filterTalents);
    setActivePage(1);
  }, [filter, talents]);

  const totalPages = Math.ceil(filteredTalents.length / perPage);
  const paginatedTalents = filteredTalents.slice(
    (activePage - 1) * perPage,
    activePage * perPage
  );

  return (
    <div className="p-4">
      <div className="flex flex-row items-center justify-between gap-4">
  <div className="text-xl sm:text-2xl font-semibold whitespace-nowrap">
    🌟 Talents
  </div>
  <div className="w-full sm:w-auto min-w-[80px]">
    <Sort />
  </div>
</div>

      {/* Loading skeleton */}
      {loading ? (
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {Array.from({ length: perPage }).map((_, i) => (
          
                  <div className="bg-mine-shaft-900 shadow-md p-4 w-full max-w-full sm:max-w-sm md:max-w-md lg:max-w-sm flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2 items-center">
                        <Skeleton height={40} width={40} circle />
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
                    <Skeleton height={36} width="50%" />
                    <Skeleton height={36} width="50%" />
                    </div>
                  </div>
                
          ))}
        </div>
      ) : (
        <>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {paginatedTalents.length ? (
              paginatedTalents.map((talent: any, index: any) => (
                <div
                  key={index}
                  className="transition transform hover:-translate-y-1 hover:scale-101 duration-300"
                >
                  <TalentsCards {...talent} />
                </div>
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
                <Text className="text-2xl font-semibold">No Talents Found</Text>
              </Card>
            )}
          </div>

          {filteredTalents.length > perPage && (
            <Box className="mt-10 flex justify-center">
              <Pagination
                value={activePage}
                onChange={setActivePage}
                total={totalPages}
                radius="md"
                size={isMobile ? 'sm' : 'md'}
                withEdges
                siblings={isMobile ? 0 : 1}
                 color='bright-sun.4'
              />
            </Box>
          )}
        </>
      )}
    </div>
  );
};

export default Talent;
