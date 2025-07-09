import { Button } from '@mantine/core';
import React, { useState } from 'react';
import ExpInput from './ExpInput';
import { formatData } from '../Services/Utilities';
import { useDispatch, useSelector } from 'react-redux';
import { changeProfile } from '../Slices/ProfileSlice';
import { SuccessNotification } from '../Services/Notification';
import { IconPencil, IconTrash } from '@tabler/icons-react';

const ExpCards = (props: any) => {
  const [edit, setEdit] = useState(false);
  const profile = useSelector((state: any) => state.profile);
  const dispatch = useDispatch();

  const handleDelete = () => {
    let exp = [...profile.experiances];
    exp.splice(props.index, 1);
    let updatedProfile = { ...profile, experiances: exp };
    dispatch(changeProfile(updatedProfile));
    SuccessNotification('success', `Experience Deleted successfully`);
  };

  return !edit ? (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between">
        <div className="flex gap-2 items-center">
          <div className="p-2 bg-mine-shaft-800">
            <img className="w-7" src={`/Icons/${props.company}.png`} alt="Company Logo" />
          </div>
          <div className="flex flex-col">
            <div className="font-semibold text-sm sm:text-base md:text-lg">{props.title}</div>
            <div className="text-xs sm:text-sm md:text-base text-mine-shaft-300">
              {props.company} &#x2022; {props.location}
            </div>
          </div>
        </div>
        <div className="text-xs sm:text-sm md:text-base text-mine-shaft-300">
          {formatData(props.startDate)} -{' '}
          {props.working ? 'Present' : formatData(props.endDate)}
        </div>
      </div>

      <div className="text-xs sm:text-sm md:text-sm text-mine-shaft-300 text-justify">
        {props.description}
      </div>

      {props.edit && (
        <div className="flex gap-2">
          <Button
            onClick={() => setEdit(true)}
            leftSection={<IconPencil size={14} />}
            color="blue.8"
            variant="outline"
          >
            Edit
          </Button>
          <Button
            color="red.8"
            variant="outline"
            leftSection={<IconTrash size={14} />}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      )}
    </div>
  ) : (
    <ExpInput {...props} add={false} setEdit={setEdit} />
  );
};

export default ExpCards;
