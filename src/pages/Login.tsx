
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAppContext } from "@/contexts/AppContext";
import { getAllMockData } from "@/utils/mockData";
import { User } from "@/types";
import { toast } from "@/hooks/use-toast";

const demoUsers: Array<{ role: User["role"], email: string, password: string, name: string }> = [
  { role: "admin", email: "admin@example.com", password: "admin123", name: "Admin User" },
  { role: "product_manager", email: "alex@example.com", password: "product123", name: "Product Manager" },
  { role: "executive", email: "jamie@example.com", password: "exec123", name: "Executive" },
  { role: "developer", email: "taylor@example.com", password: "dev123", name: "Developer" },
  { role: "customer", email: "morgan@example.com", password: "customer123", name: "Customer" },
];

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { setCurrentUser } = useAppContext();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate authentication delay
    setTimeout(() => {
      const matchedUser = demoUsers.find(
        (user) => user.email.toLowerCase() === email.toLowerCase() && user.password === password
      );

      if (matchedUser) {
        // Get mock data
        const data = getAllMockData();
        const userRecord = data.users.find((u) => u.role === matchedUser.role) || {
          id: `u-${Date.now()}`,
          name: matchedUser.name,
          email: matchedUser.email,
          role: matchedUser.role,
          avatar: `https://ui-avatars.com/api/?name=${matchedUser.name.replace(' ', '+')}&background=6E59A5&color=fff`,
        };

        setCurrentUser(userRecord as User);
        toast({
          title: "Login successful",
          description: `Welcome back, ${userRecord.name}!`,
        });
        navigate("/");
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password. Try using one of the demo credentials.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleDemoLogin = (userType: User["role"]) => {
    const demoUser = demoUsers.find(user => user.role === userType);
    if (demoUser) {
      setEmail(demoUser.email);
      setPassword(demoUser.password);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-purple-50 to-white p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-purple-800 mb-2">PlanPulseCraft</h1>
          <p className="text-lg text-gray-600 mb-8">Product management made simple</p>
        </div>

        <Card className="border-purple-100 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-purple-700 hover:bg-purple-800"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
              
              <div className="w-full pt-4">
                <p className="text-sm text-center font-medium text-gray-700 mb-3">Demo Accounts</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => handleDemoLogin("admin")}>
                    Admin
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => handleDemoLogin("product_manager")}>
                    Product Manager
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => handleDemoLogin("executive")}>
                    Executive
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => handleDemoLogin("developer")}>
                    Developer
                  </Button>
                  <Button type="button" variant="outline" size="sm" className="col-span-2" onClick={() => handleDemoLogin("customer")}>
                    Customer
                  </Button>
                </div>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
