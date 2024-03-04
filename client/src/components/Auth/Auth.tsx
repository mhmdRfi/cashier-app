import { useEffect } from "react";
import { useAppDispatch, 
    // useAppSelector 
} from "../../redux/hook";
import { keepLogin } from "../../redux/reducer/authReducer";
// import { Navigate } from 'react-router-dom';

interface AuthProps {
    children: React.ReactNode;
}
const Auth: React.FC<AuthProps> = ({children}) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(keepLogin());
    }, [dispatch]);




    return <>{children}</>
};



// const UseAuth: React.FC<AuthProps> = ({children}) => {
    
//     const isLogin = useAppSelector(state => state.authReducer.isLogin);


//     if (!isLogin) {
//         return <Navigate to="/" />;
//     }

//     return <>{children}</>
// };

export default Auth;