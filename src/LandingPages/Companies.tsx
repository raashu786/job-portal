import React from "react";
import Marquee from "react-fast-marquee";
import { companies } from "../Data/Data";

const Companies = () => {
  return (
    <div className="mt-10 xs-mx:mt-5 pb-5 px-4 md:px-8 lg:px-16">
      {/* Heading */}
      <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-mine-shaft-100 text-center xs-mx:mb-5 mb-10">
        Trusted By <span className="text-bright-sun-400">1000+</span> Companies
      </div>

      {/* Marquee Section */}
      <Marquee pauseOnHover={true} speed={50} className="flex items-center gap-6">
        {companies.map((company, index) => (
          <div
            key={index}
            className="mx-4 md:mx-6 px-2 py-1 hover:bg-mine-shaft-900 rounded-xl cursor-pointer"
          >
            <img
              className="h-10 md:h-14 lg:h-16 max-w-full object-contain"
              src={`/Companies/${company}.png`}
              alt={company}
            />
          </div>
        ))}
      </Marquee>
    </div>
  );
};

export default Companies;
