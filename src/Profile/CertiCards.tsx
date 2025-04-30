import { ActionIcon } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import React from 'react';
import { formatData } from '../Services/Utilities';
import { useDispatch, useSelector } from 'react-redux';
import { SuccessNotification } from '../Services/Notification';
import { changeProfile } from '../Slices/ProfileSlice';

const CertiCards = (props: any) => {
  const profile = useSelector((state: any) => state.profile);
  const dispatch = useDispatch();

  const handleDelete = () => {
    let certi = [...profile.certification];
    certi.splice(props.index, 1);
    let updatedProfile = { ...profile, certification: certi };
    dispatch(changeProfile(updatedProfile));
    SuccessNotification('success', `Certification Deleted successfully`);
  };

  return (
    <div>
      <div className="flex justify-between">
        <div className="flex gap-2 items-center">
          <div className="p-2 bg-mine-shaft-800">
            <img className="w-7" src={`/Icons/${props.issuer}.png`} alt="Company Logo" />
          </div>
          <div className="flex flex-col">
            <div className="font-semibold text-sm sm:text-base md:text-lg">{props.name}</div>
            <div className="text-xs sm:text-sm md:text-base text-mine-shaft-300">{props.issuer}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex flex-col items-end">
            <div className="text-xs sm:text-sm md:text-base text-mine-shaft-300">
              {formatData(props.issueDate)}
            </div>
            <div className="text-xs sm:text-sm md:text-base text-mine-shaft-300">
              ID: {props.certificateId}
            </div>
          </div>
          {props.edit && (
            <ActionIcon color="red.8" variant="subtle" aria-label="Settings" size="lg">
              <IconTrash onClick={handleDelete} className="h-4/5 w-4/5" stroke={1.5} />
            </ActionIcon>
          )}
        </div>
      </div>
    </div>
  );
};

export default CertiCards;
