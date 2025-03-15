"use client";

import { SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";
import { storeAuthData } from "@/utils/cookies";
import { loginUser } from "@/api/auth";
import {
  Button,
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Stack,
  CircularProgress,
  Alert
} from "@mui/material";
import CustomCheckbox from "@/app/components/forms/theme-elements/CustomCheckbox";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";

export default function AuthLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const data = await loginUser(email, password);

      if (data.access_token) {
        storeAuthData(data, rememberMe);

        setSuccess(true);
        setTimeout(() => {
          router.push(data.role === "admin" ? "/admin/dashboard" : "/sellers/dashboard");
        }, 2000);
      } else {
        throw new Error("Invalid Credentials");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message); // ✅ Fix: Explicitly check `err` type
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CustomFormLabel htmlFor="email">Email</CustomFormLabel>
      <CustomTextField
        id="email"
        variant="outlined"
        fullWidth
        value={email}
        onChange={(e: { target: { value: SetStateAction<string>; }; }) => setEmail(e.target.value)}
      />
      <CustomFormLabel htmlFor="password">Password</CustomFormLabel>
      <CustomTextField
        id="password"
        type="password"
        variant="outlined"
        fullWidth
        value={password}
        onChange={(e: { target: { value: SetStateAction<string>; }; }) => setPassword(e.target.value)}
      />

      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mt: 2 }}>Login Successful! Redirecting...</Alert>}

      <Stack justifyContent="space-between" direction="row" alignItems="center" my={2}>
        <FormGroup>
          <FormControlLabel
            control={<CustomCheckbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />}
            label="Remember Me"
          />
        </FormGroup>
      </Stack>

      <Box>
        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          onClick={handleLogin}
          disabled={!email || !password || loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
        </Button>
      </Box>
    </>
  );
}
