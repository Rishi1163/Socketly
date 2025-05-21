import React, { useState } from 'react';
import defaultAvatar from '../assets/avatar.png';
import { BiCamera, BiUser, BiEdit, BiCheck } from 'react-icons/bi';
import { CiMail } from "react-icons/ci";
import { useDispatch, useSelector } from 'react-redux';
import { editFullName, editProfilepic } from '../actions/authActions';

const ProfilePage = () => {
  const { user, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [isEditingName, setIsEditingName] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [previewImage, setPreviewImage] = useState(user?.profilePic || defaultAvatar);

  const handleEditClick = async () => {
    if (isEditingName) {
      await dispatch(editFullName(fullName));
      setIsEditingName(false);
    } else {
      setIsEditingName(true);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // show preview
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);

      // upload
      await dispatch(editProfilepic(file));
    }
  };

  return (
    <div className='pt-20 min-h-screen'>
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className='text-2xl font-semibold'>Profile</h1>
            <p className='mt-2'>Your profile information.</p>
          </div>

          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={previewImage}
                className='size-32 rounded-full object-cover border-4'
                alt="profile"
              />
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200"
              >
                <BiCamera className='w-5 h-5 text-base-200' />
                <input
                  type="file"
                  name='profilePic'
                  id='avatar-upload'
                  className='hidden'
                  accept='image/*'
                  onChange={handleImageChange}
                />
              </label>
            </div>
            <p className='text-sm text-zinc-400'>{loading ? "Uploading..." : "Click camera icon to upload"}</p>
          </div>

          {/* Full Name section */}
          <div className='space-y-6'>
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <BiUser className='w-4 h-4' />
                Full Name
              </div>
              <div className="relative">
                <input
                  type="text"
                  name='fullName'
                  disabled={!isEditingName}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="px-4 py-2.5 pr-10 bg-base-200 rounded-lg border w-full outline-none disabled:opacity-60"
                />
                <span
                  onClick={handleEditClick}
                  className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-base-content hover:text-primary"
                >
                  {isEditingName ? <BiCheck className="w-5 h-5" /> : <BiEdit className="w-5 h-5" />}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <CiMail className='w-4 h-4' />
                Email
              </div>
              <p className='px-4 py-2.5 bg-base-200 rounded-lg border'>{user?.email}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;