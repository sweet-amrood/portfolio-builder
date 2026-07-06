export default function PrismShard() {
  return (
    <div className="pdrift-prism" aria-hidden="true">
      <div className="pdrift-prism-shard pdrift-prism-shard--a" />
      <div className="pdrift-prism-shard pdrift-prism-shard--b" />
      <div className="pdrift-prism-shard pdrift-prism-shard--c" />
      <div className="pdrift-prism-wave">
        {Array.from({ length: 24 }, (_, i) => (
          <span key={i} className="pdrift-prism-bar" style={{ '--i': i }} />
        ))}
      </div>
      <div className="pdrift-prism-readout">
        <span>SIG::PRISM</span>
        <span>DRIFT::ACTIVE</span>
      </div>
    </div>
  );
}
