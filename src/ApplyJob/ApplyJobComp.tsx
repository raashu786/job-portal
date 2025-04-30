import {
  Divider,
} from '@mantine/core';
import ApplicationsForm from './ApplicationsForm';
import { timeAgo } from '../Services/Utilities';

const ApplyJobComp = (props:any) => {
  return (
    <div className="w-full lg:w-2/3 mx-auto p-4">
       
      {/* Header Section */}
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 bg-mine-shaft-800 rounded-xl">
          <img className="w-14" src={`/Icons/${props.company}.png`} alt="Company Logo" />
        </div>
        <div>
          <div className="font-semibold text-lg sm:text-xl lg:text-2xl">
            {props.jobTitle}
          </div>
          <div className="text-sm sm:text-base lg:text-lg text-mine-shaft-300">
            {props.company} • {timeAgo(props.postTime)} • {props.applicants?props.applicants.length:0} Applicants
          </div>
        </div>
      </div>

      <Divider my="xl" />

      {/* Application Form Section */}
      <ApplicationsForm/>
      
    </div>
  );
};
export default ApplyJobComp;
