import { Box, Button, HStack, Input, Spacer, Text, Image, IconButton, VStack, Flex, FormLabel, Textarea } from "@chakra-ui/react"
import { IconPlus, IconArrowLeft, IconPhotoUp, IconX, IconArrowRight } from '@tabler/icons-react'
import { ChangeEvent, useEffect, useState } from "react"
import axios from 'axios'
import { useNavigate } from "react-router-dom"
import { SidebarWithHeader } from '../../components/SideBar/SideBar'
import { FiUpload } from "react-icons/fi"
import { toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';



function formatPriceToIDR(price: number) {
  // Use Intl.NumberFormat to format the number as IDR currency
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(price);
}
interface CategoryItem {
  category: {
    id: string;
    category: string;
  };
}

const AddProduct = () => {
  const [dataCategory, setDataCategory] = useState([])
  const [fieldImage, setFieldImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedC, setSelectedC] = useState<CategoryItem[]>([]);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [sku, setSku] = useState("")


  const [mainPrice, setMainPrice] = useState<number>(0);
  const [markupPercentage, setMarkupPercentage] = useState<number>();
  const [priceAfterMarkedUp, setPriceAfterMarkedUp] = useState<number>(0);

  const handleInputChangePrice = (event: ChangeEvent<HTMLInputElement>) => {
    let numericValue = event.target.value.replace(/[^0-9]/g, '');
    numericValue = numericValue.replace(/^0+/, '');

    const numericValueAsNumber = parseInt(numericValue, 10);

  setMainPrice(numericValueAsNumber);
  };

  const handleInputChangeMarkup = (event: ChangeEvent<HTMLInputElement>) => {
    const numericValue = event.target.value.replace(/[^0-9]/g, '');
    setMarkupPercentage(Number(numericValue));
  };

  useEffect(() => {
    if (markupPercentage !== undefined) {
      const calculatedPrice = Number(mainPrice) + (Number(mainPrice) * markupPercentage) / 100;
      setPriceAfterMarkedUp(calculatedPrice);
    }
  }, [mainPrice, markupPercentage]);
  

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
  let priceFinal: number;
  if (markupPercentage !== undefined) {
    priceFinal = Number(mainPrice) + (mainPrice * markupPercentage / 100);
    console.log(priceFinal);
  }
  
  

  const addProduct = async () => {
    try {
        const formData = new FormData();
        // const name1 = "category"
      formData.append("name", name);
      formData.append("price", priceFinal.toString());
      formData.append("quantity", quantity.toString());
      formData.append("description", description);
      formData.append("product", fieldImage.toString());
    //   formData.append("category", selectedC);

    selectedC.forEach((item, i) => {
        formData.append(`category[${i}][id]`, item.category.id);
        formData.append(`category[${i}][category]`, item.category.category);
      });
      formData.append("markup", markupPercentage.toString());
      formData.append("sku", sku);

      await axios.post(
          `${import.meta.env.VITE_APP_API_BASE_URL}/products/add-product`,
          formData
      );
      
      navigate("/product-lists");
      toast.success("Success")
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
      <>
        <SidebarWithHeader />
    <Box width='98.7vw' height='fit-content' backgroundColor='#fbfaf9' p='50px'>
        <HStack ml={{md: '150px', sm: '0px'}} mb='10px'>
    <Button leftIcon={<IconArrowLeft />} borderRadius='full' backgroundColor='white' textColor='black' border='solid 1px black' onClick={() => navigate('/product-lists')}>Back</Button>
    <Spacer />
    <Button rightIcon={<IconArrowRight />} borderRadius='full' backgroundColor='#286043' textColor='white' border='solid 1px #286043' onClick={() => addProduct()}>Add Item</Button>
        </HStack>
        <Box ml={{md: '150px', sm: '0px'}} borderRadius='10px' p='20px' backgroundColor='white' boxShadow='0px 1px 5px gray'>
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
        aria-label="getElement"
      >
      </IconButton>
    </Box>
    </VStack>
            </Box>

        <Flex columnGap='10px' mb='20px ' flexDir={{md: 'row', sm: 'column'}}>
            <Box width='50%'>
            <Text fontSize='large' fontWeight='bold'>Name</Text>
            <FormLabel>Product Name</FormLabel>
            <Input name='name' value={name} onChange={(e) => setName(e.target.value)} type='text' border='solid gray 1px' borderRadius='full'/>
            </Box>
            <Box pt='27px' width='50%'>
            <FormLabel>Product SKU</FormLabel>
            <Input name='text' value={sku} onChange={(e) => setSku(e.target.value)} type='text' border='solid gray 1px' borderRadius='full'/>
            </Box>
        </Flex>
        <Flex columnGap='10px' mb='20px ' flexDir={{md: 'row', sm: 'column'}}>
            <Box width='40%'>
            <Text fontSize='large' fontWeight='bold'>Main Price</Text>
            <FormLabel>Starting Price</FormLabel>
            <Input type="text" // Change the type to text to allow for non-numeric characters (for currency format)
       value={mainPrice}
       onChange={handleInputChangePrice}
            name='price' border='solid gray 1px' borderRadius='full'/>
            </Box>
            <Box pt='27px' width='20%'>
            <FormLabel>Markup Percentage</FormLabel>
            <Input 
            value={markupPercentage}
            onChange={handleInputChangeMarkup}
            placeholder='Ex: 20 without %'
            name="markupPercentage" type='number' border='solid gray 1px' borderRadius='full'/>
            </Box>
            <Box pt='27px' width='40%'>
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

        <Flex columnGap='10px' mb='20px ' flexDir={{md: 'row', sm: 'column'}}>
            <Box width='40%'>
            <Text fontSize='large' fontWeight='bold'>Stock</Text>
            <Input value={quantity} onChange={(e) => setQuantity(e.target.value)} name='quantity' type='number' border='solid gray 1px' borderRadius='full'/>
            </Box>
            <Box width='60%'>
            <Text fontSize='large' fontWeight='bold'>Description</Text>
            <Textarea name='desc' value={description} onChange={(e) => setDescription(e.target.value)} type='text' border='solid gray 1px' borderRadius='10px' height='20vh'/>
            </Box>
        </Flex>
        <Text fontSize='large' fontWeight='bold'>Category</Text>

        <Flex columnGap='10px' mb='20px ' flexWrap='wrap'>
        {dataCategory
  .filter(category => !selectedC.some(selectedCategory => selectedCategory.category.id === category.id))
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
        <Flex columnGap='10px' mb='20px ' flexWrap='wrap'>
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
                aria-label="Decrement"
                icon={<IconX />}
              />
            </HStack>
          </Box>
        ))}
      </Flex>
        </form>
  
        </Box>
    </Box>
    </>
  )
}

export {AddProduct}