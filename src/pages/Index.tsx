import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import SearchFilters from "@/components/SearchFilters";
import { Header } from "@/components/Header";
import { HostelCard } from "@/components/HostelCard";
import { AdminLoginModal } from "@/components/AdminLoginModal";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handlePriceRangeChange = (min: string, max: string) => {
    if (min) setMinPrice(min);
    if (max) setMaxPrice(max);
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminModalOpen(false);
    toast({
      title: "Success",
      description: "Redirecting to admin dashboard...",
    });
    navigate("/admin");
  };

  const handleAdminLoginError = (message: string) => {
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });
  };

  const filteredHostels = mockHostels.filter((hostel) => {
    const matchesSearch = hostel.name.toLowerCase().includes(searchQuery.toLowerCase());
    const price = parseInt(hostel.price.replace(",", ""));
    const matchesMinPrice = !minPrice || price >= parseInt(minPrice);
    const matchesMaxPrice = !maxPrice || price <= parseInt(maxPrice);
    return matchesSearch && matchesMinPrice && matchesMaxPrice;
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 dark:from-background dark:to-secondary/10">
      <div className="container mx-auto px-4 py-8">
        <Header onAdminClick={() => setIsAdminModalOpen(true)} />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <SearchFilters
            onSearch={setSearchQuery}
            onPriceRangeChange={handlePriceRangeChange}
          />
        </motion.div>
        
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredHostels.map((hostel) => (
            <HostelCard key={hostel.id} hostel={hostel} />
          ))}
        </motion.div>
      </div>

      <AdminLoginModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
        onLoginError={handleAdminLoginError}
      />
    </div>
  );
};

const mockHostels = [
  {
    id: 1,
    name: "Sunshine Hostel",
    price: "3,500",
    availableRooms: 5,
    thumbnail: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
  },
  {
    id: 2,
    name: "Green View Lodge",
    price: "4,000",
    availableRooms: 3,
    thumbnail: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
  },
  {
    id: 3,
    name: "Campus Haven",
    price: "3,800",
    availableRooms: 7,
    thumbnail: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7"
  },
  {
    id: 4,
    name: "Student's Paradise",
    price: "4,200",
    availableRooms: 2,
    thumbnail: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
  },
  {
    id: 5,
    name: "Unity Hall",
    price: "3,200",
    availableRooms: 10,
    thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: 6,
    name: "Royal Residence",
    price: "4,500",
    availableRooms: 4,
    thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6"
  }
];

export default Index;
