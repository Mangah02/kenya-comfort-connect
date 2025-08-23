import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Home, Receipt } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  payment_status: string;
  created_at: string;
  delivery_type: string;
}

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const token = searchParams.get('token');

      let data, error;

      if (token) {
        // Guest order - use token-based access
        const { data: orderData, error: orderError } = await supabase
          .rpc('get_order_by_token', { token });
        
        if (orderError) {
          throw orderError;
        }
        
        if (orderData && orderData.length > 0) {
          data = orderData[0];
        } else {
          throw new Error('Order not found');
        }
      } else {
        // Authenticated user - use regular query
        const response = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();
        
        data = response.data;
        error = response.error;
        
        if (error) {
          throw error;
        }
      }

      if (data) {
        setOrder(data);
        // Update payment status to paid for demo
        await supabase
          .from('orders')
          .update({ payment_status: 'paid' })
          .eq('id', orderId);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      toast({
        title: "Error",
        description: "Failed to load order details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading order details...</p>
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
        <div className="max-w-2xl mx-auto">
          <Card className="text-center shadow-luxury">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-600">Payment Successful!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {order ? (
                <>
                  <div className="bg-muted/50 rounded-lg p-6 text-left">
                    <h3 className="font-semibold mb-4">Order Details</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Order ID:</span>
                        <p className="font-mono">{order.id}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Customer:</span>
                        <p>{order.customer_name}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Email:</span>
                        <p>{order.customer_email}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Total Amount:</span>
                        <p className="font-semibold">KES {order.total_amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Payment Status:</span>
                        <p className="text-green-600 font-semibold">Paid</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Order Date:</span>
                        <p>{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">What's Next?</h4>
                    <div className="text-sm text-blue-700 space-y-1">
                      {order.delivery_type === 'pickup' ? (
                        <>
                          <p>• Your order confirmation has been sent to your email</p>
                          <p>• Please visit our hotel to pick up your order</p>
                          <p>• Present this order ID at the front desk</p>
                        </>
                      ) : (
                        <>
                          <p>• Your order confirmation has been sent to your email</p>
                          <p>• We'll deliver your order to the specified address</p>
                          <p>• You'll receive updates about your delivery status</p>
                        </>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-8">
                  <h3 className="text-xl font-semibold mb-2">Thank you for your payment!</h3>
                  <p className="text-muted-foreground">
                    Your payment has been processed successfully. You should receive a confirmation email shortly.
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    Back to Home
                  </Button>
                </Link>
                {order && (
                  <Button 
                    onClick={() => window.print()} 
                    className="flex items-center gap-2"
                  >
                    <Receipt className="w-4 h-4" />
                    Print Receipt
                  </Button>
                )}
              </div>

              <div className="text-center pt-6 border-t">
                <p className="text-sm text-muted-foreground">
                  Need help? Contact us at{" "}
                  <a href="mailto:info@kenyaheights.com" className="text-primary hover:underline">
                    info@kenyaheights.com
                  </a>{" "}
                  or call{" "}
                  <a href="tel:+254700123456" className="text-primary hover:underline">
                    +254 700 123 456
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentSuccess;