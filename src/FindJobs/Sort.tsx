import { useState } from 'react';
import { Combobox, useCombobox } from '@mantine/core';
import { IconAdjustments } from '@tabler/icons-react';
import { useDispatch } from 'react-redux';
import { updateSort } from '../Slices/SortSlice';

const opt = ['Relevance', 'Most Recent', 'Salary: Low to High', 'Salary: High to Low'];
const talentSort =['Relevance', 'Experiance: Low to High', 'Experiance: High to Low'];

const Sort=(props:any)=> {
  const dispatch=useDispatch()
  const [selectedItem, setSelectedItem] = useState<string | null>('Relevance');
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });
  const options =props.sort=="job"?opt.map((item) => (
    <Combobox.Option className='!text-xs' value={item} key={item}>
      {item}
    </Combobox.Option>
  )):talentSort.map((item)=>(
    <Combobox.Option className='!text-xs' value={item} key={item}>
      {item}
    </Combobox.Option>
  ));
  return (
      <Combobox
        store={combobox}
        transitionProps={{ duration: 200, transition: 'pop' }}
        width={150}
        position="bottom-start"
        withArrow
        onOptionSubmit={(val) => {
          setSelectedItem(val);
          dispatch(updateSort(val));
          combobox.closeDropdown();
        }}
      >
        <Combobox.Target>
          <div onClick={()=>combobox.toggleDropdown()} className='hover:bg-mine-shaft-900 cursor-pointer shadow-md text-bright-sun-400 p-2 bg-mine-shaft-900 content-end self-end xsm-mx:mt-2 flex items-center xs-sm:px-1 xs-sm:py-0 pr-1 px-2 py-1  gap-2 text-sm'>
            {
               selectedItem 
            }<IconAdjustments className='text-bright-sun-400 w-5 h-5' /> 
          </div>
        </Combobox.Target>
        <Combobox.Dropdown>
          <Combobox.Options >{options}</Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>
   
  );
}
export default Sort;