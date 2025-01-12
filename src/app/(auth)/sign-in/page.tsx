"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Button from "@mui/material/Button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const Page = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // sign in using credentials from nextjs

  const handleEmailInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (!email || !password) {
        return toast({
          title: "Login failed!",
          description: "All fields required",
          variant: "destructive",
        });
      }

      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (!result?.ok) {
        toast({
          title: "Login failed",
          description: "Incorrect username or password",
          variant: "destructive",
        });
        setLoading(false)
      } else {
        setLoading(false)    
          router.replace('/')   
      }
    } catch (error) {
      console.log("Error in signing in", error);
      setLoading(false);
    }finally{
      setLoading(false)
    }
  };

  return (
    <>
      <div className=" min-h-screen w-full flex justify-center items-center">
        <div className="w-full max-w-md p-8 space-y-6 rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-lg font-extrabold tracking-tight lg:text-xl">
              Food management - Sign in
            </h1>
          </div>
          <div>
            <FormControl sx={{ m: 1, width: "auto" }} className="w-full" variant="outlined">
              <InputLabel htmlFor="outlined-adornment-email">Email</InputLabel>
              <OutlinedInput
                id="outlined-adornment-email"
                type="text"
                label="Email"
                value={email}
                onChange={handleEmailInput}
                required
              />
            </FormControl>
            <FormControl sx={{ m: 1, width: "full" }} className="w-full" variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Password
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handlePasswordInput}
                required
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showPassword
                          ? "hide the password"
                          : "display the password"
                      }
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
            </FormControl>
          </div>

          <Button
            variant="contained"
            className=" items-center"
            onClick={handleSubmit}
            disabled={loading}
          >
            Submit
          </Button>
        </div>
      </div>
    </>
  );
};

export default Page;
