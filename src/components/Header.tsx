import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, ShoppingCart, User, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";

const Header = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [cartItems, setCartItems] = useState(0);

  useEffect(() => {
    // Check current user
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    checkUser();

    // Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
        
        // Clear cart when user logs out
        if (event === 'SIGNED_OUT' || !session?.user) {
          localStorage.removeItem('cart');
          window.dispatchEvent(new CustomEvent('cartUpdated', { detail: [] }));
        }
      }
    );

    // Update cart count
    const updateCartCount = () => {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          const items = JSON.parse(savedCart);
          const count = items.reduce((total: number, item: any) => total + item.quantity, 0);
          setCartItems(count);
        } catch (error) {
          setCartItems(0);
        }
      } else {
        setCartItems(0);
      }
    };

    updateCartCount();
    
    // Listen for cart updates - both storage and custom events
    const handleCartUpdate = () => updateCartCount();
    
    window.addEventListener('storage', handleCartUpdate);
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      subscription.unsubscribe();
      window.removeEventListener('storage', handleCartUpdate);
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      // Clear cart before signing out
      localStorage.removeItem('cart');
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: [] }));
      
      // Clean up auth state
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });
      
      await supabase.auth.signOut({ scope: 'global' });
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">KH</span>
            </div>
            <div>
              <h1 className="text-xl font-bold gold-gradient-text">Kenya Heights Hotel</h1>
              <p className="text-xs text-muted-foreground">Comfort & Flavor in the Heart of Kenya</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-foreground hover:text-primary transition-colors">Home</a>
            <a href="#rooms" className="text-foreground hover:text-primary transition-colors">Rooms</a>
            <a href="#dining" className="text-foreground hover:text-primary transition-colors">Dining</a>
            <a href="#about" className="text-foreground hover:text-primary transition-colors">About</a>
            <a href="#contact" className="text-foreground hover:text-primary transition-colors">Contact</a>
          </nav>

          {/* Contact Info & Actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden lg:flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1 text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>+254 700 123 456</span>
              </div>
              <div className="flex items-center space-x-1 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>info@kenyaheights.com</span>
              </div>
            </div>

            {/* Cart Button */}
            <Link to="/cart">
              <Button variant="outline" size="sm" className="relative">
                <ShoppingCart className="w-4 h-4" />
                {cartItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItems}
                  </span>
                )}
              </Button>
            </Link>

            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center space-x-2">
                <div className="hidden md:flex items-center space-x-1 text-sm text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleSignOut}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button variant="outline" size="sm">
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}

            <Button variant="default" className="btn-luxury">
              Book Now
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;