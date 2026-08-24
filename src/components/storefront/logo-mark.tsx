// Hearthside Yarn brand mark — a cozy crochet-style flower.
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* leaves */}
      <ellipse cx="13.5" cy="47" rx="8" ry="3.8" transform="rotate(-36 13.5 47)" fill="#4C7A4C" opacity="0.9" />
      <ellipse cx="50.5" cy="47" rx="8" ry="3.8" transform="rotate(36 50.5 47)" fill="#4C7A4C" opacity="0.9" />
      {/* petals */}
      {[0, 60, 120].map((a) => (
        <ellipse key={`a${a}`} cx="32" cy="16.5" rx="7" ry="10" transform={`rotate(${a} 32 32)`} fill="#B4532A" />
      ))}
      {[30, 90, 150].map((a) => (
        <ellipse key={`b${a}`} cx="32" cy="16.5" rx="7" ry="10" transform={`rotate(${a} 32 32)`} fill="#C97B54" />
      ))}
      {/* center */}
      <circle cx="32" cy="32" r="8" fill="#FAF6F0" stroke="#8C4A2B" strokeWidth="2.5" />
      <circle cx="32" cy="29" r="1.4" fill="#B4532A" />
      <circle cx="29.2" cy="33.8" r="1.4" fill="#B4532A" />
      <circle cx="34.8" cy="33.8" r="1.4" fill="#B4532A" />
    </svg>
  );
}

