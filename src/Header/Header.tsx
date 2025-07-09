import { IconAnchor, IconLogout } from '@tabler/icons-react';
import NavLinks from './NavLinks';
import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ProfileMenu from './ProfileMenu';
import { useDispatch, useSelector } from 'react-redux';
import { setProfile } from '../Slices/ProfileSlice';
import { getProfile } from '../Services/ProfileService';
import NotificationMenu from './NotificationMenu';
import { jwtDecode } from 'jwt-decode';
import { removeUser, setUser } from '../Slices/UserSlice';
import { setupResponseInterceptor } from '../Interceptor/AxiosInterceptor';
import { navigateToLogin } from '../Services/AuthService';
import { Burger, Drawer } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

const Header = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);
  const token = useSelector((state: any) => state.jwt);
  const isActive = location.pathname === `/login`;
  const navigate = useNavigate();

  useEffect(() => {
    setupResponseInterceptor(navigate);
  }, [navigate]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken && storedToken.trim() !== "") {
      try {
        const decoded = jwtDecode(storedToken);
        dispatch(setUser({ ...decoded, email: decoded.sub }));
      } catch (error) {
        console.error("Invalid token, redirecting to login:", error);
        navigateToLogin(navigate); 
      }
    } else {
      dispatch(removeUser());
    }
  }, [dispatch, navigate]);
  

  useEffect(() => {
    if (user?.profileId) {
      getProfile(user.profileId)
        .then((data) => {
          dispatch(setProfile(data));
        })
        .catch((error) => {
          console.error("Error fetching profile:", error);
        });
    }
  }, [user, dispatch]);
  

  return (
    (location.pathname!='/signup' && location.pathname!='/login')?<header className="w-full bg-mine-shaft-950 text-white flex justify-between items-center px-4 sm:px-6 lg:px-8 py-3 sm:py-4">

      <div className="flex items-center gap-2 sm:gap-3">
        <h1 className="text-xl sm:text-2xl font-bold tracking-wider text-bright-sun-400 flex items-center">
          <IconAnchor className="h-8 w-8 sm:h-8 sm:w-8 lg:h-10 lg:w-10 mr-2 text-bright-sun-400 font-bold text-bright-sun-400 p-1 bg-mine-shaft-800" stroke={2.5} />
          <span className="hidden sm:inline">AKHSH JOB</span>
          <span className="sm:hidden text-sm">AKHSH JOB</span>
        </h1>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
          <NotificationMenu />
        {user ? (
          <ProfileMenu />
        ) : (
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <a
            href="/login"
            className={`relative hidden sm:flex items-center gap-1 sm:gap-2 group ${
              isActive ? 'text-bright-sun-400' : 'text-mine-shaft-100'
            } hover:text-gray-300`}
          >
            <IconLogout size={35} className="hidden sm:block text-bright-sun-400 p-2 bg-mine-shaft-800" />
            <span className="relative text-sm sm:text-base font-medium">
              Sign In
            </span>
          </a>
        )}

        <Burger className="block lg:hidden text-bright-sun-400 p-1 ml-2" onClick={open} aria-label="Toggle navigation" />
      </div>

      {/* Mobile Drawer - Simplified */}
      <Drawer
        opened={opened}
        onClose={close}
        position="right"
        size="70%"
        withCloseButton={true} 
        overlayProps={{ opacity: 0.5, blur: 4 }}
        transitionProps={{
          transition: 'slide-left',
          duration: 400,
          timingFunction: 'ease',
        }}
        className="lg:hidden"
        styles={{
          content: {
            backgroundColor: 'rgb(23, 23, 23)',
          },
        }}
      >
        <div className="p-4 h-full flex flex-col">
          {/* NavLinks with close handler */}
          <NavLinks mobile onLinkClick={close} />
          
          {/* Mobile-only sign in link */}
          {!user && (
            <a
              href="/login"
              onClick={close}
              className={`mt-auto mb-4 flex items-center gap-3 text-xl ${
                isActive ? 'text-bright-sun-400' : 'text-mine-shaft-100'
              } hover:text-gray-300 p-3 rounded-lg hover:bg-mine-shaft-800 text-center justify-center`}
            >
              <IconLogout size={20} className='text-bright-sun-400 p-2 bg-mine-shaft-800' />
              Sign In
            </a>
          )}
        </div>
      </Drawer>

      {/* Desktop Navigation - Center */}
      <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2">
        <NavLinks />
      </div>
    </header>:<></>
  );
};

export default Header;