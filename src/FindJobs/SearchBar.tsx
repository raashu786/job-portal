import React, { useState } from 'react';
import MultiInput from './MultiInput';
import { dropdownData } from '../Data/JobsData';
import { Divider, RangeSlider } from '@mantine/core';
import { useDispatch } from 'react-redux';
import { updateFilter } from '../Slices/FilterSlice';

const SearchBar = () => {
  const dispatch=useDispatch();
   const [value, setValue] = useState<[number, number]>([0, 300]);
   const handleChange=(event:any)=>{
    dispatch(updateFilter({salary:event}));
   }
    
 
   return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-4 px-4 py-6 shadow-md">
      
      {dropdownData.map((item, index)=>{
        return<React.Fragment key={index}> <div
          
          className="flex-1 mr-2 min-w-[160px] sm:min-w-[200px] md:min-w-[150px]">
          <MultiInput {...item} />
       
        </div>
        <Divider mr="xs" size='xs' orientation='vertical'/></React.Fragment>
      })
    }
  
      <div
        className="flex-1 min-w-[200px] [&_.mantine-Slider-label]:!translate-y-10">
        <div className="text-sm flex justify-between mb-2 text-white">
          <span>Salary</span>
          <span>
            ₹{value[0]} LPA - ₹{value[1]} LPA
          </span>
        </div>
        <RangeSlider
          color="bright-sun.4"
          onChangeEnd={handleChange}
          size="xs"
          value={value}
          minRange={1}
          onChange={setValue}
          labelTransitionProps={{
            transition: 'pop',
            duration: 200,
            timingFunction: 'ease',
          }}
        />
      </div>
    </div>
  );
  
};
export default SearchBar;
