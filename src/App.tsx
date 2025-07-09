
import React, { useEffect } from 'react';
import './index.css';
// core styles are required for all packages
import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/tiptap/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import 'leaflet/dist/leaflet.css';

import { createTheme, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import Store from './Store';
import { Provider } from 'react-redux';
import AppRoutes from './Pages/AppRoutes';
import { useChatStore } from './Services/MessageService';





const App: React.FC = () => {
  const { subscribeToOnlineUsers } = useChatStore ();
   useEffect(() => {
      subscribeToOnlineUsers();
   }, []);

  const theme = createTheme({
    primaryColor:'bright-sun',
    fontFamily:"Poppins, sans-serif",
    primaryShade:4,
    focusRing: "never",
    colors: {

      'mine-shaft': ['#f6f6f6','#e7e7e7','#d1d1d1','#b0b0b0','#888888','#6d6d6d','#5d5d5d','#4f4f4f','#454545','#3d3d3d','#2d2d2d'],
       
      'bright-sun': [ '#fffbeb','#fff3c6', '#ffe588','#ffd149', '#ffbd20', '#f99b07','#dd7302', '#b75006', '#943c0c', '#7a330d', '#461902']
     },
     
    })
  return (
    <Provider store={Store}>
    <MantineProvider defaultColorScheme='dark' theme={theme}>
       <Notifications position="top-center" zIndex={1000}/>
      <div className='relative'>
       <AppRoutes/>
      </div>
    </MantineProvider>
    </Provider>
  );
};
export default App;