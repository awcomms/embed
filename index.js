import Koa from "koa";
import bodyParser from "koa-bodyparser";
import http from "http";
import { pipeline } from "@xenova/transformers";
const app = new Koa();

// Use bodyparser middleware to parse JSON request
app.use(bodyParser({ enableTypes: ["text"] }));

// Define POST request route to handle the text
app.use(async (ctx) => {
  try {
    // Look for text property on request body
    const text = ctx.request.body;
    console.log(text);
    if (text) {
      const extractor = await pipeline(
        "feature-extraction",
        "Xenova/bge-base-en-v1.5"
      );
      const { data } = await extractor(text, {
        pooling: "mean",
        normalize: true,
      });
      // Check if the header "b" is present
      const b = ctx.request.header.b;
      if (b) {
        // Return a Buffer of the embedding
        ctx.body = Buffer.from(data);
      } else {
        // Return a json array of the embedding
        ctx.body = Object.values(data);
      }
    } else {
      // Send error if there's no text property on the body
      ctx.status = 400;
      ctx.body = { error: "Please provide text to process" };
    }
  } catch (e) {
    console.log("error: ", e);
  }
});

// Start the server
app.listen(3000, function () {
  console.log("Server started on localhost:3000");
});
