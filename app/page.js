"use client";
import {
  Box,
  Stack,
  Typography,
  Button,
  Modal,
  TextField,
} from "@mui/material";
import { firestore } from "@/firebase";
import {
  collection,
  getDocs,
  query,
  setDoc,
  doc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "#333",
  border: "2px solid #5e5c5c",
  boxShadow: 24,
  display: "flex",
  p: 4,
  gap: 3,
  borderRadius: "8px", // Rounded corners
};

export default function Home() {
  const [pantry, setPantry] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const updatePantry = async () => {
    const snapshot = query(collection(firestore, "pantry"));
    const docs = await getDocs(snapshot);
    const pantryList = [];
    docs.forEach((doc) => {
      pantryList.push({ name: doc.id, count: doc.data().count });
    });
    setPantry(pantryList);
  };

  useEffect(() => {
    updatePantry();
  }, []);

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "pantry"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const currentCount = docSnap.data().count;
      await setDoc(docRef, { count: currentCount + 1 });
    } else {
      await setDoc(docRef, { count: 1 });
    }
    updatePantry();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "pantry"), item.name);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const currentCount = docSnap.data().count;
      if (currentCount > 1) {
        await setDoc(docRef, { count: currentCount - 1 });
      } else {
        await deleteDoc(docRef);
      }
    }
    updatePantry();
  };

  const filteredPantry = pantry.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box
    bgcolor='#121212'

    >
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        gap={2}
      >
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2" color='#e0e0e0'>
              Add Item
            </Typography>

            <Stack width="100%" direction="row" spacing={2}>
              <TextField
                id="outlined-basic"
                label="item"
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                sx={{ 
                  borderRadius: '8px',
                  input: { color: '#e0e0e0' },
                  label: { color: '#e0e0e0' }, // Label color
                  fieldset: { borderColor: '#616161' }, // Border color
                  bgcolor: '#424242' 
                 }} 
              />
              <Button
                variant="outlined"
                onClick={() => {
                  addItem(itemName);
                  setItemName("");
                  handleClose();
                }}
                sx={{ borderRadius: '8px' }} // Rounded corners
              >
                Add
              </Button>
            </Stack>
          </Box>
        </Modal>

        <Box
          width="800px"
          height="100px"
          bgcolor="#1e1e1e"
          display="flex"
          justifyContent="center"
          alignItems="center"
          mb={2}
          borderRadius="8px" // Rounded corners
        >
          <Typography variant="h2" color='#e0e0e0' textAlign="center">
            Pantry Items
          </Typography>
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center" width="800px" mb={2} borderRadius="8px">
          <TextField
            id="search-bar"
            label="Filter Items"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ mr: 2,
               borderRadius: '8px',
               input: { color: '#e0e0e0' }, // Text color inside the input
              label: { color: '#e0e0e0' }, // Label color
              fieldset: { borderColor: '#616161' }, // Border color
              bgcolor: '#424242' // Background color of the input field
               }} 
          />
          <Button
            variant="contained"
            onClick={handleOpen}
            sx={{ borderRadius: '8px' }} // Rounded corners
          >
            Add
          </Button>
        </Box>

        <Box border="1px solid #333" borderRadius="8px"> {/* Rounded corners */}
          <Stack width="800px" height="300px" spacing={2} overflow="auto">
            {filteredPantry.map(({ name, count }) => (
              <Box
                key={name}
                width="100%"
                minHeight="150px"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                bgcolor="#1e1e1e"
                paddingX={5}
                borderRadius="8px" // Rounded corners
              >
                <Typography variant="h3" color="#e0e0e0" textAlign="center">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>

                <Typography variant="h3" color='#e0e0e0' textAlign="center">
                  Quantity: {count}
                </Typography>

                <Box display="flex" gap={2}>
                  <Button variant="contained" onClick={() => addItem(name)}>
                    +
                  </Button>
                  <Button variant="contained" onClick={() => removeItem({ name })}>
                    -
                  </Button>
                </Box>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
