import {
  Box,
  Button,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Spacer,
  Text,
  Image,
  IconButton,
  Card,
  CardBody,
  Stack,
  Heading,
  Divider,
  CardFooter,
  ButtonGroup,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  VStack,
  Select,
} from "@chakra-ui/react";
import {
  IconSearch,
  IconAdjustmentsHorizontal,
  IconPlus,
  IconArrowRight,
  IconArrowLeft,
  IconLayoutGrid,
  IconList,
  IconSortAscending2,
  IconSortDescending2,
  IconAbc,
  IconTags,
  IconError404,
  IconEditCircle,
  IconArrowNarrowDown,
  IconTrashX,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { SidebarWithHeader } from "../../components/SideBar/SideBar";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PageOrientation, TDocumentDefinitions } from "pdfmake/interfaces";

interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  markup: number;
  image: string;
  description: string;
  status: string;
  quantity: number;
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  products: Product[];
  totalPages: number;
}

function formatPriceToIDR(price: any) {
  // Use Intl.NumberFormat to format the number as IDR currency
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(price);
}

interface Category {
  id: string;
  category: string;
}

const MAX_VISIBLE_PAGES = 3;

const ProductLists = () => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [dataCategory, setDataCategory] = useState<Category[]>([]);
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<string>("10");
  const [categoryId, setCategoryId] = useState<string>("");
  const [productName, setProductName] = useState("");
  const [viewMode, setViewMode] = useState("list");
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState(page);

  const fetchData = async () => {
    try {
      const response = await axios.get<ApiResponse>(
        `${
          import.meta.env.VITE_APP_API_BASE_URL
        }/products?page=${page}&pageSize=${pageSize}&sortField=${sortField}&sortOrder=${sortOrder}&categoryId=${categoryId}&productName=${productName}`
      );
      setData(response?.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, pageSize, sortField, sortOrder, categoryId, productName]);

  console.log(data);

  const handleSortOrder = (order: string) => {
    setSortOrder(order);
    // onClose();
  };

  const handleSortField = (order: string) => {
    setSortField(order);
    // onClose();
  };

  const handleProductName = (value: string) => {
    setProductName(value);
    setPage(1);
  };

  const handleDeleteProduct = (product: Product) => {
    setSelectedProduct(product);
    setDeleteModalOpen(true);
  };

  const confirmDeleteProduct = async () => {
    try {
      if (selectedProduct) {
        const check = await axios.get(
          `${import.meta.env.VITE_APP_API_BASE_URL}/products/check-product/${selectedProduct.id}`
        );
        console.log("ini check", check);
        console.log("ini check", check.data.serviceResponse);
        console.log("ini check", check.data.length);

        if (check.data.serviceResponse.length > 0) {
          setDeleteModalOpen(false);
          toast.warning("Product used in another transaction");
        } else {
          try {
            await axios.delete(
              `${import.meta.env.VITE_APP_API_BASE_URL}/products/remove-product/${
                selectedProduct.id
              }`
            );

            setDeleteModalOpen(false);
            toast.success("Delete successful");
          } catch (err) {
            console.log(err);
          }

          // Close the delete modal after successful deletion
          setDeleteModalOpen(false);
          // Fetch updated data
          fetchData();
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (data) {
      // Call exportToPDF here, as data is now updated
      exportToPDF;
    }
  }, [data]);

  const exportToPDF = () => {
    if (data) {
      const docDefinition: TDocumentDefinitions = {
        content: [
          { text: "Product List", style: "header" },
          "\n",
          {
            table: {
              headerRows: 1,
              widths: [
                "auto",
                "auto",
                "auto",
                "auto",
                "auto",
                "auto",
                "auto",
                "auto",
                "auto",
                "auto",
              ],
              body: [
                [
                  "ID",
                  "Name",
                  "SKU",
                  "Price",
                  "MarkUp (%)",
                  "Description",
                  "Status",
                  "Quantity",
                  "Created At",
                  "Updated At",
                ],
                ...data.products.map((product) => [
                  product.id,
                  product.name,
                  product.sku,
                  formatPriceToIDR(product.price),
                  product.markup,
                  product.description,
                  product.status,
                  product.quantity,
                  new Date(product.created_at).toLocaleString(),
                  new Date(product.updated_at).toLocaleString(),
                ]),
              ],
            },
          },
        ],
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            alignment: "center",
          },
        },
        pageOrientation: "landscape" as PageOrientation, 
      };

      toast.success("Success converted to pdf...");
      pdfMake.createPdf(docDefinition).download("product_list.pdf");
    }
  };

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

  const getPageNumbers = () => {
    const totalPages = data?.totalPages || 0;
    const currentPage = selectedPage;

    let startPage = Math.max(currentPage - Math.floor(MAX_VISIBLE_PAGES / 2), 1);
    const endPage = Math.min(startPage + MAX_VISIBLE_PAGES - 1, totalPages);

    if (totalPages - endPage < Math.floor(MAX_VISIBLE_PAGES / 2)) {
      startPage = Math.max(endPage - MAX_VISIBLE_PAGES + 1, 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (startPage > 1) {
      pages.unshift("...");
    }

    if (endPage < totalPages) {
      pages.push("...");
    }

    return pages;
  };

  return (
    <>
      <SidebarWithHeader />
      <Box width="98.7vw" height="fit-content" backgroundColor="#fbfaf9" p="50px">
        <Box pl={{ md: "150px", sm: "0px" }}>
          <ToastContainer />

          <HStack mb="30px">
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <IconSearch color="black" />
              </InputLeftElement>
              <Input
                type="tel"
                placeholder="Search"
                width="50vw"
                borderRadius="full"
                borderColor="solid grey 1px"
                onChange={(e) => handleProductName(e.target.value)}
              />
            </InputGroup>
            <Spacer />
          </HStack>
          <HStack mb="10px">
            <Button
              leftIcon={<IconAdjustmentsHorizontal />}
              borderRadius="full"
              border="solid 1px black"
              onClick={onOpen}
            >
              Filter
            </Button>
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Filter</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Text>Sort Order</Text>
                  <HStack>
                    <Button
                      leftIcon={<IconSortAscending2 />}
                      border="solid black 1px"
                      borderRadius="full"
                      onClick={() => handleSortOrder("asc")}
                      isDisabled={sortOrder == "asc" ? true : false}
                    >
                      Ascending
                    </Button>
                    <Button
                      leftIcon={<IconSortDescending2 />}
                      border="solid black 1px"
                      borderRadius="full"
                      onClick={() => handleSortOrder("desc")}
                      isDisabled={sortOrder == "desc" ? true : false}
                    >
                      Descending
                    </Button>
                  </HStack>
                  <Text>Sort Field</Text>
                  <HStack>
                    <Button
                      leftIcon={<IconAbc />}
                      border="solid black 1px"
                      borderRadius="full"
                      onClick={() => handleSortField("name")}
                      isDisabled={sortField == "name" ? true : false}
                    >
                      Name
                    </Button>
                    <Button
                      leftIcon={<IconTags />}
                      border="solid black 1px"
                      borderRadius="full"
                      onClick={() => handleSortField("price")}
                      isDisabled={sortField == "price" ? true : false}
                    >
                      Price
                    </Button>
                  </HStack>
                  <Text>Category</Text>
                  <Select
                    placeholder="Select option"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                  >
                    {dataCategory?.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.category}
                      </option>
                    ))}
                  </Select>
                </ModalBody>

                <ModalFooter>
                  <Button colorScheme="blue" mr={3} onClick={onClose}>
                    Close
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
            <Spacer />
            <Button
              onClick={exportToPDF}
              borderRadius="full"
              border="solid 1px black"
              leftIcon={<IconArrowNarrowDown />}
            >
              Download
            </Button>
            <Button
              leftIcon={<IconList />}
              borderRadius="full"
              border="solid 1px black"
              onClick={() => setViewMode("list")}
              isDisabled={viewMode == "list" ? true : false}
            >
              List
            </Button>
            <Button
              rightIcon={<IconLayoutGrid />}
              borderRadius="full"
              border="solid 1px black"
              onClick={() => setViewMode("grid")}
              isDisabled={viewMode == "grid" ? true : false}
            >
              Grid
            </Button>
            <Button
              rightIcon={<IconPlus />}
              borderRadius="full"
              backgroundColor="#286043"
              textColor="white"
              border="solid 1px #286043"
              onClick={() => navigate("/add-product")}
            >
              Add Item
            </Button>
          </HStack>
          {data?.products?.length == 0 ? (
            <>
              <VStack>
                <IconError404 color="#286043" size="200px" />
                <Heading color="#286043">Product Not Found</Heading>
              </VStack>
            </>
          ) : (
            <>
              {" "}
              {viewMode === "list" ? (
                <Box p="20px" boxShadow="0px 1px 5px gray">
                  <HStack mb="5px">
                    <Text fontWeight="bold">Image</Text>
                    <Spacer />
                    <Text fontWeight="bold">Product Name</Text>
                    <Spacer />
                    <Text fontWeight="bold">Price</Text>
                    <Spacer />
                    <Text fontWeight="bold">Stock</Text>
                    <Spacer />
                    <Text fontWeight="bold" mr="10px">
                      Action
                    </Text>
                  </HStack>
                  <Box as="hr" borderTopWidth="3px" borderTopColor="black.200"></Box>
                  {data?.products &&
                    data?.products.map((item) => (
                      <>
                        <HStack m="10px" textAlign="center">
                          <Image
                            src={`${import.meta.env.VITE_APP_API_BASE_URL}/uploads/products/${
                              item.image || ""
                            }`}
                            alt={item.name}
                            objectFit="cover"
                            width="80px"
                            height="80px"
                            borderRadius="lg"
                            justifySelf="center"
                          />
                          <Spacer />
                          <Text
                            width="210px"
                            isTruncated
                            textOverflow="ellipsis"
                            whiteSpace="nowrap"
                            onClick={() => navigate(`/product-detail/${item.id}`)}
                          >
                            {item?.name}
                          </Text>
                          <Spacer />
                          <Text width="120px" textOverflow="ellipsis" whiteSpace="nowrap">
                            {formatPriceToIDR(item?.price)}
                          </Text>
                          {item.quantity == 0 ? (
                            <Box
                              backgroundColor="#fce8ed"
                              fontSize="small"
                              ml="130px"
                              mr="100px"
                              textColor="#dd1c49"
                              p="2px"
                              borderRadius="5px"
                              border="solid 1px #dd1c49"
                            >
                              Out of Stock
                            </Box>
                          ) : (
                            <Text ml="140px" mr="140px">
                              {item.quantity}
                            </Text>
                          )}
                          <IconButton
                            icon={<IconEditCircle />}
                            variant="ghost"
                            colorScheme="blue"
                            onClick={() => navigate(`/edit-product/${item.id}`)}
                            aria-label=""
                          />
                          <IconButton
                            icon={<IconTrashX />}
                            variant="ghost"
                            colorScheme="red"
                            onClick={() => handleDeleteProduct(item)}
                            aria-label=""
                          />
                        </HStack>
                        <Box as="hr" borderTopWidth="1px" borderTopColor="black.200" />
                      </>
                    ))}{" "}
                </Box>
              ) : (
                <>
                  <Stack spacing="8" direction="row" flexWrap="wrap" justify={"center"} mt={"20px"}>
                    {data?.products &&
                      data?.products.map((item) => (
                        <>
                          <Card key={item.id} maxW="240px" boxShadow="0px 1px 5px gray">
                            <Image
                              src={`${import.meta.env.VITE_APP_API_BASE_URL}/uploads/products/${
                                item.image
                              }`}
                              alt={item.name}
                              objectFit="cover"
                              width="100%"
                              height="150px"
                              borderRadius="6px"
                              justifySelf="center"
                            />
                            <CardBody>
                              <Stack mt="-3" spacing="0">
                                <Heading size="md" width="200px" isTruncated>
                                  {item.name}
                                </Heading>
                                <Text isTruncated maxW="200px">
                                  {item.description}
                                </Text>
                                <Text color="blue.600">
                                  {item.quantity == 0 ? (
                                    <Box
                                      backgroundColor="#fce8ed"
                                      fontSize="small"
                                      textColor="#dd1c49"
                                      p="2px"
                                      borderRadius="5px"
                                      border="solid 1px #dd1c49"
                                    >
                                      Out of Stock
                                    </Box>
                                  ) : (
                                    <Text>Stock : {item.quantity}</Text>
                                  )}
                                </Text>
                                <Text color="blue.600">{formatPriceToIDR(item.price)}</Text>
                              </Stack>
                            </CardBody>
                            <Box position="relative" px="5">
                              <Divider />
                            </Box>
                            <CardFooter>
                              <ButtonGroup spacing="2">
                                <Button
                                  variant="solid"
                                  bgColor="#286043"
                                  color="white"
                                  onClick={() => navigate(`/product-detail/${item.id}`)}
                                >
                                  Detail
                                </Button>
                                <Button
                                  variant="ghost"
                                  color="#286043"
                                  onClick={() => navigate(`/edit-product/${item.id}`)}
                                >
                                  Update
                                </Button>
                              </ButtonGroup>
                            </CardFooter>
                          </Card>
                        </>
                      ))}
                  </Stack>
                </>
              )}
              <HStack marginTop="10px">
                <Text>Show per Page</Text>
                <Select
                  width="fit-content"
                  placeholder="Select option"
                  value={pageSize}
                  onChange={(e) => setPageSize(e.target.value)}
                >
                  <option value={1}>1</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                  <option>All</option>
                </Select>
                <Spacer />
                <Button
                  borderRadius="full"
                  backgroundColor="#286043"
                  textColor="white"
                  border="solid 1px #286043"
                  leftIcon={<IconArrowLeft />}
                  isDisabled={page == 1 ? true : false}
                  onClick={() => {
                    setPage(page - 1);
                    setSelectedPage(selectedPage - 1);
                  }}
                ></Button>
                {getPageNumbers().map((pageNumber, index) => (
                  <Button
                    key={index}
                    borderRadius="full"
                    backgroundColor={selectedPage === pageNumber ? "#286043" : "white"}
                    textColor={selectedPage === pageNumber ? "white" : "#286043"}
                    border={`solid 1px ${selectedPage === pageNumber ? "white" : "#286043"}`}
                    onClick={() => {
                      if (pageNumber !== "...") {
                        const pageNumberAsNumber = Number(pageNumber);
                        setPage(pageNumberAsNumber);
                        setSelectedPage(pageNumberAsNumber);
                      }
                    }}
                  >
                    {pageNumber}
                  </Button>
                ))}
                <Button
                  borderRadius="full"
                  backgroundColor="#286043"
                  textColor="white"
                  border="solid 1px #286043"
                  rightIcon={<IconArrowRight />}
                  isDisabled={page == data?.totalPages ? true : false}
                  onClick={() => {
                    setPage(page + 1);
                    setSelectedPage(selectedPage + 1);
                  }}
                ></Button>
              </HStack>
            </>
          )}

          {deleteModalOpen && (
            <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Delete Product</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Text>
                    Are you sure you want to delete the product "{selectedProduct?.name}"?
                  </Text>
                  <VStack>
                    <Image
                      src={`${import.meta.env.VITE_APP_API_BASE_URL}/uploads/products/${
                        selectedProduct?.image
                      }`}
                      alt={selectedProduct?.name}
                      objectFit="cover"
                      width="200px"
                      height="200px"
                      borderRadius="lg"
                      justifySelf="center"
                    />
                  </VStack>
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme="blue" mr={3} onClick={() => setDeleteModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button colorScheme="red" onClick={confirmDeleteProduct}>
                    Delete
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          )}
        </Box>
      </Box>
    </>
  );
};

export { ProductLists };
