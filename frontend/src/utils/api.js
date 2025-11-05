import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5001/api",
    headers :{
        "Content-Type": "application/json",

    },
});

// add AUth token to headers
API.interceptors.request.use((req)=>{
    const token = localStorage.getItem('authToken');
    if (token) req.headers.Authorization= `Bearer ${token}`;
    return req; 
    
    
});
export default API;