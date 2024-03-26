
import React, { useState } from 'react';
import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react';

interface TransactionItem {
  id: number;
  product: {
    id: number;
    name: string;
  };
  total_quantity: number;
}

interface Product {
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
}

interface Transaction {
  id: number;
  total_price: number;
  // Add more properties as needed
}

interface TransactionListProps {
  transactions: Transaction[];
  onItemClick: (transactionId: number) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onItemClick }) => {
  return (
    <ul>
      {transactions.map((transaction: any) => (
        <li key={transaction.id} onClick={() => onItemClick(transaction.id)}>
          {`Transaction ${transaction.id} - Total Price: ${transaction.total_price}`}
        </li>
      ))}
    </ul>
  );
};

const TransactionItemList: React.FC<{ items: TransactionItem[]; onItemClick: (productId: number) => void }> = ({ items, onItemClick }) => {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id} onClick={() => onItemClick(item.product.id)}>
          {`Product: ${item.product.name} - Quantity: ${item.total_quantity}`}
        </li>
      ))}
    </ul>
  );
};

const ProductDetails: React.FC<{ product: Product }> = ({ product }) => {
  return (
    <div>
      <h3>{`Product: ${product.name}`}</h3>
      <p>{`Price: ${product.price}`}</p>
      {/* Add more details as needed */}
    </div>
  );
};

const data = [
  {
      "id": 12,
      "total_quantity": 1,
      "total_price": 58300,
      "date": "2023-11-17T03:04:55.079Z",
      "cashier_id": 3,
      "transaction_item": [
          {
              "id": 1,
              "total_quantity": 1,
              "product_id": 4,
              "transaction_id": 12,
              "product": {
                  "id": 4,
                  "name": "Vanilla Cream Frappuccino",
                  "price": 53000,
                  "image": null,
                  "description": "Vanilla Cream Frappuccino",
                  "status": null,
                  "quantity": 20,
                  "created_at": "2023-11-10T21:07:42.308Z",
                  "updated_at": "2023-11-10T21:07:42.308Z",
                  "markup": null,
                  "sku": null
              }
          }
      ]
  },
  {
      "id": 13,
      "total_quantity": 1,
      "total_price": 58300,
      "date": "2023-11-17T03:06:38.223Z",
      "cashier_id": 3,
      "transaction_item": [
          {
              "id": 2,
              "total_quantity": 1,
              "product_id": 4,
              "transaction_id": 13,
              "product": {
                  "id": 4,
                  "name": "Vanilla Cream Frappuccino",
                  "price": 53000,
                  "image": null,
                  "description": "Vanilla Cream Frappuccino",
                  "status": null,
                  "quantity": 20,
                  "created_at": "2023-11-10T21:07:42.308Z",
                  "updated_at": "2023-11-10T21:07:42.308Z",
                  "markup": null,
                  "sku": null
              }
          }
      ]
  },
  {
      "id": 14,
      "total_quantity": 2,
      "total_price": 77000,
      "date": "2023-11-17T03:07:26.064Z",
      "cashier_id": 3,
      "transaction_item": [
          {
              "id": 3,
              "total_quantity": 1,
              "product_id": 4,
              "transaction_id": 14,
              "product": {
                  "id": 4,
                  "name": "Vanilla Cream Frappuccino",
                  "price": 53000,
                  "image": null,
                  "description": "Vanilla Cream Frappuccino",
                  "status": null,
                  "quantity": 20,
                  "created_at": "2023-11-10T21:07:42.308Z",
                  "updated_at": "2023-11-10T21:07:42.308Z",
                  "markup": null,
                  "sku": null
              }
          },
          {
              "id": 4,
              "total_quantity": 1,
              "product_id": 2,
              "transaction_id": 14,
              "product": {
                  "id": 2,
                  "name": "Caramel Macchiatto Frappuccino",
                  "price": 62000,
                  "image": null,
                  "description": "Caramel Macchiatto Frappuccino",
                  "status": null,
                  "quantity": 20,
                  "created_at": "2023-11-10T21:02:40.632Z",
                  "updated_at": "2023-11-10T21:02:40.632Z",
                  "markup": null,
                  "sku": null
              }
          }
      ]
  }, ]

const ReportTransaction = () => {
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTransactionClick = (transactionId: any) => {
    setSelectedTransaction(transactionId);
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const handleItemClick = (productId: any) => {
    setSelectedItem(productId);
  };

  const handleCloseModal = () => {
    setSelectedTransaction(null);
    setSelectedItem(null);
    setIsModalOpen(false);
  };

  return (
    <Box>
      <h2>Transaction History</h2>
      <TransactionList transactions={data} onItemClick={handleTransactionClick} />

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Transaction Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedTransaction && (
              <TransactionItemList
                items={data.find((transaction) => transaction.id === selectedTransaction)?.transaction_item || []}
                onItemClick={handleItemClick}
              />
            )}
            {selectedItem && (
              <ProductDetails
                product={
                  data.find((transaction) =>
                    transaction.transaction_item.some((item) => item.product.id === selectedItem)
                  )?.transaction_item.find((item) => item.product.id === selectedItem)?.product || {}
                }
              />
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCloseModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export {ReportTransaction};

