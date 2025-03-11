import { Metadata } from "next";
import { requireAdmin } from "@/lib/auth.guard";
import { getProductById } from "@/lib/actions/product.action";
import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/product-form";

export const metdata: Metadata = {
  title: "Update Product",
};

const AdminUpdateProductPage = async (props: {
  params: Promise<{
    id: string;
  }>;
}) => {
  await requireAdmin();

  const { id } = await props.params;

  const product = await getProductById(id);

  if (!product) return notFound();

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <h1 className="h2-bold">Update Product</h1>

      <ProductForm type="Update" product={product} productId={product.id} />
    </div>
  );
};

export default AdminUpdateProductPage;
