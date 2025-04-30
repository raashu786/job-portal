import React from 'react'
import { jobList } from '../Data/JobsData'
import JobCards from '../FindJobs/JobCards'

const CompanyJob = () => {
  return (
    <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {
          jobList.map((job, index) => <JobCards key={index} {...job} />)
        }
      </div>
  )
}

export default CompanyJob
