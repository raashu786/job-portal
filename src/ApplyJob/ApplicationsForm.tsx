import {
  Button,
  FileInput,
  NumberInput,
  PinInput,
  Textarea,
  TextInput,
} from '@mantine/core';
import { isNotEmpty, useForm } from '@mantine/form';
import { IconPaperclip } from '@tabler/icons-react';
import React, { useState } from 'react';
import { getBase64 } from '../Services/Utilities';
import { applyJob } from '../Services/JobService';
import { ErrorNotification, SuccessNotification } from '../Services/Notification';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { sendOtp, verifyOtp } from '../Services/UserServices';


const ApplicationsForm = () => {
  const { id } = useParams();
  const user = useSelector((state: any) => state.user);
  const [preview, setPreview] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(true);
  const [emailTemp, setEmailTemp] = useState(user.email);
  const navigate = useNavigate();
  const [timer, setTimer] = useState(0);
  const [loadingSendOtp, setLoadingSendOtp] = useState(false);
const [loadingVerifyOtp, setLoadingVerifyOtp] = useState(false);

  const form = useForm({
    mode: 'controlled',
    validateInputOnChange: true,
    initialValues: {
      name: user.name || '',
      email: user.email || '',
      phone: '',
      website: '',
      resume: null,
      coverLetter: '',
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
      applicantId: user.id,
      resume: resume.split(',')[1],
    };

    applyJob(id, applicant)
      .then((res) => {
        setSubmit(true);
        SuccessNotification('success', 'Application Submitted Successfully');
        navigate('/job-history');
      })
      .catch((err) => {
        setSubmit(false);
        ErrorNotification('error', err.response?.data?.errorMessage || 'Something went wrong');
      });
  };

  const validateEmailFormat = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSendOtp = async () => {
    if (!emailTemp || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTemp)) {
      ErrorNotification("Invalid Email", "Please enter a valid email address");
      return;
    }
    setLoadingSendOtp(true);
    try {
      await sendOtp(emailTemp);
      setOtpSent(true);
      setTimer(30);
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
  

  return (
    <div className="w-full lg:w-4/3 mx-auto p-4">
      <div>
        <div className="text-lg lg:text-xl font-semibold mb-5">
          Submit Your Application
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
          <TextInput
            variant={preview ? 'unstyled' : 'default'}
            readOnly={!preview}
            className={`${preview ? 'text-mine-shaft-300 font-semibold' : ''}`}
            label="Full Name"
            placeholder="Enter Name"
            withAsterisk
            {...form.getInputProps('name')}
          />

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
        <Button
          size="xs"
          variant="outline"
          color="bright-sun.4"
          onClick={() => {
            setEditingEmail(true);
            setOtpSent(false);
            setOtp('');
            setTimer(30); // Start countdown
          }}
          className="mt-1"
        >
          Edit Email
        </Button>
      )}
    </div>
  ) : (
    <div className="flex flex-col gap-2">
      <TextInput
        label="New Email"
        withAsterisk
        value={emailTemp}
        onChange={(e) => setEmailTemp(e.target.value)}
      />

      {!otpSent ? (
        <Button variant="light" onClick={handleSendOtp} color="bright-sun.4" loading={loadingSendOtp}>
        {loadingSendOtp ? 'Sending...' : 'Send OTP'}
      </Button>
      ) : (
        <>
          <PinInput
            length={6}
            type="number"
            value={otp}
            onChange={(val) => setOtp(val)}
            oneTimeCode
          />

          <div className="flex gap-4 items-center">
          <Button
  variant="light"
  color="bright-sun.4"
  onClick={handleVerifyOtp}
  disabled={otp.length !== 6}
  loading={loadingVerifyOtp}
>
  {loadingVerifyOtp ? 'Verifying...' : 'Verify & Update Email'}
</Button>

            <Button
              variant="outline"
              color="bright-sun.4"
              onClick={handleSendOtp}
              disabled={timer > 0}
            >
              {timer > 0 ? `Resend in ${timer}s` : 'Resend OTP'}
            </Button>
          </div>
        </>
      )}
    </div>
  )}

          <NumberInput
            variant={preview ? 'unstyled' : 'default'}
            readOnly={preview}
            className={`${preview ? 'text-mine-shaft-300 font-semibold' : ''}`}
            label="Phone"
            placeholder="Enter Phone"
            withAsterisk
            hideControls
            max={9999999999}
            min={0}
            clampBehavior="strict"
            {...form.getInputProps('phone')}
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
