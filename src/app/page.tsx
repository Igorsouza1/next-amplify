"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { signIn, confirmSignIn } from "aws-amplify/auth";
import { useEffect, useState } from "react";
import { Hub } from "aws-amplify/utils";


type loginData = {
  email: string;
  password: string;
};

export default function Login() {
  const { register, handleSubmit } = useForm<loginData>();
  const router = useRouter();
  const { toast } = useToast();

  const onSubmit = async (data: loginData) => {
    try {
      const { isSignedIn, nextStep } = await signIn({
        username: data.email,
        password: data.password,
      });

      if (
        nextStep.signInStep === "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED"
      ) {
        toast({
          variant: "default",
          duration: 3000,
          title: "Sucesso",
          description: "Seja bem vindo, estamos preparando sua conta!",
        });
        await confirmSignIn({
          challengeResponse: data.password,
        }).then(() => {
          router.push("/map");
        })
      }
      if (nextStep.signInStep === "DONE") {
        toast({
          variant: "default",
          duration: 3000,
          title: "Sucesso",
          description: "Login efetuado!",
        });
        router.push("/map");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        duration: 3000,
        title: "Erro de Login",
        description: "Ocorreu um erro ao fazer login." + error,
      });
    }
  };

  return (
    <div className="w-full h-screen lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px] bg-basebackground">
      <div className="hidden bg-muted lg:block">
        <Image
          src="/riodaprata-background.jpg"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.8] "
        />
      </div>
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div>
            <Image
              src="/Logo-ihp.png"
              alt="Logo"
              width="200"
              height="150"
              className="mx-auto"
            />
          </div>
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold text-white">
              Entre com sua conta
            </h1>
          </div>
          <div className="grid gap-4">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  placeholder="joao@example.com"
                  required
                  {...register("email")}
                />
              </div>
              <div className="grid gap-2 my-5">
                <div className="flex items-center">
                  <Label htmlFor="password">Senha</Label>
                  <Link
                    href="/forgot-password"
                    className="ml-auto inline-block text-sm underline"
                  >
                    Esqueceu sua senha?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  {...register("password")}
                />
              </div>
              <Button type="submit" className="w-full">
                Entrar
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
