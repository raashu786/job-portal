import React, { useEffect, useState } from 'react';
import { Button, Title, Text } from '@mantine/core';
import { IconLock } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Unauthorized = () => {
  const navigate = useNavigate();
  const [counter, setCounter] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prev) => prev - 1);
    }, 1000);

    const timeout = setTimeout(() => {
      navigate('/');
    }, 5000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [navigate]);

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <IconLock size={64} className="text-red-500 mb-4" />
      <Title order={2} className="mb-2">
        Access Denied
      </Title>
      <Text size="lg" className="mb-2 text-gray-500">
        You do not have permission to view this page.
      </Text>
      <Text size="sm" className="mb-4 text-gray-400">
        Redirecting to home in <span className="text-white font-semibold">{counter}</span> seconds...
      </Text>
      <Button onClick={() => navigate('/')} color="bright-sun.4" variant="outline">
        Go to Home Now
      </Button>
    </motion.div>
  );
};

export default Unauthorized;
