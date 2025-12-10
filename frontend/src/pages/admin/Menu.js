import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  TextField,
  Typography
} from '@mui/material';
import { Add, Close, Delete, Edit, Save } from '@mui/icons-material';
import { toast } from 'react-toastify';
import api from '../../services/api';

const categories = [
  { value: 'wedding', label: 'Wedding & Engagement' },
  { value: 'corporate', label: 'Corporate & Business' },
  { value: 'birthday', label: 'Birthday Celebration' },
  { value: 'cultural', label: 'Cultural Ceremony' },
  { value: 'private-dining', label: 'Private Dining' },
  { value: 'other', label: 'Other Experience' }
];

const eventTypes = [
  'wedding',
  'engagement',
  'corporate',
  'conference',
  'product-launch',
  'birthday',
  'anniversary',
  'cultural',
  'private-dining',
  'other'
];

const emptyPackage = {
  name: '',
  description: '',
  category: 'wedding',
  price: '',
  discount: 0,
  maxGuests: '',
  image: '',
  features: [''],
  eventTypes: [],
  isActive: true
};

const sanitizeFeatures = (features) => {
  if (!Array.isArray(features) || features.length === 0) {
    return [''];
  }
  const cleaned = features.map((feature) => feature || '');
  return cleaned.length ? cleaned : [''];
};

const formatPrice = (value) => {
  if (value === '' || value === null || value === undefined) {
    return '0';
  }
  return Number(value).toLocaleString();
};

