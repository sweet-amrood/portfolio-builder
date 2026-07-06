export default function ProjectCover({ image, className, imageClassName, placeholderClassName, alt = '' }) {
  if (image) {
    return (
      <img
        src={image}
        alt={alt}
        className={imageClassName || className}
        loading="lazy"
      />
    );
  }

  return <div className={placeholderClassName || className} aria-hidden="true" />;
}
