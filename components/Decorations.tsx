export function MoonDecoration() {
  return (
    <div className="moon-scene" aria-hidden="true">
      <span className="moon-ring moon-ring-a" />
      <span className="moon-ring moon-ring-b" />
      <span className="moon-orbit-dot moon-orbit-dot-a" />
      <span className="moon-orbit-dot moon-orbit-dot-b" />
      <span className="moon-planet">
        <i className="crater crater-a" />
        <i className="crater crater-b" />
        <i className="crater crater-c" />
      </span>
      <span className="star star-a">✦</span>
      <span className="star star-b">✧</span>
      <span className="star star-c">+</span>
      <span className="coordinates">LUNAR COORDS:<br/>-14.2390° N<br/>-175.1982° W</span>
    </div>
  );
}

export function EdgeMarks() {
  return (
    <div className="edge-marks" aria-hidden="true">
      <span className="corner tl">+</span><span className="corner tr">+</span>
      <span className="corner bl">+</span><span className="corner br">+</span>
      <span className="edge-code">SATO / 2026 / COMMISSION</span>
    </div>
  );
}
