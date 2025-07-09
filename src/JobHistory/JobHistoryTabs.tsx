import { Tabs } from '@mantine/core';
import JobPagination from './JobPagination';

type JobHistoryTabsProps = {
  activeTab: string;
  handleTabChange: (value: string | null) => void;
  showList: any[]; // You can replace `any` with a proper Job type if you have it
};

const JobHistoryTabs = ({ activeTab, handleTabChange, showList }: JobHistoryTabsProps) => (
  <Tabs value={activeTab} onChange={handleTabChange}>
    <Tabs.List>
      <Tabs.Tab value="APPLIED">Applied</Tabs.Tab>
      <Tabs.Tab value="SAVED">Saved</Tabs.Tab>
      <Tabs.Tab value="OFFERED">Offered</Tabs.Tab>
      <Tabs.Tab value="INTERVIEWING">Interviewing</Tabs.Tab>
    </Tabs.List>
    <Tabs.Panel value={activeTab} className="mt-4">
      <JobPagination jobList={showList} activeTab={activeTab} />
    </Tabs.Panel>
  </Tabs>
);

export default JobHistoryTabs;
