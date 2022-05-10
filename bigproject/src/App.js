import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Aivle from './Screens/Aivle';
import LoginPage from './Screens/LoginPage';
import MainPage from './Screens/MainPage';
import PrivateRoute from './Utiles/PrivateRoute';

import Register from './Screens/Register';
import ResetPassword from './Screens/ResetPassword';
import SendEmail from './Screens/SendEmail';
import Community from './Screens/Community';
import Board from './Screens/Board';

import ModifyPost from './Screens/ModifyPost';
import Write from './Screens/Write';
import Modify_pwd from './Screens/Modify_pwd';
import Questions from './Screens/Questions';
import CreateList from './Components/CreateList';
import Coaching from './Screens/Coaching';
import Modify from './Screens/Modify';
import Modify_feedback from './Screens/Modify_feedback';
import Modify_post from './Screens/Modify_post';

function App() {
    return (
        <Router>
            <Routes>
                <Route path='/register' element={<Register />} />
                <Route path='/login' element={<LoginPage />} />
                <Route
                    path='aivle/main'
                    element={
                        <PrivateRoute>
                            <MainPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path='aivle/video'
                    element={
                        <PrivateRoute>
                            <Aivle />
                        </PrivateRoute>
                    }
                />
                <Route path='/send_email' element={<SendEmail />} />
                <Route path='/reset_password' element={<ResetPassword />} />
                <Route path='/register' element={<Register />} />
                <Route
                    path='/community/:page'
                    element={
                        <PrivateRoute>
                            <Community />
                        </PrivateRoute>
                    }
                />
                <Route
                    path='/modify_feedback'
                    element={
                        <PrivateRoute>
                            <Modify_feedback />
                        </PrivateRoute>
                    }
                />
                <Route
                    path='/modify_post'
                    element={
                        <PrivateRoute>
                            <Modify_post />
                        </PrivateRoute>
                    }
                />
                <Route
                    path='/write'
                    element={
                        <PrivateRoute>
                            <Write />
                        </PrivateRoute>
                    }
                />
                <Route
                    path='/modify'
                    element={
                        <PrivateRoute>
                            <Modify />
                        </PrivateRoute>
                    }
                />
                <Route
                    path='/modifypost/:id'
                    element={
                        <PrivateRoute>
                            <ModifyPost />
                        </PrivateRoute>
                    }
                />
                <Route
                    path='/board/:id'
                    element={
                        <PrivateRoute>
                            <Board />
                        </PrivateRoute>
                    }
                />
                <Route
                    path='/modify_password'
                    element={
                        <PrivateRoute>
                            <Modify_pwd />
                        </PrivateRoute>
                    }
                />
                <Route
                    path='/questions'
                    element={
                        <PrivateRoute>
                            <CreateList />
                        </PrivateRoute>
                    }
                />
                <Route
                    path='/aivle/coaching'
                    element={
                        <PrivateRoute>
                            <Coaching />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </Router>
    );
}
export default App;
