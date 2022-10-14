import { Router } from "express";
import { appendFile } from "fs";
import { ProductController } from "../controller/ProductController";
import { ProductBusiness } from "../business/ProductBusiness";
import { ProductDatabase } from "../database/ProductDatabase";
import { Authenticator } from "../services/Authenticator";
import { IdGenerator } from "../services/IdGenerator";

export const productRouter = Router();

const productController = new ProductController(
  new ProductBusiness(new ProductDatabase(), new Authenticator(), new IdGenerator())
);

productRouter.get("/", productController.getProducts);
productRouter.post("/order", productController.registerOrder);
productRouter.delete("/delete/order/:id", productController.deleteOrder);
productRouter.delete("/delete/:orderId/:productName", productController.deleteProductFromOrder);
