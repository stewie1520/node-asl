import { ProductModel } from "@/database";
import { zMiddleware } from "@/utils";
import {
  Body,
  Controller,
  Get,
  Middlewares,
  Post,
  Queries,
  Route,
  Security,
  Tags,
} from "tsoa";
import { z } from "zod";
import {
  ListProductsDTO,
  createProductValidation,
  listProductsValidation,
} from "./validation";

@Route("products")
@Tags("products")
@Security("api_key")
export class ProductController extends Controller {
  @Post("/")
  @Middlewares(zMiddleware(createProductValidation))
  public async createProduct(
    @Body()
    {
      name,
      price,
      description,
      image,
    }: z.infer<typeof createProductValidation>["body"],
  ) {
    const product = new ProductModel({
      name,
      price,
      description,
      image,
    });

    await product.save();
    return product;
  }

  @Get("/")
  @Middlewares(zMiddleware(listProductsValidation))
  public async listProduct(
    @Queries()
    { limit, offset, order }: ListProductsDTO,
  ) {
    return await ProductModel.paginate({}, { limit, offset, sort: order });
  }
}
