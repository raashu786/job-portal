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

const AppRoutes = () => {
    const user=useSelector((state:any)=>state.user)
   return <BrowserRouter>
  
    <Header/>
    <Divider size="xs" mx="md" />
   <Routes>
     <Route path="/" element ={<HomePages/>}> </Route>
     <Route path="/find-jobs" element ={<FindJobs/>}> </Route>
     <Route path="/find-talent" element ={<FindTalentsPages/>}> </Route>
     <Route path="/jobs/:id" element ={<JobDescPages/>}> </Route>
     <Route path="/apply-job/:id" element ={<ApplyJobPages/>}> </Route>
     <Route path="/company/:name" element ={<CompanyPage/>}> </Route>
     <Route path="/post-job/:id" element ={<PostJobPages/>}> </Route>
     <Route path="/posted-job/:id" element ={<PostedJobPages/>}> </Route>

     {/* <Route path="/post-job/:id" element ={<ProtectedRoutes allowedRoles={['ACCOUNT']}><PostJobPages/></ProtectedRoutes>}> </Route>
     <Route path="/posted-job/:id" element ={<ProtectedRoutes allowedRoles={['ACCOUNT']}><PostedJobPages/></ProtectedRoutes>}> </Route> */}

     <Route path="/talent-profile/:id" element ={<TalentProfilePage/>}> </Route>
     {/* <Route path="/job-history" element ={<ProtectedRoutes allowedRoles={['ACCOUNT']}><JobHistoryPages/></ProtectedRoutes>}> </Route> */}
     <Route path="/job-history" element ={<JobHistoryPages/>}> </Route>
     <Route path="/signup" element ={<PublicRoutes><SignUpPages /></PublicRoutes>}> </Route>
     {/* <Route path="/signup" element ={<SignUpPages />}> </Route> */}
     <Route path="/login" element={<PublicRoutes><SignUpPages /></PublicRoutes>}></Route>
     <Route path="/profile" element={<ProfilePages />} />
    
   </Routes>
   <Footer/>
   </BrowserRouter>
}
export default AppRoutes
