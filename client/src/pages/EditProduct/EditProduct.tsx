import { Box, Button, HStack, Icon, Input, InputGroup, InputLeftAddon, InputLeftElement, Spacer, Text, Image, IconButton, Card, CardBody, Stack, Heading, Divider, CardFooter, ButtonGroup, useDisclosure, Modal, ModalOverlay, ModalHeader, ModalContent, ModalCloseButton, ModalBody, ModalFooter, VStack, Flex, FormLabel, Checkbox, Textarea, Select } from "@chakra-ui/react"
import { IconPlus, IconArrowLeft, IconPhotoUp, IconX, IconArrowRight } from '@tabler/icons-react'
import { ChangeEvent, useEffect, useState } from "react"
import axios from 'axios'
import { useNavigate, useParams } from "react-router-dom"
import { SidebarWithHeader } from '../../components/SideBar/SideBar'
import { FiUpload } from "react-icons/fi"
import { useFormik } from "formik";
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';


interface ApiResponse {
  message: string;
  saleDate: Date;
}

function capitalizeFirstLetter(str) {
  if (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  return str; // return the unchanged string if it's undefined
}


function formatPriceToIDR(price: number) {
  // Use Intl.NumberFormat to format the number as IDR currency
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(price);
}

const EditProduct = () => {
    const { id } = useParams();
  const [data, setData] = useState([]);
  
  const [dataCategory, setDataCategory] = useState([])
  const [fieldImage, setFieldImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedC, setSelectedC] = useState([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);

  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState<number>();
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("")


  const [mainPrice, setMainPrice] = useState<number>(0);
  const [markupPercentage, setMarkupPercentage] = useState<number>();
  const [priceAfterMarkedUp, setPriceAfterMarkedUp] = useState<number>(0);
  const [sku, setSku] = useState("")


  const fetchData = async (id: number) => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_APP_API_BASE_URL}/products/details-product/${id}`
        );

        setData((prevData) => response?.data || prevData);
    } catch (err) {
        console.log(err);
    }
};

  useEffect(() => {
    const fetchDataAndSetState = async () => {
        await fetchData(id);
    };

    fetchDataAndSetState();
}, []);



  const handleInputChangePrice = (event: ChangeEvent<HTMLInputElement>) => {
    let numericValue = event.target.value.replace(/[^0-9]/g, '');
    numericValue = numericValue.replace(/^0+/, '');

    setMainPrice(numericValue); // Store the numeric value without formatting
  };

  const handleInputChangeMarkup = (event: ChangeEvent<HTMLInputElement>) => {
    const numericValue = event.target.value.replace(/[^0-9]/g, '');
    setMarkupPercentage(Number(numericValue));
  };

  useEffect(() => {
    const calculatedPrice = Number(mainPrice) + (Number(mainPrice) * markupPercentage) / 100;
    setPriceAfterMarkedUp(calculatedPrice);
  }, [mainPrice, markupPercentage]);
  
  

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const fetchCategory = async () => {
      try {
          const response = await axios.get(
              `${import.meta.env.VITE_APP_API_BASE_URL}/products/category-lists`
          );

          setDataCategory(response?.data)
      } catch (err) {
          console.log(err);
      }
  }

  console.log(dataCategory);
  

  useEffect(() => {
      fetchCategory();
  }, [])



  console.log(markupPercentage);
  const priceFinal: number = Number(mainPrice) + (mainPrice * markupPercentage / 100)
  console.log(priceFinal);
  
  

  const editProduct = async () => {
    try {
        let formData = new FormData();
        const name1 = "category"
      formData.append("id", data.id);
      formData.append("name", String(name));
      formData.append("price", Number(priceFinal));
      formData.append("quantity", Number(quantity));
      formData.append("description", description);
      formData.append("product", fieldImage);
      formData.append("status", status);
      formData.append("markup", Number(markupPercentage));
      formData.append("sku", String(sku));

    selectedC.forEach((item, i) => {
        formData.append(`category[${i}][id]`, item.category.id);
        formData.append(`category[${i}][category]`, item.category.category);
      });

      await axios.patch(
          `${import.meta.env.VITE_APP_API_BASE_URL}/products/edit-product`,
          formData
      );

      setName("");
      setQuantity(0);
      setDescription("");
      setStatus("");
      setMainPrice(0);
      setMarkupPercentage(0);
      setSku("");
      setSelectedImage("");
      setFieldImage(null);
  

      toast.success("Success edit data");
      fetchData(id);
      navigate("/product-lists")
  } catch (err) {
      console.log(err);
  }
  }

console.log(selectedC);


  const deleteCategoryProduct = async (category_id) => {
      try {
          await axios.delete(
            `${import.meta.env.VITE_APP_API_BASE_URL}/products/remove-category-product?product_id=${data.id}&category_id=${category_id}`
          )

            toast.success("Delete Category Success")
            fetchData(id);
      } catch (err) {
          console.log(err);
          
      }
  }



  const handleImageChange = (event: any) => {
    const selectedFile = event.currentTarget.files[0];
    setFieldImage(selectedFile);
    
    // Display the selected image
    if (selectedFile) {
      const objectURL = URL.createObjectURL(selectedFile);
      setSelectedImage(objectURL);
    }
  };


  const increment = (category: any) => {
    const exist = selectedC.find((item: any) => item.category.id === category.id);

    if (!exist) {
      setSelectedC([...selectedC, { category }]);
    }
  };

  const decrement = (category: any) => {
    const updatedCategories = selectedC.filter((item: any) => item.category.id !== category.id);
    setSelectedC(updatedCategories);
  };

  console.log(selectedC);
  console.log(quantity);
  

  return (
      <Box width='fit-content' minW='98vw'>
        <SidebarWithHeader />
        <ToastContainer />
        <HStack ml={{md: '150px', sm: '0px'}} mb='10px' p='30px'>
    <Button leftIcon={<IconArrowLeft />} borderRadius='full' backgroundColor='white' textColor='black' border='solid 1px black' onClick={() => navigate('/product-lists')}>Back</Button>
    <Spacer />
    <Button rightIcon={<IconArrowRight />} borderRadius='full' backgroundColor='#286043' textColor='white' border='solid 1px #286043' onClick={() => editProduct()}>Edit Item</Button>
        </HStack>
        <Flex direction={{ base: 'column', md: 'row' }}>
        <Box width={{ base: '100%', md: '50%' }}
          p={{ base: '20px', md: '50px' }}
          backgroundColor='#fbfaf9'>
        <Box ml={{md: '150px', sm: '0px'}} borderRadius='10px' p='20px' backgroundColor='white' boxShadow='0px 1px 5px gray'>
        <FormLabel>Product Information</FormLabel>

            <Box height='max-content' mb='100px'>
            <VStack>
           <Image
            src={`${import.meta.env.VITE_APP_API_BASE_URL}/uploads/products/${data?.image}`}
            alt={`${data?.name}`}
            boxSize="150px"
            objectFit="cover"
            borderRadius="10px"/> 
            <Box mt='-50px' mr='-90px'></Box>
    </VStack>
            </Box>

        <Flex columnGap='10px' mb='20px ' flexDir='column'>
            <Box width='50%'>
            <Text fontSize='large' fontWeight='bold'>Name</Text>
            <FormLabel>Product Name</FormLabel>
            <Text>{data?.name}</Text>
            </Box>
            <Box pt='27px' width='50%'>
            <FormLabel>Product SKU</FormLabel>
            <Text>{data?.sku}</Text>
            </Box>
            <Box pt='27px' width='50%'>
            <FormLabel>Status Product</FormLabel>
            <Text>{capitalizeFirstLetter(data?.status)}</Text>
            </Box>
        </Flex>
        <Flex columnGap='10px' mb='20px ' flexDirection='column'>
            <Box width='50%'>
            <Text fontSize='large' fontWeight='bold'>Main Price</Text>
            <FormLabel>Price (after markup)</FormLabel>
            <Text>{formatPriceToIDR(data?.price)}</Text>
            </Box>
            <Box pt='27px' width='50%'>
            <FormLabel>MarkUp Percentage</FormLabel>
            <Text>{data?.markup}%</Text>
            </Box>
            <Box pt='27px' width='50%'>
            <FormLabel>Stock</FormLabel>
            <Text>{data?.quantity}</Text>
            </Box>
        </Flex>
        <FormLabel>Description</FormLabel>
        <Text mb='20px'>{data?.description}</Text>
        <Text fontSize='large' fontWeight='bold'>Category</Text>
        <Flex columnGap="10px" mb="20px " flexWrap='wrap'>
        {data?.categories?.map((item) => (
          <Box key={item?.category?.id} borderRadius="full" pl="10px" pr='10px' pt='5px' pb='5px' mb='5px' border="solid blue 1px" bgColor='blue.100'>
            <HStack>
              <Text color='blue'>{item?.category?.category}</Text>
            </HStack>
          </Box>
        ))}
      </Flex>
  
        </Box>
    </Box>
    <Box width={{ base: '100%', md: '50%' }}
          p={{ base: '20px', md: '50px' }}
          backgroundColor='#fbfaf9'>
        <Box ml='0px' borderRadius='10px' p='20px' backgroundColor='white' boxShadow='0px 1px 5px gray'>
            <form>
        <FormLabel>Product Information</FormLabel>

            <Box>
            <VStack>
            {selectedImage ? <Image
            src={selectedImage}
            alt="Selected Image"
            boxSize="150px"
            objectFit="cover"
            borderRadius="10px"/> : <Box width='150px' height='150px' border='dashed gray 2px' backgroundColor='#fbfaf9' borderRadius='10px' padding='30px'><IconPhotoUp size='90px' color='gray' /></Box>}
            <Box mt='-50px' mr='-90px'>
      <Input display="none" id="fileInput" 
              type="file"
              name="image"
              size="md"
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setFieldImage(event.currentTarget.files[0] || null);
                handleImageChange(event)
              }}
            />
      <IconButton
        onClick={() => document.getElementById('fileInput').click()}
        icon={<FiUpload color='white' />}
        variant='outline'
        background='blue'
        borderRadius='50%'
        colorScheme="white"
        border='solid white 2px'
      >
      </IconButton>
    </Box>
    </VStack>
            </Box>

        <Flex columnGap='10px' mb='20px ' flexDir='column'>
            <Box width='50%'>
            <Text fontSize='large' fontWeight='bold'>Name</Text>
            <FormLabel>Product Name</FormLabel>
            <Input name='name' placeholder={data.name} value={name} onChange={(e) => setName(e.target.value)} type='text' border='solid gray 1px' borderRadius='full'/>
            </Box>
            <Box pt='27px' width='50%'>
            <FormLabel>Product SKU</FormLabel>
            <Input name='text' placeholder={data.sku} value={sku} onChange={(e) => setSku(e.target.value)} type='text' border='solid gray 1px' borderRadius='full'/>
            </Box>
        </Flex>
        <Flex flexDir='row' columnGap='20px'>
                <Text fontSize='large' fontWeight='bold'>Main Price</Text>
                </Flex>
        <Flex columnGap='10px' mb='20px ' flexDirection='column'>
            <Box width='40%'>
                
            <FormLabel>Starting Price</FormLabel>
            <Input type="text" // Change the type to text to allow for non-numeric characters (for currency format)
       value={mainPrice}
       onChange={handleInputChangePrice}
            name='price' border='solid gray 1px' borderRadius='full'/>
            </Box>
            <Box width='40%'>
            <FormLabel>Markup Percentage</FormLabel>
            <Input 
            value={markupPercentage}
            onChange={handleInputChangeMarkup}
            placeholder='Ex: 20 without %'
            name="markupPercentage" type='number' border='solid gray 1px' borderRadius='full'/>
            </Box>
            <Box width='40%'>
            <FormLabel>Price After Marked Up</FormLabel>
            <Input
  value={formatPriceToIDR(priceAfterMarkedUp)}
  name="priceAfterMarkedUp"
  isReadOnly
  type="text"
  border="solid gray 1px"
  borderRadius="full"
/>

            </Box>
        </Flex>

        <Flex columnGap='10px' mb='20px ' flexDirection='column'>
            <Box width='40%'>
            <Text fontSize='large' fontWeight='bold'>Stock</Text>
            <Input value={quantity} onChange={(e) => setQuantity(e.target.value)} name='quantity' placeholder={data.quantity} type='number' border='solid gray 1px' borderRadius='full'/>
            </Box>
            <Box width='40%'>
            <Text fontSize='large' fontWeight='bold'>Status</Text>
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
              {data.status == "activated" ? (<>
                <option value="activated">Activated</option>
              <option value="deactivated">Deactivated</option></>) : (
                  <><option value="deactivated">Deactivated</option>
                  <option value="activated">Activated</option></>
              )}
            </Select>
            </Box>
            <Box width='60%'>
            <Text fontSize='large' fontWeight='bold'>Description</Text>
            <Textarea name='desc' placeholder={data.description} value={description} onChange={(e) => setDescription(e.target.value)} type='text' border='solid gray 1px' borderRadius='10px' height='20vh'/>
            </Box>
        </Flex>
        <Flex flexDirection='column'>
        <FormLabel>Category Right Now</FormLabel>
        <Flex flexWrap="wrap" columnGap='5px'>
        {data?.categories?.map((item) => (
          <Box key={item.category.id} borderRadius="full" mb='5px' pl="10px" pr='10px' pt='5px' pb='5px' border="solid blue 1px" bgColor='blue.100'>
            <HStack>
              <Text color='blue'>{item.category.category}</Text>
              <IconButton
                onClick={() => deleteCategoryProduct(item.category.id)}
                bg="transparent"
                borderRadius="full"
                size="10px"
                color='blue'
                icon={<IconX />}
              />
            </HStack>
          </Box>
        ))}
        </Flex>
        </Flex>
        <Text fontSize='large' fontWeight='bold'>Category</Text>

        <Flex columnGap='10px' mb='20px ' flexWrap='wrap'>
        {dataCategory
  .filter(category => !selectedC.some(selectedCategory => selectedCategory.category.id === category.id) && !data.categories.some(selectedCategory => selectedCategory.category.id === category.id))
  .map((category) => (
    <Box key={category.id} mb='5px'>
      <HStack>
        <Button p='5px' border='solid black 1px' onClick={() => increment(category)} bg='transparent' borderRadius='full' size='10px' leftIcon={<IconPlus />}>
          {category.category}
        </Button>
      </HStack>
    </Box>
))}


        </Flex>
        <Text fontSize='large' fontWeight='bold'>Selected Category</Text>
        <Flex columnGap="10px" mb="20px " flexWrap='wrap'>
        {selectedC.map((selectedCategory) => (
          <Box key={selectedCategory.category.id} mb='5px' borderRadius="full" p="5px" border="solid blue 1px" bgColor='blue.100'>
            <HStack>
              <Text color='blue'>{selectedCategory.category.category}</Text>
              <IconButton
                onClick={() => decrement(selectedCategory.category)}
                bg="transparent"
                borderRadius="full"
                size="10px"
                color='blue'
                icon={<IconX />}
              />
            </HStack>
          </Box>
        ))}
        
      </Flex>
        </form>
  
        </Box>
    </Box>
        </Flex>
    </Box>
  )
}

export {EditProduct}