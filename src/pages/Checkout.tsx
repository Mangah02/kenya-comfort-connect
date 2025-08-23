import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CreditCard, Smartphone, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: 'room' | 'dining';
  description?: string;
}

const Checkout = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form data
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [deliveryType, setDeliveryType] = useState("pickup");

  useEffect(() => {
    // Load cart items
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    }

    // Check authentication
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUser(session.user);
      setCustomerEmail(session.user.email || "");
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getFinalTotal = () => {
    const subtotal = getTotalPrice();
    const serviceCharge = Math.round(subtotal * 0.1);
    const vat = Math.round(subtotal * 0.16);
    return subtotal + serviceCharge + vat;
  };

  const validateForm = () => {
    if (!customerName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your full name",
        variant: "destructive",
      });
      return false;
    }
    
    if (!customerEmail.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return false;
    }
    
    if (!customerPhone.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your phone number",
        variant: "destructive",
      });
      return false;
    }

    if (deliveryType === "delivery" && !deliveryAddress.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your delivery address",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;
    
    if (cartItems.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Your cart is empty",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Generate order token for guest orders
      let orderToken = null;
      if (!user) {
        const { data: tokenData, error: tokenError } = await supabase
          .rpc('generate_order_token');
        
        if (tokenError) {
          throw tokenError;
        }
        orderToken = tokenData;
      }

      // Create order in database
      const orderData = {
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        total_amount: getFinalTotal(),
        currency: "KES",
        payment_method: paymentMethod,
        payment_status: "pending",
        delivery_type: deliveryType,
        delivery_address: deliveryType === "delivery" ? deliveryAddress : null,
        delivery_fee: deliveryType === "delivery" ? 500 : 0,
        special_instructions: specialInstructions || null,
        order_type: "hotel_booking",
        user_id: user?.id || null,
        order_token: orderToken
      };

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (orderError) {
        throw orderError;
      }

      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        item_name: item.name,
        item_description: item.description || null,
        item_type: item.type,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity,
        item_data: {
          type: item.type,
          originalId: item.id
        }
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        throw itemsError;
      }

      if (paymentMethod === "mpesa") {
        // For demo purposes, simulate M-Pesa payment
        toast({
          title: "M-Pesa Payment Initiated",
          description: `Please check your phone for M-Pesa prompt. Order ID: ${order.id}`,
        });
        
        // In a real implementation, you would call your M-Pesa edge function here
        setTimeout(() => {
          // Clear cart and navigate to success page
          localStorage.removeItem('cart');
          
          // Navigate with order ID and token (for guest orders)
          const successUrl = orderToken 
            ? `/payment-success?orderId=${order.id}&token=${orderToken}`
            : `/payment-success?orderId=${order.id}`;
          
          navigate(successUrl);
        }, 3000);
        
      } else if (paymentMethod === "paypal") {
        // For demo purposes, simulate PayPal redirect
        toast({
          title: "Redirecting to PayPal",
          description: "You will be redirected to PayPal to complete your payment",
        });
        
        // In a real implementation, you would redirect to PayPal
        setTimeout(() => {
          localStorage.removeItem('cart');
          
          // Navigate with order ID and token (for guest orders)
          const successUrl = orderToken 
            ? `/payment-success?orderId=${order.id}&token=${orderToken}`
            : `/payment-success?orderId=${order.id}`;
          
          navigate(successUrl);
        }, 2000);
      }

    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: error.message || "Failed to process payment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">
              Add some items to your cart before proceeding to checkout
            </p>
            <Link to="/cart">
              <Button>Go to Cart</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            to="/cart"
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Delivery Information */}
            <Card>
              <CardHeader>
                <CardTitle>Delivery Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup value={deliveryType} onValueChange={setDeliveryType}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pickup" id="pickup" />
                    <Label htmlFor="pickup">Pickup at Hotel</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="delivery" id="delivery" />
                    <Label htmlFor="delivery">Delivery (+KES 500)</Label>
                  </div>
                </RadioGroup>

                {deliveryType === "delivery" && (
                  <div>
                    <Label htmlFor="address">Delivery Address *</Label>
                    <Textarea
                      id="address"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Enter your delivery address"
                      required
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="instructions">Special Instructions</Label>
                  <Textarea
                    id="instructions"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="Any special instructions for your order"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="mpesa" id="mpesa" />
                    <Smartphone className="w-5 h-5 text-green-600" />
                    <Label htmlFor="mpesa" className="flex-1">
                      M-Pesa
                      <span className="block text-sm text-muted-foreground">
                        Pay with your M-Pesa mobile money
                      </span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <Label htmlFor="paypal" className="flex-1">
                      PayPal
                      <span className="block text-sm text-muted-foreground">
                        Pay with PayPal or credit card
                      </span>
                    </Label>
                  </div>
                </RadioGroup>
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
                {/* Order Items */}
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-2 border-b">
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity} × KES {item.price.toLocaleString()}
                        </p>
                      </div>
                      <span className="font-medium">
                        KES {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <hr />

                {/* Pricing Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>KES {getTotalPrice().toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Service Charge (10%)</span>
                    <span>KES {Math.round(getTotalPrice() * 0.1).toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>VAT (16%)</span>
                    <span>KES {Math.round(getTotalPrice() * 0.16).toLocaleString()}</span>
                  </div>

                  {deliveryType === "delivery" && (
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>KES 500</span>
                    </div>
                  )}
                </div>

                <hr />
                
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>KES {(getFinalTotal() + (deliveryType === "delivery" ? 500 : 0)).toLocaleString()}</span>
                </div>

                <Button 
                  onClick={handlePayment} 
                  className="w-full btn-luxury"
                  disabled={loading}
                >
                  {loading ? "Processing..." : `Pay with ${paymentMethod === "mpesa" ? "M-Pesa" : "PayPal"}`}
                </Button>

                <div className="flex items-center justify-center text-sm text-muted-foreground">
                  <ShieldCheck className="w-4 h-4 mr-1" />
                  Secure payment processing
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

export default Checkout;