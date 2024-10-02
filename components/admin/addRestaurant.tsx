'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { makeRequest } from '@/actions/makeRequest';

const restaurantSchema = z.object({
  name: z.string().min(1, 'Restaurant name is required'),
  description: z.string().optional(),
  cuisine: z.string().min(1, 'At least one cuisine type is required'),
  address: z.object({
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().min(1, 'Zip code is required'),
  }),
  contactInformation: z.object({
    phoneNumber: z.string().min(1, 'Phone number is required'),
    email: z.string().email('Invalid email address'),
  }),
  openingHours: z.string().min(1, 'Opening hours are required'),
  images: z
    .array(z.string().url('Invalid URL'))
    .min(1, 'At least one image URL is required')
    .max(5, 'Maximum 5 images allowed'),
  location: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }),
});

type RestaurantFormValues = z.infer<typeof restaurantSchema>;

export default function AddRestaurant() {
  const form = useForm<RestaurantFormValues>({
    resolver: zodResolver(restaurantSchema),
  });

  const { fields, append, remove } = useFieldArray<RestaurantFormValues>({
    control: form.control,
    name: 'images' as never,
  });

  interface RestaurantApiResponse {}
  async function onSubmit(values: RestaurantFormValues) {
    const restaurantData = {
      name: values.name,
      description: values.description,
      address: {
        street: values.address.street,
        city: values.address.city,
        state: values.address.state,
        zipCode: values.address.zipCode,
      },
      openingHours: values.openingHours,
      cuisine: values.cuisine.split(',').map((item) => item.trim()),
      images: values.images,
      contactInformation: values.contactInformation,
      location: {
        latitude: values.location.latitude,
        longitude: values.location.longitude,
      },
      restaurantManagerId: '66f2901c39240a0a4b9de719', // !TODO Replace with actual manager ID
    };
    console.log(restaurantData);
    const response = await makeRequest<
      RestaurantApiResponse,
      typeof restaurantData
    >({
      method: 'post',
      endpoint: 'api/restaurant/admin',
      auth: 'bearer',
      data: restaurantData,
    });
    if (!response.success) {
      console.log('no success', response);
      return <>Cannot add Restaurant</>;
    } else {
      console.log('success', response.data);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Add New Restaurant</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Restaurant Name</FormLabel>
                <FormControl>
                  <Input placeholder="Restaurant Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Restaurant Description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cuisine"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cuisine Types</FormLabel>
                <FormControl>
                  <Input placeholder="Italian, Chinese, Vegan" {...field} />
                </FormControl>
                <FormDescription>
                  Enter cuisine types separated by commas
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Address</h2>
            <FormField
              control={form.control}
              name="address.street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street</FormLabel>
                  <FormControl>
                    <Input placeholder="Street Address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="address.city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="City" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address.state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input placeholder="State" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address.zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zip Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Zip Code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Contact Information</h2>
            <FormField
              control={form.control}
              name="contactInformation.phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="Phone Number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactInformation.email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="openingHours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Opening Hours</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Mon-Fri: 9AM-10PM, Sat-Sun: 10AM-11PM"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Location</h2>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="location.latitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Latitude"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location.longitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Longitude"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Images</h2>
            {fields.map((field, index) => (
              <FormField
                key={field.id}
                control={form.control}
                name={`images.${index}`}
                render={({ field: imageField }) => (
                  <FormItem>
                    <FormLabel>Image URL {index + 1}</FormLabel>
                    <div className="flex items-center space-x-2">
                      <FormControl>
                        <Input
                          {...imageField}
                          placeholder="https://example.com/image.jpg"
                          autoFocus
                        />
                      </FormControl>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            {fields.length < 5 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append('' as never)}
              >
                Add Image URL
              </Button>
            )}
          </div>
          <Button type="submit">Add Restaurant</Button>
        </form>
      </Form>
    </div>
  );
}
