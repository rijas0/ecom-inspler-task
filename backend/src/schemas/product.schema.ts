import {z} from 'zod';

export const createProductSchema = z.object({
    name:z.string().trim().min(1,"Product name is required"),
    category:z.string().trim().min(1,"Product Category is required"),
    price: z.number().min(0, "Price must be valid"),
    stock: z.number().min(0, "Stock must be valid"),
    image: z.string().trim().url("Image must be a valid URL"),
});

export const updateProductSchema = createProductSchema.partial();