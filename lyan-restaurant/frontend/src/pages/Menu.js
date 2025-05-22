// import { useState, useEffect } from 'react';
// import { 
//   Container, Grid,Card, CardMedia,CardContent,
//   Typography,Chip,Button,Rating,Divider,
//   Pagination,Checkbox,FormGroup,FormControlLabel,
//   TextField,Select, MenuItem,InputLabel,
//   FormControl,Paper, Box,
//   Skeleton,
// } from '@mui/material';
// import { ShoppingCart, Search } from '@mui/icons-material';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import "../styles/global.css";

// const MenuImage = ({ item }) => (
//   <CardMedia
//     component="img"
//     height="200"
//     image={item.image?.url || '/images/food-placeholder.jpg'}
//     alt={item.name || 'Menu item'}
//     sx={{
//       objectFit: 'cover',
//       borderTopLeftRadius: 3,
//       borderTopRightRadius: 3
//     }}
//   />
// );

// const PriceDisplay = ({ price }) => (
//   <Chip 
//     label={`$${(price || 0).toFixed(2)}`}
//     color="primary"
//     sx={{ 
//       fontWeight: 700,
//       fontSize: '1.1rem',
//       px: 2,
//       borderRadius: 2
//     }}
//   />
// );
// const Menu = () => {
//   const { branchId } = useParams();
//   const [sortBy, setSortBy] = useState('price_asc');
//   const [menu, setMenu] = useState([]);
//   const [selectedItems, setSelectedItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filters, setFilters] = useState({
//     vegetarian: false,
//     vegan: false,
//     glutenFree: false,
//     minRating: 0,
//     search: ''
//   });
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
//     const fetchMenu = async () => {
//       try {
//         setLoading(true);
//         const params = {
//           search: filters.search,
//           minRating: filters.minRating,
//           tags: [
//             ...(filters.vegetarian ? ['vegetarian'] : []),
//             ...(filters.vegan ? ['vegan'] : []),
//             ...(filters.glutenFree ? ['gluten-free'] : [])
//           ],
//           sort: sortMapping[sortBy],
//           page: pagination.page,
//           limit: pagination.limit,
//           branchId: branchId || undefined
//         };

//         const response = await axios.get('http://localhost:5000/api/menu', { 
//           params,
//           validateStatus: (status) => status < 500 
//         });

//         const validatedMenu = (response.data?.data || []).map(item => ({
//           ...item,
//           id: item._id || Math.random().toString(36).substr(2, 9),
//           image: item.image?.url ? item.image : { url: '/images/food-placeholder.jpg' },
//           price: Number(item.price) || 0,
//           rating: Number(item.rating) || 0,
//           tags: Array.isArray(item.tags) ? item.tags : [],
//           description: item.description || 'No description available'
//         }));

//         setMenu(validatedMenu);
//         setPagination(prev => ({
//           ...prev,
//           total: response.data?.total || 0,
//           pages: response.data?.pages || 1
//         }));
//       } catch (error) {
//         console.error('Fetch error:', error);
//         setMenu([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     const debounceTimer = setTimeout(fetchMenu, 300);
//     return () => clearTimeout(debounceTimer);
//   }, [branchId, filters, sortBy, pagination.page]);

//   const handlePageChange = (event, page) => {
//     setPagination(prev => ({ ...prev, page }));
//   };

//   const addToCart = (item) => {
//     setSelectedItems(prev => {
//       const existing = prev.find(i => i.id === item.id);
//       return existing ? 
//         prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i) :
//         [...prev, { ...item, quantity: 1 }];
//     });
//   };
  

//   return (
//     <Container maxWidth="xl" sx={{ py: 4 }}>
//       {/* Page Header */}
//       <Typography variant="h2" sx={{ 
//         mb: 4,
//         fontWeight: 700, 
//         textAlign: 'center' 
//         }}>
//         Our Signature Dishes
//       </Typography>

//       <Grid container spacing={4}>

//         {/* Filter Sidebar - Left Column */}
//         <Grid item xs={12} md={3}>
//           <Paper elevation={2} sx={{
//              p: 3, 
//              borderRadius: 2,
//              position: "sticky",
//              top: 20,
//              bgcolor: "background.paper" 
//              }}>

