import { Menu, Text, UnstyledButton, Group, Avatar, Switch } from '@mantine/core';
import {
  IconPhoto,
  IconMessageCircle,
  IconChevronRight,
  IconUserCircle,
  IconMoonFilled,
  IconSun,
  IconMoonStars,
  IconLogout,
} from '@tabler/icons-react';
import React, { forwardRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { removeUser } from '../Slices/UserSlice';

const ProfileMenu = () => {
  interface UserButtonProps extends React.ComponentPropsWithoutRef<'button'> {
    image: string;
    name: string;
    email: string;
    icon?: React.ReactNode;
  }
  
  const profile = useSelector((state:any)=>state.profile);
  const dispatch=useDispatch();
  const user = useSelector((state:any)=>state.user)
  const [opened, setOpened] = useState(false);
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate()
  
  const handleLogout = () => {
    // Clear the Redux state
    dispatch(removeUser());
  
    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  
    // Navigate to the login page
    navigate("/login");
  };

  const UserButton = forwardRef<HTMLButtonElement, UserButtonProps>(
    ({ image, name, email, icon, ...others }: UserButtonProps, ref) => (
      <UnstyledButton
        ref={ref}
        style={{
          padding: 'var(--mantine-spacing-xs)',
          color: 'var(--mantine-color-text)',
          borderRadius: 'var(--mantine-radius-sm)',
        }}
        {...others}
      >
        <Group gap="sm">
          <Avatar src={image} radius="0" size="md" />
          <div style={{ flex: 1 }} className="hidden sm:block">
            <Text size="sm" fw={500} truncate>
              {name}
            </Text>
            <Text c="dimmed" size="xs" truncate>
              {email}
            </Text>
          </div>
          {icon || <IconChevronRight size={16} />}
        </Group>
      </UnstyledButton>
    )
  );
  
  return (
    <Menu 
      shadow="md" 
      width={200} 
      withArrow 
      transitionProps={{ transition: 'rotate-right', duration: 300 }} 
      opened={opened} 
      onChange={setOpened}
      position="bottom-end"
    >
      <Menu.Target>
        <UserButton
          image={profile.picture ? `data:image/jpeg;base64,${profile.picture}` : "/avatar-9.png"}
          name={user.name} 
          email={user.email}  
        />
      </Menu.Target>

      <Menu.Dropdown>
      <Menu.Label className='text-md sm:hidden'>{user.name}</Menu.Label>
        <Menu.Label className='sm:hidden'>{user.email}</Menu.Label>
        <Link to="/profile">
          <Menu.Item leftSection={<IconUserCircle size={14} />}>
            Profile
          </Menu.Item>
        </Link>
        <Link to="/message">
          <Menu.Item leftSection={<IconMessageCircle size={14} />}>
          Messages
        </Menu.Item>
        </Link>
      
        <Menu.Item leftSection={<IconPhoto size={14} />}>
          Resume
        </Menu.Item>
        <Menu.Item
          leftSection={<IconMoonFilled size={14} />}
          rightSection={
            <Switch
              checked={checked}
              onChange={(event) => setChecked(event.currentTarget.checked)}
              size="md"
              color="dark.4"
              onLabel={<IconSun size={16} stroke={2.5} color="var(--mantine-color-yellow-4)" />}
              offLabel={<IconMoonStars size={16} stroke={2.5} color="var(--mantine-color-blue-6)" />}
            />
          }
        >
          Dark Mode
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item
          color="red"
          leftSection={<IconLogout size={14} />}
          onClick={handleLogout}
        >
          Log out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

export default ProfileMenu;