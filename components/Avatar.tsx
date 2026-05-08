// Initials avatar. Port of iOS Components/AvatarView.swift.
//
// Three modes:
//   * small (≤48px)         dark `surface-alt` bg + light text initials,
//                           used in inbox rows and admin lists.
//   * hero (≥60px)          light `text` bg + navy `bg` initials,
//                           used on Profile hero.
//   * tinted (any size)     pass `tint` (e.g. accent) to override.

export function Avatar({
  initials,
  size = 40,
  tint,
}: {
  initials: string;
  size?: number;
  tint?: string;
}) {
  const isHero = size >= 60;
  const fontSize = isHero ? 22 : size >= 48 ? 14 : 11;

  let bg: string;
  let fg: string;
  if (tint) {
    bg = tint;
    fg = "var(--color-accent-fg)";
  } else if (isHero) {
    bg = "var(--color-fg)";
    fg = "var(--color-bg)";
  } else {
    bg = "var(--color-surface-alt)";
    fg = "var(--color-fg)";
  }

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full font-mono font-bold ${
        !isHero && !tint ? "ring-1 ring-white/14" : ""
      }`}
      style={{
        width: size,
        height: size,
        background: bg,
        color: fg,
        fontSize,
      }}
    >
      {initials}
    </span>
  );
}
