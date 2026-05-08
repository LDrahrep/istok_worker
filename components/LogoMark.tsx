// "I" badge + "ISTOK Group" wordmark. Port of iOS Components/LogoMark.swift.
//
// The brand "I" logomark on iOS lives at Assets.xcassets/IstokLogo. For web
// we render a simple inline SVG placeholder until we get the official asset
// dropped into /public; swap in <img src="/icons/istok-logo.svg" /> at that
// point.

export function LogoMark() {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span
        className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-accent text-accent-fg font-mono font-bold text-sm shadow-sm"
        aria-hidden
      >
        I
      </span>
      <span className="text-[15px] font-semibold tracking-tight text-fg">
        ISTOK <span className="font-medium text-subtle">Group</span>
      </span>
    </span>
  );
}
