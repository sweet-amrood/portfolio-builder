import { getInitials } from '../../utils/contentHelpers';

export default function ProfilePhoto({
  image,
  name,
  className = '',
  emptyClassName = '',
  initialsClassName = '',
}) {
  const isEmpty = !image;

  return (
    <div className={`${className}${isEmpty && emptyClassName ? ` ${emptyClassName}` : ''}`.trim()}>
      {!isEmpty ? (
        <img src={image} alt={name || 'Profile'} loading="lazy" />
      ) : (
        <span className={initialsClassName}>{getInitials(name)}</span>
      )}
    </div>
  );
}
