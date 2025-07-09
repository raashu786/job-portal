import React from 'react';
import { Button, Title, Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { IconAlertTriangle } from '@tabler/icons-react';
import { motion } from 'framer-motion';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <IconAlertTriangle size={64} className="text-yellow-500 mb-4" />
      <Title order={2} className="mb-2">
        404 - Page Not Found
      </Title>
      <Text size="lg" className="mb-4 text-gray-500">
        The page you’re looking for doesn’t exist.
      </Text>
      <Button onClick={() => navigate('/')} color="bright-sun.4" variant="outline">
        Go to Home
      </Button>
    </motion.div>
  );
};

export default NotFound;
