import {
  Box,
  Button,
  HStack,
  Input,
  Spacer,
  Text,
  Image,
  IconButton,
  VStack,
  Flex,
  FormLabel,
  Textarea,
  Select,
} from "@chakra-ui/react";
import { IconPlus, IconArrowLeft, IconPhotoUp, IconX, IconArrowRight } from "@tabler/icons-react";
import { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { SidebarWithHeader } from "../../components/SideBar/SideBar";
import { FiUpload } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function capitalizeFirstLetter(str: any) {
  if (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  return str; // return the unchanged string if it's undefined
}

function formatPriceToIDR(price: number) {
  // Use Intl.NumberFormat to format the number as IDR currency
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(price);
}

interface CategoryItem {
  category: {
    id: string;
    category: string;
  };
}

interface Category {
  id: string;
  category: string;
}

type ProductData = {
  id: number;
  image: string;
  name: string;
  sku: string;
  status: string;
  price: number;
  markup: number;
  quantity: number;
  description: string;
  categories: {
    category: {
      id: string;
      category: string;
    }
  }[];
};

const EditProduct = () => {
  const { id } = useParams();
  const [data, setData] = useState<ProductData | null>(null);
  const [dataCategory, setDataCategory] = useState<Category[]>([]);
  const [fieldImage, setFieldImage] = useState<File | null>(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedC, setSelectedC] = useState<CategoryItem[]>([]);
  const navigate = useNavigate();
  // const [isChecked, setIsChecked] = useState(false);

  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");

  const [mainPrice, setMainPrice] = useState<number>(0);
  const [markupPercentage, setMarkupPercentage] = useState<number>();
  const [priceAfterMarkedUp, setPriceAfterMarkedUp] = useState<number>(0);
  const [sku, setSku] = useState("");

  console.log("ini data", data)

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
      if (id !== undefined) {
        const numericId = typeof id === "string" ? parseInt(id, 10) : id;
        await fetchData(numericId);
      }
    };

    fetchDataAndSetState();
  }, [id]);

  const handleInputChangePrice = (event: ChangeEvent<HTMLInputElement>) => {
    let numericValue = event.target.value.replace(/[^0-9]/g, "");
    numericValue = numericValue.replace(/^0+/, "");

    const numericValueAsNumber = numericValue === "" ? 0 : parseInt(numericValue, 10);

    setMainPrice(numericValueAsNumber);
  };

  const handleInputChangeMarkup = (event: ChangeEvent<HTMLInputElement>) => {
    const numericValue = event.target.value.replace(/[^0-9]/g, "");
    setMarkupPercentage(Number(numericValue));
  };

  useEffect(() => {
    if (mainPrice !== undefined && markupPercentage !== undefined) {
      const calculatedPrice = Number(mainPrice) + (Number(mainPrice) * markupPercentage) / 100;
      setPriceAfterMarkedUp(calculatedPrice);
    }
  }, [mainPrice, markupPercentage]);

  const fetchCategory = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_BASE_URL}/products/category-lists`
      );

      setDataCategory(response?.data);
    } catch (err) {
      console.log(err);
    }
  };

  console.log(dataCategory);

  useEffect(() => {
    fetchCategory();
  }, []);

  // console.log(markupPercentage);
  const finalMarkupPercentage = markupPercentage || 0;

  const priceFinal: number = Number(mainPrice) + (Number(mainPrice) * finalMarkupPercentage) / 100;
  console.log(priceFinal);
  // console.log(priceFinal);

  const editProduct = async () => {
    try {
      const formData = new FormData();
      if(data){
        formData.append("id", data.id.toString());
      }
      formData.append("name", String(name));
      formData.append("price", priceFinal.toString());
      formData.append("quantity", quantity.toString());
      formData.append("description", description);
      if (fieldImage !== null) {
        formData.append("product", fieldImage);
        formData.append("status", status);
      }
      if (markupPercentage !== undefined) {
        formData.append("markup", markupPercentage.toString());
      }
      formData.append("sku", String(sku));

      selectedC.forEach((item, i) => {
        formData.append(`category[${i}][id]`, item.category.id);
        formData.append(`category[${i}][category]`, item.category.category);
      });

      await axios.patch(`${import.meta.env.VITE_APP_API_BASE_URL}/products/edit-product`, formData);

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
      if (id !== undefined) {
        fetchData(Number(id));
      }
      navigate("/product-lists");
    } catch (err) {
      console.log(err);
    }
  };

  console.log(selectedC);

  const deleteCategoryProduct = async (category_id: any) => {
    try {
      if (data) {
        const productId = data.id; // Accessing the id from the first item in data array
        await axios.delete(
          `${
            import.meta.env.VITE_APP_API_BASE_URL
          }/products/remove-category-product?product_id=${productId}&category_id=${category_id}`
        );

        toast.success("Delete Category Success");
        if (id !== undefined) {
          fetchData(Number(id));
        }
      } else {
        console.log("Data array is empty");
      }
    } catch (err) {
      console.log(err);
    }
  };

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
    <Box width="fit-content" minW="98vw">
      <SidebarWithHeader />
      <ToastContainer />
      <HStack ml={{ md: "150px", sm: "0px" }} mb="10px" p="30px">
        <Button
          leftIcon={<IconArrowLeft />}
          borderRadius="full"
          backgroundColor="white"
          textColor="black"
          border="solid 1px black"
          onClick={() => navigate("/product-lists")}
        >
          Back
        </Button>
        <Spacer />
        <Button
          rightIcon={<IconArrowRight />}
          borderRadius="full"
          backgroundColor="#286043"
          textColor="white"
          border="solid 1px #286043"
          onClick={() => editProduct()}
        >
          Edit Item
        </Button>
      </HStack>
      <Flex direction={{ base: "column", md: "row" }}>
        <Box
          width={{ base: "100%", md: "50%" }}
          p={{ base: "20px", md: "50px" }}
          backgroundColor="#fbfaf9"
        >
          <Box
            ml={{ md: "150px", sm: "0px" }}
            borderRadius="10px"
            p="20px"
            backgroundColor="white"
            boxShadow="0px 1px 5px gray"
          >
            <FormLabel>Product Information</FormLabel>

            <Box height="max-content" mb="100px">
              <VStack>
                <Image
                  src={`${import.meta.env.VITE_APP_API_BASE_URL}/uploads/products/${
                    data ? data.image : ''
                  }`}
                  alt={`${data ? data.name : ''}`}
                  boxSize="150px"
                  objectFit="cover"
                  borderRadius="10px"
                />
                <Box mt="-50px" mr="-90px"></Box>
              </VStack>
            </Box>

            <Flex columnGap="10px" mb="20px " flexDir="column">
              <Box width="50%">
                <Text fontSize="large" fontWeight="bold">
                  Name
                </Text>
                <FormLabel>Product Name</FormLabel>
                <Text>{`${data ? data.name : ""}`}</Text>
              </Box>
              <Box pt="27px" width="50%">
                <FormLabel>Product SKU</FormLabel>
                <Text>{`${data? data.sku : ""}`}</Text>
              </Box>
              <Box pt="27px" width="50%">
                <FormLabel>Status Product</FormLabel>
                <Text>{capitalizeFirstLetter(`${data ? data.status : ""}`)}</Text>
              </Box>
            </Flex>
            <Flex columnGap="10px" mb="20px " flexDirection="column">
              <Box width="50%">
                <Text fontSize="large" fontWeight="bold">
                  Main Price
                </Text>
                <FormLabel>Price (after markup)</FormLabel>
                <Text>{formatPriceToIDR(data ? data.price : 0)}</Text>
              </Box>
              <Box pt="27px" width="50%">
                <FormLabel>MarkUp Percentage</FormLabel>
                <Text>{`${data ? data.markup : 0}`}%</Text>
              </Box>
              <Box pt="27px" width="50%">
                <FormLabel>Stock</FormLabel>
                <Text>{`${data ? data.quantity : 0}`}</Text>
              </Box>
            </Flex>
            <FormLabel>Description</FormLabel>
            <Text mb="20px">{`${data ? data.description : ""}`}</Text>
            <Text fontSize="large" fontWeight="bold">
              Category
            </Text>
            <Flex columnGap="10px" mb="20px " flexWrap="wrap">
              {data?.categories?.map((item: any) => (
                <Box
                  key={item?.category?.id}
                  borderRadius="full"
                  pl="10px"
                  pr="10px"
                  pt="5px"
                  pb="5px"
                  mb="5px"
                  border="solid blue 1px"
                  bgColor="blue.100"
                >
                  <HStack>
                    <Text color="blue">{item?.category?.category}</Text>
                  </HStack>
                </Box>
              ))}
            </Flex>
          </Box>
        </Box>
        <Box
          width={{ base: "100%", md: "50%" }}
          p={{ base: "20px", md: "50px" }}
          backgroundColor="#fbfaf9"
        >
          <Box
            ml="0px"
            borderRadius="10px"
            p="20px"
            backgroundColor="white"
            boxShadow="0px 1px 5px gray"
          >
            <form>
              <FormLabel>Product Information</FormLabel>

              <Box>
                <VStack>
                  {selectedImage ? (
                    <Image
                      src={selectedImage}
                      alt="Selected Image"
                      boxSize="150px"
                      objectFit="cover"
                      borderRadius="10px"
                    />
                  ) : (
                    <Box
                      width="150px"
                      height="150px"
                      border="dashed gray 2px"
                      backgroundColor="#fbfaf9"
                      borderRadius="10px"
                      padding="30px"
                    >
                      <IconPhotoUp size="90px" color="gray" />
                    </Box>
                  )}
                  <Box mt="-50px" mr="-90px">
                    <Input
                      display="none"
                      id="fileInput"
                      type="file"
                      name="image"
                      size="md"
                      onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        const selectedFile = event.currentTarget.files?.[0];
                        setFieldImage(selectedFile || null);
                        handleImageChange(event);
                      }}
                    />
                    <IconButton
                      onClick={() => {
                        const fileInput = document.getElementById("fileInput") as HTMLInputElement;
                        fileInput?.click();
                      }}
                      icon={<FiUpload color="white" />}
                      variant="outline"
                      background="blue"
                      borderRadius="50%"
                      colorScheme="white"
                      border="solid white 2px"
                      aria-label=""
                    ></IconButton>
                  </Box>
                </VStack>
              </Box>

              <Flex columnGap="10px" mb="20px " flexDir="column">
                <Box width="50%">
                  <Text fontSize="large" fontWeight="bold">
                    Name
                  </Text>
                  <FormLabel>Product Name</FormLabel>
                  <Input
                    name="name"
                    placeholder={data ? data.name : ""}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    border="solid gray 1px"
                    borderRadius="full"
                  />
                </Box>
                <Box pt="27px" width="50%">
                  <FormLabel>Product SKU</FormLabel>
                  <Input
                    name="text"
                    placeholder={data ? data.sku : ""}
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    type="text"
                    border="solid gray 1px"
                    borderRadius="full"
                  />
                </Box>
              </Flex>
              <Flex flexDir="row" columnGap="20px">
                <Text fontSize="large" fontWeight="bold">
                  Main Price
                </Text>
              </Flex>
              <Flex columnGap="10px" mb="20px " flexDirection="column">
                <Box width="40%">
                  <FormLabel>Starting Price</FormLabel>
                  <Input
                    type="text" // Change the type to text to allow for non-numeric characters (for currency format)
                    value={mainPrice}
                    onChange={handleInputChangePrice}
                    name="price"
                    border="solid gray 1px"
                    borderRadius="full"
                  />
                </Box>
                <Box width="40%">
                  <FormLabel>Markup Percentage</FormLabel>
                  <Input
                    value={markupPercentage}
                    onChange={handleInputChangeMarkup}
                    placeholder="Ex: 20 without %"
                    name="markupPercentage"
                    type="number"
                    border="solid gray 1px"
                    borderRadius="full"
                  />
                </Box>
                <Box width="40%">
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

              <Flex columnGap="10px" mb="20px " flexDirection="column">
                <Box width="40%">
                  <Text fontSize="large" fontWeight="bold">
                    Stock
                  </Text>
                  <Input
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                    name="quantity"
                    placeholder={`${data ? data.quantity : 0}`}
                    type="number"
                    border="solid gray 1px"
                    borderRadius="full"
                  />
                </Box>
                <Box width="40%">
                  <Text fontSize="large" fontWeight="bold">
                    Status
                  </Text>
                  <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                    {data?.status == "activated" ? (
                      <>
                        <option value="activated">Activated</option>
                        <option value="deactivated">Deactivated</option>
                      </>
                    ) : (
                      <>
                        <option value="deactivated">Deactivated</option>
                        <option value="activated">Activated</option>
                      </>
                    )}
                  </Select>
                </Box>
                <Box width="60%">
                  <Text fontSize="large" fontWeight="bold">
                    Description
                  </Text>
                  <Textarea
                    name="desc"
                    placeholder={data ? data.description : ""}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    border="solid gray 1px"
                    borderRadius="10px"
                    height="20vh"
                  />
                </Box>
              </Flex>
              <Flex flexDirection="column">
                <FormLabel>Category Right Now</FormLabel>
                <Flex flexWrap="wrap" columnGap="5px">
                  {data?.categories?.map((item: any) => (
                    <Box
                      key={item?.category?.id}
                      borderRadius="full"
                      mb="5px"
                      pl="10px"
                      pr="10px"
                      pt="5px"
                      pb="5px"
                      border="solid blue 1px"
                      bgColor="blue.100"
                    >
                      <HStack>
                        <Text color="blue">{item.category.category}</Text>
                        <IconButton
                          onClick={() => deleteCategoryProduct(item.category.id)}
                          bg="transparent"
                          borderRadius="full"
                          size="10px"
                          color="blue"
                          aria-label=""
                          icon={<IconX />}
                        />
                      </HStack>
                    </Box>
                  ))}
                </Flex>
              </Flex>
              <Text fontSize="large" fontWeight="bold">
                Category
              </Text>

              <Flex columnGap="10px" mb="20px " flexWrap="wrap">
                {data && dataCategory ? (dataCategory
                  .filter(
                    (category) =>
                      !selectedC.some(
                        (selectedCategory) => selectedCategory.category.id === category.id
                      ) &&
                      !data.categories.some(
                        (selectedCategory) => selectedCategory?.category?.id === category.id
                      )
                  )
                  .map((category) => (
                    <Box key={category.id} mb="5px">
                      <HStack>
                        <Button
                          p="5px"
                          border="solid black 1px"
                          onClick={() => increment(category)}
                          bg="transparent"
                          borderRadius="full"
                          size="10px"
                          leftIcon={<IconPlus />}
                        >
                          {category.category}
                        </Button>
                      </HStack>
                    </Box>
                  ))) : ( <p>Loading...</p>)}
              </Flex>
              <Text fontSize="large" fontWeight="bold">
                Selected Category
              </Text>
              <Flex columnGap="10px" mb="20px " flexWrap="wrap">
                {selectedC.map((selectedCategory) => (
                  <Box
                    key={selectedCategory.category.id}
                    mb="5px"
                    borderRadius="full"
                    p="5px"
                    border="solid blue 1px"
                    bgColor="blue.100"
                  >
                    <HStack>
                      <Text color="blue">{selectedCategory.category.category}</Text>
                      <IconButton
                        onClick={() => decrement(selectedCategory.category)}
                        bg="transparent"
                        borderRadius="full"
                        size="10px"
                        color="blue"
                        aria-label=""
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
  );
};

export { EditProduct };
