import { useEffect, useState } from "react";
import { 
  Container, Typography, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper,Button,Box,
  Dialog, DialogActions, DialogContent, DialogTitle, 
  TextField, CircularProgress, Alert, Snackbar
} from "@mui/material";
import Sidebar from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";
import BackButton from '../../components/BackButton';


const Branches = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [formData, setFormData] = useState({ 
    name: "", 
    location: "", 
    contact: "",
    openingHours: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/branches");
      if (!response.ok) throw new Error("Failed to fetch branches");
      const data = await response.json();
      setBranches(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (branch = null) => {
    setSelectedBranch(branch);
    setFormData(branch ? branch : { 
      name: "", 
      location: "", 
      contact: "",
      openingHours: ""
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBranch(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const method = selectedBranch ? "PUT" : "POST";
      const url = selectedBranch 
        ? `http://localhost:5000/api/branches/${selectedBranch._id}`
        : "http://localhost:5000/api/branches";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Operation failed");
      
      fetchBranches();
      setOpenSnackbar(true);
      handleCloseDialog();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/branches/${id}`, { 
        method: "DELETE" 
      });
      if (!response.ok) throw new Error("Delete failed");
      fetchBranches();
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex" }}>
        <Sidebar />
        <Container sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
          <CircularProgress />
        </Container>
      </div>
    );
  }

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
<Box sx={{ 
    display: 'flex',
    justifyContent: 'flex-end', // or 'flex-start'
    position: "absolute",
    right: 220,
    top:100,
    zIndex:1
  }}>
    <BackButton />
  </Box>
       <Container sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          Branch Management
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => handleOpenDialog()}
          sx={{ mb: 3 }}
        >
          Add New Branch
        </Button>
        

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Opening Hours</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {branches.map((branch) => (
                <TableRow key={branch._id}>
                  <TableCell>{branch.name}</TableCell>
                  <TableCell>{branch.location}</TableCell>
                  <TableCell>{branch.contact}</TableCell>
                  <TableCell>{branch.openingHours}</TableCell>
                  <TableCell>
                    <Button 
                      onClick={() => handleOpenDialog(branch)} 
                      color="primary"
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button 
                      onClick={() => handleDelete(branch._id)} 
                      color="error"
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Add/Edit Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>
            {selectedBranch ? "Edit Branch" : "Create New Branch"}
          </DialogTitle>
          <DialogContent>
            <TextField
              label="Branch Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Contact"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Opening Hours"
              name="openingHours"
              value={formData.openingHours}
              onChange={handleChange}
              fullWidth
              margin="normal"
              placeholder="e.g., 9:00 AM - 10:00 PM"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSubmit} color="primary">
              {selectedBranch ? "Save Changes" : "Create Branch"}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)}
          message="Operation completed successfully"
        />
      </Container>
    </div>
  );
};

export default Branches;