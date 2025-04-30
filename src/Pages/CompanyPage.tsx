import { Button } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Company from '../CompanyProfile/Company';
import SimilarCompanies from '../CompanyProfile/SimilarCompanies';

const CompanyPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-mine-shaft-950 font-['Poppins'] p-4">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          onClick={() => navigate(-1)}
          leftSection={<IconArrowLeft size={20} />}
          color="bright-sun.4"
          variant="light"
          className="mb-6"
        >
          Back
        </Button>
        <div className="flex flex-col lg:flex-row lg:gap-6 justify-between gap-4">
          {/* Profile Section */}
          <div className="w-full lg:w-3/4">
            <Company />
          </div>
          {/* Recommended Talent Section */}
          <div className="w-full lg:w-1/4">
            <SimilarCompanies />
          </div>
        </div>
      </div>
    </div>
  );
};
export default CompanyPage;
