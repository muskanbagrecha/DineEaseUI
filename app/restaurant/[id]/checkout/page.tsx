import { makeRequest } from '@/actions/makeRequest';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface CheckoutItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Restaurant {
  id: string;
  name: string;
  slug: string;
}

interface CheckoutData {
  restaurant: Restaurant;
  items: CheckoutItem[];
  total: number;
}

export default async function CheckoutPage({
  params,
}: {
  params: { slug: string };
}) {
  // Fetch checkout data
  const getCheckoutData = await makeRequest<CheckoutData>({
    method: 'get',
    endpoint: `api/restaurant/${params.slug}/checkout`,
    auth: 'bearer',
  });

  if (!getCheckoutData.success) {
    return <div>Error loading checkout data</div>;
  }

  const { restaurant, items, total } = getCheckoutData.data;

  return (
    <div className="mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout - {restaurant.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Your Order</CardTitle>
            <CardDescription>Review your selected items</CardDescription>
          </CardHeader>
          <CardContent>
            {items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center py-2"
              >
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <p>${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            <Separator className="my-4" />
            <div className="flex justify-between items-center font-bold">
              <p>Total</p>
              <p>${total.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment</CardTitle>
            <CardDescription>Secure payment processing</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Payment form would go here */}
            <p className="text-sm text-gray-500 mb-4">
              Payment details form placeholder
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Pay ${total.toFixed(2)}</Button>
          </CardFooter>
        </Card>
      </div>

      {/* Comment: Add client-side component here for handling payment submission */}
    </div>
  );
}
