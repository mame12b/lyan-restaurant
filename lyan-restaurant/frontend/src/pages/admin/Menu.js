// import { useState, useEffect } from 'react';
// import {
//   Container,
//   Box,
//   Button,
//   Typography,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TextField,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   IconButton,
//   Snackbar,
//   Alert,
//   CircularProgress
// } from '@mui/material';
// import { Edit, Delete, Add, Close } from '@mui/icons-material';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import { useForm, Controller } from 'react-hook-form';
// import * as yup from 'yup';
// import { yupResolver } from '@hookform/resolvers/yup';

// const schema = yup.object().shape({
//   itemName: yup.string().required('Item name is required'),
//   price: yup.number().required('Price is required').min(0),
//   description: yup.string().required('Description is required'),
//   category: yup.string().required('Category is required'),
//   tags: yup.array().of(yup.string()),
//   available: yup.boolean().required('Availability status is required')
// });

// const Menu = () => {
//   const { branchId } = useParams();
//   const [menu, setMenu] = useState([]);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [editItem, setEditItem] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   const { control, handleSubmit, reset, formState: { errors } } = useForm({
//     resolver: yupResolver(schema),
//     defaultValues: {
//       itemName: '',
//       price: 0,
//       description: '',
//       category: '',
//       tags: [],
//       available: true
//     }
//   });

//   useEffect(() => {
    
//       fetchMenu();
//   }, [branchId]);

//   const fetchMenu = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("authToken");
//       const { data } = await axios.get(
//         `http://localhost:5000/api/menu/${branchId}`, // Add branchId to URL
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Cache-Control': 'no-cache'
//           }
//         }
//       );

//       const menuData = data.data || data;
//       setMenu(Array.isArray(menuData) ? menuData : []);

//     } catch (error) {
//       console.error("Fetch Error:", {
//         status: error.response?.status,
//         message: error.response?.data?.message || error.message
//       });
//       setError(error.response?.data?.message || "Failed to fetch menu");
//     } finally {
//       setLoading(false);
//     }
//   };


//   const handleOpenCreate = () => {
//     setEditItem(null);
//     reset();
//     setOpenDialog(true);
//   };
  
//   const handleOpenEdit = (item) => {
//     setEditItem(item);
//     reset(item);
//     setOpenDialog(true);
//   };

//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//     reset();
//     setEditItem(null);
//   };


//   // Update onSubmit function
//   const onSubmit = async (data) => {
//     try {
//       const token = localStorage.getItem("authToken");
//       let response;
      
//       if (editItem) {
//         response = await axios.put(
//           `http://localhost:5000/api/menu/${editItem.id}`,
//           data,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`
//             }
//           }
//         );
//         setMenu(prev => prev.map(item => item.id === editItem.id ? response.data.data : item));
//       } else {
//         response = await axios.post(
//           `http://localhost:5000/api/menu/${branchId}`,
//           data,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`
//             }
//           }
//         );
//         setMenu(prev => [...prev, response.data.data]);
//       }
//       setSuccess(`Item ${editItem ? 'updated' : 'created'} successfully`);
//       handleCloseDialog();
//     } catch (err) {
//       setError(err.response?.data?.message || 'Operation failed');
//     }
//   };
  

// // Update handleDelete function
// const handleDelete = async (id) => {
//   try {
//     const token = localStorage.getItem("authToken");
//     await axios.delete(
//       `http://localhost:5000/api/menu/${id}`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       }
//     );
//     setMenu(prev => prev.filter(item => item.id !== id));
//     setSuccess('Item deleted successfully');
//   } catch (err) {
//     setError(err.response?.data?.message || 'Failed to delete item');
//   }
// };

//   return (
//     <Container maxWidth="lg" sx={{ py: 4 }}>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
//         <Typography variant="h4">Menu Management</Typography>
//         <Button
//           variant="contained"
//           startIcon={<Add />}
//           onClick={handleOpenCreate}
//         >
//           Add New Item
//         </Button>
//       </Box>

