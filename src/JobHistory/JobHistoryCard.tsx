import {
  Text,
  Divider,
  Button,
  Skeleton,
  Transition,
} from '@mantine/core';
import {
  IconBookmark,
  IconBookmarkFilled,
  IconCalendarMonth,
  IconClockHour3,
} from '@tabler/icons-react';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { changeProfile } from '../Slices/ProfileSlice';
import { timeAgo } from '../Services/Utilities';
import classNames from 'classnames';

const JobHistoryCard = (props: any) => {
  const profile = useSelector((state: any) => state.profile);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
      setMounted(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, [props.id]);

  const handleSaveJob = () => {
    let savedJobs: any = [...profile.savedJobs];
    if (savedJobs?.includes(props.id)) {
      savedJobs = savedJobs.filter((id: any) => id !== props.id);
    } else {
      savedJobs = [...savedJobs, props.id];
    }
    const updatedProfile = { ...profile, savedJobs };
    dispatch(changeProfile(updatedProfile));
  };

  if (loading) {
    return (
      <div className="bg-mine-shaft-900 shadow-md p-4 w-full max-w-full sm:max-w-sm md:max-w-md lg:max-w-sm flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <Skeleton height={40} width={40} circle />
            <div className="space-y-2">
              <Skeleton height={16} width={120} />
              <Skeleton height={12} width={180} />
            </div>
          </div>
          <Skeleton height={24} width={24} />
        </div>
        <div className="flex gap-2">
          <Skeleton height={24} width={60} />
          <Skeleton height={24} width={60} />
          <Skeleton height={24} width={60} />
        </div>
        <div className="space-y-2">
          <Skeleton height={12} width="100%" />
          <Skeleton height={12} width="90%" />
          <Skeleton height={12} width="80%" />
        </div>
        <Divider size="xs" color="mine-shaft.7" />
        <div className="flex justify-between items-center">
          <Skeleton height={16} width={80} />
          <div className="flex items-center gap-1">
            <Skeleton height={20} width={20} circle />
            <Skeleton height={12} width={100} />
          </div>
        </div>
        <Skeleton height={36} width="100%" />
      </div>
    );
  }

  return (
    <Transition mounted={mounted} transition="fade" duration={500} timingFunction="ease">
      {(styles) => (
        <div
          className="bg-mine-shaft-900 shadow-md p-4 w-full max-w-full sm:max-w-sm md:max-w-md lg:max-w-sm flex flex-col gap-4 transition-all duration-300 ease-in-out transform hover:scale-[1.01] hover:shadow-sm hover:shadow-bright-sun-400 hover:-translate-y-1 cursor-pointer"
          style={styles}
        >
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <div className="p-2 bg-mine-shaft-800">
                <img className="w-7" src={`/Icons/${props.company}.png`} alt="Company Logo" />
              </div>
              <div>
                <div className="font-semibold text-white">{props.jobTitle}</div>
                <div className="text-xs text-mine-shaft-300">
                  {props.company} • {props.applicants?.length || 0} Applicants
                </div>
              </div>
            </div>
            {profile.savedJobs?.includes(props.id) ? (
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

          <div className="flex justify-between gap-2 text-xs [&>div]:py-1 [&>div]:px-2 [&>div]:bg-mine-shaft-800 [&>div]:rounded-lg">
            <div className="text-bright-sun-400">{props.experiences}</div>
            <div className="text-bright-sun-400">{props.jobType}</div>
            <div className="text-bright-sun-400">{props.location}</div>
          </div>

          <div className="flex-grow">
            <Text className="!text-xs text-justify text-mine-shaft-300" lineClamp={3}>
              {props.about}
            </Text>
          </div>

          <Divider size="xs" color="mine-shaft.7" />

          <div className="flex justify-between items-center">
            <div className="font-semibold text-mine-shaft-200">₹ {props.packageOffered} LPA</div>
            <div
              className={classNames('flex gap-1 text-xs items-center', {
                'text-green-400': props.applied || props.interviewing,
                'text-yellow-400': !props.applied && !props.interviewing && !props.offered,
                'text-blue-400': props.offered,
              })}
            >
              <IconClockHour3 className="h-5 w-5" stroke={1.5} />
              {props.offered ? 'Interviewed' : props.applied || props.interviewing ? 'Applied' : 'Posted'}{' '}
              {timeAgo(props.postTime)}
            </div>
          </div>

          {(props.offered || props.interviewing) && <Divider size="xs" color="mine-shaft.7" />}

          {props.offered && (
            <Transition mounted={props.offered} transition="slide-up" duration={400} timingFunction="ease">
              {(offerStyles) => (
                <div style={offerStyles} className="flex justify-between gap-2 mt-2">
                  <Button color="green.8" variant="outline" fullWidth className="w-1/2">
                    Accept
                  </Button>
                  <Button color="red.8" variant="outline" fullWidth className="w-1/2">
                    Reject
                  </Button>
                </div>
              )}
            </Transition>
          )}

          {props.interviewing && (
            <Transition mounted={props.interviewing} transition="slide-up" duration={400} timingFunction="ease">
              {(interviewStyles) => (
                <div style={interviewStyles} className="flex justify-between items-center p-2 bg-mine-shaft-800 rounded-lg mt-2">
                  <IconCalendarMonth className="h-5 w-5 text-bright-sun-400" stroke={1.5} />
                  <div className="font-semibold text-mine-shaft-200 text-sm">August 27, 2024</div>
                  <div className="flex gap-1 text-sm text-bright-sun-400 items-center">10:00 AM</div>
                </div>
              )}
            </Transition>
          )}

          <Transition mounted={mounted} transition="fade" duration={600} timingFunction="ease">
            {(buttonStyles) => (
              <div style={buttonStyles} className="mt-auto pt-2">
                <Link to={`/jobs/${props.id}`}>
                  <Button
                    color="bright-sun.4"
                    size="sm"
                    fullWidth
                    variant="outline"
                    className="w-full transition-all duration-300 hover:bg-bright-sun-500 hover:text-white"
                  >
                    View Jobs
                  </Button>
                </Link>
              </div>
            )}
          </Transition>
        </div>
      )}
    </Transition>
  );
};

export default JobHistoryCard;
