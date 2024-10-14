// /page.js
'use client'
import HomeClient from "./home/page";
import RegisterForm from "../components/RegisterForm";
import { Typography, Box, Divider, Button, Grid } from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Page() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`${baseUrl}/api/user`); // Change to /api/name
      const userData = res.ok ? await res.json() : null;
      setUser(userData);
    };
    
    fetchUser();
  }, [baseUrl]);

  return (
    <>
      {user ? (
        <HomeClient user={user} />
      ) : (
        <Grid container sx={{ height: "98vh" }}>
          {/* Left Section */}
          <Grid
            item
            xs={12} sm={6}
            display="flex" justifyContent="center" alignItems="center"
            sx={{ backgroundColor: "#202124", color: "white", p: 2 }}
          >
            <Box textAlign="center">
              <Typography variant="h2" sx={{ marginBottom: "30px" }}>
                <strong>
                  Quick<span style={{ color: "#BB86FC" }}>CRUD</span>
                </strong>
              </Typography>
              <Typography variant="h5" gutterBottom>
                Don’t have an account? <strong>Create One</strong>
              </Typography>
              <Box display="flex" justifyContent="center" alignItems="center" sx={{ mt: 1 }}>
                <Typography variant="h6" sx={{ marginRight: 1 }}>or just</Typography>
                <Link href="/login" passHref>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#BB86FC",
                      color: "#fff",
                      "&:hover": { backgroundColor: "#9a6cd8" }
                    }}
                  >
                    Log In
                  </Button>
                </Link>
              </Box>
            </Box>
          </Grid>
          
          {/* Divider */}
          <Grid item xs={12} sm={1} display="flex" justifyContent="center" alignItems="center">
            <Divider
              orientation="vertical"
              flexItem
              sx={{ height: "100%", bgcolor: "black", borderWidth: 2 }}
            />
          </Grid>
          
          {/* Right Section */}
          <Grid item xs={12} sm={5} display="flex" justifyContent="center" alignItems="center">
            <RegisterForm />
          </Grid>
        </Grid>
      )}
    </>
  );
}
