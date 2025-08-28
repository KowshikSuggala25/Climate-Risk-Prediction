import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { z } from "zod";

const signUpSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    mobileNumber: z
      .string()
      .min(10, "Mobile number must be at least 10 digits"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const Auth = () => {
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
  });

  const { signUp, signIn, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const validatedData = signUpSchema.parse(formData);
      const { error } = await signUp(
        validatedData.email,
        validatedData.password,
        validatedData.fullName,
        validatedData.mobileNumber
      );

      if (!error) {
        setMode("signin");
      }
    } catch (error: any) {
      if (error.errors) {
        const formErrors = {};
        error.errors.forEach((err: any) => {
          formErrors[err.path[0]] = err.message;
        });
        setErrors(formErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const validatedData = signInSchema.parse(formData);
      const { error } = await signIn(
        validatedData.email,
        validatedData.password
      );

      if (!error) {
        navigate("/");
      }
    } catch (error: any) {
      if (error.errors) {
        const formErrors = {};
        error.errors.forEach((err: any) => {
          formErrors[err.path[0]] = err.message;
        });
        setErrors(formErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const validatedData = forgotPasswordSchema.parse(formData);
      const { error } = await resetPassword(validatedData.email);

      if (!error) {
        setMode("signin");
      }
    } catch (error: any) {
      if (error.errors) {
        const formErrors = {};
        error.errors.forEach((err: any) => {
          formErrors[err.path[0]] = err.message;
        });
        setErrors(formErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {mode === "signin" && "Sign In"}
            {mode === "signup" && "Sign Up"}
            {mode === "forgot" && "Reset Password"}
          </CardTitle>
          <CardDescription>
            {mode === "signin" &&
              "Enter your credentials to access your account"}
            {mode === "signup" && "Create a new account to get started"}
            {mode === "forgot" && "Enter your email to reset your password"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mode === "signup" && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  placeholder="Enter your full name"
                />
                {errors.fullName && (
                  <p className="text-sm text-destructive">{errors.fullName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobileNumber">Mobile Number</Label>
                <Input
                  id="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={(e) =>
                    handleInputChange("mobileNumber", e.target.value)
                  }
                  placeholder="Enter your mobile number"
                />
                {errors.mobileNumber && (
                  <p className="text-sm text-destructive">
                    {errors.mobileNumber}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    placeholder="Enter your password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    placeholder="Confirm your password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating Account..." : "Sign Up"}
              </Button>

              <div className="text-center space-y-2">
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setMode("signin")}
                  className="text-sm"
                >
                  Already have an account? Sign In
                </Button>
              </div>
            </form>
          )}

          {mode === "signin" && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    placeholder="Enter your password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>

              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setMode("forgot")}
                  className="text-sm p-0"
                >
                  Forgot Password?
                </Button>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing In..." : "Sign In"}
              </Button>

              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setMode("signup")}
                  className="text-sm"
                >
                  Don't have an account? Sign Up
                </Button>
              </div>
            </form>
          )}

          {mode === "forgot" && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>

              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setMode("signin")}
                  className="text-sm"
                >
                  Back to Sign In
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
