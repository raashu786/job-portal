import { useState, useEffect } from 'react';
import { Button, Group, LoadingOverlay, Radio, TextInput, PinInput, Anchor, ThemeIcon, PasswordInput, Modal, Flex } from '@mantine/core';
import { IconAt, IconPhoneCall, IconClock, IconLock, IconLockCheck } from '@tabler/icons-react';
import { ErrorNotification, SuccessNotification } from '../Services/Notification';
import { verifyMobileOtp, verifyOtp, sendOtp, sendMobileOtpReg, changePass } from '../Services/UserServices';
import { signupValidation, validatePassword } from '../Services/FormValidation';
import { useDisclosure } from '@mantine/hooks';
import { useNavigate } from 'react-router-dom';
import PasswordCriteriaTooltip from './PasswordCriteriaTooltip';



const ResetPassword = (Props:any) => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<'email' | 'mobile' | null>(null);
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false); // <-- New state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mobileTimer, setMobileTimer] = useState<number>(0);
  const [hasSentOtp, setHasSentOtp] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);

  const [showTooltip, setShowTooltip] = useState(false);
  const form = {
    email: '',
    mobile: '',
    otp: '',
  };
  const [formErrors,setFormErrors ] = useState<{[key:string]:string}>(form);
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });
  useEffect(() => {
    let mobileInterval: NodeJS.Timeout;
    if (mobileTimer > 0) {
      mobileInterval = setInterval(() => {
        setMobileTimer((prev) => prev - 1);
        setHasSentOtp(false);
      }, 1000);
    }
    return () => {
      clearInterval(mobileInterval);
    };
  }, [mobileTimer]);

  const handleSendOtp = async () => {
    if (!selectedOption) return;
    try {
      setLoading(true);
      let error = '';
      if (selectedOption === 'mobile') {
        error = signupValidation('mobile', mobile);
        if (error) {
          setFormErrors({ mobile: error, email: '', otp: '' });
          setLoading(false);
          return;
        }
        await sendMobileOtpReg(mobile);
      } else {
        error = signupValidation('email', email);
        if (error) {
          setFormErrors({ email: error, mobile: '', otp: '' });
          setLoading(false);
          return;
        }
        await sendOtp(email);
      }
      setMobileTimer(60);
      setOtpSent(true);
      SuccessNotification("OTP Sent", `OTP sent to your ${selectedOption}`);
    } catch (err: any) {
      ErrorNotification("Failed to Send OTP", err.response?.data?.errorMessage || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!selectedOption || !otp) return;
    setLoading(true);
    try {
      if (selectedOption === 'mobile') {
        await verifyMobileOtp(mobile, otp);
      } else {
        await verifyOtp(email, otp);
      }
      setOtpVerified(true);
      SuccessNotification("OTP Verified", "Now set your new password.");
    } catch (error: any) {
      console.error(error);
      ErrorNotification("OTP Verification Failed", error.response?.data?.errorMessage || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setPasswordCriteria(validatePassword(newPassword));
      return;
    }
  
    if (newPassword !== confirmPassword) {
      setFormErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match" }));
      return;
    }
  
    try {
      setLoading(true);
  
      // For mobile reset, use { mobile: mobileNumber } instead of email
      const payload = mobile ? { mobile: mobile } : { email: email };
      
      await changePass(payload, newPassword);
      SuccessNotification("Password Changed Successfully", "Login to access your account");
      close();
      navigate('/');
    } catch (err: any) {
      console.error(err);
      ErrorNotification("Password Reset Failed", err.response?.data?.errorMessage || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  const CountdownTimer = ({ seconds }: { seconds: number }) => (
    <Group gap="xs">
      <IconClock size={16} />
      <div className="text-xs">Resend OTP in <span className="text-bright-sun-400 font-semibold">{seconds}s</span></div>
    </Group>
  );

  return (
    <>
     <div className='flex flex-col gap-5'>
          <Modal opened={Props.opened} onClose={Props.close} size="xs" title="Reset Password">
      
      <div className="mx-auto flex flex-col gap-5">
        <LoadingOverlay visible={loading} overlayProps={{ radius: 'sm', blur: 2 }} loaderProps={{ color: "bright-sun.4", type: 'bars' }} />

        <Radio.Group
          label="Verify with?"
          value={selectedOption || ''}
          onChange={(val) => {
            setSelectedOption(val as 'email' | 'mobile');
            setOtpSent(false);
            setOtpVerified(false);
            setFormErrors({ email: '', mobile: '', otp: '', newPassword: '', confirmPassword: '' });
          }}
          withAsterisk
        >
          <Flex justify="center" align="center" mt="md">
          <Group mt="md">
            <Radio value="email" label="Email"  className='py-2 px-5 xs-mx:px-6 xs-mx:p-2 border border-mine-shaft-800 rounded-md has-[:checked]:border-bright-sun-400 has-[:checked]:bg-bright-sun-400/5 hover:bg-mine-shaft-900'/>
            <Radio value="mobile" label="Mobile"  className='py-2 px-5 xs-mx:px-6 xs-mx:p-2 border border-mine-shaft-800 rounded-md has-[:checked]:border-bright-sun-400 has-[:checked]:bg-bright-sun-400/5 hover:bg-mine-shaft-900'/>
          </Group>
          </Flex>
        </Radio.Group>

        {selectedOption === 'mobile' && (
          <TextInput
            name='mobile'
            label="Mobile Number"
            placeholder="Enter mobile number"
            value={mobile}
            disabled={hasSentOtp || mobileTimer > 0}
            onChange={(e) => {
              setMobile(e.target.value);
              const error = signupValidation('mobile', e.target.value);
              setFormErrors({ ...formErrors, mobile: error });
            }}
           
            leftSection={<IconPhoneCall size={16} />}
            withAsterisk
            onKeyDown={(e) => {
              const allowedKeys = ["Backspace", "Tab", "Delete", "ArrowLeft", "ArrowRight"];
              if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
                e.preventDefault();
              }
              const input = e.target as HTMLInputElement;
              if (
                /[0-9]/.test(e.key) &&
                input.value.length >= 10 &&
                !allowedKeys.includes(e.key)
              ) {
                e.preventDefault();
              }
            }}
            error={formErrors.mobile}

          />
        )}
        {selectedOption === 'email' && (
          <TextInput
            name='email'
            label="Email"
            placeholder="Enter email"
            value={email}
            disabled={hasSentOtp || mobileTimer > 0 ||otpVerified}
            onChange={(e) => {
              setEmail(e.target.value);
              if (otpSent) return;
              const error = signupValidation('email', e.target.value);
              setFormErrors({ ...formErrors, email: error });
            }}
            error={formErrors.email}
            leftSection={<IconAt size={16} />}
            withAsterisk
          />
        )}

        {otpSent && !otpVerified &&  mobileTimer > 0 && (
          <div>
            <label className="block mb-1 font-medium">
              Enter OTP <span className="text-red-500">*</span>
            </label>
            <PinInput
              size="md"
              length={6}
              type="number"
              autoFocus
              value={otp}
              onChange={(value) => setOtp(value)}
              error={!!formErrors.otp}
            />
            {formErrors.otp && <div className="text-red-500 text-sm">{formErrors.otp}</div>}
          </div>
        )}

{!otpVerified && (
  <Group>
    {(!otpSent || mobileTimer === 0) && (
      <Button
        fullWidth
        onClick={handleSendOtp}
        color="bright-sun.4"
        disabled={!selectedOption || (selectedOption === 'mobile' ? !mobile : !email)}
      >
        {otpSent ? 'Resend OTP' : 'Send OTP'}
      </Button>
    )}
    {otpSent && mobileTimer > 0 && (
      <CountdownTimer seconds={mobileTimer} />
    )}
  </Group>
)}

{otpSent && !otpVerified && mobileTimer > 0 && (
    <Button onClick={handleVerifyOtp} disabled={!otp || otp.length < 6}>
      Verify OTP
    </Button>
  
)}



        {otpVerified && (
          <>
           <PasswordCriteriaTooltip 
  show={showTooltip || (newPassword.length > 0 && !Object.values(passwordCriteria).every(Boolean))} 
  criteria={passwordCriteria}
>
  <PasswordInput
    label="New Password"
    placeholder="Enter new password"
    value={newPassword}
    name="password"
   
    onChange={(e) => {
      const value = e.target.value;
      setNewPassword(value);
      setPasswordCriteria(validatePassword(value));
      const error = signupValidation('password', e.target.value);
      setFormErrors({ ...formErrors, newPassword: error });
    }}
    onFocus={() => setShowTooltip(true)}
    onBlur={() => {
      if (Object.values(passwordCriteria).every(Boolean) || !newPassword) {
        setShowTooltip(false);
      }
    }}
    error={formErrors.newPassword}
    withAsterisk
    leftSection={<IconLock size={16} />}
  />
</PasswordCriteriaTooltip>

<PasswordInput
  label="Confirm Password"
  leftSection={<IconLockCheck size={16} />}
  placeholder="Confirm new password"
  name="confirmPassword"
  value={confirmPassword}
  onChange={(e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setFormErrors((prev) => ({
      ...prev,
      confirmPassword: value !== newPassword ? "Passwords do not match." : "",
    }));
  }}
  error={formErrors.confirmPassword}
  withAsterisk
/>
            <Button onClick={handleResetPassword}>
              Reset Password
            </Button>
          </>
        )}
      </div>
      </Modal>
      </div>
    </>
  );
};

export default ResetPassword;