//             {/* Filter Header */}
//             <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
//               Filters
//             </Typography>

//             {/* Dietary Filters */}
//             <FormGroup>
//               <Typography variant="subtitle1" gutterBottom>
//                 Dietary Preferences
//               </Typography>
//               <FormControlLabel
//                 control={
//                   <Checkbox 
//                     checked={filters.vegetarian}
//                     onChange={(e) => setFilters({...filters, vegetarian: e.target.checked})}
//                   />
//                 }
//                 label="Vegetarian"
//               />
//               <FormControlLabel
//                 control={
//                   <Checkbox 
//                     checked={filters.vegan}
//                     onChange={(e) => setFilters({...filters, vegan: e.target.checked})}
//                   />
//                 }
//                 label="Vegan"
//               />
//               <FormControlLabel
//                 control={
//                   <Checkbox 
//                     checked={filters.glutenFree}
//                     onChange={(e) => setFilters({...filters, glutenFree: e.target.checked})}
//                   />
//                 }
//                 label="Gluten Free"
//               />
//             </FormGroup>

//             <Divider sx={{ my: 3 }} />

//             {/* Rating Filter */}
//             <Typography variant="subtitle1" gutterBottom>
//               Minimum Rating
//             </Typography>
//             <Rating
//               value={filters.minRating}
//               onChange={(event, newValue) => setFilters({...filters, minRating: newValue})}
//               precision={0.5}
//               sx={{ color: 'secondary.main' }}
//             />
//           </Paper>
//         </Grid>

//         {/* Main Content - Right Column */}
//         <Grid item xs={12} md={9}>
//           {/* Sorting Controls and Search */}
//           <Box sx={{ 
//             display: 'flex',
//              gap: 2,
//               mb: 4, 
//              flexWrap: 'wrap',
//              backgroundColor: "background.default",
//              p: 2,
//              borderRadius: 3 
//              }}>

//             {/* Search Field */}
//             <TextField
//               variant="outlined"
//               placeholder="Search dishes..."
//               InputProps={{ startAdornment: <Search sx={{ mr: 1 }} /> }}
//               sx={{ flexGrow: 1, maxWidth: 400 }}
//             />

//             {/* Sorting Dropdown */}
//             <FormControl sx={{ minWidth: 200 }}>
//               <InputLabel>Sort By</InputLabel>
//               <Select
//                 value={sortBy}
//                 label="Sort By"
//                 onChange={(e) => setSortBy(e.target.value)}
//               >
//                 <Menu value="price_asc">Price: Low to High</Menu>
//                 <Menu value="price_desc">Price: High to Low</Menu>
//                 <Menu value="rating">Rating</Menu>
//                 <Menu value="popular">Most Popular</Menu>
//               </Select>
//             </FormControl>
//           </Box>


//       {/* Menu Grid */}
//       <Grid container spacing={4}>
//         {loading ? (
//           // Loading Skeletons
//           Array.from({ length: 8 }).map((_, index) => (
//             <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
//               <Card sx={{
//                  height: 400,
//                  borderRadius: 3,
//                  boxShadow: 3 
//                  }}>
//                 <Skeleton variant="rectangular" height={200} sx={{borderRadius: 3}} />
//                 <CardContent>
//                   <Skeleton variant="text" width="60%" height={30} />
//                   <Skeleton variant="text" width="40%" height={25}/>
//                   <Box sx={{display: 'flex', gap: 1, mt: 1}}>
//                   <Skeleton variant="text" width="80%" height={20} />
//                   <Skeleton variant="text" width="100%" height={20}/>
//                   </Box>
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))
//         ) : (
//               menu.map(item => (
//                 <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
//                   <Card sx={{ 
//                     height: 400, 
//                     display: 'flex', 
//                     flexDirection: 'column',
//                     borderRadius: 3,
//                     boxShadow: 3,
//                     transition: 'transform 0.3s, box-shadow 0.3s',
//                     '&:hover': { 
//                       transform: 'translateY(-5px)',
//                       boxShadow: 6 
//                     }
//                   }}>
//                     <MenuImage item={item} />

//                     <CardContent sx={{ flexGrow: 1 }}>
//                       <Typography variant="h6" fontWeight={700} gutterBottom>
//                         {item.name || 'Unnamed Item'}
//                       </Typography>

