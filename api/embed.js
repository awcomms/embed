import { embed } from "../embed";

export async function GET(request) {
  try {
    // Look for text property on request body
    const text = await request.text();
    console.log(text);
    if (text) {
      const res = await embed(text)
      // Check if the header "b" is present
      const b = request.headers.get("b");
      if (b) {
        // Return a Buffer of the embedding
        return new Response(Buffer.from(res));
      } else {
        // Return a json array of the embedding
        return new Response(JSON.stringify(res));
      }
    } else {
      // Send error if there's no text property on the body
      return new Response("Please provide text to process", { status: 400 });
    }
  } catch (e) {
    console.log("error: ", e);
    return new Response("internal error", { status: 500 });
  }
}
