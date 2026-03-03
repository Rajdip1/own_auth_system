import {
  Box,
  Button,
  Heading,
  Input,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import type React from "react";
import { AxiosError } from "axios";
import API from '../api/api'

type LoginProps = {
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
};

function Login({ setIsAuth }: LoginProps) {
  const toast = useToast();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await API.post("/api/auth/login", form);

      // localStorage.setItem("token", res.data.token);
      localStorage.setItem('accessToken', res.data.accessToken)
      // localStorage.setItem('refreshToken', res.data.refreshToken)
      setIsAuth(true);

      toast({
        title: "Login successful",
        status: "success",
        duration: 2500,
        isClosable: true,
      });
    } catch (err) {
      if (err instanceof AxiosError) {
        toast({
          title: "Login failed, Server is down",
          description: err.response?.data?.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <Box maxW="sm" mx="auto" p={6} bg="gray.800" rounded="md">
      <Heading size="md" mb={4}>
        Login
      </Heading>

      <Stack spacing={3}>
        <Input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />

        <Button colorScheme="blue" onClick={handleSubmit}>
          Login
        </Button>
      </Stack>
    </Box>
  );
}

export default Login;
