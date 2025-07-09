import { motion } from "framer-motion";
import { UseFormReturnType } from "@mantine/form";
import { IconChevronRight, IconCircleCheckFilled } from "@tabler/icons-react";
import React from "react";

type Step = {
  title: string;
  icon: React.ReactNode;
  fields: string[];
};

type StepSidebarProps = {
  steps: Step[];
  form: UseFormReturnType<any>;
  isMobile?: boolean;
};

const StepSidebar = ({ steps, form, isMobile = false }: StepSidebarProps) => {
  const isStepComplete = (stepFields: string[]) => {
    if (stepFields.length === 0) return false;
    return stepFields.every((field) => {
      const value = form.getValues()[field as keyof typeof form.getValues];
      if (Array.isArray(value)) return value.length > 0;
      return value !== "" && value !== undefined && value !== null;
    });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const iconVariants = {
    initial: { scale: 1 },
    active: { scale: 1.1, transition: { duration: 0.3 } },
  };

  if (isMobile) {
    return (
      <div className="lg:hidden sticky top-0 z-10 bg-mine-shaft-900 py-3 shadow-sm overflow-x-hidden">
        <div className="relative w-full px-4">
          {/* Progress line background */}
          <div className="absolute top-1/2 left-4 right-4 h-[2px] bg-mine-shaft-700 transform -translate-y-1/2" />
          
          {/* Animated progress fill */}
          <motion.div
            className="absolute top-1/2 left-4 h-[2px] bg-bright-sun-400 transform -translate-y-1/2"
            initial={{ width: 0 }}
            animate={{
              width: `${(steps.filter(step => isStepComplete(step.fields)).length / (steps.length - 1)) * 100}%`
            }}
            transition={{ duration: 0.5 }}
          />
          
          {/* Steps container with scroll snap */}
          <div className="flex relative z-10 w-full overflow-x-auto snap-x snap-mandatory hide-scrollbar">
            <div className="flex w-full px-2">
              {steps.map((step, index) => {
                const complete = isStepComplete(step.fields);
                const active = index <= steps.findIndex(s => !isStepComplete(s.fields));
                const isLast = index === steps.length - 1;
                
                return (
                  <div 
                    key={index}
                    className="flex-shrink-0 w-1/4 snap-center px-1" // Each step takes 25% width
                  >
                    <motion.div
                      className="flex flex-col items-center"
                      whileTap={{ scale: 0.95 }}
                    >
                      {/* Step circle */}
                      <div className={`h-7 w-7 flex mb-4 items-center justify-center relative
                        ${complete 
                          ? "bg-bright-sun-400 text-mine-shaft-900 shadow-md" 
                          : active 
                            ? "bg-mine-shaft-600 text-mine-shaft-200 border border-mine-shaft-500" 
                            : "bg-mine-shaft-800 text-mine-shaft-400"
                        }`}
                      >
                        {complete ? (
                          <IconCircleCheckFilled size={16} />
                        ) : (
                          React.isValidElement(step.icon) 
                            ? React.cloneElement(step.icon)
                            : null
                        )}
                        {!isLast && active && !complete && (
                          <div className="absolute left-full ml-1 text-bright-sun-400">
                            <IconChevronRight size={16} />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Custom scrollbar */}
        <div className="h-1 bg-mine-shaft-700 mt-1 mx-4 rounded-full">
          <motion.div 
            className="h-full bg-bright-sun-400 rounded-full"
            animate={{
              width: `${(steps.filter(step => isStepComplete(step.fields)).length / (steps.length - 1)) * 100}%`
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="hidden lg:block w-full lg:w-1/3 p-6 rounded-lg">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-xl font-semibold mb-4"
      >
        Steps to Post a Job
      </motion.h2>
      <motion.ul
        initial="hidden"
        animate="show"
        variants={containerVariants}
        className="space-y-4 text-xs sm:text-base"
      >
        {steps.map((step, index) => {
          const complete = isStepComplete(step.fields);
          return (
            <motion.li
              key={index}
              variants={itemVariants}
              className={`flex items-center gap-3 text-sm ${
                complete ? "text-bright-sun-400" : "text-mine-shaft-400"
              }`}
            >
              <motion.div
                variants={iconVariants}
                animate={complete ? "active" : "initial"}
                className={`h-8 w-8 flex items-center justify-center shadow-md ${
                  complete ? "border-02 border-bright-sun-400" : "bg-mine-shaft-800"
                }`}
              >
                {step.icon}
              </motion.div>
              <motion.span
                className={`font-medium ${
                  complete ? "text-bright-sun-400" : ""
                }`}
              >
                {step.title}
              </motion.span>
            </motion.li>
          );
        })}
      </motion.ul>
    </div>
  );
};

export default StepSidebar;