import {
  Anchor,
  Button,
  Checkbox,
  Group,
  LoadingOverlay,
  PasswordInput,
  PinInput,
  Radio,
  TextInput,
} from "@mantine/core";
import { IconAt, IconLock, IconUser, IconPhoneCall, IconClock } from "@tabler/icons-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  sendEmailOtp,
  sendMobileOtp,
  verifyOtp,
  verifyMobileOtp,
  registeredUser,
} from "../Services/UserServices";
import {
  signupValidation,
  validatePassword,
} from "../Services/FormValidation";
import {
  ErrorNotification,
  SuccessNotification,
} from "../Services/Notification";
import PasswordCriteriaTooltip from "./PasswordCriteriaTooltip";

interface FormData {
  name: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
  accountType: string;
  mobileOtp: string;
  emailOtp: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  mobile?: string;
  password?: string;
  confirmPassword?: string;
  accountType?: string;
  mobileOtp?: string;
  emailOtp?: string;
}

interface PasswordCriteria {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  specialChar: boolean;
}

interface OtpSent {
  mobile: boolean;
  email: boolean;
}

const initialForm: FormData = {
  name: "",
  email: "",
  mobile: "",
  password: "",
  confirmPassword: "",
  accountType: "",
  mobileOtp: "",
  emailOtp: "",
};

