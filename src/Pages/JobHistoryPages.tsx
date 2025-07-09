import React from 'react'
import JobHistory from '../JobHistory/JobHistory'


const JobHistoryPages = () => {
  return (
    <div className="min-h-screen bg-mine-shaft-950 font-['Poppins']">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:gap-5">
           <JobHistory/>
        </div>
      </div>
    </div>
  )
}
export default JobHistoryPages
