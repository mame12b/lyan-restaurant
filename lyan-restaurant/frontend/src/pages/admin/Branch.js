import { useEffect, useState } from "react";
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import Sidebar from "../../components/Sidebar";

const Branch = () => {
  const [branches, setBranches] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [formData, setFormData] = useState({ name: "", location: "", contact: "" });

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/branches");
      const data = await response.json();
      setBranches(data);
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };

  const handleOpen = (branch = null) => {
    setSelectedBranch(branch);
    setFormData(branch ? branch : { name: "", location: "", contact: "" });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedBranch(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const method = selectedBranch ? "PUT" : "POST";
      const url = selectedBranch ? `http://localhost:5000/api/branches/${selectedBranch._id}` : "http://localhost:5000/api/branches";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchBranches();
        handleClose();
      }
    } catch (error) {
      console.error("Error saving branch:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/branches/${id}`, { method: "DELETE" });
      fetchBranches();
    } catch (error) {
      console.error("Error deleting branch:", error);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <Container sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom>Branch Management</Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpen()}>Add Branch</Button>

        <TableContainer component={Paper} sx={{ marginTop: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {branches.map((branch) => (
                <TableRow key={branch._id}>
                  <TableCell>{branch.name}</TableCell>
                  <TableCell>{branch.location}</TableCell>
                  <TableCell>{branch.contact}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleOpen(branch)} color="primary">Edit</Button>
                    <Button onClick={() => handleDelete(branch._id)} color="error">Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Dialog for Adding/Editing Branch */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{selectedBranch ? "Edit Branch" : "Add Branch"}</DialogTitle>
          <DialogContent>
            <TextField label="Name" name="name" value={formData.name} onChange={handleChange} fullWidth margin="dense" />
            <TextField label="Location" name="location" value={formData.location} onChange={handleChange} fullWidth margin="dense" />
            <TextField label="Contact" name="contact" value={formData.contact} onChange={handleChange} fullWidth margin="dense" />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">Cancel</Button>
            <Button onClick={handleSubmit} color="primary">{selectedBranch ? "Update" : "Add"}</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
};

export default Branch;
