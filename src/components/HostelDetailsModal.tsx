import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface HostelDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  hostel: {
    name: string;
    price: string;
    availableRooms: number;
    thumbnail: string;
    description?: string;
    ownerName?: string;
    ownerContact?: string;
    roomTypes?: string[];
  };
}

export const HostelDetailsModal = ({
  isOpen,
  onClose,
  hostel,
}: HostelDetailsModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{hostel.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6">
          <div className="aspect-video relative overflow-hidden rounded-lg">
            <img
              src={hostel.thumbnail || "/placeholder.svg"}
              alt={hostel.name}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="grid gap-4">
            <div className="flex justify-between items-center">
              <p className="text-2xl font-bold text-primary">
                GH₵ {hostel.price}
                <span className="text-sm text-muted-foreground">/year</span>
              </p>
              <Badge variant="secondary" className="text-base px-4 py-1">
                {hostel.availableRooms} rooms available
              </Badge>
            </div>
            {hostel.description && (
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{hostel.description}</p>
              </div>
            )}
            {hostel.roomTypes && hostel.roomTypes.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Available Room Types</h3>
                <div className="flex flex-wrap gap-2">
                  {hostel.roomTypes.map((type) => (
                    <Badge key={type} variant="outline">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            <div className="border rounded-lg p-4 bg-muted/50">
              <h3 className="font-semibold mb-2">Contact Information</h3>
              <div className="space-y-2">
                <p>
                  <span className="text-muted-foreground">Owner:</span>{" "}
                  {hostel.ownerName || "Not provided"}
                </p>
                <p>
                  <span className="text-muted-foreground">Contact:</span>{" "}
                  {hostel.ownerContact || "Not provided"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};