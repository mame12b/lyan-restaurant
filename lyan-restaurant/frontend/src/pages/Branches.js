import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, Grid, Card, CardContent } from "@mui/material";
import axios from "axios";

const Branches = () => {
    const { id } = useParams();
    const [branches, setBranches] = useState([]);

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/branches/${id}`);
                setBranches(res.data);
            } catch (error) {
                console.error("Failed to load branches:", error);
                setBranches([]);
            }
        };

        fetchBranches();
    }, [id]);

    return (
        <Container>
            <Typography variant="h4">Branches</Typography>
            <Grid container spacing={2}>
                {Array.isArray(branches) && branches.map((branch) => (
                    <Grid item xs={12} sm={6} md={4} key={branch._id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">{branch.name}</Typography>
                                <Typography>{branch.location}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Branches;
