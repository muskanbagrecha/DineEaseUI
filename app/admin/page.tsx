import { makeRequest } from '@/actions/makeRequest';

interface Restaurant {
  id: string;
  name: string;
  description?: string;
  cuisine: string[];
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  contactInformation: {
    phoneNumber: string;
    email: string;
  };
  rating: number;
  ratingCount: number;
  openingHours: string;
  images: string[];
  isOpened: boolean;
}

interface Dish {
  id: string;
  name: string;
  description: string;
  isVeg: boolean;
  kcal: number;
  price: number;
  isAvailable: boolean;
}

export default async function AdminPage() {
  // !TODO get restaurant ID from somewhere
  // Fetch restaurant data
  const getRestaurant = await makeRequest<Restaurant>({
    method: 'get',
    endpoint: 'api/restaurant/{id}',
    auth: 'bearer',
  });

  // !TOOD: Fetch menu data
  const getMenu = await makeRequest<Dish[]>({
    method: 'get',
    endpoint: 'api/restaurant/menu/{id}', // Replace {id} with actual restaurant ID
    auth: 'bearer',
  });

  if (!getRestaurant.success || !getMenu.success) {
    return <div>Error loading restaurant data</div>;
  }

  const restaurant = getRestaurant.data;
  const menu = getMenu.data;

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Restaurant Admin Panel</h1>

      {/* Restaurant Details Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Restaurant Details</h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {restaurant.name}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {restaurant.description}
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Address</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {`${restaurant.address.street}, ${restaurant.address.city}, ${restaurant.address.state}, ${restaurant.address.country} ${restaurant.address.zipCode}`}
                </dd>
              </div>
              <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Contact</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {`${restaurant.contactInformation.phoneNumber} | ${restaurant.contactInformation.email}`}
                </dd>
              </div>
              <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Cuisine</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {restaurant.cuisine.join(', ')}
                </dd>
              </div>
              <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Rating</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {`${restaurant.rating.toFixed(1)} (${
                    restaurant.ratingCount
                  } reviews)`}
                </dd>
              </div>
              <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Opening Hours
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {restaurant.openingHours}
                </dd>
              </div>
              <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {restaurant.isOpened ? (
                    <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                      Open
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">
                      Closed
                    </span>
                  )}
                </dd>
              </div>
            </dl>
          </div>
        </div>
        {/* Comment: Add a client-side component here for editing restaurant details */}
      </section>

      {/* Restaurant Status Toggle Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Restaurant Status</h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          <p className="mb-4">
            Current status: {restaurant.isOpened ? 'Open' : 'Closed'}
          </p>
          {/* Comment: Add a client-side component here for toggling restaurant status */}
        </div>
      </section>

      {/* Menu Management Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Menu Management</h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          <div className="mb-4">
            {/* Comment: Add a client-side component here for adding new dishes */}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {menu.map((dish) => (
              <div key={dish.id} className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">{dish.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{dish.description}</p>
                <p className="mb-1">Price: ${dish.price.toFixed(2)}</p>
                <p className="mb-1">Calories: {dish.kcal} kcal</p>
                <p className="mb-2">
                  {dish.isVeg ? (
                    <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                      Vegetarian
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">
                      Non-Vegetarian
                    </span>
                  )}
                </p>
                <p>
                  {dish.isAvailable ? (
                    <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                      Available
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 rounded-full">
                      Unavailable
                    </span>
                  )}
                </p>
                {/* Comment: Add client-side components here for editing and deleting dishes */}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
