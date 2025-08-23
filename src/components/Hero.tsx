import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Wifi, Car, Utensils, Waves } from "lucide-react";
import heroImage from "@/assets/hotel-hero.jpg";

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 py-20">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-medium">5-Star Luxury Experience</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Welcome to
            <span className="block gold-gradient-text">Kenya Heights</span>
            <span className="block text-3xl md:text-4xl font-normal text-muted-foreground">
              Hotel & Restaurant
            </span>
          </h1>

          {/* Tagline */}
          <p className="text-xl text-muted-foreground mb-8 max-w-lg">
            Experience unparalleled comfort and authentic Kenyan flavors in the heart of Nairobi. 
            Your gateway to luxury hospitality.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              Explore Menu
              <Utensils className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Quick Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Wifi className="w-5 h-5 text-primary" />
              <span className="text-sm">Free WiFi</span>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Waves className="w-5 h-5 text-primary" />
              <span className="text-sm">Swimming Pool</span>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Utensils className="w-5 h-5 text-primary" />
              <span className="text-sm">Fine Dining</span>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Car className="w-5 h-5 text-primary" />
              <span className="text-sm">Food Delivery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;