import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {/* Hotel Info */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">KH</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary">Kenya Heights Hotel</h3>
                <p className="text-sm text-secondary-foreground/70">Luxury & Comfort</p>
              </div>
            </div>
            <p className="text-secondary-foreground/70 mb-6">
              Experience the finest in Kenyan hospitality with our luxury accommodations 
              and authentic local cuisine in the heart of Nairobi.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-secondary-foreground/10 rounded-lg flex items-center justify-center hover:bg-primary/20 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-secondary-foreground/10 rounded-lg flex items-center justify-center hover:bg-primary/20 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-secondary-foreground/10 rounded-lg flex items-center justify-center hover:bg-primary/20 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-secondary-foreground/10 rounded-lg flex items-center justify-center hover:bg-primary/20 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="#home" className="text-secondary-foreground/70 hover:text-primary transition-colors">Home</a></li>
              <li><a href="#rooms" className="text-secondary-foreground/70 hover:text-primary transition-colors">Rooms & Suites</a></li>
              <li><a href="#dining" className="text-secondary-foreground/70 hover:text-primary transition-colors">Dining</a></li>
              <li><a href="#" className="text-secondary-foreground/70 hover:text-primary transition-colors">Amenities</a></li>
              <li><a href="#" className="text-secondary-foreground/70 hover:text-primary transition-colors">Gallery</a></li>
              <li><a href="#contact" className="text-secondary-foreground/70 hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Services</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-secondary-foreground/70 hover:text-primary transition-colors">Room Service</a></li>
              <li><a href="#" className="text-secondary-foreground/70 hover:text-primary transition-colors">Food Delivery</a></li>
              <li><a href="#" className="text-secondary-foreground/70 hover:text-primary transition-colors">Airport Pickup</a></li>
              <li><a href="#" className="text-secondary-foreground/70 hover:text-primary transition-colors">Spa & Wellness</a></li>
              <li><a href="#" className="text-secondary-foreground/70 hover:text-primary transition-colors">Business Center</a></li>
              <li><a href="#" className="text-secondary-foreground/70 hover:text-primary transition-colors">Event Hosting</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact Info</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="text-secondary-foreground/70">123 Uhuru Highway</p>
                  <p className="text-secondary-foreground/70">Nairobi CBD, Kenya</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary" />
                <p className="text-secondary-foreground/70">+254 700 123 456</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary" />
                <p className="text-secondary-foreground/70">info@kenyaheights.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-secondary-foreground/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-secondary-foreground/70 text-sm">
              © 2025 Kenya Heights Hotel. All rights reserved.  Develped $ Designed by Joel Manga
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-secondary-foreground/70 hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="text-secondary-foreground/70 hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="text-secondary-foreground/70 hover:text-primary transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;