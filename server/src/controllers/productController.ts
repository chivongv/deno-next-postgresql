import { RouterContext } from "../../deps.ts";
import { Product } from "../types/productType.ts";
import { client } from "../models/products.ts";

function createProduct(row: any[], columns: any[] = []) {
  let product: any = new Object();

  columns.forEach((c, index) => {
    product[c.name] = row[index];
  });

  return product as Product;
}

function dataToProducts(rows: any[], columns: any[] = []) {
  const products = rows.map((p) => createProduct(p, columns));

  return products;
}

export const getAllProducts = async (ctx: RouterContext) => {
  const products = await client.queryArray(`SELECT * FROM products;`);

  ctx.response.status = 200;
  ctx.response.body = {
    success: true,
    data: dataToProducts(
      products?.rows,
      products?.rowDescription?.columns || [],
    ),
  };
};

export const getProduct = async (ctx: RouterContext) => {
  const product = await client.queryArray(
    `SELECT * FROM products WHERE id=${ctx.params.id};`,
  );
  const length = product.rowCount || 0;

  if (length >= 1) {
    ctx.response.status = 200;
    ctx.response.body = {
      success: true,
      data: createProduct(
        product.rows[0],
        product?.rowDescription?.columns,
      ),
    };
  } else {
    ctx.response.status = 404;
    ctx.response.body = {
      success: false,
      error: "No product with the provided ID found.",
    };
  }
};

export const addProduct = async (ctx: RouterContext) => {
  const { request, response } = ctx;
  const result = request.body();

  if (!request.hasBody || result.type !== "json") {
    response.status = 400;
    response.body = {
      success: false,
      error: "Invalid request. Please provide a product as a JSON object.",
    };
  }

  const data = await result.value;

  const newProduct: Product = {
    ...data,
  };

  const insertProduct = await client.queryArray(`INSERT INTO products
  (name, description, price, currency) 
  VALUES ('${data.name}', '${data.description}', ${data.price}, '${data.currency}');`);

  console.log("insertProduct", insertProduct);

  ctx.response.status = 201;
  ctx.response.body = {
    success: true,
    data: newProduct,
  };
};

export const updateProduct = async (ctx: RouterContext) => {
  const { request, response } = ctx;
  const result = request.body();

  if (!request.hasBody || result.type !== "json") {
    response.status = 400;
    response.body = {
      success: false,
      error: "Invalid request. Please provide a product as a JSON object.",
    };
  }

  const data = await result.value;
  const updatedProduct = {
    // ...product,
    ...data,
  };
  // db[productIndex] = updatedProduct;
  const product = await client.queryArray(
    `UPDATE products 
      SET name=${data.name}, description=${data.description}, 
      price=${data.price}, currency=${data.currency} 
      WHERE id=${ctx.params.id}`,
  );
  console.log("product", product);

  response.status = 200;
  response.body = {
    success: true,
    data: updatedProduct,
  };

  // if (productIndex >= 0) {
  //   // const product = db[productIndex];

  // } else {
  //   response.status = 404,
  //     response.body = {
  //       success: false,
  //       error: "Product doesn't exist. Please provide a valid product id.",
  //     };
  // }
};

export const deleteProduct = async (ctx: RouterContext) => {
  // const initialLength = db.length;
  // db = db.filter((p) => p.id !== ctx.params.id);
  const product = await client.queryArray(
    `DELETE FROM products WHERE id=${ctx.params.id}`,
  );

  ctx.response.body = {
    success: true,
  };
};
