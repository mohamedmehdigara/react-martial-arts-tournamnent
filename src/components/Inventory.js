import React, { useState } from 'react';
import styled from 'styled-components';
import ActionButton from './ActionButton';

const Container = styled.div`
  text-align: center;
`;

const ItemList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const Item = styled.li`
  margin-bottom: 10px;
`;

const Inventory = () => {
  const [items, setItems] = useState([
    { id: 1, name: 'Power-Up', description: 'Increases damage for one attack' },
    { id: 2, name: 'Special Move', description: 'Unleash a powerful attack on your opponent' },
    // Add more items
  ]);

  const handleUseItem = (itemId) => {
    // Logic to use the selected item
    console.log(`Using item with ID ${itemId}...`);
  };

  const handleDiscardItem = (itemId) => {
    // Logic to discard the selected item
    console.log(`Discarding item with ID ${itemId}...`);
    setItems(items.filter(item => item.id !== itemId));
  };

  return (
    <Container>
      <h3>Inventory</h3>
      <ItemList>
        {items.map(item => (
          <Item key={item.id}>
            <strong>{item.name}</strong>: {item.description}
            <div>
              <ActionButton onClick={() => handleUseItem(item.id)} text="Use" />
              <ActionButton onClick={() => handleDiscardItem(item.id)} text="Discard" danger />
            </div>
          </Item>
        ))}
      </ItemList>
    </Container>
  );
};

export default Inventory;
