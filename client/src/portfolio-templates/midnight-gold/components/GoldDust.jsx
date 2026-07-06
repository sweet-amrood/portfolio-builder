export default function GoldDust() {
  return (
    <div className="mgold-dust" aria-hidden="true">
      {Array.from({ length: 36 }, (_, i) => (
        <span key={i} className="mgold-dust-particle" style={{ '--i': i }} />
      ))}
    </div>
  );
}
