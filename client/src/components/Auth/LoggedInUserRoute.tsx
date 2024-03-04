// import { useEffect } from "react";
import {
	// useAppDispatch,
	useAppSelector,
} from "../../redux/hook";
import { Navigate } from "react-router-dom";

interface AuthProps {
	children: React.ReactNode;
}

export const LoggedInRoute: React.FC<AuthProps> = ({ children }) => {

	const check = localStorage.getItem("token");

	if (check) {
		return <>{children}</>;
	} else if (!check) {
		return <Navigate to="/" />;
	}
};

export const LogInRoute: React.FC<AuthProps> = ({ children }) => {
	const isLogin = useAppSelector(
		(state) => state.authReducer.isLogin
	);
	const user = useAppSelector((state) => state.authReducer.user);


	const isAdmin = user.roleId;
	if (isLogin) {
		if (isAdmin == 1) {
			return <Navigate to="/cashier-data" />;
		} else if (isAdmin == 2) {
			return <Navigate to="/cashier" />;
		}
	} else {
		return <>{children}</>;
	}

};

