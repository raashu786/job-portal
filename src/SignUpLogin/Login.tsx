import { Anchor,  Button, Checkbox, LoadingOverlay, PasswordInput, TextInput } from '@mantine/core';
import { IconAt,  IconLock } from '@tabler/icons-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginValidation, validatePassword } from '../Services/FormValidation';
import { useDisclosure } from '@mantine/hooks';
import ResetPassword from './ResetPassword';
import { ErrorNotification, SuccessNotification } from '../Services/Notification';
import { useDispatch } from 'react-redux';
import { setUser } from '../Slices/UserSlice';
import { loginUser } from '../Services/AuthService';
import { setJwt } from '../Slices/JwtSlice';
import { jwtDecode } from 'jwt-decode';
import PasswordCriteriaTooltip from './PasswordCriteriaTooltip';
import LoginWithOtp from './LoginWithOtp';
const Login = () => {
  const dispatch=useDispatch();
  const form={
    email:"",
    password:"",
  }
  const [passwordCriteria, setPasswordCriteria] = useState({
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      specialChar: false,
    });
  const [data, setData] = useState<{[key:string]:string}>(form);
  const [showTooltip, setShowTooltip] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const navigate = useNavigate()
  const [FormError,setFormError ] = useState<{[key:string]:string}>(form);
  const [loading, setLoading] = useState(false);
  const [isOtpLogin, setIsOtpLogin] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const handleChange=(event:any)=>{
    setData({...data,[event.target.name]:event.target.value})
    const { name, value } = event.target;
    setFormError({ ...FormError, [name]: '' });
    setFormError({
      ...FormError,
      [name]: name === "password" ? "" : loginValidation(name, value),
    });
    if (name === "password") {
      const errorMessage = loginValidation(name, value);
      setFormError((prev) => ({ ...prev, [name]: errorMessage }));
      setPasswordCriteria(validatePassword(value));
    }
  }
  const handleSubmit=()=>{
    let valid=true , newFormError:{[key:string]:string}={};
    for(  let key in data){
         newFormError[key]=loginValidation(key , data[key]);    
         if(newFormError[key])valid=false;
    }
    if(valid===true){
      setLoading(true);
       loginUser(data).then((res)=>{
        setData(form);
        SuccessNotification("Login Successfully","Redirecting to Home page...");
        dispatch(setJwt(res.jwt));
        const decoded=jwtDecode(res.jwt);
        setTimeout(() => {
          setLoading(false);
          dispatch(setUser({...decoded,email:decoded.sub}));
          navigate("/")
        } ,4000)
        console.log(res);
      }).catch((err)=>{
        ErrorNotification("Login Failed",err.response.data.errorMessage);
        console.log(err);
      })
    }
   }
   if (isOtpLogin) {
    return <LoginWithOtp goBack={() => setIsOtpLogin(false)} />;
  }
  return (
    <>
      <LoadingOverlay
        visible={loading}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
        loaderProps={{ color: "bright-sun.4", type: 'bars' }}
      />
    <div className="sm:w-7/10 md:mt-12 xs-mx:mt-12 md:w-4/5 lg:w-3/5 xl:w-1/2 px-2 sm:px-5 md:px-1 flex flex-col justify-center gap-5">
      <div className="text-xl md:text-2xl font-semibold">Login to Your Account</div>
      <TextInput
        withAsterisk
        leftSectionPointerEvents="none"
        leftSection={<IconAt size={16} />}
        label="Email"
        placeholder="Enter Email"
        name='email'
        value={data.email}
        onChange={handleChange}
        error={FormError.email}
        />
      <PasswordCriteriaTooltip 
            show={showTooltip || (data.password.length > 0 && !Object.values(passwordCriteria).every(Boolean))} 
            criteria={passwordCriteria}
          >
          <PasswordInput
              label="Password"
              name="password"
              value={data.password}
              onChange={handleChange}
              onFocus={() => setShowTooltip(true)}
              onBlur={() => {
                if (Object.values(passwordCriteria).every(Boolean) || !data.password) {
                  setShowTooltip(false);
                }
              }}
              error={FormError.password}
              withAsterisk
              leftSection={<IconLock size={16} />}
              placeholder="Enter your password"
            />
        </PasswordCriteriaTooltip>
    <Checkbox
      label={
        <>
          I accept <Anchor className="xs-mx:text-xs">terms & conditions</Anchor>
        </>
      }
      checked={termsAccepted}
      onChange={(e) => setTermsAccepted(e.currentTarget.checked)}
    />
    <Button autoContrast variant="filled"
      onClick={handleSubmit}
      loading={loading}
      disabled={!termsAccepted}
      >
        Login
      </Button>
      <Button 
          variant="outline" 
          onClick={() => setIsOtpLogin(true)} 
          color="bright-sun.4"
        >
          Login with OTP
        </Button>
      <div className="mx-auto text-center">
            Don't have an account?{' '}
        <span   onClick={()=>{navigate("/signup"); setFormError(form); setData(form)}} className="text-bright-sun-400 hover:underline cursor-pointer">
          Sign Up
        </span>
      </div>
      <div onClick={open} className='text-bright-sun-400 cursor-pointer hover:underline text-center'>Forget Password</div>
    </div><ResetPassword opened={opened} close={close}/></>
  );
};
export default Login;


