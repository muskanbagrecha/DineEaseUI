'use client';

import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
// import { Loader2 } from 'lucide-react';
import { makeRequest } from '@/actions/makeRequest';
import { menuFormSchema, MenuFormValues, MenuItem } from '@/schema/menu';
import { MenuItemCard } from '@/components/admin/menu/menuItemCard';
import { useAutoAnimate } from '@formkit/auto-animate/react';

export default function MenuPage({ restaurantId }: { restaurantId: string }) {
  const [anim] = useAutoAnimate();
  const form = useForm<MenuFormValues>({
    resolver: zodResolver(menuFormSchema),
    defaultValues: {
      menu: [
        {
          name: '',
          isVeg: false,
          kcal: 0,
          description: '',
          imageUrl: '',
          price: 0,
          isAvailable: true,
          category: '',
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'menu',
  });

  const onSubmit: SubmitHandler<MenuFormValues> = async (data) => {
    const menuWithImageArray = data.menu.map((item) => ({
      // category: {
      //   id: item.category,
      //   name: item.category,
      // },
      name: item.name,
      isVeg: item.isVeg,
      kcal: item.kcal,
      description: item.description,
      price: item.price,
      isAvailable: item.price,
      images: [item.imageUrl],
    }));
    const menuData = {
      restaurantId: restaurantId,
      menu: menuWithImageArray,
    };
    const response = await makeRequest<
      { message: string },
      { restaurantId: string; menu: typeof menuWithImageArray }
    >({
      method: 'post',
      endpoint: 'api/restaurant/menu/',
      auth: 'bearer',
      data: menuData,
    });

    if (response.success) {
      console.log('reponse', response);
      form.reset();
    } else {
      console.log('error', response);
      form.setError('root', {
        type: 'manual',
        message: response.error,
      });
    }
  };

  return (
    <div className=" p-4">
      <h1 className="text-2xl font-bold mb-4">
        Add Menu Items for Restaurant {restaurantId}
      </h1>
      {form.formState.errors.root && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          {form.formState.errors.root.message}
        </div>
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
          ref={anim}
        >
          {fields.map((field, index) => (
            <MenuItemCard
              key={field.id}
              index={index}
              remove={remove}
              form={form}
              totalItems={fields.length}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              append({
                name: '',
                isVeg: false,
                kcal: 0,
                description: '',
                imageUrl: '',
                price: 0,
                isAvailable: true,
                category: '',
              } as MenuItem)
            }
          >
            Add Another Menu Item
          </Button>
          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <>
                {/* <Loader2 className="mr-2 h-4 w-4 animate-spin" /> */}
                Adding Menu Items...
              </>
            ) : (
              'Add Menu Items'
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
