import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import SearchFilters from "@/components/SearchFilters";
import { Header } from "@/components/Header";
import { HostelCard } from "@/components/HostelCard";
import { AdminLoginModal } from "@/components/AdminLoginModal";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface Hostel {
  id: string;
  name: string;
  price: number;
  available_rooms: number;
  thumbnail: string | null;
  description: string | null;
  owner_name: string;
  owner_contact: string;
}

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: hostels = [], isLoading } = useQuery({
    queryKey: ['hostels'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hostels')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch hostels",
          variant: "destructive",
        });
        return [];
      }

      return data;
    },
  });

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

  const filteredHostels = hostels.filter((hostel) => {
    const matchesSearch = hostel.name.toLowerCase().includes(searchQuery.toLowerCase());
    const price = hostel.price;
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

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
            <HostelCard 
              key={hostel.id} 
              hostel={{
                id: parseInt(hostel.id),
                name: hostel.name,
                price: hostel.price.toString(),
                availableRooms: hostel.available_rooms,
                thumbnail: hostel.thumbnail || "/placeholder.svg",
                description: hostel.description || undefined,
                ownerName: hostel.owner_name,
                ownerContact: hostel.owner_contact
              }} 
            />
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

export default Index;