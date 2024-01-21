"use client";

import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
} from "@nextui-org/react";
import { useEffect, useState } from "react";

const LoginPage = () => {
  const router = useRouter();

  const [allow, setAllow] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginButtonLoading, setLoginButtonLoading] = useState(false);
  const [usernameErrorMessage, setUsernameErrorMessage] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  useEffect(() => {
    fetchAllowRegister();
  }, []);

  const fetchAllowRegister = async () => {
    const response = await fetch("/api/register/allow");
    const data = await response.json();
    if (data?.data) {
      setAllow(data.data);
    }
  };

  const submitLogin = async () => {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });
    const data = await response.json();
    setLoginButtonLoading(false);
    if (data?.code === "200") {
      const token = response.headers.get("Token");
      localStorage.setItem("token", token);
      router.push("/");
    } else {
      setUsernameErrorMessage(data?.message);
    }
  };

  const handleRegister = async () => {
    router.push("/register");
  };

  const handleLogin = async () => {
    setUsernameErrorMessage("");
    setPasswordErrorMessage("");
    if (!username || username.length > 20) {
      setUsernameErrorMessage("Username should be 1 to 20 characters long");
      return;
    }
    if (!password || password.length < 6 || password.length > 20) {
      setPasswordErrorMessage("Password should be 6 to 20 characters long");
      return;
    }
    setLoginButtonLoading(true);
    await submitLogin();
  };

  return (
    <div className="flex justify-center px-4">
      <Card className="mt-16 w-full sm:w-[448px]">
        <CardHeader>
          <h1 className="text-2xl">Welcome back</h1>
        </CardHeader>
        <CardBody>
          <div>
            <Input
              type="text"
              label="Username"
              value={username}
              onValueChange={setUsername}
              errorMessage={usernameErrorMessage}
            />
          </div>
          <div className="mt-2">
            <Input
              type="password"
              label="Password"
              value={password}
              onValueChange={setPassword}
              errorMessage={passwordErrorMessage}
            />
          </div>
        </CardBody>
        <CardFooter className="justify-end">
          <Button
            className={`${allow ? "inline-flex" : "hidden"}`}
            onClick={handleRegister}
          >
            Sign Up
          </Button>
          <Button
            color="primary"
            className="ml-2"
            onClick={handleLogin}
            isLoading={loginButtonLoading}
          >
            Sign In
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
