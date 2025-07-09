import { Divider } from '@mantine/core'
import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from '../Header/Header'
import FindJobs from './FindJobs'
import FindTalentsPages from './FindTalentsPages'
import JobDescPages from './JobDescPages'
import ApplyJobPages from './ApplyJobPages'
import CompanyPage from './CompanyPage'
import PostJobPages from './PostJobPages'
import PostedJobPages from './PostedJobPages'
import TalentProfilePage from './TalentProfilePage'
import JobHistoryPages from './JobHistoryPages'
import SignUpPages from './SignUpPages'
import ProfilePages from './ProfilePages'
import HomePages from './HomePages'
import Footer from '../Footer/Footer'
import { useSelector } from 'react-redux'
import { ProtectedRoutes } from '../Services/ProtectedRoutes'
import { PublicRoutes } from './PublicRotes'
import Unauthorized from '../Header/Unauthorized'
import NotFound from '../Header/NotFound'
import MessagePage from './MessagePage'

const AppRoutes = () => {
    const user=useSelector((state:any)=>state.user)
   return <BrowserRouter>
  
    <Header/>
    <Divider size="xs" mx="md" />
   <Routes>
     <Route path="/" element ={<HomePages/>}> </Route>
     <Route path="/find-jobs" element ={<ProtectedRoutes allowedRoles={['APPLICANT']}><FindJobs/></ProtectedRoutes>}> </Route>

     <Route path="/jobs/:id" element ={<ProtectedRoutes allowedRoles={['APPLICANT']}><JobDescPages/></ProtectedRoutes>}> </Route>

     <Route path="/apply-job/:id" element ={<ProtectedRoutes allowedRoles={['APPLICANT']}><ApplyJobPages/></ProtectedRoutes>}> </Route>

     <Route path="/company/:name" element ={<ProtectedRoutes allowedRoles={['APPLICANT']}><CompanyPage/></ProtectedRoutes>}> </Route>

     <Route path="/job-history" element ={<ProtectedRoutes allowedRoles={['APPLICANT']}><JobHistoryPages/></ProtectedRoutes>}> </Route>

     <Route path="/find-talent" element ={<ProtectedRoutes allowedRoles={['EMPLOYER']}><FindTalentsPages/></ProtectedRoutes>}> </Route>

     <Route path="/talent-profile/:id" element ={<ProtectedRoutes allowedRoles={['EMPLOYER']}><TalentProfilePage/></ProtectedRoutes>}> </Route>

     <Route path="/post-job/:id" element ={<ProtectedRoutes allowedRoles={['EMPLOYER']}><PostJobPages/></ProtectedRoutes>}> </Route>

     <Route path="/posted-job/:id" element ={<ProtectedRoutes allowedRoles={['EMPLOYER']}><PostedJobPages/></ProtectedRoutes>}> </Route>
     {/* <Route path="/message" element ={<ProtectedRoutes allowedRoles={['APPLICANT']}><MessagePage/></ProtectedRoutes>}> </Route> */}
     <Route path="/message" element={<MessagePage />}></Route>

  
     
 
     <Route path="/signup" element ={<PublicRoutes><SignUpPages /></PublicRoutes>}> </Route>
     <Route path="/login" element={<PublicRoutes><SignUpPages /></PublicRoutes>}></Route>
   
     <Route path="/profile" element={<ProfilePages />} />
     <Route path="/unauthorized" element={<Unauthorized />} />
     <Route path="*" element={<NotFound />} />
    
   </Routes>
   <Footer/>
   </BrowserRouter>
}
export default AppRoutes
