// MessageMenu.tsx
import { MoreVertical } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MessageMenuProps {
  messageId: number;
  onEdit: () => void;
  onDeleteForMe: () => void;
  onDeleteForEveryone: () => void;
}

const MessageMenu = ({ messageId, onEdit, onDeleteForMe, onDeleteForEveryone }: MessageMenuProps) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const toggleMenu = () => {
    setOpen(prev => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Animation variants
  const menuVariants = {
    hidden: { 
      opacity: 0, 
      y: -10,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300
      }
    },
    exit: { 
      opacity: 0, 
      y: -10,
      scale: 0.95,
      transition: { duration: 0.15 } 
    }
  };

  const itemVariants = {
    hover: { 
      x: 4,
      transition: { type: "spring", stiffness: 300 } 
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={toggleMenu} 
        className={`p-1 rounded-full transition-all duration-200 ${open ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
        aria-label="Message options"
      >
        <MoreVertical size={10} className="text-gray-500 dark:text-gray-400" />
      </button>
      
      <AnimatePresence>
        {open && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={menuVariants}
            className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 shadow-xl rounded-lg z-20 overflow-hidden border border-gray-100 dark:border-gray-700"
          >
            <motion.button
              variants={itemVariants}
              whileHover="hover"
              onClick={() => {
                setOpen(false);
                onEdit();
              }}
              className="flex items-center w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
            >
              <span className="mr-3 text-gray-700 dark:text-gray-300">✏️</span>
              <span className="text-gray-800 dark:text-gray-200">Edit</span>
            </motion.button>
            
            <div className="border-t border-gray-100 dark:border-gray-700" />
            
            <motion.button
              variants={itemVariants}
              whileHover="hover"
              onClick={() => {
                setOpen(false);
                onDeleteForMe();
              }}
              className="flex items-center w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
            >
              <span className="mr-3 text-gray-700 dark:text-gray-300">🗑️</span>
              <span className="text-gray-800 dark:text-gray-200">Delete for Me</span>
            </motion.button>
            
            <div className="border-t border-gray-100 dark:border-gray-700" />
            
            <motion.button
              variants={itemVariants}
              whileHover="hover"
              onClick={() => {
                setOpen(false);
                onDeleteForEveryone();
              }}
              className="flex items-center w-full text-left px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150"
            >
              <span className="mr-3">❌</span>
              <span>Delete for Everyone</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MessageMenu;