const SignUp = () => {
  const [step, setStep] = useState<number>(1);
  const [data, setData] = useState<FormData>(initialForm);
  const [formError, setFormError] = useState<FormErrors>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [otpSent, setOtpSent] = useState<OtpSent>({ mobile: false, email: false });
  const [mobileTimer, setMobileTimer] = useState<number>(0);
  const [emailTimer, setEmailTimer] = useState<number>(0);
  const [passwordCriteria, setPasswordCriteria] = useState<PasswordCriteria>({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const navigate = useNavigate();
  const [hasSentOtp, setHasSentOtp] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });

    if (name === "password") {
      const validationMsg = signupValidation(name, value);
      setFormError((prev) => ({ ...prev, password: validationMsg }));
      setPasswordCriteria(validatePassword(value));

      if (data.confirmPassword && value !== data.confirmPassword) {
        setFormError((prev) => ({ ...prev, confirmPassword: "Passwords do not match." }));
      } else {
        setFormError((prev) => ({ ...prev, confirmPassword: "" }));
      }
    } else if (name === "confirmPassword") {
      setFormError((prev) => ({
        ...prev,
        confirmPassword: value !== data.password ? "Passwords do not match." : "",
      }));
    } else {
      setFormError((prev) => ({ ...prev, [name]: signupValidation(name, value) }));
    }
  };

  const handleSendOtp = async (type: 'mobile' | 'email') => {
    try {
      setLoading(true);
      const field = type === "mobile" ? "mobile" : "email";
      const error = signupValidation(field, data[field]);
      
      if (error) {
        setFormError((prev) => ({ ...prev, [field]: error }));
        return;
      }

      if (type === "mobile") {
        await sendMobileOtp(data.mobile);
        setMobileTimer(60);
      } else {
        await sendEmailOtp(data.email);
        setEmailTimer(60);
      }
      setOtpSent((prev) => ({ ...prev, [type]: true }));
      SuccessNotification("OTP Sent", `OTP sent to your ${type}`);
      setHasSentOtp(true); 
    } catch (err: any) {
      ErrorNotification("Failed to Send OTP", err.response?.data?.errorMessage || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (type: 'mobile' | 'email') => {
    try {
      setLoading(true);
      const otpField = type === "mobile" ? "mobileOtp" : "emailOtp";
      if (!data[otpField]) {
        setFormError((prev) => ({ ...prev, [otpField]: "OTP is required" }));
        return;
      }

      if (type === "mobile") {
        await verifyMobileOtp(data.mobile, data.mobileOtp);
      } else {
        await verifyOtp(data.email, data.emailOtp);
      }
      setStep(step + 1);
      SuccessNotification(`${type === "mobile" ? "Mobile" : "Email"} Verified`, "Proceeding to next step");
    } catch (err: any) {
      ErrorNotification("Invalid OTP", err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!termsAccepted) {
      ErrorNotification("Terms Not Accepted", "Please accept the terms and conditions");
      return;
    }

    let valid = true;
    let newErrors: FormErrors = {};
    
    const fieldsToValidate = ["name", "email", "mobile", "password", "confirmPassword", "accountType"] as const;
    
    fieldsToValidate.forEach((key) => {
      if (key === "confirmPassword") {
        if (data[key] !== data.password) {
          newErrors[key] = "Passwords do not match.";
          valid = false;
        }
      } else {
        newErrors[key] = signupValidation(key, data[key]);
        if (newErrors[key]) valid = false;
      }
    });

    setFormError(newErrors);

    if (valid) {
      setLoading(true);
      try {
        await registeredUser(data);
        SuccessNotification("Registered Successfully", "Redirecting to login page...");
        setTimeout(() => navigate("/login"), 2000);
      } catch (err: any) {
        ErrorNotification("Registration Failed", err.response.data.errorMessage || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    let mobileInterval: NodeJS.Timeout;
    let emailInterval: NodeJS.Timeout;

    if (mobileTimer > 0) {
      mobileInterval = setInterval(() => {
        setMobileTimer((prev) => prev - 1);
        setHasSentOtp(false); 
      }, 1000);
    }

    if (emailTimer > 0) {
      emailInterval = setInterval(() => {
        setEmailTimer((prev) => prev - 1);
        setHasSentOtp(false); 
      }, 1000);
    }

    return () => {
      clearInterval(mobileInterval);
      clearInterval(emailInterval);
    };
  }, [mobileTimer, emailTimer]);

  const CountdownTimer = ({ seconds }: { seconds: number }) => (
    <Group gap="xs">
      <IconClock color="text-bright-sun.4" size={16} />
      <div className="text-xs">Resend OTP in <span className="text-bright-sun-400 font-semibold">{seconds}s</span></div>
    </Group>
  );

  return (
    <div className="relative sm:w-7/10 md:w-4/5 lg:w-3/5 xl:w-1/2 px-2 xs-mx:mt-10 sm:px-5 md:px-1 flex flex-col justify-center gap-5">
      <div className="text-xl md:text-2xl font-semibold">Create Your Account</div>
       <LoadingOverlay visible={loading} overlayProps={{ radius: 'sm', blur: 2 }} loaderProps={{ color: "bright-sun.4", type: 'bars' }} />

      {step === 1 && (
        <>
          <TextInput
            label="Mobile Number"
            placeholder="Enter mobile number"
            name="mobile"
            value={data.mobile}
            onChange={handleChange}
            disabled={hasSentOtp || mobileTimer > 0}

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
            error={formError.mobile}
            leftSection={<IconPhoneCall size={16} />}
            withAsterisk
          />

{otpSent.mobile && mobileTimer > 0 ? (
  <Group align="flex-end">
    <div>
      <label className="block mb-1 font-medium">
        Enter OTP <span className="text-red-500">*</span>
      </label>
      <PinInput
        length={6}
        size="md"
        autoFocus 
        type="number"
        value={data.mobileOtp}
        onChange={(value) => setData({ ...data, mobileOtp: value })}
        error={!!formError.mobileOtp}
      />
      {formError.mobileOtp && (
        <div className="text-red-500 text-sm mt-1">{formError.mobileOtp}</div>
      )}
    </div>
    <Button variant="outline" color="bright-sun.4" onClick={() => handleVerifyOtp("mobile")}>
      Verify OTP
    </Button>
    <CountdownTimer seconds={mobileTimer} />
  </Group>
) : (
  <Button
    onClick={() => handleSendOtp("mobile")}
    disabled={!!formError.mobile || emailTimer > 0}
  >
    {mobileTimer > 0 ? "Resend OTP" : 'Send OTP'}
  </Button>
)}


        </>
      )}

      {step === 2 && (
        <>
          <TextInput
            label="Email"
            placeholder="Enter email"
            name="email"
            disabled={hasSentOtp || emailTimer > 0}
            value={data.email}
            onChange={handleChange}
            error={formError.email}
            leftSection={<IconAt size={16} />}
            withAsterisk
          />

          {otpSent.email && emailTimer > 0 ? (
            <Group align="flex-end">
              <div>
                <label className="block mb-1 font-medium">
                  Enter OTP <span className="text-red-500">*</span>
                </label>
                <PinInput
                  length={6}
                  size="md"
                  autoFocus
                  type="number"
                  value={data.emailOtp}
                  onChange={(value) => setData({ ...data, emailOtp: value })}
                  error={!!formError.emailOtp}
                />
                {formError.emailOtp && (
                  <div className="text-red-500 text-sm mt-1">{formError.emailOtp}</div>
                )}
              </div>
              <Button color="bright-sun.4"  onClick={() => handleVerifyOtp("email")}>
                Verify OTP
              </Button>
              <CountdownTimer seconds={emailTimer} />
            </Group>
          ) : (
            <Button 
            
              onClick={() => handleSendOtp("email")}
              disabled={!!formError.email || emailTimer > 0}
            >{hasSentOtp?"Resend OTP":"Send OTP"}
            </Button>
          )}
        </>
      )}

      {step === 3 && (
        <>
          <TextInput
            label="Full Name"
            name="name"
            value={data.name}
            onChange={handleChange}
            error={formError.name}
            withAsterisk
            leftSection={<IconUser size={16} />}
            placeholder="Enter your full name"
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
              error={formError.password}
              withAsterisk
              leftSection={<IconLock size={16} />}
              placeholder="Enter your password"
            />
          </PasswordCriteriaTooltip>

          <PasswordInput
            label="Confirm Password"
            name="confirmPassword"
            value={data.confirmPassword}
            onChange={handleChange}
            error={formError.confirmPassword}
            withAsterisk
            leftSection={<IconLock size={16} />}
            placeholder="Confirm your password"
          />

          <Radio.Group
            name="accountType"
            label="You Are?"
            value={data.accountType}
            onChange={(value) => setData({ ...data, accountType: value })}
            error={formError.accountType}
            withAsterisk
          >
             <Group mt="xs">
                    <Radio className='py-3 px-5 xs-mx:px-2 xs-mx:p-2 border border-mine-shaft-800 rounded-lg has-[:checked]:border-bright-sun-400 has-[:checked]:bg-bright-sun-400/5 hover:bg-mine-shaft-900'  value="APPLICANT" 
                    label="Applicant" 
                 
                    />
                    <Radio className='py-3 px-5 xs-mx:px-2 xs-mx:p-2 border border-mine-shaft-800 rounded-lg has-[:checked]:border-bright-sun-400 has-[:checked]:bg-bright-sun-400/5 hover:bg-mine-shaft-900' 
                    value="EMPLOYER" 
                    label="Employer" />
               
            
                    </Group>
          </Radio.Group>

          <Checkbox
            label={
              <>
                I accept <Anchor className="xs-mx:text-xs">terms & conditions</Anchor>
              </>
            }
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.currentTarget.checked)}
          />
          
          <Button 
            onClick={handleSubmit}
            disabled={!termsAccepted}
          >
            Sign Up
          </Button>
        </>
      )}

      <div className="mx-auto text-center">
        Already have an account?{' '}
        <Anchor 
          component="button" 
          type="button"
          className="text-bright-sun-400"
          onClick={() => navigate("/login")}
        >
          Login
        </Anchor>
      </div>
    </div>
  );
};

export default SignUp;