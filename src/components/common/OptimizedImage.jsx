function optimizedPath(src, width, format) {
  const file = src.split("/").pop();
  const base = file.replace(/\.[^.]+$/, "");
  return `/assets/optimized/${base}-${width}.${format}`;
}

function sourceSet(src, widths, format) {
  return widths
    .map((width) => `${optimizedPath(src, width, format)} ${width}w`)
    .join(", ");
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  widths = [width],
  sizes = "100vw",
  className,
  loading = "lazy",
  decoding = "async",
  fetchPriority,
}) {
  const availableWidths = widths.filter((candidate) => candidate <= width);
  const safeWidths = availableWidths.length ? availableWidths : [widths[0]];

  return (
    <picture className={className ? `optimized-picture ${className}` : "optimized-picture"}>
      <source type="image/avif" srcSet={sourceSet(src, safeWidths, "avif")} sizes={sizes} />
      <source type="image/webp" srcSet={sourceSet(src, safeWidths, "webp")} sizes={sizes} />
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding={decoding}
        fetchPriority={fetchPriority}
      />
    </picture>
  );
}
