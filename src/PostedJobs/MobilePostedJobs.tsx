import { Drawer, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconMenu2 } from '@tabler/icons-react';
import PostedJob from './PostedJob';

const MobilePostedJobsDrawer = ({ job, jobList }: any) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <div className="lg:hidden flex">
        <Button onClick={open} variant='outline' fullWidth  m="sm" color='bright-sun.4' leftSection={<IconMenu2 size={20} />}>
          Jobs Status
        </Button>
      </div>
      <Drawer
        opened={opened}
        onClose={close}
        title="Jobs Status"
        position="left"
        size="sm"
        overlayProps={{ opacity: 0.55, blur: 3 }}
      >
        <PostedJob job={job} jobList={jobList} />
      </Drawer>
    </>
  );
};

export default MobilePostedJobsDrawer;
