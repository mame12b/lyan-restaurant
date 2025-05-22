
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
//                     <Menu value="Appetizers">Appetizers</Menu>
//                     <Menu value="Main Courses">Main Courses</Menu>
//                     <Menu value="Desserts">Desserts</Menu>
//                     <Menu value="Beverages">Beverages</Menu>
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
//                     <Menu value="available">Available</Menu>
//                     <Menu value="unavailable">Unavailable</Menu>
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

import { useState, useEffect, useCallback, memo } from 'react';
import { 
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  Button,
  Rating,
  Divider,
  Pagination,
  Checkbox,
  FormGroup,
  FormControlLabel,
  TextField,
  Select,
  InputLabel,
  FormControl,
  Paper,
  Box,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  MenuItem
} from '@mui/material';
import { ShoppingCart, Search, Add, Edit, Delete, Close } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '../../context/AuthContext';

const schema = yup.object().shape({
  name: yup.string().required('Item name is required'),
  price: yup.number().required('Price is required').min(0),
  description: yup.string().required('Description is required'),
  category: yup.string().required('Category is required'),
  tags: yup.array().of(yup.string()),
  available: yup.boolean().required('Availability status is required')
});

const MenuItemCard = memo(({ item, addToCart, isAdmin, onEdit, onDelete }) => (
  <Grid item xs={12} sm={6} md={4} lg={3}>
    <Card sx={{ 
      height: 400, 
      display: 'flex', 
      flexDirection: 'column',
      borderRadius: 3,
      boxShadow: 3,
      transition: 'transform 0.3s, box-shadow 0.3s',
      '&:hover': { 
        transform: 'translateY(-5px)',
        boxShadow: 6 
      }
    }}>
      <CardMedia
        component="img"
        height="200"
        image={item.image?.url || '/images/placeholder.jpg'}
        alt={item.name}
        sx={{ 
          objectFit: 'cover',
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3
        }}
        onError={(e) => {
          e.target.src = '/images/placeholder.jpg';
        }}
      />

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          {item.name}
          {!item.available && (
            <Chip label="Unavailable" color="error" size="small" sx={{ ml: 1 }} />
          )}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Rating value={item.rating} precision={0.5} readOnly sx={{ color: 'secondary.main' }} />
          <Chip 
            label={`$${item.price?.toFixed(2) || '0.00'}`} 
            color="primary"
            sx={{ fontWeight: 700, fontSize: '1.1rem', px: 2, borderRadius: 2 }}
          />  
        </Box>

        <Typography variant="body2" color="text.secondary" paragraph>
          {item.description}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {item.tags?.map(tag => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              variant="outlined"
              color="secondary"
              sx={{ borderRadius: 2, textTransform: "capitalize" }}
            />
          ))}
        </Box>
      </CardContent>

      <Box sx={{ display: 'flex', mt: 'auto' }}>
        {isAdmin ? (
          <>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              sx={{ 
                py: 1.5,
                borderBottomLeftRadius: 3,
                borderTopRightRadius: 0
              }}
              onClick={() => onEdit(item)}
            >
              <Edit />
            </Button>
            <Button
              fullWidth
              variant="contained"
              color="error"
              sx={{ 
                py: 1.5,
                borderBottomRightRadius: 3,
                borderTopLeftRadius: 0
              }}
              onClick={() => onDelete(item._id)}
            >
              <Delete />
            </Button>
          </>
        ) : (
          <Button 
            fullWidth 
            variant="contained" 
            color="secondary"
            sx={{ 
              py: 1.5,
              borderBottomLeftRadius: 3,
              borderBottomRightRadius: 3,
              fontWeight: 700
            }}
            onClick={() => addToCart(item)}
            disabled={!item.available}
          >
            Add to Cart
          </Button>
        )}
      </Box>
    </Card>
  </Grid>
));

