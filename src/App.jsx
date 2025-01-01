import React from 'react'
// import './App.css'
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import ResponsiveLayout from './components/responsive/Responsive_layout';
import Home from './components/pages/home/Home';
import LoginPage from './components/pages/login/LoginPage';
import SignupPage from './components/pages/login/SignupPage';
import PrivateRoute from './components/privateRoute/PrivateRoute';
import Notfound from './components/pages/Not_found/NotFound';

function App() {

  return(
          <div className='App'>
                <Router>
                      <Routes>

                            <Route path='/' element={<Home></Home>}></Route>
                            <Route path='/login' element={<LoginPage></LoginPage>}></Route>
                            <Route path='/signup' element={<SignupPage></SignupPage>}></Route>


                            <Route element={<PrivateRoute></PrivateRoute>}>
                              {/* <Route path='/chat' element={<Chat></Chat>}></Route>
                              <Route path='/chat/:id/messages' element={<ChatMessage></ChatMessage>}></Route> */}
                              <Route  path='/chat' element={<ResponsiveLayout></ResponsiveLayout>}></Route>
                            </Route>

                            <Route path='*' element={<Notfound />}></Route>


                      </Routes>
                  </Router>

          </div>

  )
}

export default App;