//       {loading ? (
//         <CircularProgress sx={{ display: 'block', mx: 'auto' }} />
//       ) : (
//         <TableContainer component={Paper}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Item Name</TableCell>
//                 <TableCell>Price</TableCell>
//                 <TableCell>Category</TableCell>
//                 <TableCell>Available</TableCell>
//                 <TableCell>Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {menu.map((item) => (
//                 <TableRow key={item.id}>
//                   <TableCell>{item.itemName}</TableCell>
//                   <TableCell>${item.price.toFixed(2)}</TableCell>
//                   <TableCell>{item.category}</TableCell>
//                   <TableCell>{item.available ? 'Yes' : 'No'}</TableCell>
//                   <TableCell>
//                     <IconButton onClick={() => handleOpenEdit(item)}>
//                       <Edit color="primary" />
//                     </IconButton>
//                     <IconButton onClick={() => handleDelete(item.id)}>
//                       <Delete color="error" />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       )}

//       <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
//         <DialogTitle>
//           {editItem ? 'Edit Menu Item' : 'Create New Menu Item'}
//           <IconButton
//             aria-label="close"
//             onClick={handleCloseDialog}
//             sx={{ position: 'absolute', right: 8, top: 8 }}
//           >
//             <Close />
//           </IconButton>
//         </DialogTitle>
//         <form onSubmit={handleSubmit(onSubmit)}>
//           <DialogContent dividers>
//             <Controller
//               name="itemName"
//               control={control}
//               render={({ field }) => (
//                 <TextField
//                   {...field}
//                   label="Item Name"
//                   fullWidth
//                   margin="normal"
//                   error={!!errors.itemName}
//                   helperText={errors.itemName?.message}
//                 />
//               )}
//             />

//             <Controller
//               name="price"
//               control={control}
//               render={({ field }) => (
//                 <TextField
//                   {...field}
//                   label="Price"
//                   type="number"
//                   fullWidth
//                   margin="normal"
//                   error={!!errors.price}
//                   helperText={errors.price?.message}
//                 />
//               )}
//             />

//             <Controller
//               name="description"
//               control={control}
//               render={({ field }) => (
//                 <TextField
//                   {...field}
//                   label="Description"
//                   multiline
//                   rows={4}
//                   fullWidth
//                   margin="normal"
//                   error={!!errors.description}
//                   helperText={errors.description?.message}
//                 />
//               )}
//             />

//             <Controller
//               name="category"
//               control={control}
//               render={({ field }) => (
//                 <FormControl fullWidth margin="normal">
//                   <InputLabel>Category</InputLabel>
//                   <Select
//                     {...field}
//                     label="Category"
//                     error={!!errors.category}
//                   >
//                     <MenuItem value="Appetizers">Appetizers</MenuItem>
//                     <MenuItem value="Main Courses">Main Courses</MenuItem>
//                     <MenuItem value="Desserts">Desserts</MenuItem>
//                     <MenuItem value="Beverages">Beverages</MenuItem>
//                   </Select>
//                 </FormControl>
//               )}
//             />

//             <Controller
//               name="available"
//               control={control}
//               render={({ field }) => (
//                 <FormControl fullWidth margin="normal">
//                   <InputLabel>Availability</InputLabel>
//                   <Select
//                     {...field}
//                     label="Availability"
//                     value={field.value ? 'available' : 'unavailable'}
//                     onChange={(e) => field.onChange(e.target.value === 'available')}
//                   >
//                     <MenuItem value="available">Available</MenuItem>
//                     <MenuItem value="unavailable">Unavailable</MenuItem>
//                   </Select>
//                 </FormControl>
//               )}
//             />
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleCloseDialog}>Cancel</Button>
//             <Button type="submit" variant="contained">
//               {editItem ? 'Update Item' : 'Create Item'}
//             </Button>
//           </DialogActions>
//         </form>
//       </Dialog>

//       <Snackbar
//         open={!!error}
//         autoHideDuration={6000}
//         onClose={() => setError('')}
//       >
//         <Alert severity="error" sx={{ width: '100%' }}>
//           {error}
//         </Alert>
//       </Snackbar>

//       <Snackbar
//         open={!!success}
//         autoHideDuration={6000}
//         onClose={() => setSuccess('')}
//       >
//         <Alert severity="success" sx={{ width: '100%' }}>
//           {success}
//         </Alert>
//       </Snackbar>
//     </Container>
//   );
// };

// export default Menu;



