
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

  // Auto-login function
  const handleFullDemoLogin = (userType: User["role"]) => {
    const demoUser = demoUsers.find(user => user.role === userType);
    if (demoUser) {
      setIsLoading(true);
      
      // Get mock data
      const data = getAllMockData();
      const userRecord = data.users.find((u) => u.role === demoUser.role) || {
        id: `u-${Date.now()}`,
        name: demoUser.name,
        email: demoUser.email,
        role: demoUser.role,
        avatar: `https://ui-avatars.com/api/?name=${demoUser.name.replace(' ', '+')}&background=6E59A5&color=fff`,
      };

      // Simulate loading delay
      setTimeout(() => {
        setCurrentUser(userRecord as User);
        toast({
          title: "Demo Login",
          description: `Logged in as ${userRecord.name} (${userRecord.role.replace('_', ' ')})`,
        });
        navigate("/");
        setIsLoading(false);
      }, 800);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 to-slate-100 p-4">
      {/* Left side - Product info */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-8">
        <div className="max-w-md text-center">
          <h1 className="text-5xl font-bold tracking-tight text-purple-800 mb-4">PlanPulseCraft</h1>
          <p className="text-xl text-gray-600 mb-8">Product management made simple</p>
          <div className="space-y-4 text-left bg-white bg-opacity-80 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-purple-700">Powerful features:</h3>
            <ul className="space-y-2">
              <li className="flex items-center"><span className="bg-purple-100 p-1 rounded mr-2">✓</span> Roadmap planning & visualization</li>
              <li className="flex items-center"><span className="bg-purple-100 p-1 rounded mr-2">✓</span> Feature prioritization</li>
              <li className="flex items-center"><span className="bg-purple-100 p-1 rounded mr-2">✓</span> Customer feedback management</li>
              <li className="flex items-center"><span className="bg-purple-100 p-1 rounded mr-2">✓</span> Release planning</li>
              <li className="flex items-center"><span className="bg-purple-100 p-1 rounded mr-2">✓</span> Team collaboration</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center">
        <div className="w-full max-w-md">
          <Card className="border-purple-100 shadow-xl">
            <CardHeader>
              <CardTitle className="text-3xl text-center mb-1">Welcome</CardTitle>
              <CardDescription className="text-center">
                Use demo accounts to explore different user roles
              </CardDescription>
            </CardHeader>
            
            {/* Quick Login Demo Section */}
            <div className="px-6 pt-2 pb-4">
              <div className="mb-6">
                <h3 className="text-center font-medium mb-3 text-sm text-purple-800 uppercase tracking-wider">Quick Demo Login</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    onClick={() => handleFullDemoLogin("admin")}
                    className="bg-purple-900 hover:bg-purple-950 text-white"
                    disabled={isLoading}
                  >
                    Admin
                  </Button>
                  <Button 
                    onClick={() => handleFullDemoLogin("product_manager")} 
                    className="bg-purple-700 hover:bg-purple-800 text-white"
                    disabled={isLoading}
                  >
                    Product Manager
                  </Button>
                  <Button 
                    onClick={() => handleFullDemoLogin("executive")} 
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={isLoading}
                  >
                    Executive
                  </Button>
                  <Button 
                    onClick={() => handleFullDemoLogin("developer")}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    disabled={isLoading}
                  >
                    Developer
                  </Button>
                  <Button 
                    onClick={() => handleFullDemoLogin("customer")}
                    className="col-span-2 bg-amber-600 hover:bg-amber-700 text-white"
                    disabled={isLoading}
                  >
                    Customer
                  </Button>
                </div>
              </div>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or sign in manually</span>
                </div>
              </div>
            </div>

            {/* Manual Login Form */}
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4 pt-0">
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
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
                
                <div className="w-full pt-2">
                  <p className="text-xs text-center text-gray-500 mb-2">Demo Credentials</p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                    <div>
                      <span className="font-semibold block">Admin:</span>
                      <span className="text-gray-500">admin@example.com / admin123</span>
                    </div>
                    <div>
                      <span className="font-semibold block">Product Manager:</span>
                      <span className="text-gray-500">alex@example.com / product123</span>
                    </div>
                    <div>
                      <span className="font-semibold block">Executive:</span>
                      <span className="text-gray-500">jamie@example.com / exec123</span>
                    </div>
                    <div>
                      <span className="font-semibold block">Developer:</span>
                      <span className="text-gray-500">taylor@example.com / dev123</span>
                    </div>
                    <div className="col-span-2">
                      <span className="font-semibold block">Customer:</span>
                      <span className="text-gray-500">morgan@example.com / customer123</span>
                    </div>
                  </div>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
