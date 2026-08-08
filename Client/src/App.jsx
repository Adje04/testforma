import React from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './Pages/Home/Home'
import Library from './Pages/Library/Library'
import Login from './Pages/Login/Login'
import OtpCode from './Pages/OtpCode/OtpCode'
import Registration from './Pages/Registration/Registration'
import QuestionCategory from './Pages/Admin/Categories/QuestionCategory'
import ListCategory from './Pages/Admin/Categories/ListCategory'
import Create from './Pages/Admin/resources/Create'
import Dashboard from './Pages/Dashboard/Dashboard'
import { UserProvider } from './State/UserContext'
import CreateQuestion from './Pages/Question/CreateQuestion'
import ListQuestion from './Pages/Question/ListQuestion'
import UserDashboard from './Pages/Dashboard/UserDashboard'
import ProtectedRoute from './utils/ProtectedRoute'
import ListCategoryResource from './Pages/Admin/resources/ListCategoryResource'
import QuestionDetail from './Pages/Question/QuestionDetail'
import ListCommunities from './Pages/Communities/ListCommunities'
import Discussion from './Pages/Discussion/Discussion'
import VerifyEmail from './Pages/Password/VerifyEmail'
import ForgetPassword from './Pages/Password/ForgetPassword'
import ConfirmEmail from './Pages/Password/ConfirmEmail'
import Profile from './Pages/Profile/Profile'
import Errors from './errors/Errors'
import Error404 from './errors/Error404'
import AboutPage from './Pages/AboutPage/AboutPage'
import UserHome from './Pages/Home/UserHome'


export default function App() {
  return (
    <>

      <UserProvider>
        <BrowserRouter>
          <Routes>

            <Route path='/registration' element={<Registration />} />
            <Route path='/login' element={<Login />} />
            <Route path='/code-confirmation' element={<OtpCode />} />


            <Route path='/verify-email' element={<VerifyEmail />} />
            <Route path='/email-confirmation' element={<ConfirmEmail />} />
            <Route path='/forget-password/' element={<ForgetPassword />} />


            <Route path='/' element={<Home />} />
            <Route path='/about' element={<AboutPage />} />
            <Route path='/bibliothèque' element={<Library />} />
            <Route path='/list-question' element={<ListQuestion />} />
            <Route path="/question/:questionId" element={<QuestionDetail />} />
            <Route path="/communities" element={<ListCommunities />} />

            <Route path='/discussion' element={<ProtectedRoute element={<Discussion />} isAdmin={false} />} />

            <Route path='/userDashboard' element={<ProtectedRoute element={<UserDashboard />} isAdmin={false} />}>

              <Route path='create-question' element={<CreateQuestion />} />
              <Route path='list-question' element={<ListQuestion />} />
              <Route path="question/:questionId" element={<QuestionDetail />} />
              <Route path='bibliothèque' element={<Library />} />
              <Route path='communities' element={<ListCommunities />} />
              <Route path='profile' element={<Profile />} />
              <Route path='welcome' element={<UserHome />} />

            </Route>


            <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} isAdmin={true} />} >
              <Route path='create-category' element={<QuestionCategory />} />
              <Route path='list-category' element={<ListCategory />} />
              <Route path='list-resource-category' element={<ProtectedRoute element={<ListCategoryResource />} isAdmin={true} />} />
              <Route path='create-resource' element={<Create />} />
            </Route>

            {/* Gestion d'erreurs générales */}
            <Route path="/error" element={<Errors />} />
            <Route path="*" element={<Error404 />} />
          </Routes>
        </BrowserRouter>
      </UserProvider >
    </>
  )
}







