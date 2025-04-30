import React from 'react'
import { similar } from '../Data/Company'
import CompanyCards from './CompanyCards'

const SimilarCompanies = () => {
  return (
    <div>
        <div className="text-lg sm:text-xl font-semibold mb-5">Similar Company</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
          {similar.map(
            (companies, index) => index < 6 && <CompanyCards key={index} {...companies} />
          )}
        </div>
      </div>
  )
}

export default SimilarCompanies
