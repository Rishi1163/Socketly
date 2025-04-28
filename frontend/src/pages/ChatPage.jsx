import React, { useEffect, useState, useRef } from 'react'
import img from '../assets/avatar.png'
import { IoClose, IoSend } from "react-icons/io5";
import { CiImageOn } from "react-icons/ci";
import { useDispatch, useSelector } from 'react-redux'
import { getMessages, sendMessage } from '../actions/messageActions' // 🔥 UPDATED
import { socket } from '../socket/socket';
import { addMessages } from '../store/messageSlice';

const ChatPage = ({ close, selectedUser }) => {
  const dispatch = useDispatch()
  const { messages } = useSelector((state) => state.message)
  const { user } = useSelector((state) => state.auth)

  const [text, setText] = useState('') // 🔥 UPDATED
  const [selectedImage, setSelectedImage] = useState(null)
  const [previewImageUrl, setPreviewImageUrl] = useState(null)
  const fileInputRef = useRef(null)
  const messagesEndRef = useRef(null) // 🔥 UPDATED

  useEffect(() => {
    if (selectedUser?._id) {
      dispatch(getMessages(selectedUser._id))
    }

    socket.on("newMessage", (msg) => {
      const isRelevant =
        (msg.sender === selectedUser._id && msg.receiver === user._id) ||
        (msg.sender === user._id && msg.receiver === selectedUser._id);

      if (isRelevant) {
        dispatch(addMessages(msg));
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    });

    return () => {
      socket.off("newMessage");
    };
  }, [dispatch, selectedUser])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedImage(file)
      setPreviewImageUrl(URL.createObjectURL(file))
    }
    e.target.value = null
  }

  const clearImagePreview = () => {
    setSelectedImage(null)
    setPreviewImageUrl(null)
  }

  // 🔥 NEW: Send message handler
  const handleSendMessage = async () => {
    if (!text.trim() && !selectedImage) return

    await dispatch(sendMessage(text, selectedImage, selectedUser._id))

    setText('')
    clearImagePreview()

    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  return (
    <div className='grid lg:grid-rows-[0.8fr_5fr_0.9fr] grid-rows-[0.5fr_9fr_0.4fr] max-h-screen'>
      {/* Header */}
      <div className='border-b border-gray-700 min-h-16 max-h-24'>
        <div className='flex justify-between'>
          <div className='flex gap-2 items-center px-3 py-2'>
            <img src={selectedUser?.profilePic || img} alt="" className='h-12 w-12 rounded-full' />
            <p>{selectedUser?.fullName || "Unknown"}</p>
          </div>
          <button onClick={close} className='flex items-center px-2 mr-4 cursor-pointer'>
            <IoClose size={25} />
            <p className='text-sm'>Close</p>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className='max-h-[80vh] lg:min-h-[74vh] lg:max-h-[74vh] p-4 space-y-3 overflow-y-auto scrollbar-hide'>
        {messages.map((msg, index) => {
          const fromSelf = msg.sender === user._id;
          return (
            <div key={index} className={`chat ${fromSelf ? 'chat-end' : 'chat-start'}`}>
              <div className="chat-image avatar">
                <div className="w-12 rounded-full">
                  <img
                    src={fromSelf ? (user.profilePic || img) : (selectedUser?.profilePic || img)}
                    alt="profile"
                  />
                </div>
              </div>
              <div className="chat-bubble flex flex-col gap-2 relative">
                {msg.image && (
                  <img
                    src={msg.image}
                    alt="attached"
                    className="md:max-w-xs max-w-[200px] mt-2 rounded-md"
                  />
                )}
                <div className='flex justify-end items-end gap-2 w-full'>
                  {msg.text && (
                    <span className="text-sm flex-grow">{msg.text}</span>
                  )}
                  <span className="text-[10px] text-gray-300">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Section */}
      <div className='min-h-20 px-2 py-3 relative'>
        {/* Image Preview (absolute, above input) */}
        {previewImageUrl && (
          <div className="absolute -top-32 left-6 w-32 h-32 overflow-hidden rounded-md shadow-md border border-gray-600 bg-black">
            <div className="relative w-full h-full">
              <img
                src={previewImageUrl}
                alt="Preview"
                className="object-cover w-full h-full"
              />
              <button
                onClick={clearImagePreview}
                className="absolute top-1 right-0 bg-black bg-opacity-70 rounded-full p-1 hover:bg-opacity-90"
              >
                <IoClose className="text-white" size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Input bar */}
        <div className='border border-gray-500 w-full h-full rounded-full px-5 flex gap-3 items-center'>
          <input
            type="text"
            value={text} // 🔥 UPDATED
            onChange={(e) => setText(e.target.value)} // 🔥 UPDATED
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} // 🔥 UPDATED
            className='outline-none flex-1 h-full bg-transparent text-white '
            placeholder='Type a message'
          />

          {/* File input */}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="cursor-pointer p-3">
            <CiImageOn size={25} />
          </label>

          <button className='p-3' onClick={handleSendMessage}> {/* 🔥 UPDATED */}
            <IoSend size={25} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatPage
