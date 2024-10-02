import * as z from 'zod';

export const menuItemSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  isVeg: z.boolean(),
  kcal: z.number().min(0, { message: 'Calories must be a positive number.' }),
  description: z
    .string()
    .min(10, { message: 'Description must be at least 10 characters.' }),
  imageUrl: z.string().url({ message: 'Must be a valid URL.' }),
  price: z.number().positive({ message: 'Price must be a positive number.' }),
  isAvailable: z.boolean(),
  category: z.string().min(1, { message: 'Category is required.' }),
});
export const menuFormSchema = z.object({
  menu: z
    .array(menuItemSchema)
    .min(1, { message: 'At least one menu item is required.' }),
});

export type MenuFormValues = z.infer<typeof menuFormSchema>;
export type MenuItem = z.infer<typeof menuItemSchema>;
