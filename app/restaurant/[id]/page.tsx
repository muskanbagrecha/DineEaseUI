import { makeRequest } from '@/actions/makeRequest';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Mail, MapPin, Phone, Star } from 'lucide-react';
import Image from 'next/image';

interface SingleRestaurantProps {
  params: {
    id: string;
  };
}

interface Manager {
  id: string;
  email: string;
  phone: number;
  role: string;
}

interface Location {
  x: number;
  y: number;
  type: string;
  coordinates: number[];
}

interface Address {
  street: string;
  city: string;
  pincode: number;
}

interface ContactInformation {
  phoneNumber: string;
  email: string;
}

interface Restaurant {
  id: string;
  name: string;
  description?: string;
  manager: Manager;
  cuisine: string[];
  address: Address;
  location: Location;
  rating: number;
  ratingCount: number;
  openingHours: string;
  images: string[];
  // menu: any[]; // You might want to define a proper type for menu items
  contactInformation: ContactInformation;
  opened: boolean;
}

export default async function SingleRestaurantPage({
  params: { id },
}: SingleRestaurantProps) {
  const getRestaurant = await makeRequest<Restaurant, string>({
    method: 'post',
    endpoint: 'restaurants/id',
    auth: 'none',
    data: id,
  });

  if (!getRestaurant.success) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              {getRestaurant.error} {id}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const restaurant = getRestaurant.data;
  console.log(restaurant);
  return (
    <main className="py-8">
      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-4xl mb-2">{restaurant.name}</CardTitle>
              <CardDescription className="text-xl">
                {restaurant.description}
              </CardDescription>
            </div>
            <Badge
              className={`${restaurant.opened ? 'bg-green-500' : 'bg-red-500'}`}
            >
              {restaurant.opened ? 'Open' : 'Closed'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {restaurant.cuisine.map((item, index) => (
              <Badge key={index} variant="outline">
                {item}
              </Badge>
            ))}
          </div>
          <div className="flex items-center mb-4">
            <Star className="text-yellow-500 mr-2" />
            <span className="font-semibold">
              {restaurant.rating.toFixed(1)}
            </span>
            <span className="text-gray-600 ml-2">
              ({restaurant.ratingCount} reviews)
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Restaurant Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* {restaurant.images.map((image, index) => (
                <Image
                  key={index}
                  src={image}
                  alt={`${restaurant.name} - Image ${index + 1}`}
                  width={400}
                  height={300}
                  className="rounded-lg shadow-md object-cover w-full h-[200px]"
                />
              ))} */}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center">
              <MapPin className="mr-2" />
              <p>{`${restaurant.address.street}, ${restaurant.address.city}, ${restaurant.address.pincode}`}</p>
            </div>
            <div className="flex items-center">
              <Phone className="mr-2" />
              <p>{restaurant.contactInformation.phoneNumber}</p>
            </div>
            <div className="flex items-center">
              <Mail className="mr-2" />
              <p>{restaurant.contactInformation.email}</p>
            </div>
            <div className="flex items-center">
              <Clock className="mr-2" />
              <p>{restaurant.openingHours}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="menu" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="menu">Menu</TabsTrigger>
          <TabsTrigger value="location">Location</TabsTrigger>
        </TabsList>
        <TabsContent value="menu">
          <Card>
            <CardHeader>
              <CardTitle>Menu</CardTitle>
            </CardHeader>
            <CardContent>
              {/* {restaurant.menu.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 
                lg:grid-cols-3 gap-4">
                  {restaurant.menu.map((dish, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle>{dish.name}</CardTitle>
                        <CardDescription>{dish.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="font-semibold mb-2">
                          ${dish.price.toFixed(2)}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : ( */}
              <p>No menu items available at the moment.</p>
              {/* )} */}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="location">
          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Coordinates: {restaurant.location.coordinates.join(', ')}</p>
              {/* You can add a map component here if you have one */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
