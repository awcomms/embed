export const embed = async (text) => {
  const extractor = await pipeline(
    "feature-extraction",
    "Xenova/bge-base-en-v1.5"
  );
  const { data } = await extractor(text, {
    pooling: "mean",
    normalize: true,
  });
  return Object.values(data);
};
