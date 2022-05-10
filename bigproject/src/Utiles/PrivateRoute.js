import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ children, ...rest }) => {
    if (!localStorage.getItem('user')) {
        return <Navigate replace to='/login' />;
    }
    return children ? children : <Outlet />;
};

export default PrivateRoute;
