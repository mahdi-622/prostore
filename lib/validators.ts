import { z } from "zod";
import { formatNumberWithDecimals } from "./utils";
import { PAYMENT_METHODS } from "./constants";

const currency = z
  .string()
  .refine(
    (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimals(Number(value))),
    "Price must exactly have two decimal places"
  );

//schema for inserting products
export const insertProductSchema = z.object({
  name: z.string().min(3, "Name must have atleast three characters"),
  slug: z.string().min(3, "Slug must have atleast three characters"),
  category: z.string().min(3, "Category must have atleast three characters"),
  brand: z.string().min(3, "Brand must have atleast three characters"),
  description: z
    .string()
    .min(3, "Description must have atleast three characters"),
  stock: z.coerce.number(),
  images: z.array(z.string()).min(1, "Product must at least have one image"),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
  price: currency,
});

//schema for updating products
export const updateProductSchema = insertProductSchema.extend({
  id: z.string().min(1, "Id is required").optional(),
});

// schema for sign in usrers
export const signInFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must at least have six characters"),
});

// schema for sign up usrers
export const signUpFormSchema = z
  .object({
    name: z.string().min(3, "Name must at least have three characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must at least have six characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must at least have six characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// cart item schema
export const cartItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  qty: z.number().int().nonnegative("Quantity can not be negative"),
  image: z.string().min(1, "Image is required"),
  price: currency,
});

//cart schema
export const insertCartSchema = z.object({
  items: z.array(cartItemSchema),
  itemsPrice: currency,
  totalPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  sessionCartId: z.string().min(1, "Session cart id is required"),
  userId: z.string().optional().nullable(),
});

// Schema for the shipping address
export const shippingAddressSchema = z.object({
  fullName: z.string().min(3, "Name must at least have 3 characters"),
  streetAddress: z.string().min(3, "Address must at least have 3 characters"),
  city: z.string().min(3, "City must at least have 3 characters"),
  postalCode: z.string().min(3, "Postal code must at least have 3 characters"),
  country: z.string().min(3, "Country code must at least have 3 characters"),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

// schema for oayment method
export const paymentMethodSchema = z
  .object({
    type: z.string().min(1, "Payment method is requierd"),
  })
  .refine((data) => PAYMENT_METHODS.includes(data.type), {
    path: ["type"],
    message: "Invalid payment method",
  });

// schema for inserting orders
export const insertOrderSchema = z.object({
  userId: z.string().min(1, "User id is requierd"),
  itemsPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  totalPrice: currency,
  paymentMethod: z.string().refine((data) => PAYMENT_METHODS.includes(data), {
    message: "Invalid payment method",
  }),
  shippingAddress: shippingAddressSchema,
});

// schema for inserting an order item
export const insertOrderItemSchema = z.object({
  productId: z.string(),
  slug: z.string(),
  image: z.string(),
  name: z.string(),
  price: currency,
  qty: z.number(),
});

// schema for payment result
export const paymentResultSchema = z.object({
  id: z.string(),
  status: z.string(),
  email_address: z.string(),
  pricePaid: z.string(),
});

// schema for updating user profile
export const updateProfileSchema = z.object({
  name: z.string().min(3, "Name must at least have three characters"),
  email: z.string().min(3, "Email must at least have three characters"),
});

// schema for updating users
export const updateUserSchema = z.object({
  id: z.string().min(1, "ID is required"),
  role: z.string().min(1, "Role is required").nullable(),
  name: z.string().min(3, "Name must at least have three characters"),
  email: z.string().min(3, "Email must at least have three characters"),
});

// schema to insert reviews
export const insertReviewSchema = z.object({
  title: z.string().min(3, "Title must atleast have 3 characters"),
  description: z.string().min(3, "Description must atleast have 3 characters"),
  productId: z.string().min(1, "Product is required"),
  userId: z.string().min(1, "User is required"),
  rating: z.coerce
    .number()
    .int()
    .min(1, "Rating must atleast be 1")
    .max(5, "Rating must at most be 5"),
});
