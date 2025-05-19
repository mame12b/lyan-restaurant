import { useState, useEffect } from 'react';
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
} from '@mui/material';
import { ShoppingCart, Search } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import "../styles/global.css";

const Menu = () => {
  const { branchId } = useParams();
  const [sortBy, setSortBy] = useState('price_asc');
  const [menu, setMenu] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    minRating: 0,
    search: ''
  });
  const [pagination, setPagination] = useState({
    page : 1,
    limit: 10
  });
  // sort mapping 
  const sortMapping ={
    price_asc: 'price',
    price_desc: '-price',
    rating: '-rating',
    popular: '-orderCount'
  };


  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const params = {
          search: filters.search,
          minRating: filters.minRating,
          tags: [
            ...(filters.vegetarian ? ['vegetarian'] : []),
            ...(filters.vegan ? ['vegan'] : []),
            ...(filters.glutenFree ? ['gluten-free'] : [])
          ],
          sort: sortMapping[sortBy],
          page: pagination.page,
          limit: pagination.limit
        };

        // Add branchId to params only if it exists
        if (branchId) {
          params.branchId = branchId;
        }

        const response = await axios.get('http://localhost:5000/api/menu', {
          params: params
        });

        setMenu(response.data.data || []);
        setPagination(prev => ({
          ...prev,
          total: response.data.total,
          pages: response.data.pages
        }));
      } catch (error) {
        console.error('Fetch error:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, [branchId, filters, sortBy, pagination.page]);

  // pagination handler 
  const handlePageChange = (event, page) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const addToCart = (item) => {
    setSelectedItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };
  

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
    </Container>
  )
};

export default Menu;