//                       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//                         <Rating 
//                           value={item.rating || 0} 
//                           precision={0.5} 
//                           readOnly 
//                           sx={{ color: 'secondary.main' }}
//                         />
//                         <PriceDisplay price={item.price} />
//                       </Box>

//                       <Typography variant="body2" color="text.secondary" paragraph>
//                         {item.description || 'No description available'}
//                       </Typography>

//                       <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
//                         {(item.tags || []).map(tag => (
//                           <Chip
//                             key={tag}
//                             label={tag}
//                             size="small"
//                             variant="outlined"
//                             color="secondary"
//                             sx={{ borderRadius: 2, textTransform: "capitalize" }}
//                           />
//                         ))}
//                       </Box>
//                     </CardContent>

//                     {/* <Button 
//                       fullWidth 
//                       variant="contained" 
//                       color='secondary'
//                       sx={{ 
//                         mt: 'auto',
//                         py: 1.5,
//                         borderBottomLeftRadius: 3,
//                         borderBottomRightRadius: 3,
//                         fontWeight: 700
//                       }}
//                       onClick={() => addToCart(item)}
//                     >
//                       Add to Cart
//                     </Button> */}

//                 {/* Food Image */}
//                 <CardMedia
//                   component="img"
//                   height="200"
//                   image={item.image.url}
//                   alt={item.name}
//                   sx={{ objectFit: 'cover',
//                         borderTopLeftRadius:3,
//                         borderTopRightRadius: 3
//                    }}
//                 />

//                 <CardContent sx={{ flexGrow: 1 }}>
//                   {/* Dish Name */}
//                   <Typography variant="h6" fontWeight={700} gutterBottom>
//                     {item.name}
//                   </Typography>

//                   <Box sx={{
//                     display: 'flex',
//                     justifyContent: 'space-between',
//                     alignItems: 'center',
//                     mb: 2
//                   }}>

//                   {/* Rating and Price */}
//                   <div className="flex justify-between items-center mb-2">
//                     <Rating 
//                       value={item.rating} 
//                       precision={0.5} 
//                       readOnly 
//                       sx={{ color: 'secondary.main' }}
//                     />
//                     {/* <Chip 
//                       label={$${item.price.toFixed(2)}} 
//                       color="primary"
//                       sx={{ 
//                         fontWeight: 700,
//                         fontSize: '1.1rem',
//                         px: 2,
//                         borderRadius: 2
//                       }}
//                     />   */}
        
//                   </div>
//                   </Box>

//                   {/* Description */}
//                   <Typography variant="body2" color="text.secondary" paragraph>
//                     {item.description}
//                   </Typography>

//                   {/* Dietary Tags */}
//                   <div className="flex gap-1 flex-wrap">
//                     {item.tags.map(tag => (
//                       <Chip
//                         key={tag}
//                         label={tag}
//                         size="small"
//                         variant="outlined"
//                         color="secondary"
//                         sx={{ borderRadius: 2,
//                               textTransform: "capitalize"
//                          }}
//                       />
//                     ))}
//                   </div>
//                 </CardContent>

//                 {/* Add to Cart Button */}
//                 <Button 
//                   fullWidth 
//                   variant="contained" 
//                   color='secondary'
//                   sx={{ 
//                     mt: 'auto',
//                     py: 1.5,
//                     borderBottomLeftRadius: 3,
//                     borderBottomRightRadius: 3,
//                     fontWeight: 700
//                   }}
//                   onClick={() => addToCart(item)}
//                 >
//                   Add to Cart
//                 </Button>
//               </Card>
//             </Grid>
//           ))
//         )}
//       </Grid>
//     </Grid>
//     </Grid>
//       {/* Order Summary Floating Button */}
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
//             '& .MuiButton-startIcon': { mr: 1.5 }
//           }}
//         >
//           View Order ({selectedItems.length})
//         </Button>
//       )}

//       {/* Category Dividers */}
//       <Divider sx={{ my: 6 }}>
//         <Chip 
//           label="Chef's Specials" 
//           color="primary" 
//           sx={{ px: 4, fontSize: '1.1rem' }}
//         />
//       </Divider>

