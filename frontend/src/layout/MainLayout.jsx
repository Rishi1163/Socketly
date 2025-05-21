import React, { useState } from 'react'
import ChatPage from '../pages/ChatPage'
import Sidebar from '../components/Sidebar'
import StartConvo from '../components/StartConvo'

const MainLayout = () => {
  const [selectedUser, setSelectedUser] = useState(null)

  return (
    <div className='h-screen w-full'>
      <div className='grid grid-cols-1 md:grid-cols-[0.8fr_2.2fr] lg:grid-cols-[1fr_3fr] h-full'>
        {/* Sidebar */}
        <div className='md:border-r md:border-gray-700 border-0 overflow-y-auto'>
          <Sidebar onSelectUser={setSelectedUser} />
        </div>

        {/* Chat Area */}
        <div className='h-full'>
          {
            selectedUser ? (
              <ChatPage selectedUser={selectedUser} close={() => setSelectedUser(null)} />
            ) : (
              <StartConvo />
            )
          }
        </div>
      </div>
    </div>
  )
}

export default MainLayout
