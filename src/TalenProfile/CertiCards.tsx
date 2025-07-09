import React from 'react';
import { formatData } from '../Services/Utilities';

const CertiCards = (props: any) => {
  return (
    <div className="px-2 sm:px-3 md:px-4">
      <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-0">
        <div className="flex gap-2 items-start sm:items-center">
          <div className="p-2 bg-mine-shaft-800">
            <img className="w-6 sm:w-7 md:w-8" src={`/Icons/${props.issuer}.png`} alt="Company Logo" />
          </div>
          <div className="flex flex-col">
            <div className="font-semibold text-sm sm:text-base md:text-lg">{props.name}</div>
            <div className="text-xs sm:text-sm md:text-sm text-mine-shaft-400 font-bold">{props.issuer}</div>
          </div>
        </div>

        <div className="flex flex-col items-end text-right">
          <div className="text-xs sm:text-sm md:text-sm  text-mine-shaft-400">
            {formatData(props.issueDate)}
          </div>
          <div className="text-xs sm:text-sm md:text-base text-mine-shaft-300">
            <span className='text-bright-sun-400'>ID</span> <span className='text-sm font-semibold text-mine-shaft-300'>{props.certificateId}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertiCards;
