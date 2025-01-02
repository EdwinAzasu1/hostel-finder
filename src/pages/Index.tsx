import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Temporary mock data for development
const mockHostels = [
  {
    id: 1,
    name: "Sunshine Hostel",
    price: "3,500",
    availableRooms: 5,
    thumbnail: "/placeholder.svg"
  },
  {
    id: 2,
    name: "Green View Lodge",
    price: "4,000",
    availableRooms: 3,
    thumbnail: "/placeholder.svg"
  },
  {
    id: 3,
    name: "Campus Haven",
    price: "3,800",
    availableRooms: 7,
    thumbnail: "/placeholder.svg"
  },
  {
    id: 4,
    name: "Student's Paradise",
    price: "4,200",
    availableRooms: 2,
    thumbnail: "/placeholder.svg"
  },
  {
    id: 5,
    name: "Unity Hall",
    price: "3,200",
    availableRooms: 10,
    thumbnail: "/placeholder.svg"
  },
  {
    id: 6,
    name: "Royal Residence",
    price: "4,500",
    availableRooms: 4,
    thumbnail: "/placeholder.svg"
  }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Central University Hostel Finder
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockHostels.map((hostel) => (
            <Card key={hostel.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video relative">
                <img
                  src={hostel.thumbnail}
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