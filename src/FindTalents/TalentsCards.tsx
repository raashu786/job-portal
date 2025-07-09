/* eslint-disable jsx-a11y/anchor-has-content */
import {  IconCalendarMonth, IconEPassport, IconFileText, IconHeart, IconLetterA, IconMail, IconMapPin, IconWorld } from '@tabler/icons-react';
import React, { useEffect, useRef, useState } from 'react';
import { Text, Avatar, Button, Modal, Card, Group,  } from '@mantine/core';
import {  Image } from 'antd';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDisclosure } from '@mantine/hooks';
import { DateInput, TimeInput } from '@mantine/dates';
import { getProfile } from '../Services/ProfileService';
import { changeJobsStatusById } from '../Services/JobService';

import { ErrorNotification, SuccessNotification } from '../Services/Notification';
import { base64ToPdf, formatInterViewTime} from '../Services/Utilities';
import { motion } from 'framer-motion';
import { useChatStore } from '../Services/MessageService';
const TalentsCards = (props:any) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [app, { open:openApp, close:closeApp }] = useDisclosure(false);
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime]=useState<any>({});
  const ref = useRef<HTMLInputElement>(null);
  const [profile, setProfile]=useState<any>({});
  const {id}=useParams();
const navigate = useNavigate();
const setSelectedUser = useChatStore((state) => state.setSelectedUser);

