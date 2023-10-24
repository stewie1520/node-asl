import mongoose, { model, Schema } from "mongoose";
import paginate from "mongoose-paginate-v2";

export interface Product {
  name: string;
  price: number;
  description: string;
  image: string;
}

const productSchema = new Schema<ProductDocument>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true },
);

productSchema.plugin(paginate);

export interface ProductDocument extends mongoose.Document, Product {}

export const ProductModel = model<
  ProductDocument,
  mongoose.PaginateModel<ProductDocument>
>("Product", productSchema);
