import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { HostelDetailsModal } from "./HostelDetailsModal";
import { Eye } from "lucide-react";
import { HostelUI } from "@/integrations/supabase/types/hostel";

interface HostelCardProps {
  hostel: HostelUI;
}

export const HostelCard = ({ hostel }: HostelCardProps) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <motion.div
        whileHover={{
          scale: 1.03,
          transition: { duration: 0.2 },
        }}
      >
        <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 bg-card/50 backdrop-blur-sm border-2 border-transparent hover:border-primary/20">
          <div className="aspect-video relative overflow-hidden">
            <img
              src={hostel.thumbnail || "/placeholder.svg"}
              alt={hostel.name}
              className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <CardHeader>
            <CardTitle className="group-hover:text-primary transition-colors duration-300">
              {hostel.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <p className="text-lg font-semibold text-primary">
                GH₵ {Number(hostel.price).toLocaleString()}
                <span className="text-sm text-muted-foreground">/year</span>
              </p>
              <p className="text-sm px-3 py-1 rounded-full bg-secondary">
                {hostel.availableRooms} rooms available
              </p>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowDetails(true)}
            >
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      <HostelDetailsModal
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        hostel={{
          ...hostel,
          price: Number(hostel.price)
        }}
      />
    </>
  );
};