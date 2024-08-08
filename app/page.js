'use client'

import { useState, useEffect } from 'react'
import { Box, Stack, Typography, Button, Modal, TextField, Menu, MenuItem } from '@mui/material'
// import { firestore } from '@/firebase'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'

let firestore;
if (typeof window !== 'undefined') {
    // Importing Firestore only on the client side
    import('@/firebase').then(module => {
        firestore = module.firestore;
    });
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
  borderRadius: 2,
}

export default function Home() {
    const [inventory, setInventory] = useState([])
    const [open, setOpen] = useState(false)
    const [itemName, setItemName] = useState('') 
    const [searchQuery, setSearchQuery] = useState('') 
    const [filterAnchorEl, setFilterAnchorEl] = useState(null);
    const [filterOption, setFilterOption] = useState('');

    const updateInventory = async () => {
        if (!firestore) return;
        const q = query(collection(firestore, 'inventory'));
        const snapshot = await getDocs(q);
        const inventoryList = [];
        snapshot.forEach((doc) => {
            inventoryList.push({ name: doc.id, ...doc.data() });
        });
        setInventory(inventoryList);
    };
      
    useEffect(() => {
        updateInventory();
      }, [firestore]);
    
    const addItem = async (item) => {
        if (!firestore) return;
        const docRef = doc(collection(firestore, 'inventory'), item)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
            const { quantity } = docSnap.data()
            await setDoc(docRef, { quantity: quantity + 1 })
        } else {
            await setDoc(docRef, { quantity: 1 })
        }
        await updateInventory()
    };
      
    const removeItem = async (item) => {
        if (!firestore) return;
        const docRef = doc(collection(firestore, 'inventory'), item)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {

            const { quantity } = docSnap.data()
            if (quantity === 1) {
                await deleteDoc(docRef)
            } else {
                await setDoc(docRef, { quantity: quantity - 1 })
            }
        }
        await updateInventory()
    };

    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)


    const handleFilterOpen = (event) => setFilterAnchorEl(event.currentTarget);
    const handleFilterClose = () => setFilterAnchorEl(null);

    const handleFilterSelect = (option) => {
        setFilterOption(option);
        handleFilterClose();
    };

    // Filter the inventory based on the search query
    const filteredInventory = inventory
    .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (filterOption === 'Low to High') {
        return a.quantity - b.quantity;
      } else if (filterOption === 'High to Low') {
        return b.quantity - a.quantity;
      }
      return 0;
    });

    return (
        <Box
          width="100vw"
          height="100vh"
          display={'flex'}
          justifyContent={'center'}
          flexDirection={'column'}
          alignItems={'center'}
          gap={2}
          bgcolor="#f5f5f5"
        >
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2" mb={2}>
                Add Item
              </Typography>
              <Stack width="100%" direction={'row'} spacing={2}>
                <TextField
                  id="outlined-basic"
                  label="Item"
                  variant="outlined"
                  fullWidth
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={async () => {
                    addItem(itemName)
                    setItemName('')
                    handleClose()
                  }}
                >
                  Add
                </Button>
              </Stack>
            </Box>
          </Modal>
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Add New Item
          </Button>
          <TextField
            label="Search"
            variant="outlined"
            fullWidth
            margin="normal"
            sx={{ 
                width: '300px', 
                margin: 'normal', 
                padding: '8px' 
            }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

            <Button
                variant="contained"
                color="secondary"
                onClick={handleFilterOpen}
                sx={{ marginBottom: 2 }}
            >
                Filter by Quantity
            </Button>
            <Menu
                anchorEl={filterAnchorEl}
                open={Boolean(filterAnchorEl)}
                onClose={handleFilterClose}
            >
                <MenuItem onClick={() => handleFilterSelect('Low to High')}>Low to High</MenuItem>
                <MenuItem onClick={() => handleFilterSelect('High to Low')}>High to Low</MenuItem>
            </Menu>

          <Box border={'1px solid #333'} borderRadius={2} bgcolor="white" p={2}>
            <Box
              width="800px"
              height="80px"
              bgcolor={'#3f51b5'}
              display={'flex'}
              justifyContent={'center'}
              alignItems={'center'}
              borderRadius={1}
            >
              <Typography variant={'h4'} color={'white'} textAlign={'center'}>
                Inventory Items
              </Typography>
            </Box>
            <Stack width="800px" height="400px" spacing={2} overflow={'auto'} mt={2}
              p={1}
              bgcolor="#f5f5f5"
              borderRadius={1}>
              {filteredInventory.map(({name, quantity}) => (
                <Box
                  key={name}
                  width="100%"
                  minHeight="100px"
                  display={'flex'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                  bgcolor={'white'}
                  paddingX={5}
                  boxShadow={1}
                  p={2}
                  borderRadius={1}
                >
                  <Typography variant={'h6'} color={'#333'} textAlign={'center'}>
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                  <Typography variant={'h6'} color={'#333'} textAlign={'center'}>
                    Quantity: {quantity}
                  </Typography>
                  <Button variant="contained" color="secondary" size="small" onClick={() => removeItem(name)}>
                    Remove
                  </Button>
                </Box>
              ))}
            </Stack>
          </Box>
        </Box>
      );
}