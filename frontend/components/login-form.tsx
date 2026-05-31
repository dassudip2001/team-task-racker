"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { LoginInput } from "@/schema/login";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUserStore } from "@/store/userStore";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>();

  const { isPending, mutateAsync } = useMutation<
    { access: string; refresh: string },
    void,
    LoginInput
  >({
    mutationFn: async (data: LoginInput) => {
      const response = await api.post("/token/", data);
      return response.data;
    },
    onSuccess: async (data) => {
      toast.success("Login successful!");
      const { setTokens } = useAuthStore.getState();
      const { setUser } = useUserStore.getState();

      if (data.access) {
        setTokens(data.access, data.refresh);
        document.cookie = `access_token=${data.access}; path=/; max-age=86400; SameSite=Lax`;
      }
      if (data.refresh) {
        document.cookie = `refresh_token=${data.refresh}; path=/; max-age=604800; SameSite=Lax`;
      }
      try {
        const userRes = await api.get("/profile/");
        setUser(userRes.data);
      } catch (e) {
        console.error("Failed to fetch user details", e);
      }

      router.push("/dashboard");
    },
  });
  const onSubmit: SubmitHandler<LoginInput> = async (data: LoginInput) => {
    mutateAsync(data);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  id="username"
                  type="text"
                  {...register("username", { required: true })}
                  placeholder="john_doe"
                />
                {errors.username && (
                  <FieldDescription className="text-red-500">
                    {errors.username.message}
                  </FieldDescription>
                )}
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Link
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password", { required: true })}
                />
                {errors.password && (
                  <FieldDescription className="text-red-500">
                    {errors.password.message}
                  </FieldDescription>
                )}
              </Field>
              <Field>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Logging in..." : "Login"}
                </Button>

                <FieldDescription className="text-center">
                  Don&apos;t have an account?{" "}
                  <Link href="/signup">Sign up</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
