import Koa from "koa";
import bodyParser from "koa-bodyparser";
import {pipeline} from "@xenova/transformers"

const app = new Koa()

// Use bodyparser middleware to parse JSON request
app.use(bodyParser({ enableTypes: ["text"] }));

const embed = async (text) => {
  const extractor = await pipeline(
    "feature-extraction",
    "Xenova/bert-large-cased-whole-word-masking"
  );
  const { data } = await extractor(text, {
    pooling: "mean",
    normalize: true,
  });
  return Object.values(data);
};


// Define POST request route to handle the text
app.use(async (ctx) => {
  try {
    // Look for text property on request body
    const text = ctx.request.body;
    console.log(text);
    if (text) {
      const res = await embed(text);
      console.log('embedding', embed)
      // Check if the header "b" is present
      const b = ctx.request.header.b;
      if (b) {
        // Return a Buffer of the embedding
        ctx.body = Buffer.from(res);
      } else {
        // Return a json array of the embedding
        ctx.body = res;
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
