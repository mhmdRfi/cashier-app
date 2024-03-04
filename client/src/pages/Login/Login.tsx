import { useAppDispatch } from "../../redux/hook";
import { useState } from "react";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../redux/reducer/authReducer";
import {
	Box,
	Button,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	InputRightElement,
	Stack,
	Text,
	Image,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import background from "../../assets/coffee.jpg";
import logo from "../../assets/ee8e2ef267a626690ecec7c84a48cfd4.png";
import toast from "react-hot-toast";

function Login() {
	const [showPassword, setShowPassword] = useState(false);

	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const formik = useFormik({
		initialValues: {
			email: "",
			password: "",
		},
		onSubmit: async (values) => {
			const user = await dispatch(
				login(values.email, values.password)
			);
			if (user) {
				if (user.roleId === 1) {
					navigate("/dashboard-admin");
				} else if (user.roleId === 2) {
					navigate("/cashier");
				} else {
					toast.error("Login gagal");
				}
			}
		},
	});

	return (
		<Box>
			<Box
				width={"100vw"}
				height={"100vh"}
				backgroundColor={"black"}
				position={"relative"}
			>
				<Box
					width={"100vw"}
					opacity={"0.5"}
					padding={"0"}
					backgroundImage={background}
					height={"100vh"}
					backgroundSize={"cover"}
				></Box>

				<Box
					position={"absolute"}
					left={{ base: "0", lg: "150px" }}
					right={{ base: "0", lg: "auto" }}
					margin={{ base: "0 auto", lg: "0" }}
					// display={{base:'block', md:'none'}}
					top={{ base: "20px", lg: "200px" }}
					maxWidth={{ base: "300px", md: "500px" }}
					overflow={"hidden"}
				>
					<Image
						src={logo}
						boxSize={{ base: "75px", md: "100px" }}
						margin={{ base: "auto", lg: "0" }}
					/>
					<Text
						color={"white"}
						fontSize={{ base: "32px", lg: "72px" }}
						fontWeight={"800"}
						margin={"0"}
						textAlign={{ base: "center", lg: "left" }}
					>
						Starbucks
					</Text>
					<Text
						color={"white"}
						fontSize={{ base: "12px", lg: "24px" }}
						fontWeight={"500"}
						margin={"0"}
						textAlign={{ base: "center", lg: "left" }}
					>
						The overprice coffee to make you look rich even though you
						are poor.
					</Text>
				</Box>

				<Box
					boxShadow={"0px 1px 5px gray"}
					padding={"30px"}
					// display={'none'}
					borderRadius={"10px"}
					alignItems={"center"}
					backgroundColor={"white"}
					position={"absolute"}
					top={{ base: "200px", lg: "150px" }}
					width={{ base: "300px", md: "400px" }}
					right={{ base: "0", md: "150px" }}
					left={{ base: "0", md: "auto" }}
					margin={{ base: "0 auto", md: "0" }}
				>
					<Text fontWeight={"bold"} fontSize={"24px"}>
						Login Form
					</Text>
					<Text fontSize={"12px"} color={"gray"} paddingTop={"0px"}>
						Lorem ipsum dolor sit amet, consectetur adipisicing elit.{" "}
					</Text>

					<form onSubmit={formik.handleSubmit}>
						<Stack marginTop={"30px"}>
							<FormControl id="email">
								<FormLabel
									fontSize={"14px"}
									color={"gray"}
									marginBottom={"10px"}
								>
									Email
								</FormLabel>
								<InputGroup>
									<Input
										name="email"
										placeholder="enter email"
										value={formik.values.email}
										onChange={formik.handleChange}
										required
										width={"100%"}
										padding={"12px 20px"}
										border={"1px solid #6666"}
										borderRadius={"100px"}
										fontSize={"16px"}
									/>
								</InputGroup>
							</FormControl>
							<FormControl id="password">
								<FormLabel
									fontSize={"14px"}
									color={"gray"}
									marginBottom={"10px"}
								>
									Password
								</FormLabel>
								<InputGroup>
									<Input
										type={showPassword ? "text" : "password"}
										name="password"
										value={formik.values.password}
										onChange={formik.handleChange}
										required
										placeholder="enter password"
										width={"100%"}
										padding={"12px 20px"}
										border={"1px solid #6666"}
										borderRadius={"100px"}
										fontSize={"16px"}
									/>
									<InputRightElement>
										<Button
											variant={"ghost"}
											onClick={() =>
												setShowPassword(
													(showPassword) => !showPassword
												)
											}
											backgroundColor={"transparent"}
										>
											{showPassword ? <ViewIcon /> : <ViewOffIcon />}
										</Button>
									</InputRightElement>
								</InputGroup>
							</FormControl>

							<Stack marginTop={"30px"}>
								<Button
									bg={"#286043"}
									color={"white"}
									_hover={{
										bg: "white",
										color: "#286043",
										border: "1px solid #286043",
									}}
									borderRadius={"100px"}
									type="submit"
								>
									Sign in
								</Button>
								<Link to="/forgot-password">
									<Text
										fontSize={"12px"}
										color={"blue.500"}
										marginBottom={"10px"}
										textAlign={"center"}
									>
										Forgot password?
									</Text>
								</Link>
							</Stack>
						</Stack>
					</form>
				</Box>
			</Box>
		</Box>
	);
}

export default Login;
