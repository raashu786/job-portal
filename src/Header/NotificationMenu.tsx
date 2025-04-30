import { Card, Indicator, Menu, Text } from '@mantine/core';
import { IconBell, IconCheck, IconUserOff } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react'
import { Notification } from '@mantine/core';
import { useSelector } from 'react-redux';
import { getNotification, readNotification } from '../Services/NotificationService';
import { useNavigate } from 'react-router-dom';

const NotificationMenu = () => {
  const [opened, setOpened] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const navigate = useNavigate();
  
  const user = useSelector((state: any) => state.user);

  useEffect(() => {
    if (user && user.id) {
      getNotification(user.id)
        .then((res) => {
          setNotifications(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [user?.id]);

  const unread = (index: number) => {
    const notificationId = notifications[index]?.id;
    if (!notificationId) return;

    const updatedNotis = notifications.filter((_, i) => i !== index);
    setNotifications(updatedNotis);

    readNotification(notificationId)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };
 
  return (
    <Menu 
      shadow="md" 
      width={400}
      withArrow 
      transitionProps={{ transition: 'rotate-right', duration: 300 }} 
      opened={opened} 
      onChange={setOpened}
      position="bottom-end"
    >
      <Menu.Target>
        <Indicator 
          disabled={notifications.length <= 0} 
          inline 
          processing 
          color="bright-sun.4" 
          size={8} 
          offset={5}
          className="cursor-pointer"
        >
          <div className="bg-mine-shaft-900 p-2.5 sm:p-2">
            <IconBell
              stroke={2}
              
              size={20}
              className="text-bright-sun-400 hover:text-bright-sun-400 transition-colors"
              title="Notifications"
            />
          </div>
        </Indicator>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Notifications</Menu.Label>
        <Menu.Item>
          <div className='flex flex-col gap-1 max-h-[60vh] w-[365px] overflow-y-auto'>
            {notifications.map((noti:any, index:number) => (
              <Notification 
                key={index} 
                onClick={() => {
                  navigate(noti.route); 
                  setOpened(false); 
                  unread(index);
                }} 
                onClose={() => unread(index)}  
                icon={<IconCheck size={20} />} 
                title={noti.action}
                className="cursor-pointer hover:bg-mine-shaft-800 transition-colors"
              >
                <Text size="sm" lineClamp={2}>
                  {noti.message}
                </Text>
              </Notification>
            ))}

            {notifications.length === 0 && (
              <Card shadow="sm" padding="lg" radius="md" withBorder className="flex flex-col items-center justify-center">
                <IconUserOff size={40} stroke={1.5} color="green" />
                <Text className='text-lg sm:text-xl font-semibold mt-2'>No Notifications</Text>
              </Card>
            )}
          </div>
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

export default NotificationMenu;