"use server";
import { prisma } from "@/db/prisma";
import { convertToPlainObject, formatError } from "../utils";
import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from "../constants";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { insertProductSchema, updateProductSchema } from "../validators";
import { Prisma } from "@prisma/client";

// get latesdt products
export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: { createdAt: "desc" },
  });

  return convertToPlainObject(data);
}

//get one product by its slug
export async function getProductBySlug(slug: string) {
  return await prisma.product.findFirst({
    where: { slug: slug },
  });
}

//get one product by its id
export async function getProductById(productId: string) {
  const data = await prisma.product.findFirst({
    where: { id: productId },
  });

  return convertToPlainObject(data);
}

// get all products
export async function getAllProducts({
  query,
  limit = PAGE_SIZE,
  page,
  category,
  price,
  rating,
  sort,
}: {
  query: string;
  limit?: number;
  page: number;
  category?: string;
  price?: string;
  rating?: string;
  sort?: string;
}) {
  // query filter
  const queryFilter: Prisma.ProductWhereInput =
    query && query !== "all"
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        }
      : {};

  // category filter
  const categoryFilter = category && category !== "all" ? { category } : {};

  // price filter
  const priceFilter: Prisma.ProductWhereInput =
    price && price !== "all"
      ? {
          price: {
            gte: Number(price.split("-")[0]),
            lte: Number(price.split("-")[1]),
          },
        }
      : {};

  // rating filter
  const ratingFilter =
    rating && rating !== "all"
      ? {
          rating: {
            gte: Number(rating),
          },
        }
      : {};

  const data = await prisma.product.findMany({
    where: {
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    },
    skip: (page - 1) * limit,
    take: limit,
    orderBy:
      sort === "lowest"
        ? { price: "asc" }
        : sort === "highest"
        ? { price: "desc" }
        : sort === "rating"
        ? { rating: "desc" }
        : { createdAt: "desc" },
  });

  const productsCount = await prisma.product.count();

  return {
    data,
    totalPages: Math.ceil(productsCount / limit),
  };
}

// delete a product
export async function deleteProduct(id: string) {
  try {
    const existingProduct = await prisma.product.findFirst({
      where: { id: id },
    });

    if (!existingProduct) throw new Error("Product not found");

    await prisma.product.delete({
      where: { id: id },
    });

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Product was successfully deleted",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// create a product
export async function createProduct(data: z.infer<typeof insertProductSchema>) {
  try {
    const product = insertProductSchema.parse(data);
    await prisma.product.create({ data: product });

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Product was successfully created 🥳",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// update products action
export async function updateProduct(data: z.infer<typeof updateProductSchema>) {
  try {
    const product = updateProductSchema.parse(data);

    const existingProduct = await prisma.product.findFirst({
      where: { id: product.id },
    });
    if (!existingProduct) throw new Error("Product not found");

    await prisma.product.update({
      where: { id: product.id },
      data: product,
    });

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Product was successfully updated",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// get all the categories
export async function getAllCategories() {
  const data = await prisma.product.groupBy({
    by: ["category"],
    _count: true,
  });
  return data;
}

// get featured products
export async function getFeaturedProducts() {
  const data = await prisma.product.findMany({
    where: { isFeatured: true },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  return convertToPlainObject(data);
}
