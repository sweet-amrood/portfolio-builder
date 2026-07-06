import preSvg from '../assets/pre.svg';

export default function Preloader({ active }) {
  if (!active) return null;

  return (
    <div
      className="smcls-preloader"
      style={{ backgroundImage: `url(${preSvg})` }}
      aria-hidden="true"
    />
  );
}
