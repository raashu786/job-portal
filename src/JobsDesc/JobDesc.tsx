import { ActionIcon, Button, Divider } from '@mantine/core'
import { IconBookmark, IconBookmarkFilled } from '@tabler/icons-react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { card } from '../Data/JobDescData'
import DOMPurify from 'dompurify';
import { timeAgo } from '../Services/Utilities'
import { useDispatch, useSelector } from 'react-redux'
import { changeProfile } from '../Slices/ProfileSlice'
import { postJob } from '../Services/JobService'
import { ErrorNotification, SuccessNotification } from '../Services/Notification'

const JobDesc = (props: any) => {
  const data = DOMPurify.sanitize(props.description);
  const profile = useSelector((state: any) => state.profile);
  const dispatch = useDispatch();
  const [applied, setApplied] = useState(false);
  const user = useSelector((state: any) => state.user);

  const handleSaveJob = () => {
    let savedJobs: any = [...profile.savedJobs];
    if (savedJobs?.includes(props.id)) {
      savedJobs = savedJobs?.filter((id: any) => id !== props.id);
    } else {
      savedJobs = [...savedJobs, props.id];
    }
    let updatedProfile = { ...profile, savedJobs: savedJobs };
    dispatch(changeProfile(updatedProfile));
  }

  useEffect(() => {
    if (props.applicants?.filter((applicant: any) => applicant.applicantId === user.id).length > 0) {
      setApplied(true);
    } else {
      setApplied(false);
    }
  }, [props]);

  const handleClosed = () => {
    postJob({ ...props, jobStatus: "CLOSED" }).then((res) => {
      SuccessNotification("success", "Job Closed Successfully");
    }).catch((err) => {
      ErrorNotification("Error", err.response.data.errorMessage);
    });
  }

  return (
    <div className="w-full">
      {/* Job Header Section */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-mine-shaft-800">
            <img className="w-10 sm:w-14" src={`/Icons/${props.company}.png`} alt="Company Logo" />
          </div>
          <div>
            <div className="font-semibold text-base xs:text-lg sm:text-2xl">{props.jobTitle}</div>
            <div className="text-xs xs:text-sm sm:text-lg text-mine-shaft-300">
              {props.company} • {timeAgo(props.postTime)} • {props.applicants ? props.applicants.length : 0} Applicants
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
  {(props.edit || !applied) && (
    <Link to={props.edit ? `/post-job/${props.id}` : `/apply-job/${props.id}`}>
      <Button
        color={props.edit ? "blue.4" : "darkgreen.4"}
        variant="outline"
        className="px-2 py-1 text-xs xs:text-sm sm:px-4 sm:py-2 whitespace-nowrap"
      >
        {props.closed ? "Reopen" : props.edit ? "Edit" : "Apply"}
      </Button>
    </Link>
  )}

  {(!props.edit || applied) && (
    <Button
      color="green.8"
      variant="outline"
      className="px-2 py-1 text-xs xs:text-sm sm:px-4 sm:py-2 whitespace-nowrap"
    >
      Applied
    </Button>
  )}

  {props.edit && !props.closed ? (
    <Button
      color="red.4"
      onClick={handleClosed}
      variant="outline"
      className="px-2 py-1 text-xs xs:text-sm sm:px-4 sm:py-2 whitespace-nowrap"
    >
      Close
    </Button>
  ) : profile.savedJobs?.includes(props.id) ? (
    <IconBookmarkFilled
      onClick={handleSaveJob}
      className="text-bright-sun-400 cursor-pointer transition-transform duration-200 hover:scale-110 hover:text-bright-sun-800"
    />
  ) : (
    <IconBookmark
      onClick={handleSaveJob}
      className="text-mine-shaft-300 cursor-pointer transition-transform duration-200 hover:scale-110 hover:text-bright-sun-400"
    />
  )}
</div>

      </div>

      <Divider my="xl" />

      {/* Job Details Section */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {card.map((item, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <ActionIcon className="!h-10 !w-10 xs:!h-12 xs:!w-12 rounded-0" variant="light" color="bright-sun.4">
              <item.icon className="h-4/5 w-4/5" stroke={1.5} />
            </ActionIcon>
            <div className="text-xs xs:text-sm text-mine-shaft-300">{item.name}</div>
            <div className="font-semibold text-xs xs:text-sm">{props ? props[item.id] : "N/A"}{item.id === "packageOffered" && <>LPA</>}</div>
          </div>
        ))}
      </div>

      <Divider my="xl" />

      {/* Skills Section */}
      <div>
  <div className="text-sm xs:text-base sm:text-lg font-semibold mb-3 sm:mb-5">
    Required Skills
  </div>

  <div className="flex flex-wrap gap-2">
    {props?.skillsRequired?.map((item: any, index: number) => (
      <div
        key={index}
        className="bg-mine-shaft-600 text-bright-sun-800 text-[10px] xs:text-xs sm:text-sm px-2 py-1 font-medium"
      >
        {item}
      </div>
    ))}
  </div>
</div>



      <Divider my="xl" />

      {/* Job Description */}
      <div
  className="
    text-xs xs:text-sm sm:text-base
    [&_h4]:text-sm xs:[&_h4]:text-base sm:[&_h4]:text-lg
    [&_h4]:my-3 sm:[&_h4]:my-5
    [&_h4]:font-semibold
    [&_h4]:text-mine-shaft-200
    [&_p]:text-justify
    [&_*]:text-mine-shaft-200
    [&_li]:marker:text-bright-sun-400
    [&_li]:mb-1
    leading-relaxed
  "
  dangerouslySetInnerHTML={{ __html: data }}
/>


      <Divider my="xl" />

      {/* Company Information */}
      <div>
        <div className="text-base xs:text-lg sm:text-xl font-semibold mb-5">About Company</div>
        <div className="flex justify-between items-center flex-wrap gap-2">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-mine-shaft-800">
              <img className="w-8 xs:w-10" src={`/Icons/${props.company}.png`} alt="Company Logo" />
            </div>
            <div>
              <div className="font-medium text-xs xs:text-sm sm:text-lg">{props.company}</div>
              <div className="text-mine-shaft-300 text-xs xs:text-sm sm:text-lg">
                10K+ Employees
              </div>
            </div>
          </div>
          <Link to={`/company/${props.company}`}>
            <Button color="bright-sun.4" variant="light" className="px-2 py-1 text-xs xs:text-sm sm:px-4 sm:py-2">
              Company Pages
            </Button>
          </Link>
        </div>
        <div className="text-mine-shaft-200 text-justify text-xs xs:text-sm sm:text-base mt-5">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quis animi facilis eius obcaecati, quam exercitationem porro ad sunt doloribus libero perspiciatis, cum asperiores impedit hic optio! Repudiandae, vitae sed sequi optio odit molestias delectus at dolore provident aut deleniti dolorum culpa magni, distinctio maxime quia.
        </div>
      </div>
    </div>
  );
};

export default JobDesc;