const PackageManagement = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentPackage, setCurrentPackage] = useState(emptyPackage);
  const [saving, setSaving] = useState(false);
  const [actioningId, setActioningId] = useState(null);

  const fetchPackages = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/packages');
      setPackages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('error', error);
      toast.error('Failed to load packages');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  const handleOpenDialog = (packageData) => {
    if (packageData) {
      setCurrentPackage({
        ...emptyPackage,
        ...packageData,
        price: packageData.price ?? '',
        discount: packageData.discount ?? 0,
        maxGuests: packageData.maxGuests ?? '',
        features: sanitizeFeatures(packageData.features),
        eventTypes: packageData.eventTypes ?? [],
        image: packageData.image ?? ''
      });
      setEditMode(true);
    } else {
      setCurrentPackage(emptyPackage);
      setEditMode(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditMode(false);
    setCurrentPackage(emptyPackage);
  };

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;

    setCurrentPackage((prev) => {
      if (name === 'isActive') {
        return { ...prev, isActive: checked };
      }

      if (['price', 'discount', 'maxGuests'].includes(name)) {
        return { ...prev, [name]: value === '' ? '' : Number(value) };
      }

      if (type === 'number') {
        return { ...prev, [name]: value === '' ? '' : Number(value) };
      }

      return { ...prev, [name]: value };
    });
  };

  const handleFeatureChange = (index, value) => {
    setCurrentPackage((prev) => {
      const nextFeatures = [...prev.features];
      nextFeatures[index] = value;
      return { ...prev, features: nextFeatures };
    });
  };

  const addFeature = () => {
    setCurrentPackage((prev) => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeFeature = (index) => {
    setCurrentPackage((prev) => {
      const nextFeatures = prev.features.filter((_, featureIndex) => featureIndex !== index);
      return { ...prev, features: nextFeatures.length ? nextFeatures : [''] };
    });
  };

  const handleEventTypeToggle = (type) => {
    setCurrentPackage((prev) => {
      const exists = prev.eventTypes.includes(type);
      if (exists) {
        return {
          ...prev,
          eventTypes: prev.eventTypes.filter((item) => item !== type)
        };
      }
      return {
        ...prev,
        eventTypes: [...prev.eventTypes, type]
      };
    });
  };

  const handleSavePackage = async () => {
    if (!currentPackage.name.trim() || !currentPackage.description.trim()) {
      toast.error('Please provide a name and description');
      return;
    }

    if (currentPackage.price === '' || currentPackage.maxGuests === '') {
      toast.error('Please provide price and maximum guests');
      return;
    }

    setSaving(true);

    try {
      const payload = {
        ...currentPackage,
        price: Number(currentPackage.price),
        discount: Number(currentPackage.discount) || 0,
        maxGuests: Number(currentPackage.maxGuests) || 0,
        features: currentPackage.features.filter((feature) => feature.trim() !== ''),
        eventTypes: currentPackage.eventTypes
      };

      if (!payload.image?.trim()) {
        delete payload.image;
      } else {
        payload.image = payload.image.trim();
      }

      if (!payload.features.length) {
        payload.features = ['Customizable on request'];
      }

      if (editMode && currentPackage._id) {
        await api.put(`/packages/${currentPackage._id}`, payload);
        toast.success('Package updated');
      } else {
        await api.post('/packages', payload);
        toast.success('Package created');
      }

      handleCloseDialog();
      fetchPackages();
    } catch (error) {
      console.error("error", error);
      toast.error(error?.response?.data?.message || 'Failed to save package');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePackage = async (id) => {
    const proceed = window.confirm('Are you sure you want to delete this package?');
    if (!proceed) {
      return;
    }

    setActioningId(id);
    try {
      await api.delete(`/packages/${id}`);
      toast.success('Package deleted');
      fetchPackages();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete package');
    } finally {
      setActioningId(null);
    }
  };

  const handleToggleActive = async (id, isActive) => {
    setActioningId(id);
    try {
      await api.patch(`/packages/${id}/toggle-active`);
      toast.success(`Package ${isActive ? 'paused' : 'reactivated'}`);
      fetchPackages();
    } catch (error) {
      console.error(error);
      toast.error('Failed to update package status');
    } finally {
      setActioningId(null);
    }
  };

  const stats = useMemo(() => {
    const total = packages.length;
    const active = packages.filter((pkg) => pkg.isActive).length;
    const inactive = total - active;
    const average = total
      ? Math.round(
          packages.reduce((sum, pkg) => sum + Number(pkg.price || 0), 0) / total
        )
      : 0;

    return {
      total,
      active,
      inactive,
      average
    };
  }, [packages]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, pt: { xs: 10, md: 12 }, bgcolor: '#f7f9fb', minHeight: '100vh' }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          mb: 4,
          borderRadius: 4,
          background: 'linear-gradient(135deg, #D4AF37 0%, #D4AF37 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -40,
            right: -40,
            width: 160,
            height: 160,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)'
          }}
        />
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'center' }}
          spacing={3}
        >
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Package Experience Hub
            </Typography>
            <Typography variant="body1" sx={{ maxWidth: 520, opacity: 0.85 }}>
              Craft beautifully curated event packages, showcase the highlights, and keep your
              offerings fresh. All the essentials are collected here with a clean, modern view.
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
            sx={{
              py: 1.3,
              px: 4,
              borderRadius: 999,
              fontWeight: 600,
              bgcolor: 'rgba(255,255,255,0.15)',
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.28)'
              }
            }}
          >
            Create package
          </Button>
        </Stack>

        <Grid container spacing={2} sx={{ mt: 3 }}>
          {[{
            label: 'Total packages',
            value: stats.total,
            accent: 'rgba(255,255,255,0.25)'
          }, {
            label: 'Active offerings',
            value: stats.active,
            accent: 'rgba(255,255,255,0.18)'
          }, {
            label: 'Inactive',
            value: stats.inactive,
            accent: 'rgba(255,255,255,0.12)'
          }, {
            label: 'Avg. price (ETB)',
            value: formatPrice(stats.average),
            accent: 'rgba(255,255,255,0.1)'
          }].map((stat) => (
            <Grid item xs={6} md={3} key={stat.label}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  bgcolor: stat.accent,
                  color: 'white'
                }}
              >
                <Typography variant="caption" sx={{ textTransform: 'uppercase', opacity: 0.75 }}>
                  {stat.label}
                </Typography>
                <Typography variant="h5" fontWeight={700}>
                  {stat.value}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {packages.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            textAlign: 'center',
            py: 6,
            borderRadius: 4,
            bgcolor: 'white',
            border: '1px dashed rgba(212,175,55,0.2)'
          }}
        >
          <Typography variant="h5" fontWeight={600} gutterBottom>
            No packages yet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 420, mx: 'auto', mb: 3 }}>
            Begin by creating your first package. Highlight what makes your catering experiences
            memorable and add rich details, pricing, and event types.
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
            sx={{
              px: 4,
              py: 1.2,
              borderRadius: 999,
              background: 'linear-gradient(135deg, #D4AF37 0%, #D4AF37 100%)'
            }}
          >
            Create your first package
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {packages.map((pkg) => {
            const discountedPrice = pkg.discount
              ? Math.round(Number(pkg.price || 0) * (1 - pkg.discount / 100))
              : null;

            return (
              <Grid item xs={12} sm={6} lg={4} key={pkg._id}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    borderRadius: 4,
                    overflow: 'hidden',
                    boxShadow: '0 18px 45px -24px rgba(212,175,55,0.5)',
                    bgcolor: 'white'
                  }}
                >
                  <Box sx={{ position: 'relative', height: 200 }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={
                        pkg.image ||
                        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80'
                      }
                      alt={pkg.name}
                      sx={{ objectFit: 'cover' }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.6) 100%)',
                        color: 'white',
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Chip
                          label={pkg.category.replace('-', ' ')}
                          size="small"
                          sx={{
                            bgcolor: 'rgba(255,255,255,0.2)',
                            color: 'white',
                            textTransform: 'capitalize'
                          }}
                        />
                        <Chip
                          label={pkg.isActive ? 'Active' : 'Draft'}
                          size="small"
                          sx={{
                            bgcolor: pkg.isActive ? 'rgba(212,175,55,0.45)' : 'rgba(255,255,255,0.2)',
                            color: 'white'
                          }}
                        />
                      </Stack>
                      <Typography variant="h6" fontWeight={700}>
                        {pkg.name}
                      </Typography>
                    </Box>
                  </Box>

                  <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      {pkg.description && pkg.description.length > 140
                        ? `${pkg.description.substring(0, 140)}...`
                        : pkg.description}
                    </Typography>

                    {pkg.eventTypes?.length > 0 && (
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {pkg.eventTypes.slice(0, 4).map((type) => (
                          <Chip
                            key={type}
                            label={type.replace('-', ' ')}
                            size="small"
                            sx={{ textTransform: 'capitalize', bgcolor: 'rgba(212,175,55,0.08)' }}
                          />
                        ))}
                        {pkg.eventTypes.length > 4 && (
                          <Chip label={`+${pkg.eventTypes.length - 4}`} size="small" />
                        )}
                      </Stack>
                    )}

                    {pkg.features?.length > 0 && (
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                          Highlights
                        </Typography>
                        <Stack spacing={0.5}>
                          {pkg.features.slice(0, 3).map((feature, index) => (
                            <Typography
                              key={`${pkg._id}-feature-${index}`}
                              variant="body2"
                              color="text.secondary"
                            >
                              • {feature}
                            </Typography>
                          ))}
                          {pkg.features.length > 3 && (
                            <Typography variant="caption" color="text.secondary">
                              +{pkg.features.length - 3} more details
                            </Typography>
                          )}
                        </Stack>
                      </Box>
                    )}

                    <Box display="flex" justifyContent="space-between" alignItems="flex-end">
                      <Box>
                        <Typography variant="h5" fontWeight={700} color="primary.main">
                          {discountedPrice
                            ? `${formatPrice(discountedPrice)} ETB`
                            : `${formatPrice(pkg.price)} ETB`}
                        </Typography>
                        {discountedPrice && (
                          <Typography variant="body2" color="text.secondary">
                            <Box component="span" sx={{ textDecoration: 'line-through', mr: 1 }}>
                              {`${formatPrice(pkg.price)} ETB`}
                            </Box>
                            <Chip
                              label={`-${pkg.discount}%`}
                              size="small"
                              color="error"
                              sx={{ ml: 1 }}
                            />
                          </Typography>
                        )}
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        Capacity • {pkg.maxGuests} guests
                      </Typography>
                    </Box>
                  </CardContent>

                  <Divider sx={{ mx: 2 }} />
                  <Box sx={{ display: 'flex', gap: 1, p: 2, pt: 1 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<Edit />}
                      onClick={() => handleOpenDialog(pkg)}
                      sx={{
                        bgcolor: 'rgba(212,175,55,0.12)',
                        color: 'primary.main',
                        '&:hover': { bgcolor: 'rgba(212,175,55,0.18)' }
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => handleToggleActive(pkg._id, pkg.isActive)}
                      disabled={actioningId === pkg._id}
                      sx={{
                        borderColor: pkg.isActive ? 'warning.main' : 'success.main',
                        color: pkg.isActive ? 'warning.main' : 'success.main'
                      }}
                    >
                      {pkg.isActive ? 'Pause' : 'Activate'}
                    </Button>
                    <IconButton
                      color="error"
                      onClick={() => handleDeletePackage(pkg._id)}
                      disabled={actioningId === pkg._id}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      <Dialog
        open={openDialog}
        onClose={saving ? undefined : handleCloseDialog}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #D4AF37 0%, #D4AF37 100%)',
            color: 'white',
            pb: 2
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h5" fontWeight="bold">
                {editMode ? '✏️ Edit Package' : '🎉 Create New Package'}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                {editMode
                  ? 'Update package details and keep your listings fresh.'
                  : 'Fill in the details to create a new catering experience.'}
              </Typography>
            </Box>
            <IconButton onClick={handleCloseDialog} sx={{ color: 'white' }} disabled={saving}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0 }}>
          <Box sx={{ p: { xs: 3, md: 4 }, bgcolor: '#f8fafc' }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={7}>
                <Stack spacing={3}>
                  <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
                    <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                      Package basics
                    </Typography>
                    <Stack spacing={2.5}>
                      <TextField
                        fullWidth
                        label="Package name"
                        name="name"
                        value={currentPackage.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Premium Wedding Celebration"
                      />
                      <TextField
                        fullWidth
                        label="Story & experience"
                        name="description"
                        value={currentPackage.description}
                        onChange={handleInputChange}
                        multiline
                        rows={4}
                        required
                        placeholder="Describe the ambiance, services, cuisine, and signature touches that define this package."
                      />
                    </Stack>
                  </Paper>

                  <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
                    <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                      Event details
                    </Typography>
                    <Stack spacing={2.5}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Ideal for
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {eventTypes.map((type) => {
                            const selected = currentPackage.eventTypes.includes(type);
                            return (
                              <Chip
                                key={type}
                                label={type.replace('-', ' ')}
                                onClick={() => handleEventTypeToggle(type)}
                                variant={selected ? 'filled' : 'outlined'}
                                color={selected ? 'success' : 'default'}
                                sx={{ textTransform: 'capitalize' }}
                              />
                            );
                          })}
                        </Stack>
                      </Box>

                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Signature highlights
                        </Typography>
                        <Stack spacing={1.5}>
                          {currentPackage.features.map((feature, index) => (
                            <Box key={index} display="flex" gap={1}>
                              <TextField
                                fullWidth
                                label={`Feature ${index + 1}`}
                                value={feature}
                                onChange={(event) => handleFeatureChange(index, event.target.value)}
                                placeholder="Plated Ethiopian fusion dinner, live saxophonist, ..."
                              />
                              {currentPackage.features.length > 1 && (
                                <IconButton
                                  color="error"
                                  onClick={() => removeFeature(index)}
                                  sx={{ alignSelf: 'center' }}
                                >
                                  <Delete />
                                </IconButton>
                              )}
                            </Box>
                          ))}
                          <Button startIcon={<Add />} variant="outlined" onClick={addFeature}>
                            Add another highlight
                          </Button>
                        </Stack>
                      </Box>
                    </Stack>
                  </Paper>
                </Stack>
              </Grid>

              <Grid item xs={12} md={5}>
                <Stack spacing={3}>
                  <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
                    <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                      Pricing & availability
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          type="number"
                          label="Price (ETB)"
                          name="price"
                          value={currentPackage.price}
                          onChange={handleInputChange}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          type="number"
                          label="Discount (%)"
                          name="discount"
                          value={currentPackage.discount}
                          onChange={handleInputChange}
                          InputProps={{ inputProps: { min: 0, max: 100 } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          type="number"
                          label="Max guests"
                          name="maxGuests"
                          value={currentPackage.maxGuests}
                          onChange={handleInputChange}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={currentPackage.isActive}
                              onChange={(event) =>
                                setCurrentPackage((prev) => ({
                                  ...prev,
                                  isActive: event.target.checked
                                }))
                              }
                            />
                          }
                          label={currentPackage.isActive ? 'Package is live' : 'Package hidden'}
                        />
                      </Grid>
                      {currentPackage.discount > 0 && currentPackage.price && (
                        <Grid item xs={12}>
                          <Typography variant="body2" color="text.secondary">
                            Guests pay{' '}
                            <Box component="span" fontWeight={700} color="primary.main">
                              {formatPrice(
                                Math.round(
                                  Number(currentPackage.price || 0) *
                                    (1 - Number(currentPackage.discount || 0) / 100)
                                )
                              )}{' '}
                              ETB
                            </Box>{' '}
                            after discount.
                          </Typography>
                        </Grid>
                      )}
                    </Grid>
                  </Paper>

                  <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
                    <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                      Imagery & classification
                    </Typography>
                    <Stack spacing={2}>
                      <FormControl fullWidth>
                        <InputLabel id="category-label">Category</InputLabel>
                        <Select
                          labelId="category-label"
                          label="Category"
                          name="category"
                          value={currentPackage.category}
                          onChange={handleInputChange}
                        >
                          {categories.map((category) => (
                            <MenuItem key={category.value} value={category.value}>
                              {category.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <TextField
                        fullWidth
                        label="Image URL"
                        name="image"
                        value={currentPackage.image}
                        onChange={handleInputChange}
                        placeholder="https://yourcdn.com/packages/signature.jpg"
                      />
                      {currentPackage.image && (
                        <Box
                          component="img"
                          src={currentPackage.image}
                          alt="Preview"
                          sx={{
                            width: '100%',
                            height: 160,
                            objectFit: 'cover',
                            borderRadius: 2,
                            border: '1px solid rgba(0,0,0,0.08)'
                          }}
                        />
                      )}
                    </Stack>
                  </Paper>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: { xs: 3, md: 4 }, py: 3, bgcolor: '#f8fafc' }}>
          <Button onClick={handleCloseDialog} startIcon={<Close />} sx={{ mr: 1 }} disabled={saving}>
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSavePackage}
            disabled={
              saving ||
              !currentPackage.name.trim() ||
              !currentPackage.description.trim() ||
              currentPackage.price === '' ||
              currentPackage.maxGuests === ''
            }
            sx={{
              background: 'linear-gradient(135deg, #D4AF37 0%, #D4AF37 100%)',
              px: 4,
              py: 1.3,
              '&:hover': {
                background: 'linear-gradient(135deg, #D4AF37 0%, #D4AF37 100%)'
              }
            }}
          >
            {saving ? 'Saving...' : editMode ? 'Save changes' : 'Create package'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PackageManagement;

