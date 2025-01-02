import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SearchFilters from "@/components/SearchFilters";
import { ThemeToggle } from "@/components/ThemeToggle";

// Updated mock data with better images
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

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const filteredHostels = mockHostels.filter((hostel) => {
    const matchesSearch = hostel.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const price = parseInt(hostel.price.replace(",", ""));
    const matchesMinPrice = !minPrice || price >= parseInt(minPrice);
    const matchesMaxPrice = !maxPrice || price <= parseInt(maxPrice);
    return matchesSearch && matchesMinPrice && matchesMaxPrice;
  });

  const handlePriceRangeChange = (min: string, max: string) => {
    if (min) setMinPrice(min);
    if (max) setMaxPrice(max);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <ThemeToggle />
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Central University Hostel Finder
        </h1>
        
        <SearchFilters
          onSearch={setSearchQuery}
          onPriceRangeChange={handlePriceRangeChange}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHostels.map((hostel) => (
            <Card key={hostel.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video relative">
                <img
                  src={`${hostel.thumbnail}?w=600&h=400&fit=crop`}
                  alt={hostel.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <CardHeader>
                <CardTitle>{hostel.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <p className="text-lg font-semibold">
                    GH₵ {hostel.price}
                    <span className="text-sm text-muted-foreground">/year</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {hostel.availableRooms} rooms available
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;