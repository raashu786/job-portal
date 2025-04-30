import { Tooltip } from '@mantine/core';
import React from 'react';

const PasswordValidation = ({ passwordCriteria, formType }: { passwordCriteria: any, formType: string }) => {
  // Different tooltip headings based on the form type
  const tooltipTitles: Record<string, string> = {
    signup: "Password must meet the following criteria:",
    login: "Ensure your password meets security standards:",
    reset: "Create a strong new password:",
  };
  return (
    <Tooltip
      color="dark"
      arrowOffset={5}
      arrowSize={8}
      multiline
      position="right-start"
      w={250}
      withArrow
      transitionProps={{ transition: 'slide-left', duration: 300 }}
      label={
        <div
          className="py-3 px-5 border bg-bright-sun-400/5 backdrop-blur-md border-bright-sun-400 rounded-lg bg-mine-shaft-900 hover:bg-mine-shaft-800"
          style={{
            fontFamily: "Arial, sans-serif",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            color: "#fff",
          }}
        >
          <p className="text-sm font-bold mb-2">{tooltipTitles[formType]}</p>
          <p style={{ color: passwordCriteria.uppercase ? "#ffbd20" : "" }}>
            {passwordCriteria.uppercase ? "✅" : "❌"} At least one uppercase letter
          </p>
          <p style={{ color: passwordCriteria.lowercase ? "#ffbd20" : "" }}>
            {passwordCriteria.lowercase ? "✅" : "❌"} At least one lowercase letter
          </p>
          <p style={{ color: passwordCriteria.number ? "#ffbd20" : "" }}>
            {passwordCriteria.number ? "✅" : "❌"} At least one number
          </p>
          <p style={{ color: passwordCriteria.specialChar ? "#ffbd20" : "" }}>
            {passwordCriteria.specialChar ? "✅" : "❌"} At least one special character
          </p>
          <p style={{ color: passwordCriteria.length ? "#ffbd20" : "" }}>
            {passwordCriteria.length ? "✅" : "❌"} 8-15 characters
          </p>
        </div>
      }
    >
      <div />
    </Tooltip>
  );
};
export default PasswordValidation;
