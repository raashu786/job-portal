// JobHistory.tsx
import { useMediaQuery } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getAllJobs } from '../Services/JobService';
import JobHistoryTabs from './JobHistoryTabs';
import JobHistoryAccordion from './JobHistoryAccordion';
export type ApplicationStatus = 'APPLIED' | 'SAVED' | 'OFFERED' | 'INTERVIEWING';
const allowedTabs: ApplicationStatus[] = ['APPLIED', 'SAVED', 'OFFERED', 'INTERVIEWING'];

const JobHistory = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [activeTab, setActiveTab] = useState<ApplicationStatus>('APPLIED');
  const [jobList, setJobList] = useState<any[]>([]);
  const [showList, setShowList] = useState<any[]>([]);
  const profile = useSelector((state: any) => state.profile);
  const user = useSelector((state: any) => state.user);

  useEffect(() => {
    getAllJobs()
      .then((res) => {
        setJobList(res);
        filterJobs('APPLIED', res);
      })
      .catch(console.error);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filterJobs = (tab: ApplicationStatus, jobs = jobList) => {
    if (tab === 'SAVED') {
      setShowList(jobs.filter((job: any) => profile.savedJobs?.includes(job.id)));
    } else {
      setShowList(jobs.filter((job: any) =>
        job.applicants?.some(
          (applicant: any) =>
            applicant.applicantId === profile.id && applicant.applicationStatus === tab
        )
      ));
    }
  };

  const handleTabChange = (value: string | null) => {
    if (value && allowedTabs.includes(value as ApplicationStatus)) {
      const tab = value as ApplicationStatus;
      setActiveTab(tab);
      filterJobs(tab);
    }
  };

  return (
    <div>
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-5 mt-5">Job History</h2>
      {isMobile ? (
        <JobHistoryAccordion
          activeTab={activeTab}
          handleTabChange={handleTabChange}
          showList={showList}
        />
      ) : (
        <JobHistoryTabs
          activeTab={activeTab}
          handleTabChange={handleTabChange}
          showList={showList}
        />
      )}
    </div>
  );
};

export default JobHistory;