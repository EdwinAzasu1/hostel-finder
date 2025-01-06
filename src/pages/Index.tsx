import { useState } from "react";
import { Container } from "@/components/ui/container";
import { HostelCard } from "@/components/HostelCard";
import SearchFilters from "@/components/SearchFilters";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { AdminLoginModal } from "@/components/AdminLoginModal";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toHostelUI } from "@/integrations/supabase/types/hostel";

const Index = () => {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const { toast } = useToast();

  const { data: hostels = [], isLoading } = useQuery({
    queryKey: ['hostels'],
    queryFn: async () => {
      // Fetch hostels
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

      // Fetch room types for all hostels
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

      // Combine hostels with their room types and convert to UI model
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
    <Container>
      <h1 className="text-4xl font-bold mb-4">Available Hostels</h1>
      <SearchFilters />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          hostels.map((hostel) => (
            <HostelCard key={hostel.id} hostel={hostel} />
          ))
        )}
      </div>
      <Button onClick={() => setShowAdminLogin(true)}>Admin Login</Button>
      <AdminLoginModal 
        isOpen={showAdminLogin} 
        onClose={() => setShowAdminLogin(false)}
        onLoginSuccess={() => {
          // Handle successful login
        }}
        onLoginError={(message) => {
          toast({
            title: "Error",
            description: message,
            variant: "destructive",
          });
        }}
      />
    </Container>
  );
};

export default Index;