//       {/* Pagination */}
//       <Pagination 
//   count={pagination.pages} 
//   page={pagination.page}
//   onChange={handlePageChange}
//   color="primary" 
//   sx={{ 
//     mt: 4,
//     '& .MuiPaginationItem-root': {
//       fontSize: '1.1rem'
//     }
//   }}
// />
//     </Container>
//   )
// };

// export default Menu;

import { useState, useEffect } from 'react';
import { 
  Container, Grid, Card, CardMedia, CardContent, Typography, 
  Chip, Button, Rating, Divider, Pagination, Checkbox, 
  FormGroup, FormControlLabel, TextField, Select, MenuItem, 
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton, List, ListItem, ListItemText, Alert,
  InputLabel, FormControl, Paper, Box, Skeleton, Tabs, Tab
} from '@mui/material';
import { ShoppingCart, Search, Close, Remove, Add, Delete } from '@mui/icons-material';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import "../styles/global.css";

// Reusable Components
const MenuImage = ({ item }) => (
  <CardMedia
    component="img"
    height="200"
    image={item.image?.url || '/images/food-placeholder.jpg'}
    alt={item.name}
    sx={{ 
      objectFit: 'cover', 
      borderRadius: 3,
      filter: 'brightness(0.9)',
      transition: 'transform 0.3s ease-in-out'
    }}
  />
);

const PriceDisplay = ({ price }) => (
  <Chip 
    label={`$${(price || 0).toFixed(2)}`}
    sx={{ 
      fontWeight: 700,
      fontSize: '1.1rem',
      px: 2,
      borderRadius: 2,
      backgroundColor: '#FFD700',
      color: '#0a0a0a'
    }}
  />
);

const MenuItemCard = ({ item, addToCart }) => (
  <motion.div whileHover={{ scale: 1.03 }}>
    <Card sx={{ 
      height: 400, 
      display: 'flex', 
      flexDirection: 'column',
      borderRadius: 3,
      backgroundColor: '#1a1a1a',
      border: '1px solid #ffffff22',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    }}>
      <MenuImage item={item} />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography 
          variant="h6" 
          fontWeight={700} 
          gutterBottom
          sx={{ color: '#FFD700' }}
        >
          {item.name}
        </Typography>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 2 
        }}>
          <Rating 
            value={item.rating} 
            precision={0.5} 
            readOnly 
            sx={{ color: '#FFD700' }}
          />
          <PriceDisplay price={item.price} />
        </Box>

        <Typography 
          variant="body2" 
          paragraph
          sx={{ color: '#ffffffcc' }}
        >
          {item.description}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {item.tags.map(tag => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              variant="outlined"
              sx={{ 
                borderRadius: 2, 
                textTransform: "capitalize",
                color: '#FFD700',
                borderColor: '#FFD70055'
              }}
            />
          ))}
        </Box>
      </CardContent>

      <Button 
        fullWidth 
        variant="contained" 
        sx={{ 
          mt: 'auto',
          py: 1.5,
          borderRadius: 3,
          fontWeight: 700,
          backgroundColor: '#FFD700',
          color: '#0a0a0a',
          '&:hover': {
            backgroundColor: '#C5A900'
          }
        }}
        onClick={() => addToCart(item)}
      >
        Add to Cart
      </Button>
    </Card>
  </motion.div>
);

