// The soft curved divider from her current site. `from` is the color above, `to` the band below.
const fills = {
  cream: "#F7F3EE",
  sage: "#B7CAA3",
  olive: "#576D52",
  paper: "#FFFDFA",
} as const;

type Fill = keyof typeof fills;

export function WaveDivider({ from, to, flip = false }: { from: Fill; to: Fill; flip?: boolean }) {
  return (
    <div aria-hidden style={{ backgroundColor: fills[from] }} className="leading-none">
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className={`block h-10 w-full md:h-16 ${flip ? "-scale-x-100" : ""}`}
      >
        <path
          d="M0 48c160-36 340-44 520-20s360 52 540 36 280-44 380-40v56H0z"
          fill={fills[to]}
        />
      </svg>
    </div>
  );
}
