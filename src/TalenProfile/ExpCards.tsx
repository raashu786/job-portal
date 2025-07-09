import React from 'react';
import { formatData } from '../Services/Utilities';

const ExpCards = (props: any) => {
  return (
    <div className="flex flex-col gap-3 px-2 sm:px-3 md:px-4">
      <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-0">
        <div className="flex gap-2 items-start sm:items-center">
          <div className="p-2 bg-mine-shaft-800">
            <img className="w-6 sm:w-7 md:w-8" src={`/Icons/${props.company}.png`} alt="Company Logo" />
          </div>
          <div className="flex flex-col">
            <div className="font-bold text-mine-shaft-300 text-sm sm:text-base md:text-lg">{props.title}</div>
            <div className="text-xs sm:text-sm md:text-base text-mine-shaft-300">
              {props.company} &#x2022; {props.location}
              
            </div>
          </div>
        </div>
        <div className="text-xs sm:text-sm md:text-base text-mine-shaft-300">
          {formatData(props.startDate)} - {formatData(props.endDate)}
        </div>
      </div>

      <div className="text-xs sm:text-sm md:text-sm text-mine-shaft-300 text-justify">
        {props.description}
      </div>
    </div>
  );
};

export default ExpCards;
