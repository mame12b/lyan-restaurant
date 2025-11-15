import React, { useEffect, useState, useCallback } from "react";
import { 
  Container,
  Typography,
  Table,
  TableBody,
  TableCell, 
  TableContainer,
  TableRow,
  Paper,
  Button,
  TableHead,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Chip,
  IconButton,
  Tooltip,
  Box,
  Stack,
  Card,
  CardContent,
  Divider,
  useMediaQuery
} from "@mui/material";
import { Delete, Refresh, Person, Email as EmailIcon, AdminPanelSettings } from "@mui/icons-material";
import { toast } from "react-toastify";
import { userAPI } from "../../services/api";
import { alpha, useTheme } from "@mui/material/styles";
import BRAND_COLORS from "../../theme/brandColors";

const Users = () => {
  const theme = useTheme();
  const brandColors = theme.palette.brand ?? BRAND_COLORS;
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await userAPI.getAllUsers();
      // Handle backend response structure
      setUsers(response.data?.users || response.users || []);
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDeleteUser = async (userId) => {
    try {
      setDeleting(true);
      const response = await userAPI.deleteUser(userId);
      if (response.data?.success || response.success) {
        toast.success(response.data?.message || response.message || "User deleted successfully");
        setUsers(prev => prev.filter(user => user._id !== userId));
      }
    } catch (error) {
      console.error('Delete Error:', error);
      toast.error(error.response?.data?.message || "Failed to delete user");
    } finally {
      setDeleteUserId(null);
      setDeleting(false);
    }
  };

  const getRoleColor = (role) => {
    return role === 'admin' ? brandColors.gold : brandColors.green;
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          👥 User Management
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={fetchUsers}
          disabled={loading}
          sx={{
            borderColor: brandColors.gold,
            color: brandColors.gold,
            '&:hover': {
              borderColor: brandColors.green,
              bgcolor: alpha(brandColors.green, 0.08)
            }
          }}
        >
          Refresh
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      ) : users.length === 0 ? (
        <Alert severity="info">No users found</Alert>
      ) : isMobile ? (
        // Mobile Card View
        <Stack spacing={2}>
          {users.map((user) => (
            <Card key={user._id} elevation={3} sx={{ borderRadius: 2 }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Box flex={1}>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      {user.name}
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" mb={1}>
                      <Chip
                        icon={user.role === 'admin' ? <AdminPanelSettings /> : <Person />}
                        label={user.role.toUpperCase()}
                        size="small"
                        sx={{
                          bgcolor: alpha(getRoleColor(user.role), 0.12),
                          color: getRoleColor(user.role),
                          fontWeight: 600
                        }}
                      />
                      {user.isVerified ? (
                        <Chip label="Verified" size="small" color="success" />
                      ) : (
                        <Chip label="Pending" size="small" color="warning" />
                      )}
                    </Stack>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => setDeleteUserId(user._id)}
                    sx={{ 
                      color: brandColors.red,
                      '&:hover': { bgcolor: alpha(brandColors.red, 0.08) }
                    }}
                    disabled={user.role === 'admin'}
                  >
                    <Delete />
                  </IconButton>
                </Box>

                <Divider sx={{ my: 1.5 }} />

                <Stack spacing={1}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <EmailIcon fontSize="small" color="action" />
                    <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                      {user.email}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Person fontSize="small" color="action" />
                    <Typography variant="caption" color="text.secondary">
                      Joined: {new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      ) : (
        // Desktop Table View
        <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead sx={{ bgcolor: alpha(brandColors.gold, 0.1) }}>
              <TableRow>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Role</strong></TableCell>
                <TableCell><strong>Verified</strong></TableCell>
                <TableCell><strong>Joined</strong></TableCell>
                <TableCell align="center"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow
                  key={user._id}
                  sx={{
                    '&:hover': { bgcolor: alpha(brandColors.gold, 0.05) },
                    transition: 'background-color 0.2s'
                  }}
                >
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Person fontSize="small" color="action" />
                      <Typography variant="body2" fontWeight={500}>
                        {user.name}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <EmailIcon fontSize="small" color="action" />
                      <Typography variant="body2">{user.email}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={user.role === 'admin' ? <AdminPanelSettings /> : <Person />}
                      label={user.role.toUpperCase()}
                      size="small"
                      sx={{
                        bgcolor: alpha(getRoleColor(user.role), 0.12),
                        color: getRoleColor(user.role),
                        fontWeight: 600
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {user.isVerified ? (
                      <Chip label="Verified" size="small" color="success" />
                    ) : (
                      <Chip label="Pending" size="small" color="warning" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Delete User">
                      <IconButton
                        size="small"
                        onClick={() => setDeleteUserId(user._id)}
                        sx={{ 
                          color: brandColors.red,
                          '&:hover': { bgcolor: alpha(brandColors.red, 0.08) }
                        }}
                        disabled={user.role === 'admin'}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={Boolean(deleteUserId)}
        onClose={() => !deleting && setDeleteUserId(null)}
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ bgcolor: alpha(brandColors.red, 0.1), fontWeight: 'bold' }}>
          Delete User
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <DialogContentText>
            Are you sure you want to delete this user? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteUserId(null)} disabled={deleting}>
            Cancel
          </Button>
          <Button 
            onClick={() => handleDeleteUser(deleteUserId)}
            color="error"
            variant="contained"
            disabled={deleting}
          >
            {deleting ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Users;