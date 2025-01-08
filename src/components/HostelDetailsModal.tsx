import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { HostelRoomType } from "@/integrations/supabase/types/hostel";

interface HostelDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  hostel: {
    name: string;
    price: number;
    availableRooms: number;
    thumbnail: string;
    description?: string;
    ownerName?: string;
    ownerContact?: string;
    roomTypes?: HostelRoomType[];
  };
}

export const HostelDetailsModal = ({
  isOpen,
  onClose,
  hostel,
}: HostelDetailsModalProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      if (contentRef.current) {
        const { scrollHeight, clientHeight, scrollTop } = contentRef.current;
        setShowScrollButton(scrollHeight > clientHeight && scrollTop < scrollHeight - clientHeight);
      }
    };

    const content = contentRef.current;
    if (content) {
      content.addEventListener('scroll', checkScroll);
      // Initial check
      checkScroll();
    }

    return () => {
      if (content) {
        content.removeEventListener('scroll', checkScroll);
      }
    };
  }, [isOpen]);

  const scrollToBottom = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: contentRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{hostel.name}</DialogTitle>
        </DialogHeader>
        <div ref={contentRef} className="grid gap-6 overflow-y-auto pr-2">
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
                Starting from GH₵ {hostel.price.toLocaleString()}
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
                <div className="grid gap-2">
                  {hostel.roomTypes.map((type) => (
                    <div
                      key={type.id}
                      className="flex justify-between items-center p-3 bg-muted rounded-lg"
                    >
                      <Badge variant="outline" className="text-base">
                        {type.room_type}
                      </Badge>
                      <span className="font-semibold">
                        GH₵ {type.price.toLocaleString()}/year
                      </span>
                    </div>
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
        {showScrollButton && (
          <Button
            variant="outline"
            size="icon"
            className="absolute bottom-4 right-4 rounded-full"
            onClick={scrollToBottom}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};