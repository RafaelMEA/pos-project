const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import axios from "axios";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAlert } from "@/contexts/AlertContext";
import { DialogFooter } from "@/components/ui/dialog";

const formSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

type FormData = z.infer<typeof formSchema>;

const Login = () => {
  const { addAlert } = useAlert();
  const navigate = useNavigate();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onLogin = async (data: FormData) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, data, {
        headers: {
          "x-api-key": API_KEY,
          "Content-Type": "application/json",
        },
      });
      console.log(response.data);
      console.log("User logged in successfully");
      addAlert("success", "Login", "User logged in successfully");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Failed to login user:", error);

      const errorMessage =
        error.response?.data?.message || "Failed to login user";
      addAlert("error", "Login", errorMessage);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[50%]">
        <CardHeader className="font-bold text-2xl">Sign In</CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onLogin)}
              className="space-y-4 gap-4 w-full"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="********"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="col-span-2 mb-2">
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </DialogFooter>
            </form>
          </Form>
          <Button className="w-full" variant="link">
            Don't have an account? <Link to="/register">Register</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
