import {
  Button,
  FileInput,
  NumberInput,
  PinInput,
  Textarea,
  TextInput,
  Text, 
  Alert,
  Group
} from '@mantine/core';
import { isNotEmpty, useForm } from '@mantine/form';
import { IconClock, IconInfoCircle, IconPaperclip, IconPencil, IconX, IconLocation } from '@tabler/icons-react';
import React, { useState } from 'react';
import { getBase64 } from '../Services/Utilities';
import { applyJob } from '../Services/JobService';
import { ErrorNotification, SuccessNotification } from '../Services/Notification';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { sendEmailOtp, sendMobileOtp, verifyMobileOtp, verifyOtp } from '../Services/UserServices';
import UserLocationModal from './LocationModal';
import { signupValidation } from '../Services/FormValidation';

const ApplicationsForm = () => {
  const { id } = useParams();
  const user = useSelector((state: any) => state.user);
  const profile = useSelector((state: any) => state.profile);
  const [preview, setPreview] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified] = useState(true);
  const [emailTemp, setEmailTemp] = useState(user.email);
  const navigate = useNavigate();
  const [timer, setTimer] = useState(0);
  const [loadingSendOtp, setLoadingSendOtp] = useState(false);
  const [loadingVerifyOtp, setLoadingVerifyOtp] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [otpMobile, setOtpMobile] = useState('');
  const [editingMobile, setEditingMobile] = useState(false);
  const [mobileTemp, setMobileTemp] = useState(profile.mobile);
  const [otpSentMobile, setOtpSentMobile] = useState(false);
  const [loadingSendOtpMobile, setLoadingSendOtpMobile] = useState(false);
  const [loadingVerifyOtpMobile, setLoadingVerifyOtpMobile] = useState(false);
  const [timerMobile, setTimerMobile] = useState(0);
  const [formErrors, setFormErrors] = useState<{
    mobile?: string;
    email?: string;
    name?: string;
  }>({});

  const openLocationModal = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationModalOpen(true);
      },
      (error) => {
        console.error('Error fetching location:', error);
        ErrorNotification('Location Error', 'Unable to access your location. Please enable location permissions.');
      }
    );
  };

  const handleLocationSave = (location: { lat: number; lng: number; locations: string }) => {
    form.setValues({
      ...form.values,
      latitude: location.lat.toString(),
      longitude: location.lng.toString(),
      locations: location.locations
    });
    setLocationModalOpen(false);
    SuccessNotification('Location Saved', 'Your location has been saved successfully');
  };

  const form = useForm({
    mode: 'controlled',
    validateInputOnChange: true,
    initialValues: {
      name: user.name || '',
      email: user.email || '',
      phone: user.mobile ||'',
      website: '',
      resume: null,
      coverLetter: '',
      latitude: '',
      longitude: '',
      locations: '',
    },
    validate: {
      name: isNotEmpty('Enter your Name, name is required.'),
      email: isNotEmpty('Enter your email, email is required.'),
      phone: isNotEmpty('Enter your phone, phone is required.'),
      website: isNotEmpty('Enter your website, website is required.'),
      resume: isNotEmpty('Attach your resume, resume is required.'),
    },
  });

  const handlePreview = () => {
    form.validate();
    if (!form.isValid()) return;
    if (!emailVerified) {
      ErrorNotification('error', 'Please verify your new email with OTP');
      return;
    }
    setPreview(!preview);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleSubmit = async () => {
    setSubmit(true);
    let resume: any = await getBase64(form.getValues().resume);
    let applicant = {
      ...form.getValues(),
      applicantId: profile.id,
      resume: resume.split(',')[1],
      location: {
        latitude: parseFloat(form.getValues().latitude),
        longitude: parseFloat(form.getValues().longitude),
        locations: form.getValues().locations
      },
    };
    
    applyJob(id, applicant)
      .then((res) => {
        setSubmit(false);
        SuccessNotification('success', 'Application Submitted Successfully');
        navigate('/job-history');
      })
      .catch((err) => {
        setSubmit(false);
        ErrorNotification('error', err.response?.data?.errorMessage || 'Something went wrong');
      });
  };  const handleSendOtp = async () => {
    if (!emailTemp || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTemp)) {
      ErrorNotification("Invalid Email", "Please enter a valid email address");
      return;
    }
    setLoadingSendOtp(true);
    try {
      await sendEmailOtp(emailTemp);
      setOtpSent(true);
      setTimer(120);
      SuccessNotification("OTP Sent", "OTP has been sent to your email");
    } catch (error) {
      ErrorNotification("Error", "Failed to send OTP. Try again.");
    } finally {
      setLoadingSendOtp(false);
    }
  };
  React.useEffect(() => {
    let interval: any;
    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);
  const handleVerifyOtp = async () => {
    setLoadingVerifyOtp(true);
    try {
      await verifyOtp(emailTemp, otp);
      form.setFieldValue('email', emailTemp);
      setEditingEmail(false);
      setOtp('');
      setOtpSent(false);
      SuccessNotification("Verified", "Email has been updated successfully");
    } catch (error) {
      ErrorNotification("Error", "OTP Verification failed. Try again.");
    } finally {
      setLoadingVerifyOtp(false);
    }
  };
  const handleSendMobileOtp = async () => {
    if (!mobileTemp || mobileTemp.length !== 10 || !/^\d{10}$/.test(mobileTemp)) {
      ErrorNotification('Invalid Mobile', 'Please enter a valid mobile number');
      return;
    }
    setLoadingSendOtpMobile(true);
    try {
      await sendMobileOtp(mobileTemp);
      setOtpSentMobile(true);
      setTimerMobile(120);
      SuccessNotification('OTP Sent', 'OTP has been sent to your mobile');
    } catch (error) {
      ErrorNotification('Error', 'Failed to send OTP. Try again.');
    } finally {
      setLoadingSendOtpMobile(false);
    }
  };
  React.useEffect(() => {
    let interval: any;
    if (otpSentMobile && timerMobile > 0) {
      interval = setInterval(() => {
        setTimerMobile((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpSentMobile, timerMobile]);
  
  const handleVerifyMobileOtp = async () => {
    setLoadingVerifyOtpMobile(true);
    try {
      await verifyMobileOtp(mobileTemp, otpMobile);
      form.setFieldValue('phone', mobileTemp);
      setEditingMobile(false);
      setOtpMobile('');
      setOtpSentMobile(false);
      SuccessNotification('Verified', 'Mobile number has been updated successfully');
    } catch (error) {
      ErrorNotification('Error', 'OTP Verification failed. Try again.');
    } finally {
      setLoadingVerifyOtpMobile(false);
    }
  };
  const CountdownTimer = ({ seconds }: { seconds: number }) => (
    <Group gap="xs">
      <IconClock color="text-bright-sun.4" size={16} />
      <div className="text-xs">Resend OTP in <span className="text-bright-sun-400 font-semibold">{seconds}s</span></div>
    </Group>
  );

  return (
    <div className="w-full lg:w-4/3 mx-auto p-4">
      <div>
        <div className="text-lg lg:text-xl font-semibold mb-5">
          Submit Your Application
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
        <div>
  {!editingMobile ? (
    <div>
      <TextInput
        variant={preview ? 'unstyled' : 'default'}
        readOnly
        value={form.getInputProps('phone').value}
        label="Mobile"
        withAsterisk
      />
      {!preview && (
        <div className="mt-1 flex justify-end">
  <Button
    size="xs"
    variant="outline"
    color="bright-sun.4"
    onClick={() => {
      setEditingMobile(true);
      setOtpSentMobile(false);
      setOtpMobile('');
      setMobileTemp(form.getInputProps('phone').value);
      setTimerMobile(30);
    }}
  >
    <IconPencil />
  </Button>
</div>

      )}
    </div>
  ) : (
    <>
      <NumberInput
  label="New Mobile"
  withAsterisk
  value={mobileTemp}
  onChange={(val) => {
    const newValue = val ? val.toString() : '';
    setMobileTemp(newValue);

    const error = signupValidation('mobile', newValue);
    setFormErrors((prev) => ({ ...prev, mobile: error }));
  }}
  error={formErrors.mobile}
  className="mb-2"
  hideControls
  max={9999999999}
  min={1000000000}
  clampBehavior="blur"
  allowNegative={false}
/>

      {!otpSentMobile ? (
        <>
          <div className="flex justify-between items-center mt-1">
            <Button
              variant="light"
              onClick={handleSendMobileOtp}
              color="bright-sun.4"
              loading={loadingSendOtpMobile}
              className="mt-1"
              
              disabled={
                loadingSendOtpMobile ||
                
                mobileTemp.toString().length !== 10 ||
                String(mobileTemp) === String(form.getInputProps('phone').value)
              }
            >
              {loadingSendOtpMobile ? 'Sending...' : 'Send OTP'}
            </Button>
            <div className="mt-1 flex justify-end"></div> 
            <Button
            size='xs'
            color='bright-sun.4'
              variant="outline"
              onClick={() => {
                setEditingMobile(false);
                setOtpMobile('');
                setOtpSentMobile(false);
                setMobileTemp('');
              }}
              className="mt-1"
            >
              <IconX/>
            </Button>
          </div>
        
          {String(mobileTemp) === String(form.getInputProps('phone').value) && (
  <Alert
    variant="light"
    color="bright-sun.4"
    title="Warning"
    icon={<IconInfoCircle />}
    className="mt-1"
  >
    <Text size='xs'>New number must be different from current one.</Text>
  </Alert>
)}
        </>
      ) : (
        <div className="mt-1">
          <PinInput
            length={6}
            type="number"
            value={otpMobile}
            onChange={(val) => setOtpMobile(val)}
            oneTimeCode
            size='lg'
            autoFocus
            
          />
          <div className="flex justify-between items-center mt-1">
            <Button
              variant="light"
              color="bright-sun.4"
              onClick={handleVerifyMobileOtp}
              disabled={otpMobile.length !== 6}
              loading={loadingVerifyOtpMobile}
            >
              {loadingVerifyOtpMobile ? 'Verifying...' : 'Verify & update'}
            </Button>
            <Button
              variant="outline"
              color="bright-sun.4"
              onClick={handleSendMobileOtp}
              disabled={timerMobile > 0}
            >
              {timerMobile > 0 ? <CountdownTimer seconds={timerMobile} /> : 'Resend OTP'}
              
            </Button>
          
          </div>
        </div>
      )}
    </>
  )}
</div>
{
  !editingEmail ? (
    <div>
      <TextInput
        variant={preview ? 'unstyled' : 'default'}
        readOnly
        value={form.getInputProps('email').value}
        label="Email"
        withAsterisk
      />
      {!preview && (
        <div className="mt-1 flex justify-end">
        <Button
          size="xs"
          variant="outline"
          color="bright-sun.4"
          onClick={() => {
            setEditingEmail(true);
            setOtpSent(false);
            setOtp('');
            setTimer(30); 
          }}
          className="mt-1"
        >
         <IconPencil/>
        </Button>
        </div>
      )}
    </div>
  ) : (
    <div className="flex flex-col gap-2">
  <TextInput
  label="New Email"
  withAsterisk
  value={emailTemp}
  error={formErrors.email}
  onChange={(e) => {
    const newValue = e.currentTarget.value;
    setEmailTemp(newValue);
    const error = signupValidation('email', newValue);
    setFormErrors((prev) => ({ ...prev, email: error }));
  }}
/>
  {!otpSent ? (
          <>
      <div className="flex justify-between items-center mt-1">
        <Button variant="light" onClick={handleSendOtp} color="bright-sun.4" loading={loadingSendOtp}
        disabled={
          loadingSendOtp ||
          String(emailTemp) === String(form.getInputProps('email').value) ||
          !!formErrors.email || 
          emailTemp.trim() === ''
        }
        >
        {loadingSendOtp ? 'Sending...' : 'Send OTP'}
      </Button>
      <Button
       size='xs'
       color='bright-sun.4'
         variant="outline"
         onClick={() => {
           setEditingEmail(false); 
         }}
         className="mt-1"
       >
         <IconX/>
       </Button>
      </div>
      {String(emailTemp) === String(form.getInputProps('email').value) && (
  <Alert
    variant="light"
    color="bright-sun.4"
    title="Warning"
    icon={<IconInfoCircle />}
  >
    <Text size='xs'>New Email must be different from current one.</Text>
  </Alert>
)}
       </>
      ) : (
        <>
          <PinInput
            length={6}
            type="number"
            value={otp}
            onChange={(val) => setOtp(val)}
            oneTimeCode
            size='lg'
            autoFocus
          />

<div className="flex justify-between items-center mt-1">
          <Button
  variant="light"
  color="bright-sun.4"
  onClick={handleVerifyOtp}
  disabled={otp.length !== 6}
  loading={loadingVerifyOtp}
>
  {loadingVerifyOtp ? 'Verifying...' : 'Verify & Update'}
</Button>

            <Button
              variant="outline"
              color="bright-sun.4"
              onClick={handleSendOtp}
              disabled={timer > 0}
            >
              {timer > 0 ? <CountdownTimer seconds={timer} /> : 'Resend OTP'}
            </Button>
          </div>
        </>
      )}
    </div>
  )}

<TextInput
  variant={preview ? 'unstyled' : 'default'}
  readOnly={!preview}
  className={`${preview ? 'text-mine-shaft-300 font-semibold' : ''}`}
  label="Full Name"
  placeholder="Enter Name"
  withAsterisk
  {...form.getInputProps('name')}
/>
   
          <TextInput
            variant={preview ? 'unstyled' : 'default'}
            readOnly={preview}
            className={`${preview ? 'text-mine-shaft-300 font-semibold' : ''}`}
            label="Portfolio"
            placeholder="Enter URL"
            withAsterisk
            {...form.getInputProps('website')}
          />
        </div>

        <div className="mt-5">
          <FileInput
            variant={preview ? 'unstyled' : 'default'}
            readOnly={preview}
            className={`${preview ? 'text-mine-shaft-300 font-semibold' : ''}`}
            rightSection={<IconPaperclip stroke={1.5} />}
            label="Attach your CV"
            placeholder="Your CV"
            rightSectionPointerEvents="none"
            {...form.getInputProps('resume')}
            accept="application/pdf"
          />
        </div>
{/* Location Section */}
          <div className="col-span-1 sm:col-span-2">
            {form.values.locations ? (
              <TextInput
                label="Your Location"
                value={form.values.locations}
                readOnly
                leftSection={<IconLocation size={18} />}
                className="mt-2"
                 {...form.getInputProps('locations')}
              />
            ) : (
              <Button
                leftSection={<IconLocation size={18} />}
                variant="outline"
                color="bright-sun.4"
                onClick={openLocationModal}
                className="mt-2"
              >
                Select Your Location
              </Button>
            )}
          </div>

          {userLocation && (
            <UserLocationModal
              opened={locationModalOpen}
              onClose={() => setLocationModalOpen(false)}
              lat={userLocation.lat}
              lng={userLocation.lng}
              onLocationSave={handleLocationSave}
            />
          )}

        <div className="mt-5 flex flex-col gap-4">
          <Textarea
            variant={preview ? 'unstyled' : 'default'}
            readOnly={preview}
            className={`${preview ? 'text-mine-shaft-300 font-semibold' : ''}`}
            label="Additional Information"
            placeholder="Write something..."
            autosize
            minRows={2}
            maxRows={4}
            {...form.getInputProps('coverLetter')}
          />

          {!preview && (
            <Button
              fullWidth
              onClick={handlePreview}
              variant="light"
              color="bright-sun.4"
              className="self-start transition-transform hover:scale-105"
            >
              Preview
            </Button>
          )}

          {preview && (
            <div className="flex gap-10 [&>*]:w-1/2">
              <Button
                fullWidth
                onClick={handlePreview}
                variant="light"
                color="bright-sun.4"
                className="self-start transition-transform hover:scale-105"
              >
                Edit
              </Button>

              <Button
                fullWidth
                onClick={handleSubmit}
                variant="light"
                color="bright-sun.4"
                loading={submit}
                className="self-start transition-transform hover:scale-105"
              >
                Submit
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ApplicationsForm;
