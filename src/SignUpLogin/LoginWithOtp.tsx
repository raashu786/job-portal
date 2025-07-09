import { useState, useEffect } from 'react';
import { Button, Group, LoadingOverlay, Radio, TextInput, PinInput, Checkbox, Anchor, ThemeIcon } from '@mantine/core';
import { IconAt, IconPhoneCall, IconClock, IconFingerprint } from '@tabler/icons-react';
import { ErrorNotification, SuccessNotification } from '../Services/Notification';
import { verifyMobileOtp, verifyOtp, sendOtp, sendMobileOtpReg } from '../Services/UserServices';
import { signupValidation } from '../Services/FormValidation';
import { setJwt } from '../Slices/JwtSlice';
import { setUser } from '../Slices/UserSlice';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUserWithOtpEmail, loginUserWithOtpMobile } from '../Services/AuthService';
import axios from 'axios';
import { useDisclosure } from '@mantine/hooks';
import ResetPassword from './ResetPassword';
interface LoginWithOtpProps {
  goBack: () => void;
}
const LoginWithOtp = ({ goBack }: LoginWithOtpProps) => {
  const dispatch=useDispatch();
  const [selectedOption, setSelectedOption] = useState<'email' | 'mobile' | null>(null);
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate()
  const [opened, { open, close }] = useDisclosure(false);
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [mobileTimer, setMobileTimer] = useState<number>(0);
  const [hasSentOtp, setHasSentOtp] = useState(false);
  const form = {
    email: '',
    mobile: '',
    otp: '',
  };
  const [FormError,setFormError ] = useState<{[key:string]:string}>(form);
  const [data, setData] = useState<{[key:string]:string}>(form);

  const handleSendOtp = async () => {
    if (!selectedOption) return;
    try {
      setLoading(true);
      let error = '';
      if (selectedOption === 'mobile') {
        error = signupValidation('mobile', mobile);
        if (error) {
          setFormError({ mobile: error, email: '', otp: '' });
          setLoading(false);
          return;
        }
        await sendMobileOtpReg(mobile);
      } else {
        error = signupValidation('email', email);
        if (error) {
          setFormError({ email: error, mobile: '', otp: '' });
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
      let res;
      if (selectedOption === 'mobile') {
        res = await verifyMobileOtp(mobile, otp);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        res = await verifyOtp(email, otp);
      }
      let loginRes;
      if (selectedOption === 'mobile') {
        const loginData = { mobile }; 
        loginRes = await loginUserWithOtpMobile(loginData);
      } else {
        const loginData = { email }; 
        loginRes = await loginUserWithOtpEmail(loginData);
      }
      setData(form);
      SuccessNotification("Login Successfully", "Redirecting to Home page...");
      dispatch(setJwt(loginRes.jwt));
      const decoded = jwtDecode(loginRes.jwt);
      if (selectedOption === 'mobile') {
        dispatch(setUser({ ...decoded, mobile: decoded.sub }));
      } else {
        dispatch(setUser({ ...decoded, email: decoded.sub }));
      }
      setTimeout(() => {
        setLoading(false);
        navigate("/");
      }, 4000);
      console.log(loginRes);
    } catch (error) {
      setLoading(false);
      console.error(error);
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        ErrorNotification("Login Failed", error.response.data.errorMessage || "Something went wrong");
      } else {
        ErrorNotification("Login Failed", "Something went wrong");
      }
    }
  };
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
const CountdownTimer = ({ seconds }: { seconds: number }) => (
    <Group gap="xs">
      <IconClock color="text-bright-sun.4" size={16} />
      <div className="text-xs">Resend OTP in <span className="text-bright-sun-400 font-semibold">{seconds}s</span></div>
    </Group>
  );
  return (
    <>
    <div className="sm:w-7/10 md:w-4/5 lg:w-3/5 xl:w-1/2 mx-auto mt-12 flex flex-col gap-5">
      <LoadingOverlay
        visible={loading}
        overlayProps={{ radius: 'sm', blur: 2 }}
        loaderProps={{ color: "bright-sun.4", type: 'bars' }}
      />
     <div className="text-xl md:text-2xl font-semibold">Login to Your Account</div>
      <Radio.Group
        label="Login with?"
        value={selectedOption || ''}
        onChange={(val) => {
          setSelectedOption(val as 'email' | 'mobile');
          setOtpSent(false);
          setFormError({ email: '', mobile: '', otp: '' });
        }}
        withAsterisk
      >
        <Group mt="md">
          <Radio
            value="email"
            label="Email"
            className='py-3 px-8 xs-mx:px-6 xs-mx:p-2 border border-mine-shaft-800 rounded-lg has-[:checked]:border-bright-sun-400 has-[:checked]:bg-bright-sun-400/5 hover:bg-mine-shaft-900'
          />
          <Radio
            value="mobile"
            label="Mobile"
            className='py-3 px-8 xs-mx:px-6 xs-mx:p-2 border border-mine-shaft-800 rounded-lg has-[:checked]:border-bright-sun-400 has-[:checked]:bg-bright-sun-400/5 hover:bg-mine-shaft-900'
          />
        </Group>
      </Radio.Group>
      {selectedOption === 'mobile' && (
        <TextInput
          label="Mobile Number"
          placeholder="Enter mobile number"
          value={mobile}
          name="mobile"
          disabled={hasSentOtp || mobileTimer > 0}
          onChange={(e) => {
            setMobile(e.target.value);
            const error = signupValidation('mobile', e.target.value);
            setFormError({ ...FormError, mobile: error });
          }}
          
          onKeyDown={(e) => {
            const allowedKeys = ["Backspace", "Tab", "Delete", "ArrowLeft", "ArrowRight"];
            if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
              e.preventDefault();
            }
            const input = e.target as HTMLInputElement; // 👈 Cast to HTMLInputElement
            if (
              /[0-9]/.test(e.key) &&
              input.value.length >= 10 &&
              !allowedKeys.includes(e.key)
            ) {
              e.preventDefault();
            }
          }}
          error={FormError.mobile}
          leftSection={<IconPhoneCall size={16} />}
          withAsterisk
        />
      )}
      {selectedOption === 'email' && (
        <TextInput
          label="Email"
          placeholder="Enter email"
          value={email}
          name="email"
          disabled={hasSentOtp || mobileTimer > 0}
          onChange={(e) => {
            setEmail(e.target.value);
            if (otpSent) return;
            const error = signupValidation('email', e.target.value);
            setFormError({ ...FormError, email: error });
          }}
          error={FormError.email}
          leftSection={<IconAt size={16} />}
          withAsterisk
        />
      )}
{otpSent && mobileTimer > 0 && (
  <Group align="flex-end">
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
        error={!!FormError.otp}
      />
      {FormError.otp && <div className="text-red-500 text-sm">{FormError.otp}</div>}
    </div>
  </Group>
)}

<Checkbox
  label={
    <>
      I accept <Anchor className="xs-mx:text-xs">terms & conditions</Anchor>
    </>
  }
  checked={termsAccepted}
  onChange={(e) => setTermsAccepted(e.currentTarget.checked)}
/>

{otpSent && mobileTimer > 0 ? (
  <Group>
    <Button
      onClick={handleVerifyOtp}
      disabled={!otp || otp.length < 6 || !termsAccepted}
    >
      Login with OTP
    </Button>
    <CountdownTimer seconds={mobileTimer} />
  </Group>
) : (
  <Button
    onClick={handleSendOtp}
    disabled={
      !selectedOption ||
      (selectedOption === 'mobile' ? !mobile : !email)
    }
  >
    {otpSent ? 'Resend OTP' : 'Send OTP'}
  </Button>
)}

  <Button variant="outline" color="bright-sun.4" onClick={goBack}>
    Login With Password  
    <ThemeIcon color="orange" variant="light">
      <IconFingerprint size={20} />
    </ThemeIcon>    
  </Button>
    <div className="mx-auto text-center">
        Don't have an account?{' '}
        <span   onClick={()=>{navigate("/signup");  setData(form)}} className="text-bright-sun-400 hover:underline cursor-pointer">
          Sign Up
        </span>
      </div>
    <div onClick={open} className='text-bright-sun-400 cursor-pointer hover:underline text-center'>Forget Password</div>
    </div><ResetPassword opened={opened} close={close}/></>
  );
};
export default LoginWithOtp;