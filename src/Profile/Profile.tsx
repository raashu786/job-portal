import {  Divider, FileInput, Overlay } from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import Info from './Info';
import { changeProfile } from '../Slices/ProfileSlice';
import About from './About';
import Skills from './Skills';
import Experience from './Experience';
import Certification from './Certification';
import { useHover } from '@mantine/hooks';
import { Icon3dCubeSphere, IconClock, IconCoinRupee, IconDeviceSdCard, IconEdit, IconEye, IconFileDescription, IconJetpack, IconListDetails, IconTableShortcut, IconTypography } from '@tabler/icons-react';
import { SuccessNotification } from '../Services/Notification';
import { getBase64 } from '../Services/Utilities';
import StepSidebar from '../PostJob/StepSidebar';
import ProfileStepSideBar from './ProfileStepSideBar';

const Profile = () => {
  const dispatch =useDispatch();
  const profile = useSelector((state:any)=>state.profile);
  const { hovered, ref } = useHover();

    const handleFileChange= async (image:any)=>{
      let picture:any = await getBase64(image);
      let updatedProfile = {...profile, picture:picture.split(',')[1]};
      dispatch(changeProfile(updatedProfile));
      SuccessNotification("success",`Profile picture updated successfully`);

    }
    const steps = [
      {
        title: 'Upload your profile photo',
        icon: <IconEye size={20} />,
        fields: ['picture']
      },
      {
        title: 'Select Job Title',
        icon: <IconClock size={20} />,
        fields: ['jobTitle']
      },
      {
        title: 'Select current Company',
        icon: <IconJetpack size={20} />,
        fields: ['company']
      },
      {
        title: 'Select current Location',
        icon: <IconTypography size={20} />,
        fields: ['location']
      },
      {
        title: 'Enter Total Year of Experiance',
        icon: <IconListDetails size={20} />,
        fields: ['location']
      },
      {
        title: 'Write about your self ',
        icon: <IconCoinRupee size={20} />,
        fields: ['about']
      },
      {
        title: 'Add your skills',
        icon: <IconFileDescription size={20} />,
        fields: ['skills']
      },
      {
        title: 'Add Experiances',
        icon: <IconTableShortcut size={20} />,
        fields: ['experiances']
      },
      {
        title: 'Add Certification',
        icon: <IconDeviceSdCard size={20} />,
        fields: ['certification'] 
      },
      {
        title: 'Verify mobile number',
        icon: <Icon3dCubeSphere size={20} />,
        fields: [] 
      },
      {
        title: 'Verify Email Id',
        icon: <Icon3dCubeSphere size={20} />,
        fields: [] 
      },
    ];
  return (
    <div className="max-w-7xl mx-auto ">
  <div className="flex flex-col lg:flex-row">
    <aside className="w-full lg:w-1/3">
      <ProfileStepSideBar steps={steps}/>
    </aside>
    <main className="w-full lg:w-2/3">
      <div className="relative">
      <img
  className="w-full h-32 sm:h-40 md:h-55 lg:h-50 xl:h-70 object-cover"
  src="/Profile/banner.jpg"
  alt="Banner"
/>
        <div
          ref={ref}
          className="absolute -bottom-16 left-4 sm:left-6 border-1 border-mine-shaft-950 flex items-center justify-center bg-white"
        >
          <img
            className="w-32 sm:w-48 h-32 sm:h-48  object-cover"
            src={profile.picture ? `data:image/jpeg;base64,${profile.picture}` : "/avatar-9.png"}
            alt="Profile"
          />
          {hovered && <Overlay color="#000"  backgroundOpacity={0.65} />}
          {hovered && <IconEdit className="absolute z-[300] !h-16 !w-16 text-yellow-400" />}
          {hovered && (
            <FileInput
              onChange={handleFileChange}
              className="absolute z-[301] w-12 [&_*]:!h-full !h-full !w-full"
              variant="transparent"
              size="lg"
              radius="xl"
              accept="image/png, image/jpeg"
            />
          )}
        </div>
      </div>
     

      {/* Sections */}
      <div className="px-4 mt-8">
      <div className="px-3 mt-20 sm:mt-28">
      <Info/>
  </div>
        <Divider my="xl" />
        <About />
        <Divider my="xl" />
        <Skills />
        <Divider my="xl" />
        <Experience />
        <Divider my="xl" />
        <Certification />
        <Divider my="xl" />
      </div>
    </main>
  </div>
</div>

  );
};
export default Profile;
