import React from 'react';
import { PiPlugsConnectedBold } from "react-icons/pi";
import { FaRegUser } from "react-icons/fa6";
import { FiLogOut } from "react-icons/fi";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../actions/authActions';
import { socket } from '../socket/socket';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout(navigate, socket));
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className='min-h-14 max-h-[4.5rem] w-full border-b pb-2 border-gray-700'>
      <div className='flex py-2 justify-between'>
        <Link to={'/'} className='px-4 my-4 flex gap-2'>
          <PiPlugsConnectedBold size={35} />
          <p className='pt-1 text-xl font-semibold'>Socketly</p>
        </Link>

        {!isAuthPage && (
          <div className='flex px-5 items-center gap-5'>
            <Link to={'/profile'} className='flex gap-1 items-center cursor-pointer'>
              <FaRegUser size={20} />
              <p>Profile</p>
            </Link>
            <button onClick={handleLogout} className='flex gap-1 items-center cursor-pointer'>
              <FiLogOut size={20} />
              <p>Logout</p>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
