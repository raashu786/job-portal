import React, { useEffect, useState } from 'react';
import SelectInput from './SelectInput';
import { content, fields } from '../Data/PostJob';
import { Button, NumberInput, TagsInput, Textarea } from '@mantine/core';
import RichTextEditor from './RichTextEditor';
import { isNotEmpty, useForm } from '@mantine/form';
import { getJob, postJob } from '../Services/JobService';
import { ErrorNotification, SuccessNotification } from '../Services/Notification';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import StepSidebar from './StepSidebar';
import {
  IconEye,
  IconListDetails,
  IconFileDescription,
  IconClock,
  IconTypography,
  IconJetpack,
  IconCoinRupee,
  IconTableShortcut,
  IconDeviceSdCard,
  Icon3dCubeSphere,
} from '@tabler/icons-react';

const PostJobs = () => {
  const { id } = useParams();
  const select = fields;
  const navigate = useNavigate();
  const [editorData, setEditorData] = useState(content);
  const profile = useSelector((state: any) => state.profile);
 

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id !== "0") {
      getJob(id).then((res) => {
        form.setValues(res);
        setEditorData(res.description);
      }).catch((err) => {
        console.log(err);
      });
    } else {
      form.reset();
      setEditorData(content);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Steps for guidance with icons
  const steps = [
    {
      title: 'Select youe JobTitle or Role',
      icon: <IconEye size={20} />,
      fields: ['jobTitle']
    },
    {
      title: 'Select your current company',
      icon: <IconClock size={20} />,
      fields: ['company']
    },
    {
      title: 'Select your experiance types',
      icon: <IconJetpack size={20} />,
      fields: ['experiences']
    },
    {
      title: 'Select your job types',
      icon: <IconTypography size={20} />,
      fields: ['jobType']
    },
    {
      title: 'Select your Job Location',
      icon: <IconListDetails size={20} />,
      fields: ['location']
    },
    {
      title: 'Enter your Salary range ',
      icon: <IconCoinRupee size={20} />,
      fields: ['packageOffered']
    },
    {
      title: 'Add your skills',
      icon: <IconFileDescription size={20} />,
      fields: ['skillsRequired']
    },
    {
      title: 'Write your short note about',
      icon: <IconTableShortcut size={20} />,
      fields: ['about']
    },
    {
      title: 'Write your job descriptions',
      icon: <IconDeviceSdCard size={20} />,
      fields: ['description'] 
    },
    {
      title: 'Publish or Draft the Job',
      icon: <Icon3dCubeSphere size={20} />,
      fields: [] 
    },
  ];

  const form = useForm({
    mode: 'controlled',
    validateInputOnChange: true,
    initialValues: {
      jobTitle: '',
      company: '',
      about: '',
      experiences: '',
      jobType: '',
      location: '',
      packageOffered: '',
      description: content,
      skillsRequired: []
    },
    validate: {
      jobTitle: isNotEmpty('JobTitle is Required'),
      company: isNotEmpty('Company is Required'),
      about: isNotEmpty('About is Required'),
      experiences: isNotEmpty('Experiences is Required'),
      jobType: isNotEmpty('JobType is Required'),
      location: isNotEmpty('Location is Required'),
      packageOffered: isNotEmpty('PackageOffered is Required'),
      description: isNotEmpty('Description is Required'),
      skillsRequired: isNotEmpty('SkillsRequired is Required'),
    }
  });
  const handlePostJob = () => {
    form.validate();
    if (!form.isValid()) return;
    postJob({ ...form.getValues(), id, postedBy: profile.id, jobStatus: "ACTIVE" }).then((res) => {
      SuccessNotification("success", "Job Posted successfully");
      navigate(`/posted-job/${res.id}`);
    }).catch((err) => {
      console.log(err);
      ErrorNotification("Error", err.response.data.errorMessage);
    });
  };

  const handleDraftJob = () => {
    postJob({ ...form.getValues(), id, postedBy: profile.id, jobStatus: "DRAFT" }).then((res) => {
      SuccessNotification("success", "Job Draft successfully");
      navigate(`/posted-job/${res.id}`);
    }).catch((err) => {
      console.log(err);
      ErrorNotification("Error", err.response.data.errorMessage);
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8">
      {/* Step Sidebar */}
      <StepSidebar steps={steps} form={form} />
      <StepSidebar steps={steps} form={form} isMobile />

      {/* Right Section: Form */}
      <div className="w-full lg:w-2/3">
        {/* Page Title */}
        <div className="text-lg sm:text-2xl font-semibold text-center sm:text-left mb-2">
          Post a Job
        </div>

        {/* Form Section */}
        <div className="flex flex-col gap-6">
          {/* First Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SelectInput form={form} name="jobTitle" {...select[0]} />
            <SelectInput form={form} name="company" {...select[1]} />
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SelectInput form={form} name="experiences" {...select[2]} />
            <SelectInput form={form} name="jobType" {...select[3]} />
          </div>

          {/* Third Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SelectInput form={form} name="location" {...select[4]} />
            <NumberInput
              hideControls
              label="Salary"
              placeholder="Enter Salary"
              name="packageOffered"
              withAsterisk
              min={1}
              max={300}
              clampBehavior='strict'
              {...form.getInputProps('packageOffered')}
            />
          </div>

          {/* Skills Input */}
          <div>
            <TagsInput
              withAsterisk
              label="Skills"
              placeholder="Enter Skill"
              defaultValue={['React']}
              acceptValueOnBlur
              splitChars={[',', ' ', '|']}
              clearable
              className="w-full"
              {...form.getInputProps('skillsRequired')}
            />
          </div>
          <Textarea
            withAsterisk
            label="About job"
            placeholder='Enter About Job.. '
            resize="vertical"
            autosize
            minRows={2}
            maxRows={10}
            {...form.getInputProps('about')}
          />

          {/* Job Description */}
          <div className="bg-mine-shaft-950 p-4 shadow-lg [&_button[data-active='true']]:!text-bright-sun-400  [&_button[data-active='true']]:!bg-bright-sun-400/20">
            <div className="text-sm sm:text-base font-medium mb-2">
              Job Description <span className='text-red-500'>*</span>
            </div>
            <RichTextEditor form={form} data={editorData} />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-20 justify-center sm:justify-start">
            <Button color="bright-sun.4" onClick={handlePostJob} variant="light" className="px-6 py-2">
              Publish Job
            </Button>
            <Button color="bright-sun.4" onClick={handleDraftJob} variant="outline" className="px-6 py-2">
              Save as Draft
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostJobs;