import { InstagramLogo } from "@/components/instagram-logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import axiosIntense from "@/https/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(4, {
    message: "Password must be at least 6 characters.",
  }),
});

export default function SignIn() {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      await axiosIntense.post("/auth/login", data);
    },
    onSuccess: () => {
      window.location.pathname = "/";
      toast("Login succesfully");
    },
    onError: () => {
      toast.error("Somenthing went wrong");
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values);
    form.reset();
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-[350px] space-y-4">
        <Card className="px-10 py-12">
          <CardHeader className="space-y-0 pb-6">
            <InstagramLogo />
          </CardHeader>
          <CardContent className="pb-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Input
                            className="h-[38px] rounded-sm px-2 text-sm placeholder:text-neutral-500"
                            placeholder="Email"
                            {...field}
                          />
                          <div className="pointer-events-none absolute inset-0 rounded-sm ring-0 ring-inset ring-black/5 transition-all duration-200 focus-within:ring-1" />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Input
                            className="h-[38px] rounded-sm px-2 text-sm placeholder:text-neutral-500"
                            type="password"
                            placeholder="Password"
                            {...field}
                          />
                          <div className="pointer-events-none absolute inset-0 rounded-sm ring-0 ring-inset ring-black/5 transition-all duration-200 focus-within:ring-1" />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <Button
                  className="h-[32px] w-full rounded-lg bg-[#0095f6] font-semibold hover:bg-[#1877f2] disabled:cursor-not-allowed disabled:opacity-50"
                  type="submit"
                  disabled={isPending || !form.formState.isValid}
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Log in"
                  )}
                </Button>
              </form>
            </Form>

            <div className="my-6 flex items-center gap-4">
              <Separator className="flex-1" />
              <span className="text-xs font-semibold uppercase text-neutral-500">
                Or
              </span>
              <Separator className="flex-1" />
            </div>

            <button className="w-full text-center text-sm font-semibold text-[#385185] hover:text-[#00376b]">
              Forgot password?
            </button>
          </CardContent>
        </Card>

        <Card className=" p-5 text-center">
          <p className="text-sm">
            Don&apos;t have an account?{" "}
            <Link
              to="/auth/signup"
              className="font-semibold text-[#0095f6] hover:text-[#1877f2]"
            >
              Sign up
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
