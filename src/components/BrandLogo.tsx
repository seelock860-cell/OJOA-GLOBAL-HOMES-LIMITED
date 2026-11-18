interface BrandLogoProps {
  variant?: 'dark' | 'light';
}

export function BrandLogo({ variant = 'dark' }: BrandLogoProps) {
  const textColor = variant === 'light' ? 'text-white' : 'text-[#0B1C3D]';
  const markBg = variant === 'light' ? 'bg-white/10 border-[#C6A254]/50' : 'bg-[#0B1C3D] border-[#C6A254]/40';

  return (
    <span className={`inline-flex items-center gap-3 whitespace-nowrap shrink-0 ${textColor}`}>
      <span
        className={`inline-flex h-9 w-9 items-center justify-center border ${markBg} rounded-sm shrink-0`}
        aria-hidden="true"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 10.5L12 3.5L21 10.5V20.5H15.5V14.5H8.5V20.5H3V10.5Z"
            stroke="#C6A254"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path d="M12 3.5V9" stroke="#C6A254" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </span>
      <span className="font-display text-xl font-semibold tracking-tight leading-none">
        Ojoa Global Homes
      </span>
    </span>
  );
}
