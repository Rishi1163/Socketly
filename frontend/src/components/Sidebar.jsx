import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '../actions/authActions';
import { socket } from '../socket/socket';
import img from '../assets/avatar.png';
import { setOnlineUsers } from '../store/authSlice';

const Sidebar = ({ onSelectUser }) => {
  const dispatch = useDispatch();
  const { allUsers, onlineUsers } = useSelector((state) => state.auth);
  // console.log("onlineUsers",onlineUsers)
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    dispatch(getAllUsers());
    
    socket.on("getOnlineUser", (onlineUserIds) => {
      dispatch(setOnlineUsers(onlineUserIds));
    });

    return () => {
      socket.off("getOnlineUser");
    };
  }, [dispatch]);

  // Filter users based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(allUsers);
    } else {
      const filtered = allUsers.filter(user =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, allUsers]);

  return (
    <div className="w-full min-h-screen rounded-xl lg:p-4 py-3 px-4 overflow-y-auto">
      {/* Search */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search users..."
          className="w-full pl-3 pr-3 py-2 rounded-md bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-2 text-gray-400 hover:text-white"
          >
            ✕
          </button>
        )}
      </div>

      {/* User List */}
      <div className="space-y-3 overflow-y-auto min-h-[95vh]">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => {
            const isOnline = onlineUsers.includes(user._id);

            return (
              <div
                key={user._id}
                className="flex items-center lg:gap-4 gap-1 p-2 rounded-lg hover:bg-gray-700 cursor-pointer transition relative"
                onClick={() => onSelectUser(user)}
              >
                <div className="relative">
                  <img
                    src={user?.profilePic || img}
                    alt={user.fullName}
                    className="lg:w-11 lg:h-11 w-7 h-7 rounded-full object-cover"
                  />
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 bg-green-500 border-2 border-gray-800 rounded-full w-3 h-3 lg:w-3.5 lg:h-3.5"></span>
                  )}
                </div>
                <p className="lg:text-[17px] font-medium sm:text-sm text-white truncate">
                  {user.fullName}
                </p>
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-400 py-4">
            No users found matching "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;