import React from 'react'
import { talents } from '../Data/TalentData'
import TalentsCards from '../FindTalents/TalentsCards'

const CompanyEmployees = () => {
  return (
    <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
  {talents.map((talent, index) => 
     <TalentsCards key={index} {...talent} />)}
</div>
  )
}

export default CompanyEmployees
