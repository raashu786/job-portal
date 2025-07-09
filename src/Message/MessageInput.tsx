import { useEffect, useRef, useState } from "react";
import { Image, Send, Smile, X } from "lucide-react";
import toast from "react-hot-toast";
import { useChatStore } from "../Services/MessageService";
import { Input } from "@mantine/core";
import debounce from "lodash.debounce";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
 
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);

  const {
    sendMessage,
    sendTypingNotification,
    selectedUser,
    editingMessage,
    setEditingMessage,
    editMessage,
  } = useChatStore();

  useEffect(() => {
    if (editingMessage) {
      setText(editingMessage.text);
    }
  }, [editingMessage]);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setText(prevText => prevText + emojiData.emoji);
    setShowEmojiPicker(false);
  };
const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const allowedTypes = ['image/', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

  if (!allowedTypes.some(type => file.type.startsWith(type))) {
    toast.error("Unsupported file type. Only images and documents are allowed.");
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    toast.error("File must be smaller than 10MB");
    return;
  }

  setImageFile(file);

  // Show preview only if it's an image
  if (file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }
};


  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !imageFile) return;

    try {
      if (editingMessage) {
        await editMessage(editingMessage.id, text.trim());
        setEditingMessage(null);
      } else {
      
      const formData = new FormData();
      
       if (text.trim()) formData.append("text", text.trim());
       if (imageFile) formData.append("file", imageFile);
        await sendMessage(formData);
        
      }

      setText("");
      removeImage();
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Message send failed");
    }
  };

  const debounceStopTyping = useRef(
    debounce((receiverId: number) => {
      sendTypingNotification(receiverId, false);
    }, 2000)
  ).current;

  const handleTyping = (value: string) => {
    setText(value);

    if (!selectedUser?.id) return;

    sendTypingNotification(selectedUser.id, true);
    debounceStopTyping(selectedUser.id);
  };

  return (
    <div className="p-4 w-full bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      {/* Image preview with animation */}
      {imagePreview && (
        <div className="mb-3 relative transition-all duration-300 animate-fade-in">
          <div className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <div className="relative group">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-lg border-2 border-emerald-500"
              />
              <button
                onClick={removeImage}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center shadow-lg transition-transform hover:scale-110"
                type="button"
                aria-label="Remove image"
              >
                <X className="size-4 text-white" />
              </button>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-300">
              Ready to send
            </span>
          </div>
        </div>
      )}

      {/* Editing indicator */}
      {editingMessage && (
        <div className="mb-2 px-3 py-2 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-lg flex justify-between items-center text-sm">
          <span>✏️ Editing message</span>
          <button
            type="button"
            onClick={() => {
              setEditingMessage(null);
              setText("");
            }}
            className="text-red-500 dark:text-red-400 hover:underline ml-2"
          >
            Cancel
          </button>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="relative">
        <div className="flex items-center bg-text-mine-shaft-400 dark:bg-text-mine-shaft-400 rounded-0 px-3 py-2 transition-all duration-200 shadow-sm hover:shadow-md focus-within:ring-0 focus-within:ring-bright-sun-400 focus-within:bg-white dark:focus-within:bg-mine-shaft-950">
          <Input
  type="text"
  styles={{
    input: {
      outline: "none",
      boxShadow: "none",
      border: "none",
      background: "transparent",
    },
  }}
  className="flex-1 text-gray-800 dark:text-white placeholder-text-mine-shaft-400 dark:placeholder-bright-mine-shaft-800"
  placeholder={selectedUser ? `Message ${selectedUser.name}` : "Type a message..."}
  value={text}
  onChange={(e) => handleTyping(e.target.value)}
  onFocus={() => setIsFocused(true)}
  onBlur={() => setIsFocused(false)}
/>

          <div className="flex items-center space-x-2 ml-2">
            <button
              type="button"
              className={`p-2 rounded-0 transition-colors ${
                imagePreview
                  ? "text-emerald-500"
                  : "text-gray-500 hover:text-emerald-500 dark:text-gray-400 dark:hover:text-emerald-400"
              }`}
              onClick={() => fileInputRef.current?.click()}
              aria-label="Attach image"
            >
              <Image size={22} />
            </button>
 <button
              type="button"
              className={`p-2 rounded-0 transition-colors ${
                showEmojiPicker
                  ? "text-bright-sun-400"
                  : "text-gray-500 hover:text-bright-sun-400 dark:text-gray-400 dark:hover:text-bright-sun-400"
              }`}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              aria-label="Select emoji"
            >
              <Smile size={22} />
            </button>
           <input
  type="file"
  accept="image/*,.pdf,.doc,.docx"
  className="hidden"
  ref={fileInputRef}
  onChange={handleImageChange}
/>

            <button
              type="submit"
              disabled={!text.trim() && !imageFile}
              className={`p-2 rounded-0 transition-all ${
                (text.trim() || imageFile)
                  ? "bg-bright-sun-400 text-white hover:bg-emerald-600 transform hover:scale-110"
                  : "bg-text-mine-shaft-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              }`}
              aria-label="Send message"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
 {showEmojiPicker && (
          <div ref={emojiPickerRef} className="absolute bottom-16 right-4 z-10 bg-mine-shaft-400">
            <EmojiPicker 
              onEmojiClick={onEmojiClick}
              width={300}
              height={350}
              previewConfig={{ showPreview: false }}
              skinTonesDisabled
              searchDisabled
            />
          </div>
        )}
        {/* Micro-interaction for typing indicator */}
       {isFocused && text && (
  <div className="absolute -top-6 right-0">
    
    <div className="flex items-center space-x-1 px-2 py-1 bg-bright-sun-400 dark:bg-gray-800 rounded-full shadow-sm">
 <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
        {typeof selectedUser === 'string' 
          ? `${selectedUser.split(' ')[0]} is typing` 
          : selectedUser?.name 
            ? `${selectedUser.name.split(' ')[0]} is typing`
            : "Typing"}
      </span>
      <div className="flex space-x-1">
        <div className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" 
             style={{ animationDelay: '0ms' }} />
        <div className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" 
             style={{ animationDelay: '150ms' }} />
        <div className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" 
             style={{ animationDelay: '300ms' }} />
      </div>
     
    </div>
  </div>
)}
      </form>
    </div>
  );
};

export default MessageInput;