import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Clock, Truck, ChefHat } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import kenyanCuisine from "@/assets/kenyan-cuisine.jpg";

const featuredDishes = [
  {
    id: 1,
    name: "Nyama Choma Deluxe",
    description: "Perfectly grilled beef served with ugali, sukuma wiki, and traditional sauces",
    price: { kes: "KES 1,200", usd: "USD 9" },
    image: kenyanCuisine,
    category: "Main Course",
    rating: 4.9,
    prepTime: "25 min"
  },
  {
    id: 2,
    name: "Swahili Seafood Curry",
    description: "Fresh fish in coconut curry with pilau rice and traditional spices",
    price: { kes: "KES 1,500", usd: "USD 11" },
    image: kenyanCuisine,
    category: "Signature Dish",
    rating: 4.8,
    prepTime: "30 min"
  },
  {
    id: 3,
    name: "Chef's Special Samosas",
    description: "Crispy samosas filled with spiced meat and vegetables, served with chutney",
    price: { kes: "KES 450", usd: "USD 3.5" },
    image: kenyanCuisine,
    category: "Appetizer",
    rating: 4.7,
    prepTime: "15 min"
  }
];

const DiningPreview = () => {
  const { toast } = useToast();

  const handleAddToOrder = (dishName: string, price: string) => {
    toast({
      title: "Added to Order",
      description: `${dishName} (${price}) added to your cart`,
    });
    // TODO: Add to cart state management
  };

  const handleReserveTable = () => {
    toast({
      title: "Table Reservation",
      description: "Redirecting to table reservation system",
    });
    // TODO: Navigate to reservation page
  };

  const handleOrderOnline = () => {
    toast({
      title: "Online Ordering",
      description: "Redirecting to full menu and cart",
    });
    // TODO: Navigate to full menu page
  };

  return (
    <section id="dining" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-6">
            <ChefHat className="w-4 h-4" />
            <span className="text-sm font-medium">Authentic Kenyan Cuisine</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Savor the <span className="gold-gradient-text">Flavors</span> of Kenya
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From traditional dishes to modern interpretations, our kitchen brings you 
            the best of Kenyan culinary heritage with international standards.
          </p>
        </div>

        {/* Featured Dishes */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredDishes.map((dish) => (
            <Card key={dish.id} className="luxury-card border-0 overflow-hidden">
              <div className="relative">
                <img 
                  src={dish.image} 
                  alt={dish.name}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 left-4 bg-secondary text-secondary-foreground px-3 py-1 rounded-full">
                  <span className="text-xs font-medium">{dish.category}</span>
                </div>
                <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-primary fill-current" />
                    <span className="text-sm font-medium">{dish.rating}</span>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold">{dish.name}</h3>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">{dish.price.kes}</p>
                    <p className="text-sm text-muted-foreground">{dish.price.usd}</p>
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-4">{dish.description}</p>
                
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{dish.prepTime}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-accent">
                    <Truck className="w-4 h-4" />
                    <span>Delivery Available</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full btn-luxury"
                  onClick={() => handleAddToOrder(dish.name, dish.price.kes)}
                >
                  Add to Order
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Dining Options */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="luxury-card border-0 p-8 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <ChefHat className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold mb-3">Dine In Experience</h3>
            <p className="text-muted-foreground mb-6">
              Enjoy our elegant restaurant atmosphere with live traditional music 
              and impeccable service from our expert staff.
            </p>
            <Button 
              variant="outline" 
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              onClick={handleReserveTable}
            >
              Reserve Table
            </Button>
          </Card>

          <Card className="luxury-card border-0 p-8 text-center">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-2xl font-semibold mb-3">Delivery & Pickup</h3>
            <p className="text-muted-foreground mb-6">
              Enjoy our delicious meals at home with our reliable delivery service 
              or convenient pickup options available daily.
            </p>
            <Button 
              variant="outline" 
              className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
              onClick={handleOrderOnline}
            >
              Order Online
            </Button>
          </Card>
        </div>

        {/* View Full Menu */}
        <div className="text-center">
          <Button 
            size="lg" 
            className="btn-luxury text-lg px-8 py-6"
            onClick={handleOrderOnline}
          >
            View Full Menu & Order Online
          </Button>
        </div>
      </div>
    </section>
  );
};

export default DiningPreview;