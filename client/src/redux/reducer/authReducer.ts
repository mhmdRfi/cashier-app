import {
	createSlice,
	Dispatch,
	PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

interface User {
	id: number | null;
	email: string;
	username: string;
	avatar: string;
	roleId: number | null;
}

interface UserState {
	user: User;
	isLogin: boolean;
}

const initialState: UserState = {
	user: {
		id: null,
		email: "",
		username: "",
		avatar: "",
		roleId: null,
	},
	isLogin: false,
};

const authReducer = createSlice({
	name: "AuthReducer",
	initialState,
	reducers: {
		setUser: (state, action: PayloadAction<User>) => {
			const { id, email, username, avatar, roleId } = action.payload;

			state.user = {
				id,
				email,
				username,
				avatar,
				roleId,
			};
		},
		loginSuccess: (state) => {
			state.isLogin = true;
		},
		logoutSuccess: (state) => {
			state.isLogin = false;
			localStorage.removeItem("token");
		},
		keepLoginSuccess: (state) => {
			state.isLogin = true;
		},
	},
});

export const login = (email: string, password: string) => {
	return async (dispatch: Dispatch) => {
		try {
			const res = await axios.post(
				`${import.meta.env.VITE_APP_API_BASE_URL}/auth/login`,
				{
					email,
					password,
				}
			);

			localStorage.setItem("token", res?.data?.data?.token);
			dispatch(setUser(res?.data?.data?.user));
			dispatch(loginSuccess());
			toast.success("login is successful")
			return res?.data?.data?.user;
		} catch (err) {
			if (err && axios.isAxiosError(err)) {
				const axiosError = err as AxiosError;
				if (axiosError.response) {
					toast.error("Login failed")
				}
			} else {
				console.error("An unexpected error occurred:", err);
			}
		}
	};
};

export const keepLogin = () => {
	return async (dispatch: Dispatch) => {
		try {
			const token = localStorage.getItem("token");

      if (token){
        const res = await axios.get(`${import.meta.env.APP_API_BASE_URL}/auth/keep-login`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        dispatch(setUser(res?.data?.data));
        dispatch(keepLoginSuccess());
      }
    } catch (err){
      localStorage.removeItem("token")
      if (err && axios.isAxiosError(err)) {
        const axiosError = err as AxiosError;
        if (axiosError.response) {
			toast.error("Invalid Token")
        }
      } else {
        
        console.error('An unexpected error occurred:', err);
      }
    }
  }
}

export const {
	setUser,
	loginSuccess,
	logoutSuccess,
	keepLoginSuccess,
} = authReducer.actions;

export default authReducer.reducer;
