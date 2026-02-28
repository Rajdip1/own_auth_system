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

function Signup() {
  const toast = useToast();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post("/auth/signup", form);

      toast({
        title: "Signup successful",
        description: "You can now login",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setForm({ name: "", email: "", password: "" });
    } catch (err) {
      if (err instanceof AxiosError) {
        toast({
          title: "Signup failed",
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
        Signup
      </Heading>

      <Stack spacing={3}>
        <Input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />
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

        <Button colorScheme="teal" onClick={handleSubmit}>
          Signup
        </Button>
      </Stack>
    </Box>
  );
}

export default Signup;
