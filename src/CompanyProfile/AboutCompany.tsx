/* eslint-disable react/jsx-no-target-blank */
import React from 'react'
import { companyData } from '../Data/Company'

const AboutCompany = () => {
    const company :{[key:string]:any}=companyData;
  return (
    <div className="flex flex-col gap-5">
  {Object.keys(company).map((key, index) => 
    key !== "Name" && (
      <div key={index}>
        <div className="text-xl mb-3 font-semibold">{key}</div>
        {key !== "Website" && (
          <div className="text-sm text-mine-shaft-300 text-justify">
            {key !== "Specialties"
              ? company[key]
              : company[key].map((item: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-4">
                    <span className="text-bright-sun-300" >&bull;</span> 
                    <span >{item}</span>
                  </div>
                ))}
          </div>
        )}
        {key === "Website" && (
          <a
            href={company[key]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-bright-sun-300 text-justify"
          >
            {company[key]}
          </a>
        )}
      </div>
    )
  )}
</div>

  )
}

export default AboutCompany
