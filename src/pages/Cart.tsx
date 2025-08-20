import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: 'room' | 'dining';
  description?: string;
  image?: string;
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Load cart items from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    }
  }, []);

  const saveCart = (items: CartItem[]) => {
    localStorage.setItem('cart', JSON.stringify(items));
    setCartItems(items);
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }

    const updatedItems = cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    saveCart(updatedItems);
  };

  const removeItem = (id: string) => {
    const updatedItems = cartItems.filter(item => item.id !== id);
    saveCart(updatedItems);
    toast({
      title: "Item Removed",
      description: "Item has been removed from your cart",
    });
  };

  const clearCart = () => {
    saveCart([]);
    toast({
      title: "Cart Cleared",
      description: "All items have been removed from your cart",
    });
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to your cart before checkout",
        variant: "destructive",
      });
      return;
    }
    navigate('/checkout');
  };

  // Sample items for demo if cart is empty
  const addSampleItems = () => {
    const sampleItems: CartItem[] = [
      {
        id: '1',
        name: 'Deluxe Room',
        price: 15000,
        quantity: 1,
        type: 'room',
        description: '2 nights stay',
        image: '/src/assets/deluxe-room.jpg'
      },
      {
        id: '2',
        name: 'Kenyan Cuisine Dinner',
        price: 2500,
        quantity: 2,
        type: 'dining',
        description: 'Traditional Kenyan meal',
        image: '/src/assets/kenyan-cuisine.jpg'
      }
    ];
    saveCart(sampleItems);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Shopping Cart ({getTotalItems()} items)
                </CardTitle>
                {cartItems.length > 0 && (
                  <Button variant="outline" size="sm" onClick={clearCart}>
                    Clear Cart
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {cartItems.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
                    <p className="text-muted-foreground mb-4">
                      Add some items to get started
                    </p>
                    <div className="space-y-2">
                      <Button onClick={addSampleItems} variant="outline">
                        Add Sample Items (Demo)
                      </Button>
                      <br />
                      <Link to="/">
                        <Button>Continue Shopping</Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                        )}
                        
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.name}</h4>
                          {item.description && (
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          )}
                          <Badge variant="secondary" className="mt-1">
                            {item.type === 'room' ? 'Room' : 'Dining'}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="text-right">
                          <p className="font-semibold">
                            KES {(item.price * item.quantity).toLocaleString()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            KES {item.price.toLocaleString()} each
                          </p>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal ({getTotalItems()} items)</span>
                  <span>KES {getTotalPrice().toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Service Charge</span>
                  <span>KES {Math.round(getTotalPrice() * 0.1).toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span>VAT (16%)</span>
                  <span>KES {Math.round(getTotalPrice() * 0.16).toLocaleString()}</span>
                </div>

                <hr />
                
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>KES {Math.round(getTotalPrice() * 1.26).toLocaleString()}</span>
                </div>

                <Button 
                  onClick={handleCheckout} 
                  className="w-full btn-luxury"
                  disabled={cartItems.length === 0 || loading}
                >
                  {loading ? "Processing..." : "Proceed to Checkout"}
                </Button>

                <div className="text-center">
                  <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
                    Continue Shopping
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;