// Main Component
const Menu = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [menuData, setMenuData] = useState({ restaurant: [], catering: [] });
  const [filters, setFilters] = useState({
    vegetarian: false,
    vegan: false,
    minRating: 0,
    search: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 1
  });
  const [loading, setLoading] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [showAddedAlert, setShowAddedAlert] = useState(false);

  const menuType = activeTab === 0 ? 'restaurant' : 'catering';

  // Load menu data
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const params = {
          ...filters,
          page: pagination.page,
          limit: pagination.limit,
          type: menuType
        };

        const response = await axios.get('http://localhost:5000/api/menu', { params });
        
        setMenuData(prev => ({
          ...prev,
          [menuType]: response.data.data.map(item => ({
            ...item,
            price: Number(item.price),
            rating: Number(item.rating),
            tags: item.tags || []
          }))
        }));

        setPagination({
          ...pagination,
          total: response.data.total,
          pages: response.data.pages
        });
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchMenu, 300);
    return () => clearTimeout(debounceTimer);
  }, [filters, pagination.page, menuType]);

  // Cart persistence
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if(savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const addToCart = (item) => {
    setCartItems(prev => {
      const existingItem = prev.find(i => i._id === item._id);
      if (existingItem) {
        return prev.map(i => 
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setShowAddedAlert(true);
    setTimeout(() => setShowAddedAlert(false), 2000);
    if (!cartOpen) setCartOpen(true);
  };

  const CartPreview = () => {
    const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const updateQuantity = (itemId, newQuantity) => {
      setCartItems(prev => 
        prev.map(item => 
          item._id === itemId 
            ? { ...item, quantity: Math.max(1, newQuantity) } 
            : item
        ).filter(item => item.quantity > 0)
      );
    };

    return (
      <Dialog
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            backgroundColor: '#1a1a1a',
            color: '#ffffff',
            borderRadius: 3
          }
        }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid #FFD70033' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4" sx={{ color: '#FFD700' }}>
              Your Cart
            </Typography>
            <IconButton onClick={() => setCartOpen(false)}>
              <Close sx={{ color: '#FFD700' }} />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          {cartItems.length === 0 ? (
            <Alert severity="info" sx={{ mt: 2, backgroundColor: '#FFD70022' }}>
              Your cart is empty
            </Alert>
          ) : (
            <List>
              {cartItems.map((item) => (
                <ListItem key={item._id} divider>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Box sx={{ flex: 1 }}>
                      <ListItemText
                        primary={item.name}
                        secondary={`$${item.price.toFixed(2)} each`}
                        primaryTypographyProps={{ color: '#FFD700' }}
                        secondaryTypographyProps={{ color: '#ffffff99' }}
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton 
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        sx={{ color: '#FFD700' }}
                      >
                        <Remove />
                      </IconButton>
                      
                      <Typography sx={{ minWidth: '30px', textAlign: 'center' }}>
                        {item.quantity}
                      </Typography>
                      
                      <IconButton 
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        sx={{ color: '#FFD700' }}
                      >
                        <Add />
                      </IconButton>
                      
                      <IconButton 
                        onClick={() => updateQuantity(item._id, 0)}
                        sx={{ color: '#ff4444', ml: 2 }}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>

        {cartItems.length > 0 && (
          <DialogActions sx={{ 
            borderTop: '1px solid #FFD70033',
            justifyContent: 'space-between',
            px: 3,
            py: 2
          }}>
            <Typography variant="h6" sx={{ color: '#FFD700' }}>
              Total: ${totalAmount.toFixed(2)}
            </Typography>
            <Button 
              variant="contained"
              onClick={() => navigate('/checkout')}
              sx={{
                backgroundColor: '#FFD700',
                color: '#0a0a0a',
                '&:hover': { backgroundColor: '#C5A900' }
              }}
            >
              Proceed to Checkout
            </Button>
          </DialogActions>
        )}
      </Dialog>
    );
  };

  return (
    <Box sx={{ 
      backgroundColor: '#0a0a0a',
      minHeight: '100vh',
      color: '#ffffff'
    }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Alert Notification */}
        {showAddedAlert && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              bottom: 180,
              right: 32
            }}
          >
            <Alert 
              severity="success" 
              sx={{ 
                backgroundColor: '#1a1a1a',
                color: '#FFD700',
                border: '1px solid #FFD700'
              }}
            >
              Item added to cart!
            </Alert>
          </motion.div>
        )}

        {/* Tabs Section */}
        <Box sx={{ 
          textAlign: 'center', 
          mb: 4,
          borderBottom: '2px solid #FFD700'
        }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            centered
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: '#FFD700'
              }
            }}
          >
            <Tab 
              label="Restaurant Menu" 
              sx={{ 
                color: activeTab === 0 ? '#FFD700' : '#ffffff99',
                fontSize: '1.1rem',
                fontWeight: 500
              }} 
            />
            <Tab 
              label="Catering Packages" 
              sx={{ 
                color: activeTab === 1 ? '#FFD700' : '#ffffff99',
                fontSize: '1.1rem',
                fontWeight: 500
              }} 
            />
          </Tabs>
        </Box>

        <Grid container spacing={4}>
          {/* Filters Sidebar */}
          <Grid item xs={12} md={3}>
            <motion.div
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Paper sx={{ 
                p: 3, 
                borderRadius: 3, 
                position: 'sticky', 
                top: 20,
                backgroundColor: '#1a1a1a',
                border: '1px solid #FFD70033'
              }}>
                <Typography 
                  variant="h5" 
                  gutterBottom
                  sx={{ 
                    color: '#FFD700',
                    fontWeight: 300,
                    letterSpacing: '1px'
                  }}
                >
                  Refine Selection
                </Typography>
                
                <TextField
                  fullWidth
                  label="Search"
                  variant="outlined"
                  sx={{ mb: 3 }}
                  InputProps={{ 
                    startAdornment: <Search sx={{ color: '#FFD700' }} />,
                    sx: { color: '#ffffff' }
                  }}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                />

                <FormGroup>
                  <Typography 
                    variant="subtitle1" 
                    gutterBottom
                    sx={{ color: '#FFD700' }}
                  >
                    Dietary Preferences
                  </Typography>
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={filters.vegetarian}
                        sx={{
                          color: '#FFD700',
                          '&.Mui-checked': { color: '#FFD700' }
                        }}
                      />
                    }
                    label="Vegetarian"
                    sx={{ color: '#ffffffcc' }}
                    onChange={(e) => setFilters({...filters, vegetarian: e.target.checked})}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={filters.vegan}
                        sx={{
                          color: '#FFD700',
                          '&.Mui-checked': { color: '#FFD700' }
                        }}
                      />
                    }
                    label="Vegan"
                    sx={{ color: '#ffffffcc' }}
                    onChange={(e) => setFilters({...filters, vegan: e.target.checked})}
                  />
                </FormGroup>

                <Divider sx={{ my: 3, borderColor: '#FFD70033' }} />

                <Typography 
                  variant="subtitle1" 
                  gutterBottom
                  sx={{ color: '#FFD700' }}
                >
                  Minimum Rating
                </Typography>
                <Rating
                  value={filters.minRating}
                  onChange={(e, val) => setFilters({...filters, minRating: val})}
                  precision={0.5}
                  sx={{ color: '#FFD700' }}
                />
              </Paper>
            </motion.div>
          </Grid>

          {/* Menu Items Grid */}
          <Grid item xs={12} md={9}>
            <Grid container spacing={4}>
              {loading ? (
                Array(6).fill().map((_, i) => (
                  <Grid item xs={12} sm={6} md={4} key={i}>
                    <Skeleton 
                      variant="rectangular" 
                      height={400} 
                      sx={{ 
                        borderRadius: 3,
                        backgroundColor: '#1a1a1a'
                      }} 
                    />
                  </Grid>
                ))
              ) : (
                menuData[menuType].map(item => (
                  <Grid item xs={12} sm={6} md={4} key={item._id}>
                    <MenuItemCard item={item} addToCart={addToCart} />
                  </Grid>
                ))
              )}
            </Grid>

            <Pagination
              count={pagination.pages}
              page={pagination.page}
              onChange={(e, page) => setPagination(prev => ({ ...prev, page }))}
              sx={{ 
                mt: 4, 
                display: 'flex', 
                justifyContent: 'center',
                '& .MuiPaginationItem-root': {
                  color: '#ffffff',
                  '&.Mui-selected': {
                    backgroundColor: '#FFD700',
                    color: '#0a0a0a'
                  },
                  '&:hover': {
                    backgroundColor: '#FFD70033'
                  }
                }
              }}
            />
          </Grid>
        </Grid>

        {/* Cart Preview Button */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            position: 'fixed',
            bottom: 32,
            right: 32
          }}
        >
          <Button
            variant="contained"
            startIcon={<ShoppingCart />}
            onClick={() => setCartOpen(true)}
            sx={{
              borderRadius: 3,
              padding: '12px 24px',
              backgroundColor: '#FFD700',
              color: '#0a0a0a',
              '&:hover': { backgroundColor: '#C5A900' }
            }}
          >
            View Cart ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})
          </Button>
        </motion.div>

        <CartPreview />
      </Container>
    </Box>
  );
};

export default Menu;