import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { Edit, Delete, Add, Close } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const schema = yup.object().shape({
  itemName: yup.string().required('Item name is required'),
  price: yup.number().required('Price is required').min(0),
  description: yup.string().required('Description is required'),
  category: yup.string().required('Category is required'),
  tags: yup.array().of(yup.string()),
  available: yup.boolean().required('Availability status is required')
});

const Menu = () => {
  const { branchId } = useParams();
  const [menu, setMenu] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      itemName: '',
      price: 0,
      description: '',
      category: '',
      tags: [],
      available: true
    }
  });

  useEffect(() => {
    
      fetchMenu();
  }, [branchId]);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const { data } = await axios.get(
        `http://localhost:5000/api/menu/${branchId}`, // Add branchId to URL
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Cache-Control': 'no-cache'
          }
        }
      );

      const menuData = data.data || data;
      setMenu(Array.isArray(menuData) ? menuData : []);

    } catch (error) {
      console.error("Fetch Error:", {
        status: error.response?.status,
        message: error.response?.data?.message || error.message
      });
      setError(error.response?.data?.message || "Failed to fetch menu");
    } finally {
      setLoading(false);
    }
  };

  
  const handleOpenCreate = () => {
    setEditItem(null);
    reset();
    setOpenDialog(true);
  };
  
  const handleOpenEdit = (item) => {
    setEditItem(item);
    reset(item);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    reset();
    setEditItem(null);
  };


  // Update onSubmit function
  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("authToken");
      let response;
      
      if (editItem) {
        response = await axios.put(
          `http://localhost:5000/api/menu/${editItem.id}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setMenu(prev => prev.map(item => item.id === editItem.id ? response.data.data : item));
      } else {
        response = await axios.post(
          `http://localhost:5000/api/menu/${branchId}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setMenu(prev => [...prev, response.data.data]);
      }
      setSuccess(`Item ${editItem ? 'updated' : 'created'} successfully`);
      handleCloseDialog();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };
  

// Update handleDelete function
const handleDelete = async (id) => {
  try {
    const token = localStorage.getItem("authToken");
    await axios.delete(
      `http://localhost:5000/api/menu/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    setMenu(prev => prev.filter(item => item.id !== id));
    setSuccess('Item deleted successfully');
  } catch (err) {
    setError(err.response?.data?.message || 'Failed to delete item');
  }
};

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4">Menu Management</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpenCreate}
        >
          Add New Item
        </Button>
      </Box>

      {loading ? (
        <CircularProgress sx={{ display: 'block', mx: 'auto' }} />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Item Name</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Available</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {menu.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.itemName}</TableCell>
                  <TableCell>${item.price.toFixed(2)}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.available ? 'Yes' : 'No'}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenEdit(item)}>
                      <Edit color="primary" />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(item.id)}>
                      <Delete color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editItem ? 'Edit Menu Item' : 'Create New Menu Item'}
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent dividers>
            <Controller
              name="itemName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Item Name"
                  fullWidth
                  margin="normal"
                  error={!!errors.itemName}
                  helperText={errors.itemName?.message}
                />
              )}
            />

            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Price"
                  type="number"
                  fullWidth
                  margin="normal"
                  error={!!errors.price}
                  helperText={errors.price?.message}
                />
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description"
                  multiline
                  rows={4}
                  fullWidth
                  margin="normal"
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              )}
            />

            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth margin="normal">
                  <InputLabel>Category</InputLabel>
                  <Select
                    {...field}
                    label="Category"
                    error={!!errors.category}
                  >
                    <MenuItem value="Appetizers">Appetizers</MenuItem>
                    <MenuItem value="Main Courses">Main Courses</MenuItem>
                    <MenuItem value="Desserts">Desserts</MenuItem>
                    <MenuItem value="Beverages">Beverages</MenuItem>
                  </Select>
                </FormControl>
              )}
            />

            <Controller
              name="available"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth margin="normal">
                  <InputLabel>Availability</InputLabel>
                  <Select
                    {...field}
                    label="Availability"
                    value={field.value ? 'available' : 'unavailable'}
                    onChange={(e) => field.onChange(e.target.value === 'available')}
                  >
                    <MenuItem value="available">Available</MenuItem>
                    <MenuItem value="unavailable">Unavailable</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editItem ? 'Update Item' : 'Create Item'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
      >
        <Alert severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess('')}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Menu;