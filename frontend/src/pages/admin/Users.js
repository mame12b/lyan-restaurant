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
  useMediaQuery,
  TablePagination
} from "@mui/material";
import { Delete, Refresh, Person, Email as EmailIcon, AdminPanelSettings, ArrowBack } from "@mui/icons-material";
import { toast } from "react-toastify";
import { userAPI } from "../../services/api";
import { alpha, useTheme } from "@mui/material/styles";
import BRAND_COLORS from "../../theme/brandColors";
import { useNavigate } from "react-router-dom";

const Users = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const brandColors = theme.palette.brand ?? BRAND_COLORS;
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);

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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Paginated users
  const paginatedUsers = users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Container maxWidth="xl" sx={{ pt: { xs: 10, md: 12 }, pb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <Typography 
          variant="h4" 
          fontWeight="bold" 
          sx={{ 
            color: brandColors.darkText || '#2d3748',
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
          }}
        >
          👥 User Management
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            startIcon={<ArrowBack sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />}
            onClick={() => navigate('/admin')}
            size={isMobile ? "small" : "medium"}
            sx={{ 
              bgcolor: '#1a1a1a',
              color: 'white',
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              px: { xs: 1, sm: 2 },
              fontWeight: 600,
              '&:hover': {
                bgcolor: '#2d2d2d'
              }
            }}
            variant="contained"
          >
            {isMobile ? 'Back' : 'Back to Dashboard'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<Refresh sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />}
            onClick={fetchUsers}
            disabled={loading}
            size={isMobile ? "small" : "medium"}
            sx={{
              borderColor: brandColors.gold,
              color: brandColors.gold,
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              px: { xs: 1, sm: 2 },
              '&:hover': {
                borderColor: brandColors.green,
                bgcolor: alpha(brandColors.green, 0.08)
              }
            }}
          >
            Refresh
          </Button>
        </Stack>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      ) : users.length === 0 ? (
        <Alert severity="info">No users found</Alert>
      ) : isMobile ? (
        // Mobile Card View with Pagination
        <>
          <Stack spacing={2}>
            {paginatedUsers.map((user) => (
              <Card key={user._id} elevation={3} sx={{ borderRadius: 2, bgcolor: 'white', border: `1px solid ${alpha(brandColors.gold, 0.2)}` }}>
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
          <Paper elevation={3} sx={{ mt: 2, borderRadius: 2 }}>
            <TablePagination
              component="div"
              count={users.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[6, 12, 18, 24]}
              sx={{
                borderTop: `1px solid ${alpha(brandColors.gold, 0.1)}`,
                '.MuiTablePagination-toolbar': {
                  bgcolor: alpha(brandColors.gold, 0.03)
                }
              }}
            />
          </Paper>
        </>
      ) : (
        // Desktop Table View with Pagination
        <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: alpha(brandColors.gold, 0.1) }}>
                <TableRow>
                  <TableCell sx={{ color: brandColors.darkText || '#2d3748', fontWeight: 700 }}>Name</TableCell>
                  <TableCell sx={{ color: brandColors.darkText || '#2d3748', fontWeight: 700 }}>Email</TableCell>
                  <TableCell sx={{ color: brandColors.darkText || '#2d3748', fontWeight: 700 }}>Role</TableCell>
                  <TableCell sx={{ color: brandColors.darkText || '#2d3748', fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ color: brandColors.darkText || '#2d3748', fontWeight: 700 }}>Joined</TableCell>
                  <TableCell align="center" sx={{ color: brandColors.darkText || '#2d3748', fontWeight: 700 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">No users found</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedUsers.map((user) => (
                    <TableRow
                      key={user._id}
                      sx={{
                        bgcolor: 'white',
                        '&:hover': { bgcolor: alpha(brandColors.gold, 0.08) },
                        transition: 'background-color 0.2s',
                        borderBottom: `1px solid ${alpha(brandColors.gold, 0.15)}`
                      }}
                    >
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Person fontSize="small" sx={{ color: '#718096' }} />
                          <Typography variant="body2" fontWeight={600} sx={{ color: '#1a202c' }}>
                            {user.name}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <EmailIcon fontSize="small" sx={{ color: '#718096' }} />
                          <Typography variant="body2" fontWeight={500} sx={{ color: '#2d3748' }}>{user.email}</Typography>
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
                        <Typography variant="body2" sx={{ color: brandColors.lightText || '#718096' }}>
                          {new Date(user.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title={user.role === 'admin' ? "Cannot delete admin" : "Delete User"}>
                          <span>
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
                          </span>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={users.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[6, 12, 18, 24]}
            sx={{
              borderTop: `1px solid ${alpha(brandColors.gold, 0.1)}`,
              '.MuiTablePagination-toolbar': {
                bgcolor: alpha(brandColors.gold, 0.03)
              }
            }}
          />
        </Paper>
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