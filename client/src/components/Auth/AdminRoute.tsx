
import { useSelector } from "react-redux";
import { Navigate } from 'react-router-dom';

import { RootState } from "../../redux/store";

interface AuthProps {
	children: React.ReactNode;
}

const AdminRoute: React.FC<AuthProps> = ({ children }) => {
	// const dispatch = useAppDispatch();
	// dispatch(keepLogin());
	const user = useSelector(
		(state: RootState) => state.authReducer.user
	);
    const check = localStorage.getItem("token");
	const isAdmin = user.roleId;
	if (check) {
		if (isAdmin == 1) {
			return <>{children}</>;
		} else if (isAdmin == 2) {
			return <Navigate to="/cashier" />;
		}
	} else {
        return <Navigate to="/" />;
    }
};

export default AdminRoute;
