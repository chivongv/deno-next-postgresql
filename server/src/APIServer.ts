import { Application, CorsOptions, oakCors, Router } from "../deps.ts";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  updateProduct,
} from "./controllers/productController.ts";

export type ServerOptions = {
  hostname?: string;
  port?: number;
};

export class APIServer {
  private app = new Application();
  private router = new Router();
  private abortController = new AbortController();
  public hostname: string;
  public port: number;
  public isRunning: boolean = false;
  private whitelist: CorsOptions = { origin: ["http://localhost:3000"] };

  constructor(options: ServerOptions) {
    const { hostname, port } = options;
    this.hostname = hostname || "hostname";
    this.port = port || 5000;
    this.initEndpoints();
  }

  public async start() {
    this.isRunning = true;
    const { signal } = this.abortController;
    console.log(`Server is running on http://${this.hostname}:${this.port}`);
    await this.app.listen({ hostname: this.hostname, port: this.port, signal });

    console.log("Server stopped...");
    this.isRunning = false;
  }

  public async stop() {
    this.isRunning = false;
    this.abortController.abort();
  }

  private initEndpoints() {
    this.router.get(
      "/api/v1/products",
      getAllProducts,
    );
    this.router.get("/api/v1/products/:id", getProduct);
    this.router.post("/api/v1/products", addProduct);
    this.router.put("/api/v1/products/:id", updateProduct);
    this.router.delete("/api/v1/products/:id", deleteProduct);

    this.app.use(oakCors(this.whitelist));
    this.app.use(this.router.routes());
    this.app.use(this.router.allowedMethods());
  }
}
