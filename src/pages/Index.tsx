import { useState } from "react";
import SearchFilters from "@/components/SearchFilters";
import { HostelCard } from "@/components/HostelCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { AdminLoginModal } from "@/components/AdminLoginModal";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toHostelUI } from "@/integrations/supabase/types/hostel";
import { ThemeToggle } from "@/components/ThemeToggle";

const Index = () => {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const { toast } = useToast();

  const { data: hostels = [], isLoading } = useQuery({
    queryKey: ['hostels'],
    queryFn: async () => {
      const { data: hostelsData, error: hostelsError } = await supabase
        .from('hostels')
        .select('*')
        .order('created_at', { ascending: false });

      if (hostelsError) {
        toast({
          title: "Error",
          description: "Failed to fetch hostels",
          variant: "destructive",
        });
        return [];
      }

      const { data: roomTypesData, error: roomTypesError } = await supabase
        .from('hostel_room_types')
        .select('*')
        .in(
          'hostel_id',
          hostelsData.map((h) => h.id)
        );

      if (roomTypesError) {
        toast({
          title: "Error",
          description: "Failed to fetch room types",
          variant: "destructive",
        });
        return hostelsData.map(hostel => toHostelUI(hostel));
      }

      return hostelsData.map((hostel) => {
        const hostelWithRoomTypes = {
          ...hostel,
          roomTypes: roomTypesData.filter((rt) => rt.hostel_id === hostel.id),
        };
        return toHostelUI(hostelWithRoomTypes);
      });
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Available Hostels
            </h1>
          </div>
          <Button 
            onClick={() => setShowAdminLogin(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Admin Login
          </Button>
        </div>
        
        <div className="mb-8">
          <SearchFilters />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <p className="text-lg text-muted-foreground">Loading...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hostels.map((hostel) => (
              <HostelCard key={hostel.id} hostel={hostel} />
            ))}
          </div>
        )}

        <AdminLoginModal 
          isOpen={showAdminLogin} 
          onClose={() => setShowAdminLogin(false)}
          onLoginSuccess={() => {
            toast({
              title: "Success",
              description: "Logged in as admin successfully",
            });
            window.location.href = "/admin";
          }}
          onLoginError={(message) => {
            toast({
              title: "Error",
              description: message,
              variant: "destructive",
            });
          }}
        />
      </div>
    </div>
  );
};

export default Index;