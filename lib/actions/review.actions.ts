"use server";
import { z } from "zod";
import { insertReviewSchema } from "../validators";
import { formatError } from "../utils";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { revalidatePath } from "next/cache";

// create and update reviews
export async function createUpdateReview(
  data: z.infer<typeof insertReviewSchema>
) {
  try {
    const session = await auth();
    if (!session) throw new Error("You must be logged in to write a review");

    // validate and store review
    const review = insertReviewSchema.parse({
      ...data,
      userId: session?.user?.id,
    });

    // get the products that is been reviewde
    const product = await prisma.product.findFirst({
      where: { id: review.productId },
    });

    if (!product) throw new Error("Product not found");

    // check if user already reviewed
    const reviewExist = await prisma.review.findFirst({
      where: { productId: review.productId, userId: review.userId },
    });

    await prisma.$transaction(async (tx) => {
      if (reviewExist) {
        // update the review
        await tx.review.update({
          where: { id: reviewExist.id },
          data: {
            title: review.title,
            description: review.description,
            rating: review.rating,
          },
        });
      } else {
        // create the review
        await tx.review.create({ data: review });
      }

      // get average rating
      const averageRating = await tx.review.aggregate({
        where: { productId: review.productId },
        _avg: { rating: true },
      });

      // get number of reviews
      const numReviews = await tx.review.count({
        where: { productId: review.productId },
      });

      // update the product table with avg rating and num reviews
      await tx.product.update({
        where: { id: review.productId },
        data: {
          numReviews: numReviews,
          rating: averageRating._avg.rating || 0,
        },
      });
    });

    revalidatePath(`/product/${product.slug}`);

    return {
      success: true,
      message: "Reviews updated successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Get all the reviews for one product
export async function getReviews({ productId }: { productId: string }) {
  const data = await prisma.review.findMany({
    where: { productId: productId },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return { data };
}

// get review written by current user
export async function getReviewByProductId({
  productId,
}: {
  productId: string;
}) {
  const session = await auth();

  if (!session) throw new Error("User is not logged in");

  return await prisma.review.findFirst({
    where: {
      productId: productId,
      userId: session?.user?.id,
    },
  });
}