const handleMessageClick = () => {
  setSelectedUser({
    id: profile.id,
    name: profile.name,
    picture: profile.picture
  });
  navigate("/message");
};
  useEffect(()=>{
    if(props.applicantId)getProfile(props.applicantId).then((res)=>{
      setProfile(res);
    }).catch((err)=>{
      console.log(err);
    })
    else setProfile(props);
  }, [props]);
  const handleOffer=(status:string)=>{
    let interview:any={id,applicantId:profile?.id,applicationStatus:status};
    if(status==="INTERVIEWING"){
      const [hours , minutes]=time.split(":").map(Number);
      date?.setHours(hours,minutes);
      interview ={...interview, interviewTime:date};
    }
    changeJobsStatusById(interview).then((res)=>{
      if(status==="INTERVIEWING")SuccessNotification("Interview Scheduled","Interview Scheduled Successfully.");
      else if(status==="OFFERED")SuccessNotification("Offered Accepted","Offer had been sent Successfully.");
      else SuccessNotification("Offered Rejected","Offer had been Rejectd.");
      window.location.reload();
    }).catch((err)=>{
      console.log(err);
      ErrorNotification("Error",err.response.data.errorMessage);
    });
  }
  return (
    <div className='bg-mine-shaft-900 p-2 w-full sm:w-92  lg:w-92 flex flex-col gap-2  cursor-pointer border border-mine-shaft-700 overflow-hidden'>
     
      
      <div className='min-h-[15px] flex flex-col justify-center shadow-md'>
        <motion.div 
          className='flex justify-between'
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className='flex gap-1 items-center'>
            <motion.div 
              className='p-1 bg-mine-shaft-800'
              whileHover={{ scale: 1.05 }}
            >
              <Image
        width={50}
        height={50}
        
        src={profile?.picture ? `data:image/jpeg;base64,${profile?.picture}` : "/avatar-9.png"}
        placeholder={
          <Image
            preview={false}
            src={profile?.picture ? `data:image/jpeg;base64,${profile?.picture}` : "/avatar-9.png"}
       
           width={200}
        height={200}
          />
        }
      />
              {/* <Avatar size="md" radius="0" src={profile?.picture ? `data:image/jpeg;base64,${profile?.picture}` : "/avatar-9.png"} alt="Company Logo" /> */}
            </motion.div>
            <div>
              <div className='font-semibold text-lg text-white'>{profile?.name}</div>
              <div className='text-xs text-mine-shaft-300'>{profile?.jobTitle} • {profile?.company}</div>
            </div>
          </div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.8 }}
          >
            <div className='shadow-md text-bright-sun-400 p-2 bg-mine-shaft-800 cursor-pointer hover:text-mine-shaft-300 transition-colors'><IconHeart size={20}  /></div>
            
          </motion.div>
        </motion.div>
      </div>
      
      <div className='h-px bg-mine-shaft-700 w-full' />

      {/* Skills Section */}
      <div className='min-h-[10px] flex flex-col justify-center '>
        <motion.div 
          className=' justify-between [&>div]:shadow-lg py-1 px-2  text-xs text-bright-sun-400 flex flex-wrap gap-1 [&>div]:py-1 [&>div]:px-1 [&>div]:bg-mine-shaft-800 [&>div]:text-bright-sun-400 text-xs'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          {profile.skills?.map((skill: string, index: number) => 
            index < 3 && (
              <motion.div 
                key={index}
                whileHover={{ scale: 1.05, backgroundColor: '#3b3b3b' }}
                transition={{ duration: 0.2 }}
              >
                {skill}
              </motion.div>
            )
          )}
        </motion.div>
      </div>
      
      <div className='h-px bg-mine-shaft-700 w-full' />

      {/* About Section */}
      <div className='min-h-[50px] flex flex-col justify-center'>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.3 }}
        >
          <Text className='!text-xs text-justify text-mine-shaft-300' lineClamp={3}>{profile.about}</Text>
        </motion.div>
      </div>
      
      <div className='h-px bg-mine-shaft-700 w-full' />

      {/* Status Section */}
      <div className='min-h-[10px] flex flex-col justify-center'>
        <motion.div
          className='flex justify-between items-center'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          {props.invited ? (
            <>
              <div className='font-semibold text-mine-shaft-200'>{props.applicationStatus}</div>
              <div className='flex gap-1 text-xs text-mine-shaft-400 items-center'>
                <IconCalendarMonth className='h-5 w-5' stroke={1.5} />
                {formatInterViewTime(props.interviewTime)}
              </div>
            </>
          ) : (
            <>
              <div className='flex gap-1 text-xs text-mine-shaft-400 items-center'> <div  className="text-bright-sun-400 p-1 bg-mine-shaft-800">
                  <IconEPassport size={20} />

                </div>Experiance<div className="text-bright-sun-400 p-2 bg-mine-shaft-800">{props.totalExp?props.totalExp:1}</div></div>
              <div className='flex gap-1 text-xs text-mine-shaft-400 items-center'>
                <div  className="text-bright-sun-400 p-1 bg-mine-shaft-800">
                  <IconMapPin size={20} />

                </div>
                
                {profile.location}
              </div>
            </>
          )}
        </motion.div>
      </div>
      
      <div className='h-px bg-mine-shaft-700 w-full' />

      {/* Action Buttons Section */}
      <div className='min-h-[20px] flex flex-col justify-center'>
        <motion.div 
          className='flex justify-between gap-3 [&>*]:w-1/2'
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.3 }}
        >
          {!props.invited ? (
            <>
              <Link to={`/talent-profile/${profile.id}`}>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button color="bright-sun.4" variant="outline" fullWidth className='hover:bg-bright-sun-400/10'>
                    Profile
                  </Button>
                </motion.div>
              </Link>
              <div>
                {props.posted ? (
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button
                      onClick={open}
                      rightSection={<IconCalendarMonth className="w-5 h-5" />}
                      color="bright-sun.4"
                      variant="light"
                      fullWidth
                      className='hover:bg-bright-sun-400/20'
                    >
                      Schedule
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                   
                     <Button color="bright-sun.4"  onClick={handleMessageClick} variant="light" fullWidth className='hover:bg-bright-sun-400/20'>
                      Message
                    </Button>
                 
                   
                  </motion.div>
                )}
              </div>
            </>
          ) : (
            <>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button color="bright-sun.4" variant="light" fullWidth onClick={() => handleOffer("OFFERED")} className='hover:bg-bright-sun-400/20'>
                  Accept
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button color="red.4" variant="outline" fullWidth onClick={() => handleOffer("REJECTED")} className='hover:bg-red-400/10'>
                  Reject
                </Button>
              </motion.div>
            </>
          )}
        </motion.div>
      </div>

      {/* Additional Button */}
      {(props.invited || props.posted) && (
        <>
          <div className='h-px bg-mine-shaft-700 w-full' />
          <div className='min-h-[50px] flex flex-col justify-center'>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button onClick={openApp} color="bright-sun.4" variant="outline" fullWidth className='hover:bg-bright-sun-400/10'>
                  View Application
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </>
      )}

      {/* Modals */}
      <Modal opened={opened} onClose={close} title="Schedule Interview" centered>
        <div className='flex flex-col gap-4'>
          <DateInput
            value={date}
            onChange={setDate}
            label="Date"
            placeholder="Enter Date"
            minDate={new Date()}
          />
          <TimeInput 
            label="Time" 
            value={time} 
            ref={ref} 
            onClick={() => ref.current?.showPicker()}
            onChange={(event) => setTime(event.currentTarget.value)} 
          />
          <Button onClick={() => handleOffer("INTERVIEWING")} color='bright-sun.4' variant='light' fullWidth>
            Schedule
          </Button>
        </div>
      </Modal>

      <Modal opened={app} onClose={closeApp} title="APPLICATION" centered>
        <div className="flex flex-col gap-4">
          {[{
            icon: <IconMail size={20} className="text-bright-sun-400" />, 
            label: "Email", 
            value: props.email, 
            link: `mailto:${props.email}`
          }, {
            icon: <IconWorld size={20} className="text-bright-sun-400" />, 
            label: "Website", 
            value: props.website, 
            link: props.website
          }, {
            icon: <IconFileText size={20} className="text-bright-sun-400" />, 
            label: "Resume", 
            value: props.name, 
            action: () => base64ToPdf(props.resume)
          }].map((item, index) => (
            <motion.div 
              key={index} 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
            >
              <Card shadow="sm" p="lg" radius="md" withBorder>
                <Group>
                  {item.icon}
                  <Text className='text-sm font-semibold text-semibold' fw={500}>{item.label}</Text>
                  {item.link ? (
                    <a href={item.link} target="_blank" rel="noreferrer" className="text-bright-sun-400 cursor-pointer hover:underline text-xs">
                      {item.value}
                    </a>
                  ) : (
                    <span onClick={item.action} className="text-bright-sun-400 text-xs cursor-pointer hover:underline">
                      {item.value}.pdf
                    </span>
                  )}
                </Group>
              </Card>
            </motion.div>
          ))}

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Card shadow="sm" p="lg" radius="md" withBorder>
              <Group>
                <IconLetterA size={20} className="text-bright-sun-400" />
                <Text className='text-sm' fw={500}>Cover Letter</Text>
              </Group>
              <Text className='!text-xs text-justify text-mine-shaft-300'>{props.coverLetter}</Text>
            </Card>
          </motion.div>
        </div>
      </Modal>
    </div>
  );
};
export default TalentsCards;
