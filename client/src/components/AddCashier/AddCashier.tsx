import { FC } from "react";
import {
	Button,
	Input,
	useDisclosure,
	Modal,
	ModalBody,
	ModalContent,
	ModalOverlay,
	ModalHeader,
	ModalCloseButton,
	ModalFooter,
	FormControl,
	FormLabel,
	Text,
	Icon,
	FormErrorMessage,
	Select,
} from "@chakra-ui/react";
import * as Yup from "yup";
import { useFormik } from "formik";
import axios from "axios";
import { IconPlus } from "@tabler/icons-react";
import toast from "react-hot-toast";
import { BeatLoader } from "react-spinners";
import { useState, CSSProperties } from "react";

const CashierScheme = Yup.object().shape({
	email: Yup.string()
		.email("email is invalid")
		.required("email is required"),
	username: Yup.string().required("Tanggal tiket wajib diisi"),
	password: Yup.string().required("Password tiket wajib diisi"),
});

const override: CSSProperties = {
	display: "block",
	margin: "0 auto",
	borderColor: "white",
};

interface AddCashierProps {
	onCashierAdded: () => void;
}
const AddCashier: FC<AddCashierProps> = ({ onCashierAdded }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const token = localStorage.getItem("token");

	//   const [addCashier, setAddCashier] = useState();
	const [loading, setLoading] = useState(false);

	const addCashier = async (
		email: string,
		username: string,
		password: string,
		type: string
	) => {
		try {
			setLoading(true);
			await axios.post(
				`${import.meta.env.VITE_APP_API_BASE_URL}/auth/addcashier`,
				{
					email,
					username,
					password,
					type,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			onCashierAdded();
			setLoading(false);
			toast.success("Successfully add cashier");
			onClose();
		} catch (err) {
			console.log(err);
			setLoading(false);
			toast.error("Add cashier failed");
		}
	};

	const formik = useFormik({
		initialValues: {
			email: "",
			username: "",
			password: "pass123",
			type: "",
		},

		validationSchema: CashierScheme,
		onSubmit: (values, { resetForm }) => {
			addCashier(
				values.email,
				values.username,
				values.password,
				values.type
			);
			resetForm({
				values: {
					email: "",
					username: "",
					password: "pass123",
					type: "",
				},
			});
		},
	});

	return (
		<>
			<Button
				onClick={onOpen}
				bg={"#286043"}
				color={"white"}
				_hover={{
					bg: "#EAEFEC",
					color: "#286043",
					border: "2px solid #286043",
				}}
				borderRadius={"100px"}
				display={"flex"}
				gap={"6px"}
				alignItems={"center"}
				justifyContent={"center"}
				padding={"14px 24px 12px 24px"}
			>
				<Text fontSize={{ base: "11px", md: "16px" }}>Add New</Text>
				<Icon
					as={IconPlus}
					color={"#FFFFF"}
					display={{ base: "none", md: "block" }}
				/>
				<Modal isOpen={isOpen} onClose={onClose}>
					<ModalOverlay />
					<form onSubmit={formik.handleSubmit}>
						<ModalContent>
							<ModalHeader>Add Cashier</ModalHeader>
							<ModalCloseButton />
							<ModalBody pb={6}>
								<FormControl
									isInvalid={
										!!(formik.touched.email && formik.errors.email)
									}
								>
									<FormLabel>Email</FormLabel>
									<Input
										name="email"
										placeholder="Enter email"
										type="email"
										value={formik.values.email}
										onChange={formik.handleChange}
									/>

									{formik.touched.email && formik.errors.email && (
										<FormErrorMessage>
											{formik.errors.email}
										</FormErrorMessage>
									)}
								</FormControl>

								<FormControl
									isInvalid={
										!!(
											formik.touched.username &&
											formik.errors.username
										)
									}
								>
									<FormLabel>Username</FormLabel>
									<Input
										name="username"
										placeholder="Enter username"
										value={formik.values.username}
										onChange={formik.handleChange}
									/>

									{formik.touched.username &&
										formik.errors.username && (
											<FormErrorMessage>
												{formik.errors.username}
											</FormErrorMessage>
										)}
								</FormControl>

								<FormControl
									isInvalid={
										!!(formik.touched.type && formik.errors.type)
									}
								>
									<FormLabel>Type</FormLabel>
									<Select
										name="type"
										placeholder="Choose cashier type"
										value={formik.values.type}
										onChange={formik.handleChange}
									>
										<option value={"full-time"}>Full-time</option>
										<option value={"part-time"}>Part-time</option>
									</Select>

									{formik.touched.type && formik.errors.type && (
										<FormErrorMessage>
											{formik.errors.type}
										</FormErrorMessage>
									)}
								</FormControl>

								<FormControl
									isInvalid={
										!!(
											formik.touched.password &&
											formik.errors.password
										)
									}
								>
									<FormLabel>Password</FormLabel>
									<Input
										name="password"
										placeholder="pass123"
										value={formik.values.password}
										disabled={true}
										onChange={formik.handleChange}
									/>

									{formik.touched.password &&
										formik.errors.password && (
											<FormErrorMessage>
												{formik.errors.password}
											</FormErrorMessage>
										)}
								</FormControl>
							</ModalBody>

							<ModalFooter gap={"10px"}>
								{loading ? (
									<Button
										bg={"#286043"}
										color={"white"}
										borderRadius={"100px"}
                    w={"120px"}
										// isDisabled
									>
										<div className="sweet-loading">
											<BeatLoader
												color={"#ffffff"}
												loading={loading}
												cssOverride={override}
												size={10}
												aria-label="spiner"
												data-testid="loader"
											/>
										</div>
									</Button>
								) : (
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
                    w={"120px"}
									>
										Add Cashier
									</Button>
								)}
								<Button onClick={onClose} borderRadius={"100px"}>
									Cancel
								</Button>
							</ModalFooter>
						</ModalContent>
					</form>
				</Modal>

				{/* <Tiket display='none' buatTicket={buatTicket}/>   */}
			</Button>
		</>
	);
};

export default AddCashier;
