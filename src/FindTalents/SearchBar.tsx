import React, { useState } from 'react';
import { Divider, Input, RangeSlider } from '@mantine/core';
import MultiInput from '../FindJobs/MultiInput';
import { searchFields } from '../Data/TalentData';
import {  IconUser } from '@tabler/icons-react';
import { useDispatch } from 'react-redux';
import { updateFilter } from '../Slices/FilterSlice';

const SearchBar = () => {
  const dispatch = useDispatch();
  const [value, setValue] = useState<[number, number]>([0, 50]);
  const [name, setName] = useState('');

  const handleChange = (type: any, event: any) => {
    if (type === "exp") dispatch(updateFilter({ exp: event }));
    else {
      dispatch(updateFilter({ name: event.target.value }));
      setName(event.target.value);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 px-4 py-6 shadow-md">
      {/* Name Input */}
      <div className="flex items-center w-full sm:w-auto sm:flex-1 min-w-[200px]">
        <div className="shadow-md text-bright-sun-400 p-2 bg-mine-shaft-900 mr-2">
          <IconUser size={25} />
        </div>
        <Input
          variant="unstyled"
          value={name}
          placeholder="Talent Name"
          className="[&_input]:!placeholder-mine-shaft-300 w-full"
          onChange={(e) => handleChange("name", e)}
        />
       
      </div>
      
      {/* Only show divider on larger screens */}
      <Divider size="xs" orientation="vertical" className="hidden sm:block h-8 mr-2" />
  
      {/* Dynamic Search Fields */}
      {searchFields.map((item, index) => (
        <React.Fragment key={index}>
          <div className="w-full sm:w-auto sm:flex-1 min-w-[200px]">
            <MultiInput title={item.title} icon={item.icon} options={item.options} />
          </div>
          
          {/* Only show divider on larger screens and not after last item */}
          {index < searchFields.length - 1 && (
            <Divider size="xs" orientation="vertical" className="hidden sm:block h-8 mr-2" />
          )}
        </React.Fragment>
      ))}
  
      {/* Only show divider before experience slider on larger screens */}
      <Divider size="xs" orientation="vertical" className="hidden sm:block h-8 mr-2" />
  
      {/* Experience Range Slider */}
      <div className="w-full sm:w-auto sm:flex-1 min-w-[200px] [&_.mantine-Slider-label]:!translate-y-10">
        <div className="text-sm flex justify-between mb-2 text-white">
          <div>Experience (Years)</div>
          <div>{value[0]} - {value[1]}</div>
        </div>
        <RangeSlider
          onChangeEnd={(e) => handleChange("exp", e)}
          color="bright-sun.4"
          minRange={1}
          size="xs"
          max={50}
          min={0}
          value={value}
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
