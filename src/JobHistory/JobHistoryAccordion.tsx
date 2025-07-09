import { Accordion, Group, Text } from '@mantine/core';
import JobPagination from './JobPagination';
import {
  IconAward,
  IconBookmark,
  IconBriefcase,
  IconCalendarEvent,
} from '@tabler/icons-react';

type JobHistoryAccordionProps = {
  activeTab: string;
  handleTabChange: (value: string | null) => void;
  showList: any[];
};

const tabOptions = [
  {
    value: 'APPLIED',
    icon: IconBriefcase,
    description: 'Jobs you applied to',
  },
  {
    value: 'SAVED',
    icon: IconBookmark,
    description: 'Saved for later',
  },
  {
    value: 'OFFERED',
    icon: IconAward,
    description: 'Your job offers',
  },
  {
    value: 'INTERVIEWING',
    icon: IconCalendarEvent,
    description: 'Upcoming interviews',
  },
];

const JobHistoryAccordion = ({
  activeTab,
  handleTabChange,
  showList,
}: JobHistoryAccordionProps) => {
  const items = tabOptions.map((item) => (
    <Accordion.Item value={item.value} key={item.value}>
      <Accordion.Control icon={<item.icon size={20}  color="#FFBD21" />}>
        <Group wrap="nowrap">
          <div>
            <Text color="#FFBD21">{item.value}</Text>
            <Text size="sm" c="dimmed" fw={400}>
              {item.description}
            </Text>
          </div>
        </Group>
      </Accordion.Control>
      <Accordion.Panel>
        <JobPagination jobList={showList} activeTab={item.value} />
      </Accordion.Panel>
    </Accordion.Item>
  ));

  return (
    <Accordion
      variant="contained"
      defaultValue={activeTab}
      onChange={handleTabChange}
      className="block sm:hidden"
    >
      {items}
    </Accordion>
  );
};

export default JobHistoryAccordion;
