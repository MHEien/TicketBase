export function ImageBlock({ src, alt, caption, width, height }: {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}) {
  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="mx-auto rounded-lg shadow-lg max-w-full h-auto"
            style={width && height ? { maxWidth: width, maxHeight: height } : undefined}
          />
          {caption && (
            <p className="mt-4 text-sm text-gray-600 italic">
              {caption}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
