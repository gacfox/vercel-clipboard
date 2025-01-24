"use client";

import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
} from "@heroui/react";
import { useState } from "react";

const RegisterPage = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [registerButtonLoading, setRegisterButtonLoading] = useState(false);
  const [usernameErrorMessage, setUsernameErrorMessage] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [rePasswordErrorMessage, setRePasswordErrorMessage] = useState("");

  const submitRegister = async () => {
    const response = await fetch("/api/register", {
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
    setRegisterButtonLoading(false);
    if (data?.code === "200") {
      router.push("/login");
    } else {
      setUsernameErrorMessage(data?.message);
    }
  };

  const handleLogin = async () => {
    router.push("/login");
  };

  const handleRegister = async () => {
    setUsernameErrorMessage("");
    setPasswordErrorMessage("");
    setRePasswordErrorMessage("");
    if (!username || username.length > 20) {
      setUsernameErrorMessage("Username should be 1 to 20 characters long");
      return;
    }
    if (!password || password.length < 6 || password.length > 20) {
      setPasswordErrorMessage("Password should be 6 to 20 characters long");
      return;
    }
    if (!rePassword || rePassword !== password) {
      setRePasswordErrorMessage("Passwords do not match");
      return;
    }
    setRegisterButtonLoading(true);
    await submitRegister();
  };

  return (
    <div className="flex justify-center px-4">
      <Card className="mt-16 w-full sm:w-[448px]">
        <CardHeader>
          <h1 className="text-2xl">Create a new account</h1>
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
          <div className="mt-2">
            <Input
              type="password"
              label="Retype your password"
              value={rePassword}
              onValueChange={setRePassword}
              errorMessage={rePasswordErrorMessage}
            />
          </div>
        </CardBody>
        <CardFooter className="justify-end">
          <Button onPress={handleLogin}>Sign In</Button>
          <Button
            color="primary"
            onPress={handleRegister}
            isLoading={registerButtonLoading}
            className="ml-2"
          >
            Sign Up
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterPage;
