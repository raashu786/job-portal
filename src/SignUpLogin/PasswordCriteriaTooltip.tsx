import React from 'react';
import { Tooltip } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
// eslint-disable-next-line react-hooks/rules-of-hooks

interface PasswordCriteria {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  specialChar: boolean;
}

interface Props {
  show: boolean;
  criteria: PasswordCriteria;
  children: React.ReactNode;
}

const PasswordCriteriaTooltip: React.FC<Props> = ({ show, criteria, children }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <Tooltip
      color="dark"
      arrowOffset={5}
      arrowSize={8}
      multiline
      position={isMobile ? 'top-start' : 'right-start'}
      w={250}
      withArrow
      opened={show}
      transitionProps={{ transition: 'slide-left', duration: 300 }}
      label={
        <div className="py-3 px-5 border bg-bright-sun-400/5 backdrop-blur-md border-bright-sun-400 rounded-lg bg-mine-shaft-900 hover:bg-mine-shaft-800"
          style={{
            fontFamily: "Arial, sans-serif",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            color: "#fff",
          }}
        >
          <p className='text-xs md:text-xs text-mine-shaft-100'
            style={{ color: criteria.uppercase ? "#ffbd20" : "" }}>
            {criteria.uppercase ? "✅" : "❌"} At least one uppercase letter
          </p>
          <p className='text-xs md:text-xs text-mine-shaft-100'
            style={{ color: criteria.lowercase ? "#ffbd20" : "" }}>
            {criteria.lowercase ? "✅" : "❌"} At least one lowercase letter
          </p>
          <p className='text-xs md:text-xs text-mine-shaft-100'
            style={{ color: criteria.number ? "#ffbd20" : "" }}>
            {criteria.number ? "✅" : "❌"} At least one number
          </p>
          <p className='text-xs md:text-xs text-mine-shaft-100'
            style={{ color: criteria.specialChar ? "#ffbd20" : "" }}>
            {criteria.specialChar ? "✅" : "❌"} At least one special character
          </p>
          <p className='text-xs md:text-xs text-mine-shaft-100'
            style={{ color: criteria.length ? "#ffbd20" : "" }}>
            {criteria.length ? "✅" : "❌"} 8-15 characters
          </p>
        </div>
      }
    >
      {children}
    </Tooltip>
  );
};

export default PasswordCriteriaTooltip;