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
    Select,
    Link,
    FormErrorMessage} from '@chakra-ui/react'
import { useFormik } from "formik";
import axios from 'axios';
import toast from 'react-hot-toast';

interface UpdateCashierProps {
    id: number;
    email: string;
    username: string;
    type: string;
    status: string;
    onCashierUpdated : () => void;
}
function UpdateCashier({id, email, username, type, status, onCashierUpdated}: UpdateCashierProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const token = localStorage.getItem("token");

  
  
  const editCashier = async (
    email: string,
    username: string,
    status: string,
    type: string,
    
  ) => {
    try{ 
      await axios.patch(`${import.meta.env.VITE_APP_API_BASE_URL}/user/updatecashier/${id}`, {
      email,
      username,
      status,
      type,
    }
    , {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    );

    toast.success("Edit cashier is successful")
    onCashierUpdated();
    onClose();
    } catch (err){
      console.log(err)
      toast.error("Edit cashier failed")
    }
  };

  const formik = useFormik({
    initialValues:{
    email: email, 
    username: username,
    status: status,
    type: type,
    },

    onSubmit: (values) => {
        editCashier(
          values.email, 
          values.username,
          values.status,
          values.type,
          )
        }
      });

  return (
    <>
        <Link 
        onClick={onOpen}
        >
            <Text fontSize={'14px'} fontWeight={'400'} color={'#949494'}>Edit</Text>
                <Modal
                  isOpen={isOpen}
                  onClose={onClose}
                >
                  
                  <ModalOverlay />
                  <form onSubmit={formik.handleSubmit}>
                  <ModalContent>
                    <ModalHeader>Edit Cashier</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>

                      <FormControl isInvalid={!!(
                      formik.touched.email && formik.errors.email)}>
                        <FormLabel>Email</FormLabel>
                        <Input name="email"
                        // placeholder='Enter email'
                        type='email'
                        value={formik.values.email}
                        onChange={formik.handleChange} />

                        {formik.touched.email && formik.errors.email && (
                          <FormErrorMessage>
                            {formik.errors.email}
                          </FormErrorMessage>
                        )}
                      </FormControl>

                      <FormControl isInvalid={!!(
                      formik.touched.username && formik.errors.username)}>
                        <FormLabel>Username</FormLabel>
                        <Input name="username"
                        // placeholder='Enter username'
                        value={formik.values.username}
                        onChange={formik.handleChange} />

                        {formik.touched.username && formik.errors.username && (
                          <FormErrorMessage>
                            {formik.errors.username}
                          </FormErrorMessage>
                        )}
                      </FormControl>

                      <FormControl isInvalid={!!(
                      formik.touched.type && formik.errors.type)}>
                        <FormLabel>Type</FormLabel>
                        <Select name="type"
                        // placeholder='Choose current cashier type'
                        value={formik.values.type}
                        onChange={formik.handleChange}>
                            <option value={"full-time"}>Full-time</option>
                            <option value={"part-time"}>Part-time</option>
                        </Select>
                        {formik.touched.status && formik.errors.status && (
                          <FormErrorMessage>
                            {formik.errors.status}
                          </FormErrorMessage>
                        )}
                      </FormControl>

                      <FormControl isInvalid={!!(
                      formik.touched.status && formik.errors.status)}>
                        <FormLabel>Status</FormLabel>
                        <Select name="status"
                        // placeholder='Choose current cashier status'
                        value={formik.values.status}
                        onChange={formik.handleChange}>
                            <option value={"active"}>Active</option>
                            <option value={"inactive"}>Inactive</option>
                        </Select>
                        {formik.touched.status && formik.errors.status && (
                          <FormErrorMessage>
                            {formik.errors.status}
                          </FormErrorMessage>
                        )}
                      </FormControl>

                    </ModalBody>

                    <ModalFooter>
                      <Button colorScheme='blue' mr={3} type='submit'>
                        Save
                      </Button>
                      <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                  </ModalContent>
                  </form>
                </Modal>

        </Link>
    </>
  )
}

export default UpdateCashier


