import React from 'react';
import { makeRequest } from '@/actions/makeRequest';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Clock, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface GeoJsonPoint {
  type: string;
  coordinates: number[];
}

interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

interface ContactInformation {
  phoneNumber: string;
  email: string;
}

interface Restaurant {
  id: string;
  name: string;
  description?: string;
  cuisine: string[];
  address: Address;
  location: GeoJsonPoint;
  rating: number;
  ratingCount: number;
  openingHours: string;
  images: string[];
  opened: boolean;
  contactInformation: ContactInformation;
}

const RestaurantCard = ({ restaurant }: { restaurant: Restaurant }) => (
  <div className="bg-white rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
    <div className="relative h-48">
      {/* <Image
        src={restaurant.images[0] || '/api/placeholder/400/200'}
        alt={restaurant.name}
        layout="fill"
        objectFit="cover"
      /> */}
      <div className="absolute top-2 right-2">
        <Badge
          className={`text-white ${
            restaurant.opened ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {restaurant.opened ? 'Open' : 'Closed'}
        </Badge>
      </div>
    </div>
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">{restaurant.name}</h2>
      <p className="text-gray-600 mb-2 line-clamp-2">
        {restaurant.description}
      </p>
      <div className="flex flex-wrap gap-1 mb-2">
        {restaurant.cuisine.map((item, index) => (
          <Badge key={index} variant="secondary">
            {item}
          </Badge>
        ))}
      </div>
      <div className="flex items-center mb-2 text-yellow-500">
        <Star className="w-4 h-4 mr-1" />
        <span>
          {restaurant.rating.toFixed(1)} ({restaurant.ratingCount} reviews)
        </span>
      </div>
      <div className="flex items-center mb-1 text-gray-600">
        <Clock className="w-4 h-4 mr-2" />
        <span className="text-sm">{restaurant.openingHours}</span>
      </div>
      <div className="flex items-center mb-1 text-gray-600">
        <MapPin className="w-4 h-4 mr-2" />
        <span className="text-sm">{`${restaurant.address.city}, ${restaurant.address.country}`}</span>
      </div>
      <div className="flex items-center text-gray-600">
        <Phone className="w-4 h-4 mr-2" />
        <span className="text-sm">
          {restaurant.contactInformation.phoneNumber}
        </span>
      </div>
    </div>
    <div className="px-4 py-3 bg-gray-50">
      <Link href={`/restaurant/${restaurant.id}`}>
        <Button variant="outline" className="w-full">
          View Details
        </Button>
      </Link>
    </div>
  </div>
);

export default async function Home() {
  const getRestaurants = await makeRequest<Restaurant[]>({
    method: 'get',
    endpoint: 'restaurants',
    auth: 'none',
  });

  if (!getRestaurants.success) {
    return (
      <main className="flex flex-col ">
        <div className="text-center py-8">
          <p className="text-xl text-gray-600">No restaurants found</p>
        </div>
      </main>
    );
  }

  const restaurants = getRestaurants.data;

  return (
    <main className="flex flex-col items-center p-8">
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
        {restaurants.length === 0 && (
          <div className="text-center py-8">
            <p className="text-xl text-gray-600">
              No restaurants available at the moment
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
