import { Box, Button, Flex } from "@chakra-ui/react";
import { useState } from "react";
import Signup from "./pages/signup";
import Login from "./pages/login";
import Profile from "./pages/profile";
import API from "./api/api";

type View = "login" | "signup";

function App() {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem("accessToken"));
  const [view, setView] = useState<View>("login");

  // const handleLogout = () => {
  //   localStorage.removeItem("token");
  //   setIsAuth(false);
  //   setView("login");
  // };

  // const handleLogout = () => {
  // localStorage.removeItem("accessToken");
  // localStorage.removeItem("refreshToken");
  // setIsAuth(false);
  // setView("login");
  // };

  const handleLogout = async () => {
    try {
      await API.post('/auth/logout')
    } catch (err) {
      console.log("Logout error:", err);
    }

    localStorage.removeItem("accessToken");
    setIsAuth(false);
    setView("login");
  };

  return (
    <Box minH="100vh" bg="gray.900" color="white">
      {/* 🔹 NAVBAR */}
      <Flex px={6} py={4} justify="space-between" align="center" bg="gray.800">
        <Box fontWeight="bold">Auth System</Box>

        <Flex gap={3}>
          {!isAuth ? (
            <>
              <Button
                size="sm"
                variant={view === "login" ? "solid" : "outline"}
                colorScheme="blue"
                onClick={() => setView("login")}
              >
                Login
              </Button>

              <Button
                size="sm"
                variant={view === "signup" ? "solid" : "outline"}
                colorScheme="teal"
                onClick={() => setView("signup")}
              >
                Signup
              </Button>
            </>
          ) : (
            <Button size="sm" colorScheme="red" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </Flex>
      </Flex>

      {/* 🔹 MAIN CONTENT */}
      <Box mt={10}>
        {!isAuth ? (
          view === "login" ? (
            <Login setIsAuth={setIsAuth} />
          ) : (
            <Signup />
          )
        ) : (
          <Profile />
        )}
      </Box>
    </Box>
  );
}

export default App;
