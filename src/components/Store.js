import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

const ItemList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const Item = styled.li`
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
`;

const Store = ({ currencyBalance, onPurchase }) => {
  const [items] = useState([
    { id: 1, name: 'Power-Up', price: 50 },
    { id: 2, name: 'Special Move', price: 100 },
    { id: 3, name: 'Cosmetic Customization', price: 200 },
  ]);

  const handlePurchase = (item) => {
    if (currencyBalance >= item.price) {
      onPurchase(item);
    } else {
      alert('Insufficient funds!');
    }
  };

  return (
    <Container>
      <Title>Virtual Store</Title>
      <p>Balance: {currencyBalance}</p>
      <ItemList>
        {items.map((item) => (
          <Item key={item.id}>
            <span>{item.name}</span>
            <button onClick={() => handlePurchase(item)}>Buy ({item.price})</button>
          </Item>
        ))}
      </ItemList>
    </Container>
  );
};

export default Store;
