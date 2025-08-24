import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Wifi, Car, Coffee, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart, CartItem } from "@/hooks/use-cart";
import deluxeRoom from "@/assets/deluxe-room.jpg";

const rooms = [
  {
    id: 1,
    name: "Standard Room",
    description: "Comfortable and cozy room perfect for business travelers",
    price: { kes: "KES 8,500", usd: "USD 65" },
    image: deluxeRoom,
    amenities: ["Free WiFi", "AC", "TV", "Mini Fridge"],
    maxGuests: 2,
    rating: 4.5
  },
  {
    id: 2,
    name: "Deluxe Room",
    description: "Spacious room with city view and modern amenities",
    price: { kes: "KES 12,500", usd: "USD 95" },
    image: deluxeRoom,
    amenities: ["Free WiFi", "City View", "Minibar", "Room Service"],
    maxGuests: 3,
    rating: 4.8
  },
  {
    id: 3,
    name: "Executive Suite",
    description: "Luxury suite with panoramic views and premium services",
    price: { kes: "KES 18,500", usd: "USD 140" },
    image: deluxeRoom,
    amenities: ["Mountain View", "Balcony", "Jacuzzi", "Butler Service"],
    maxGuests: 4,
    rating: 5.0
  }
];

const RoomsPreview = () => {
  const { toast } = useToast();
  const { addToCart } = useCart();

  const handleBookRoom = (room: any) => {
    const priceNumber = parseInt(room.price.kes.replace(/[^\d]/g, ''));
    
    const cartItem: CartItem = {
      id: `room-${room.id}`,
      name: room.name,
      price: priceNumber,
      quantity: 1,
      type: 'room',
      description: room.description,
      image: room.image
    };
    
    addToCart(cartItem);
    
    toast({
      title: "Room Added to Cart",
      description: `${room.name} has been added to your cart`,
    });
  };

  return (
    <section id="rooms" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Luxury <span className="gold-gradient-text">Accommodations</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose from our carefully designed rooms and suites, each offering comfort, 
            style, and authentic Kenyan hospitality.
          </p>
        </div>

        {/* Rooms Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {rooms.map((room) => (
            <Card key={room.id} className="luxury-card border-0 overflow-hidden">
              <div className="relative">
                <img 
                  src={room.image} 
                  alt={room.name}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-primary fill-current" />
                    <span className="text-sm font-medium">{room.rating}</span>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold">{room.name}</h3>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">{room.price.kes}</p>
                    <p className="text-sm text-muted-foreground">{room.price.usd}</p>
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-4">{room.description}</p>
                
                <div className="flex items-center space-x-4 mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{room.maxGuests} guests</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {room.amenities.map((amenity, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
                
                <Button 
                  className="w-full btn-luxury"
                  onClick={() => handleBookRoom(room)}
                >
                  Book This Room
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            View All Rooms & Suites
          </Button>
        </div>
      </div>
    </section>
  );
};

export default RoomsPreview;