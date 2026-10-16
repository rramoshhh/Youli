import Image, { ImageProps } from 'next/image';

const isRemote = (src: string) => src.startsWith('http://') || src.startsWith('https://');
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

type SmartImageProps = Omit<ImageProps, 'src'> & {
  src?: string;
  fallbackSrc?: string;
};

export default function SmartImage({
  src,
  fallbackSrc = '/assets/boidour4.webp',
  alt,
  width,
  height,
  sizes,
  className,
  style,
  loading,
  priority,
  ...rest
}: SmartImageProps) {
  const resolvedSrc = src && src.trim() ? src : fallbackSrc;
  const publicSrc = resolvedSrc.startsWith('/') ? `${basePath}${resolvedSrc}` : resolvedSrc;

  if (isRemote(publicSrc)) {
    return (
      <img
        src={publicSrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
        style={style}
        loading={loading || (priority ? 'eager' : 'lazy')}
        decoding="async"
      />
    );
  }

  return (
    <Image
      src={publicSrc}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      className={className}
      style={style}
      loading={loading}
      priority={priority}
      {...rest}
    />
  );
}
