import { Route, Routes } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import ProtectedRoute from "./utils/ProtectedRoute"
import ChatPage from "./pages/ChatPage"
import Header from "./components/Header"
import MainLayout from "./layout/MainLayout"
import ProfilePage from "./pages/ProfilePage"

function App() {

  return (
    <div>
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/"  element={<ChatPage />}/>
          </Route>
          <Route path="/profile" element={<ProfilePage />}/>
        </Route>
      </Routes>
    </div>
  )
}

export default App
