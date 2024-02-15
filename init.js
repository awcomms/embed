const extractor = await pipeline(
    "feature-extraction",
    "Xenova/bge-base-en-v1.5"
  );
  const { data } = await extractor('', {
    pooling: "mean",
    normalize: true,
  });
  return Object.values(data);