const Menu = () => {
  const { user } = useAuth();
  const { branchId } = useParams();
  const [menu, setMenu] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [sortBy, setSortBy] = useState('price_asc');

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      price: 0,
      description: '',
      category: '',
      tags: [],
      available: true
    }
  });


 const [filters, setFilters] = useState({
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    minRating: 0,
    search: ''
  });

  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });

  const sortMapping = {
    price_asc: 'price',
    price_desc: '-price',
    rating: '-rating',
    popular: '-orderCount'
  };

  const fetchMenu = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const tags = [
        ...(filters.vegetarian ? ['vegetarian'] : []),
        ...(filters.vegan ? ['vegan'] : []),
        ...(filters.glutenFree ? ['gluten-free'] : [])
      ].join(',');

      const params = {
        search: debouncedSearch,
        minRating: filters.minRating,
        tags: tags || undefined,
        sort: sortMapping[sortBy],
        page: pagination.page,
        limit: pagination.limit,
        ...(branchId && { branchId }),
      };

      const response = await axios.get('http://localhost:5000/api/menu', {
        params,
        headers: user?.role === 'admin' ? { 
          Authorization: `Bearer ${localStorage.getItem('authToken')}` 
        } : {}
      });

      if (!response.data?.success || !Array.isArray(response.data.data)) {
        throw new Error(response.data?.message || 'Invalid data format');
      }

      setMenu(response.data.data);
      setPagination(prev => ({
        ...prev,
        total: response.data.total,
        pages: response.data.pages,
      }));
    } catch (error) {
      setError(error.response?.data?.message || error.message);
      setMenu([]);
    } finally {
      setLoading(false);
    }
  }, [branchId, debouncedSearch, filters, sortBy, pagination, user]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 300);

    return () => clearTimeout(handler);
  }, [filters.search]);

    useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);


  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Convert tags array to comma-separated string
        const tags = [
          ...(filters.vegetarian ? ['vegetarian'] : []),
          ...(filters.vegan ? ['vegan'] : []),
          ...(filters.glutenFree ? ['gluten-free'] : [])
        ].join(',');

        const params = {
          search: debouncedSearch,
          minRating: filters.minRating,
          tags: tags || undefined, // Send undefined if empty
          sort: sortMapping[sortBy],
          page: pagination.page,
          limit: pagination.limit,
          ...(branchId && { branchId }), // Conditional branchId
        };

        const response = await axios.get('http://localhost:5000/api/menu', {
          params,
          validateStatus: (status) => status < 500,
        });

        // Handle non-2xx responses
        if (response.status !== 200 || !response.data?.success) {
          throw new Error(response.data?.message || 'Failed to fetch menu');
        }

        // Validate response structure
        if (!Array.isArray(response.data.data)) {
          throw new Error('Invalid data format from server');
        }

        setMenu(response.data.data);
        setPagination(prev => ({
          ...prev,
          total: response.data.total,
          pages: response.data.pages,
        }));
      } catch (error) {
        setError(error.message || 'Failed to load menu items');
        console.error('Fetch error:', error);
        setMenu([]); // Reset menu on error
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [branchId, filters, sortBy, pagination.page, pagination.limit,debouncedSearch]);

  

