/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Toaster, toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export function AuthForm() {
  const [isRegister, setIsRegister] = useState(false);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = async (data: any) => {
    if (isRegister) {
      console.log("registering");
      fetch("api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then(() => {
          toast.success(`Registered successfully, welcome ${data.name}!`);
          setIsRegister(false);
        })
        .catch(() => toast.error("Unable to create user try again later"));
    } else {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (res?.ok) {
        toast.success(`Welcome back, ${data.email}!`);
      } else {
        toast.error(`${res?.error}`);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Toaster richColors />
      <Card className="w-[400px] shadow-lg">
        <CardHeader>
          <CardTitle>{isRegister ? "Create an Account" : "Login"}</CardTitle>
          <CardDescription>
            {isRegister
              ? "Enter your details to register."
              : "Enter your credentials to login."}
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="example@mail.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message as string}
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 mt-5">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting
                ? "Please wait..."
                : isRegister
                ? "Register"
                : "Login"}
            </Button>

            <Button
              variant="link"
              type="button"
              onClick={() => setIsRegister((prev) => !prev)}
              className="text-sm text-muted-foreground"
            >
              {isRegister
                ? "Already have an account? Login"
                : "Don't have an account? Register"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
