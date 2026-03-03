import { useEffect, useState } from "react";
import API from "../api/api";
import { Box, Text } from "@chakra-ui/react";

function Profile() {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
  const fetchProfile = async () => {
    try {
      await API.get("/api/profile");
      setStatus("authenticated");
    } catch (error: any) {
      // If 401, interceptor might refresh token
      if (error.response?.status === 401) {
        return; // Let interceptor handle it
      }

      setStatus("unauthorized");
    }
  };

  fetchProfile();
}, []);


  return (
    <Box textAlign="center">
      <Text fontSize="xl" fontWeight="bold">
        Profile
      </Text>

      {status === "loading" && <Text>Checking login...</Text>}
      {status === "authenticated" && <Text color="green.400">Authenticated ✅</Text>}
      {status === "unauthorized" && <Text color="red.400">Unauthorized ❌</Text>}
    </Box>
  );
}

export default Profile;
