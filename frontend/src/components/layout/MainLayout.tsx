import { useState, useEffect } from "react";
import {
  Layout,
  Menu,
  ShoppingCart,
  ShoppingBag,
  User,
  ChartBarStacked,
  Users,
  X,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NavLink, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertMessage } from "@/components/AlertMessage";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useAlert } from "@/contexts/AlertContext";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Layout },
  { name: "Products", href: "/products", icon: ShoppingBag },
  { name: "Categories", href: "/categories", icon: ChartBarStacked },
  { name: "Transaction", href: "/transaction", icon: ShoppingCart },
  { name: "Customers", href: "/customers", icon: User },
  { name: "Users", href: "/users", icon: Users },
];

export function MainLayout({ children }: MainLayoutProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { user, logout } = useAuth();
  const { addAlert } = useAlert();
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      addAlert("success", "Logout", "User logged out successfully");
    } catch (error: any) {
      console.error("Failed to logout user:", error);
      addAlert("error", "Logout", "Failed to logout user");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const UserProfileSection = () => (
    <div className="flex items-center space-x-3 p-4">
      <Avatar className="h-9 w-9">
        <AvatarImage src="/avatar.png" alt={user?.first_name} />
        <AvatarFallback>{user?.first_name?.[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">
          {user?.first_name} {user?.last_name}
        </p>
        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut}>
            {isLoggingOut ? "Logging out..." : "Logout"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  const NavigationLinks = ({ mobile = false }) => (
    <nav className={cn("space-y-1", mobile && "px-2 py-4")}>
      {navigation.map((item) => (
        <NavLink
          key={item.name}
          to={item.href}
          className={({ isActive }) =>
            cn(
              "group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-gray-700 hover:bg-gray-50",
              mobile && "hover:bg-gray-100"
            )
          }
        >
          <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
          {item.name}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AlertMessage />

      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-40 md:hidden"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle navigation</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] p-0">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h1 className="text-xl font-bold">POS System</h1>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <NavigationLinks mobile />
            </div>
            <div className="border-t">
              <UserProfileSection />
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow border-r border-gray-200 bg-white">
          <div className="flex items-center h-16 px-4 border-b">
            <h1 className="text-xl font-bold">POS System</h1>
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto">
            <div className="flex-1 py-4">
              <NavigationLinks />
            </div>
            <div className="border-t">
              <UserProfileSection />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col md:pl-64">
        <header
          className={cn(
            "sticky top-0 z-30 md:hidden bg-white/80 backdrop-blur-sm transition-shadow duration-200",
            isScrolled && "shadow-sm"
          )}
        >
          <div className="h-16" />
        </header>
        <main className="flex-1">
          <div className="py-6">
            <div className="mx-auto px-4 sm:px-6 md:px-8">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}