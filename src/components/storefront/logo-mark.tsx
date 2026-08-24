// Hearthside Yarn brand mark — a cozy yarn ball with a crochet hook.
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* yarn ball */}
      <circle cx="28" cy="37" r="16" fill="#8C4A2B" />
      <path
        d="M12.6 33.2C20 26.4 35 27 43 34.6"
        stroke="#B4532A"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M12.5 40.5C19.5 34 34.5 34.8 42.5 42"
        stroke="#B4532A"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M17.5 48.5C24 43 34.5 43.6 39.5 47.6"
        stroke="#C97B54"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* loose strand */}
      <path
        d="M43 44c6 .8 9.4 3.6 10.6 8.4"
        stroke="#8C4A2B"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* soft highlight */}
      <ellipse
        cx="22"
        cy="30.5"
        rx="4.2"
        ry="2.6"
        transform="rotate(-32 22 30.5)"
        fill="#FFFFFF"
        opacity="0.32"
      />
      {/* crochet hook */}
      <path
        d="M53.5 9.5 40 23.5"
        stroke="#5C3A21"
        strokeWidth="4.4"
        strokeLinecap="round"
      />
      <path
        d="M40.6 22.7c-4 1.2-5.4 4.6-3.4 7.4"
        stroke="#5C3A21"
        strokeWidth="4.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function LogoMarkBadge({ className }: { className?: string }) {
  return (
    <span className={className}>
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect width="64" height="64" rx="16" fill="#FAF6F0" />
        <rect x="1.5" y="1.5" width="61" height="61" rx="14.5" stroke="#EADFCE" strokeWidth="1.5" />
        <circle cx="28" cy="37" r="15" fill="#8C4A2B" />
        <path
          d="M13.6 33.4C20.6 27 34.6 27.6 42.2 34.8"
          stroke="#B4532A"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <path
          d="M13.5 40.5C20.1 34.4 34 35.2 41.6 41.9"
          stroke="#B4532A"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <ellipse cx="22" cy="30.5" rx="4" ry="2.5" transform="rotate(-32 22 30.5)" fill="#fff" opacity="0.35" />
        <path
          d="M52.5 11.5 40 24"
          stroke="#5C3A21"
          strokeWidth="4.2"
          strokeLinecap="round"
        />
        <path
          d="M40.6 23.3c-3.6 1.1-4.9 4.2-3.1 6.8"
          stroke="#5C3A21"
          strokeWidth="4.2"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
