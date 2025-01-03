import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

interface HostelCardProps {
  hostel: {
    id: number;
    name: string;
    price: string;
    availableRooms: number;
    thumbnail: string;
  };
}

export const HostelCard = ({ hostel }: HostelCardProps) => {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.03,
        transition: { duration: 0.2 }
      }}
    >
      <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 bg-card/50 backdrop-blur-sm border-2 border-transparent hover:border-primary/20">
        <div className="aspect-video relative overflow-hidden">
          <img
            src={`${hostel.thumbnail}?w=600&h=400&fit=crop`}
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
          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold text-primary">
              GH₵ {hostel.price}
              <span className="text-sm text-muted-foreground">/year</span>
            </p>
            <p className="text-sm px-3 py-1 rounded-full bg-secondary">
              {hostel.availableRooms} rooms available
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};