useEffect(() => {
  const handler = setTimeout(() => {
    setDebouncedSearch(filters.search);
  }, 300); // 300ms delay

  return () => clearTimeout(handler);
}, [filters.search]);

  // pagination handler 
  const handlePageChange = (event, page) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const handleCRUD = async (method, url, data) => {
    try {
      const response = await axios({
        method,
        url: `http://localhost:5000/api/menu/${url}`,
        data,
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('authToken')}` 
        }
      });

      setSuccess(response.data.message);
      fetchMenu();
      return true;
    } catch (error) {
      setError(error.response?.data?.message || error.message);
      return false;
    }
  };

  const handleCreate = async (data) => {
    const success = await handleCRUD('post', branchId, data);
    if (success) handleCloseDialog();
  };

  const handleUpdate = async (data) => {
    const success = await handleCRUD('put', editItem._id, data);
    if (success) handleCloseDialog();
  };

  const handleDelete = async (id) => {
    await handleCRUD('delete', id);
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

  const addToCart = useCallback((item) => {
    setSelectedItems(prev => {
      const existing = prev.find(i => i._id === item._id);
      if (existing) {
        return prev.map(i => i._id === item._id 
          ? { ...i, quantity: i.quantity + 1 } 
          : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);
  


  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Page Header */}
      <Typography variant="h2" sx={{ 
        mb: 4,
        fontWeight: 700, 
        textAlign: 'center' 
        }}>
        Our Signature Dishes
      </Typography>
       {user?.role === 'admin' && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleOpenCreate}
          >
            Add New Item
          </Button>
        )}
      <Grid container spacing={4}>

        {/* Filter Sidebar - Left Column */}
        <Grid item xs={12} md={3}>
          <Paper elevation={2} sx={{
             p: 3, 
             borderRadius: 2,
             position: "sticky",
             top: 20,
             bgcolor: "background.paper" 
             }}>

            {/* Filter Header */}
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Filters
            </Typography>

            {/* Dietary Filters */}
            <FormGroup>
              <Typography variant="subtitle1" gutterBottom>
                Dietary Preferences
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={filters.vegetarian}
                    onChange={(e) => setFilters({...filters, vegetarian: e.target.checked})}
                  />
                }
                label="Vegetarian"
              />
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={filters.vegan}
                    onChange={(e) => setFilters({...filters, vegan: e.target.checked})}
                  />
                }
                label="Vegan"
              />
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={filters.glutenFree}
                    onChange={(e) => setFilters({...filters, glutenFree: e.target.checked})}
                  />
                }
                label="Gluten Free"
              />
            </FormGroup>

            <Divider sx={{ my: 3 }} />

            {/* Rating Filter */}
            <Typography variant="subtitle1" gutterBottom>
              Minimum Rating
            </Typography>
            <Rating
              value={filters.minRating}
              onChange={(event, newValue) => setFilters({...filters, minRating: newValue})}
              precision={0.5}
              sx={{ color: 'secondary.main' }}
            />
          </Paper>
        </Grid>

        {/* Main Content - Right Column */}
        <Grid item xs={12} md={9}>
          {/* Sorting Controls and Search */}
          <Box sx={{ 
            display: 'flex',
             gap: 2,
              mb: 4, 
             flexWrap: 'wrap',
             backgroundColor: "background.default",
             p: 2,
             borderRadius: 3 
             }}>

            {/* Search Field */}
            <TextField
              variant="outlined"
              placeholder="Search dishes..."
              InputProps={{ startAdornment: <Search sx={{ mr: 1 }} /> }}
              sx={{ flexGrow: 1, maxWidth: 400 }}
            />

            {/* Sorting Dropdown */}
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <Menu value="price_asc">Price: Low to High</Menu>
                <Menu value="price_desc">Price: High to Low</Menu>
                <Menu value="rating">Rating</Menu>
                <Menu value="popular">Most Popular</Menu>
              </Select>
            </FormControl>
          </Box>


      {/* Menu Grid */}
      <Grid container spacing={4}>
        {loading ? (
          // Loading Skeletons
          Array.from({ length: 8 }).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card sx={{
                 height: 400,
                 borderRadius: 3,
                 boxShadow: 3 
                 }}>
                <Skeleton variant="rectangular" height={200} sx={{borderRadius: 3}} />
                <CardContent>
                  <Skeleton variant="text" width="60%" height={30} />
                  <Skeleton variant="text" width="40%" height={25}/>
                  <Box sx={{display: 'flex', gap: 1, mt: 1}}>
                  <Skeleton variant="text" width="80%" height={20} />
                  <Skeleton variant="text" width="100%" height={20}/>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          menu.map(item => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
              <Card sx={{ 
                height: 400, 
                display: 'flex', 
                flexDirection: 'column',
                borderRadius: 3,
                boxShadow: 3,
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': { 
                  transform: 'translateY(-5px)',
                boxShadow: 6 
              }
              }}>
                {/* Food Image */}
                <CardMedia
                  component="img"
                  height="200"
                  image={item.image.url}
                  alt={item.name}
                  sx={{ objectFit: 'cover',
                        borderTopLeftRadius:3,
                        borderTopRightRadius: 3
                   }}
                />

                <CardContent sx={{ flexGrow: 1 }}>
                  {/* Dish Name */}
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    {item.name}
                  </Typography>

                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2
                  }}>

                  {/* Rating and Price */}
                  <div className="flex justify-between items-center mb-2">
                    <Rating 
                      value={item.rating} 
                      precision={0.5} 
                      readOnly 
                      sx={{ color: 'secondary.main' }}
                    />
                    <Chip 
                      label={`$${item.price.toFixed(2)}`} 
                      color="primary"
                      sx={{ 
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        px: 2,
                        borderRadius: 2
                      }}
                    />  
                  </div>
                  </Box>

                  {/* Description */}
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {item.description}
                  </Typography>

                  {/* Dietary Tags */}
                  <div className="flex gap-1 flex-wrap">
                    {item.tags.map(tag => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        variant="outlined"
                        color="secondary"
                        sx={{ borderRadius: 2,
                              textTransform: "capitalize"
                         }}
                      />
                    ))}
                  </div>
                </CardContent>

                {/* Add to Cart Button */}
                <Button 
                  fullWidth 
                  variant="contained" 
                  color='secondary'
                  sx={{ 
                    mt: 'auto',
                    py: 1.5,
                    borderBottomLeftRadius: 3,
                    borderBottomRightRadius: 3,
                    fontWeight: 700
                  }}
                  onClick={() => addToCart(item)}
                >
                  Add to Cart
                </Button>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Grid>
    </Grid>
      {/* Order Summary Floating Button */}
      {selectedItems.length > 0 && (
        <Button
          variant="contained"
          color="secondary"
          startIcon={<ShoppingCart />}
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            py: 2,
            px: 4,
            borderRadius: 2,
            boxShadow: 3,
            '& .MuiButton-startIcon': { mr: 1.5 }
          }}
        >
          View Order ({selectedItems.length})
        </Button>
      )}

      {/* Category Dividers */}
      <Divider sx={{ my: 6 }}>
        <Chip 
          label="Chef's Specials" 
          color="primary" 
          sx={{ px: 4, fontSize: '1.1rem' }}
        />
      </Divider>

      {/* Pagination */}
      <Pagination 
  count={pagination.pages} 
  page={pagination.page}
  onChange={handlePageChange}
  color="primary" 
  sx={{ 
    mt: 4,
    '& .MuiPaginationItem-root': {
      fontSize: '1.1rem'
    }
  }}
/>
 <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editItem ? 'Edit Menu Item' : 'Create New Menu Item'}
          <IconButton onClick={handleCloseDialog} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleSubmit(editItem ? handleUpdate : handleCreate)}>
          <DialogContent dividers>
            {/* Form fields same as before */}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editItem ? 'Update Item' : 'Create Item'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar open={!!error} onClose={() => setError('')}>
        <Alert severity="error">{error}</Alert>
      </Snackbar>

      <Snackbar open={!!success} onClose={() => setSuccess('')}>
        <Alert severity="success">{success}</Alert>
      </Snackbar>
    </Container>
  )
};

export default Menu;

// import { useState, useEffect, useCallback, memo } from 'react';
// import { 
//   Container,
//   Grid,
//   Card,
//   CardMedia,
//   CardContent,
//   Typography,
//   Chip,
//   Button,
//   Rating,
//   Divider,
//   Pagination,
//   Checkbox,
//   FormGroup,
//   FormControlLabel,
//   TextField,
//   Select,
//   InputLabel,
//   FormControl,
//   Paper,
//   Box,
//   Skeleton,
//   MenuItem
// } from '@mui/material';
// import { ShoppingCart, Search } from '@mui/icons-material';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import "../../styles/global.css";

// const MenuItemCard = memo(({ item, addToCart }) => (
//   <Grid item xs={12} sm={6} md={4} lg={3}>
//     <Card sx={{ 
//       height: 400, 
//       display: 'flex', 
//       flexDirection: 'column',
//       borderRadius: 3,
//       boxShadow: 3,
//       transition: 'transform 0.3s, box-shadow 0.3s',
//       '&:hover': { 
//         transform: 'translateY(-5px)',
//         boxShadow: 6 
//       }
//     }}>
//       <CardMedia
//         component="img"
//         height="200"
//         image={item.image?.url || '/images/placeholder.jpg'}
//         alt={item.name}
//         sx={{ 
//           objectFit: 'cover',
//           borderTopLeftRadius: 3,
//           borderTopRightRadius: 3
//         }}
//         onError={(e) => {
//           e.target.src = '/images/placeholder.jpg';
//         }}
//       />

//       <CardContent sx={{ flexGrow: 1 }}>
//         <Typography variant="h6" fontWeight={700} gutterBottom>
//           {item.name}
//         </Typography>

//         <Box sx={{
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           mb: 2
//         }}>
//           <Rating 
//             value={item.rating} 
//             precision={0.5} 
//             readOnly 
//             sx={{ color: 'secondary.main' }}
//           />
//           <Chip 
//             label={`$${item.price?.toFixed(2) || '0.00'}`} 
//             color="primary"
//             sx={{ 
//               fontWeight: 700,
//               fontSize: '1.1rem',
//               px: 2,
//               borderRadius: 2
//             }}
//           />  
//         </Box>

//         <Typography variant="body2" color="text.secondary" paragraph>
//           {item.description}
//         </Typography>

//         <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
//           {item.tags?.map(tag => (
//             <Chip
//               key={tag}
//               label={tag}
//               size="small"
//               variant="outlined"
//               color="secondary"
//               sx={{ 
//                 borderRadius: 2,
//                 textTransform: "capitalize"
//               }}
//             />
//           ))}
//         </Box>
//       </CardContent>

//       <Button 
//         fullWidth 
//         variant="contained" 
//         color='secondary'
//         sx={{ 
//           mt: 'auto',
//           py: 1.5,
//           borderBottomLeftRadius: 3,
//           borderBottomRightRadius: 3,
//           fontWeight: 700
//         }}
//         onClick={() => addToCart(item)}
//       >
//         Add to Cart
//       </Button>
//     </Card>
//   </Grid>
// ));

// const Menu = () => {
//   const { branchId } = useParams();
//   const [sortBy, setSortBy] = useState('price_asc');
//   const [menu, setMenu] = useState([]);
//   const [selectedItems, setSelectedItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [filters, setFilters] = useState({
//     vegetarian: false,
//     vegan: false,
//     glutenFree: false,
//     minRating: 0,
//     search: ''
//   });
//   const [debouncedSearch, setDebouncedSearch] = useState('');
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 10,
//     total: 0,
//     pages: 1
//   });

//   const sortMapping = {
//     price_asc: 'price',
//     price_desc: '-price',
//     rating: '-rating',
//     popular: '-orderCount'
//   };

//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedSearch(filters.search);
//     }, 300);

//     return () => clearTimeout(handler);
//   }, [filters.search]);

//   useEffect(() => {
//     const controller = new AbortController();
//     let isMounted = true;

//     const fetchMenu = async () => {
//       try {
//         setLoading(true);
//         setError('');
        
//         const tags = [
//           ...(filters.vegetarian ? ['vegetarian'] : []),
//           ...(filters.vegan ? ['vegan'] : []),
//           ...(filters.glutenFree ? ['gluten-free'] : [])
//         ].join(',');

//         const params = {
//           search: debouncedSearch,
//           minRating: filters.minRating,
//           tags: tags || undefined,
//           sort: sortMapping[sortBy],
//           page: pagination.page,
//           limit: pagination.limit,
//           ...(branchId && { branchId }),
//         };

//         const response = await axios.get('http://localhost:5000/api/menu', {
//           params,
//           signal: controller.signal,
//           validateStatus: (status) => status < 500,
//         });

//         if (!isMounted) return;

//         if (response.status !== 200 || !response.data?.success) {
//           throw new Error(response.data?.message || 'Failed to fetch menu');
//         }

//         if (!Array.isArray(response.data.data)) {
//           throw new Error('Invalid data format from server');
//         }

//         setMenu(response.data.data);
//         setPagination(prev => ({
//           ...prev,
//           total: response.data.total,
//           pages: response.data.pages,
//         }));
//       } catch (error) {
//         if (isMounted && !axios.isCancel(error)) {
//           setError(error.message || 'Failed to load menu items');
//           setMenu([]);
//         }
//       } finally {
//         if (isMounted) setLoading(false);
//       }
//     };

//     fetchMenu();

//     return () => {
//       isMounted = false;
//       controller.abort();
//     };
//   }, [branchId, debouncedSearch, filters, sortBy, pagination.page, pagination.limit]);

//   const handlePageChange = (event, page) => {
//     setPagination(prev => ({ ...prev, page }));
//   };

//   const addToCart = useCallback((item) => {
//     setSelectedItems(prev => {
//       const existing = prev.find(i => i._id === item._id);
//       if (existing) {
//         return prev.map(i => i._id === item._id 
//           ? { ...i, quantity: i.quantity + 1 } 
//           : i
//         );
//       }
//       return [...prev, { ...item, quantity: 1 }];
//     });
//   }, []);

//   return (
//     <Container maxWidth="xl" sx={{ py: 4 }}>
//       <Typography variant="h2" sx={{ mb: 4, fontWeight: 700, textAlign: 'center' }}>
//         Our Signature Dishes
//       </Typography>

//       {error && (
//         <Box sx={{ textAlign: 'center', mb: 4, color: 'error.main' }}>
//           <Typography variant="h6">{error}</Typography>
//           <Button 
//             variant="outlined" 
//             sx={{ mt: 2 }}
//             onClick={() => window.location.reload()}
//           >
//             Try Again
//           </Button>
//         </Box>
//       )}

//       <Grid container spacing={4}>
//         <Grid item xs={12} md={3}>
//           <Paper elevation={2} sx={{ p: 3, borderRadius: 2, position: "sticky", top: 20 }}>
//             <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
//               Filters
//             </Typography>

//             <FormGroup>
//               <Typography variant="subtitle1" gutterBottom>
//                 Dietary Preferences
//               </Typography>
//               <FormControlLabel
//                 control={
//                   <Checkbox 
//                     checked={filters.vegetarian}
//                     onChange={(e) => setFilters(prev => ({
//                       ...prev, 
//                       vegetarian: e.target.checked
//                     }))}
//                   />
//                 }
//                 label="Vegetarian"
//               />
//               <FormControlLabel
//                 control={
//                   <Checkbox 
//                     checked={filters.vegan}
//                     onChange={(e) => setFilters(prev => ({
//                       ...prev, 
//                       vegan: e.target.checked
//                     }))}
//                   />
//                 }
//                 label="Vegan"
//               />
//               <FormControlLabel
//                 control={
//                   <Checkbox 
//                     checked={filters.glutenFree}
//                     onChange={(e) => setFilters(prev => ({
//                       ...prev, 
//                       glutenFree: e.target.checked
//                     }))}
//                   />
//                 }
//                 label="Gluten Free"
//               />
//             </FormGroup>

//             <Divider sx={{ my: 3 }} />

//             <Typography variant="subtitle1" gutterBottom>
//               Minimum Rating
//             </Typography>
//             <Rating
//               value={filters.minRating}
//               onChange={(event, newValue) => setFilters(prev => ({
//                 ...prev, 
//                 minRating: newValue
//               }))}
//               precision={0.5}
//               sx={{ color: 'secondary.main' }}
//             />
//           </Paper>
//         </Grid>

//         <Grid item xs={12} md={9}>
//           <Box sx={{ 
//             display: 'flex', 
//             gap: 2, 
//             mb: 4, 
//             flexWrap: 'wrap', 
//             p: 2, 
//             borderRadius: 3 
//           }}>
//             <TextField
//               variant="outlined"
//               placeholder="Search dishes..."
//               value={filters.search}
//               onChange={(e) => setFilters(prev => ({
//                 ...prev, 
//                 search: e.target.value
//               }))}
//               InputProps={{ startAdornment: <Search sx={{ mr: 1 }} /> }}
//               sx={{ flexGrow: 1, maxWidth: 400 }}
//             />

//             <FormControl sx={{ minWidth: 200 }}>
//               <InputLabel>Sort By</InputLabel>
//               <Select
//                 value={sortBy}
//                 label="Sort By"
//                 onChange={(e) => setSortBy(e.target.value)}
//               >
//                 <MenuItem value="price_asc">Price: Low to High</MenuItem>
//                 <MenuItem value="price_desc">Price: High to Low</MenuItem>
//                 <MenuItem value="rating">Rating</MenuItem>
//                 <MenuItem value="popular">Most Popular</MenuItem>
//               </Select>
//             </FormControl>
//           </Box>

//           <Grid container spacing={4}>
//             {loading ? (
//               Array.from({ length: pagination.limit }).map((_, index) => (
//                 <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
//                   <Card sx={{ 
//                     height: 400, 
//                     borderRadius: 3, 
//                     boxShadow: 3 
//                   }}>
//                     <Skeleton 
//                       variant="rectangular" 
//                       height={200} 
//                       sx={{ borderRadius: 3 }} 
//                     />
//                     <CardContent>
//                       <Skeleton variant="text" width="60%" height={30} />
//                       <Skeleton variant="text" width="40%" height={25}/>
//                       <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
//                         <Skeleton variant="text" width="80%" height={20} />
//                         <Skeleton variant="text" width="100%" height={20}/>
//                       </Box>
//                     </CardContent>
//                   </Card>
//                 </Grid>
//               ))
//             ) : (
//               menu.map(item => (
//                 <MenuItemCard 
//                   key={item._id} 
//                   item={item} 
//                   addToCart={addToCart} 
//                 />
//               ))
//             )}
//           </Grid>
//         </Grid>
//       </Grid>

//       {selectedItems.length > 0 && (
//         <Button
//           variant="contained"
//           color="secondary"
//           startIcon={<ShoppingCart />}
//           sx={{
//             position: 'fixed',
//             bottom: 32,
//             right: 32,
//             py: 2,
//             px: 4,
//             borderRadius: 2,
//             boxShadow: 3,
//           }}
//         >
//           View Order ({selectedItems.length})
//         </Button>
//       )}

//       <Pagination 
//         count={pagination.pages} 
//         page={pagination.page}
//         onChange={handlePageChange}
//         color="primary" 
//         sx={{ mt: 4 }}
//       />
//     </Container>
//   );
// };

// export default Menu;





