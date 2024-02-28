import Koa from "koa";
import bodyParser from "koa-bodyparser";
import { pipeline } from "@xenova/transformers";

const app = new Koa();

app.use(bodyParser({ enableTypes: ["text"] }));

const embed = async (text) => {
  const extractor = await pipeline(
    "feature-extraction",
    "Xenova/gte-base"
  );
  const { data } = await extractor(text, {
    pooling: "mean",
    normalize: true,
  });
  return Object.values(data);
};

app.use(async (ctx) => {
  try {
    const text = ctx.request.body;
    console.log(text);
    if (text) {
      const res = await embed(text);
      console.log("embedding", embed);
      const b = ctx.request.header.b;
      if (b) {
        ctx.body = Buffer.from(res);
      } else {
        ctx.body = res;
      }
    } else {
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
