import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

interface HeaderProps {
  onAdminClick: () => void;
}

export const Header = ({ onAdminClick }: HeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Central University Hostel Finder
        </h1>
      </div>
      <Button
        variant="outline"
        className="flex items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
        onClick={onAdminClick}
      >
        <Shield className="w-4 h-4" />
        Admin Login
      </Button>
    </div>
  );
};