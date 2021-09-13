export default function TestPage() {
  const times = Array.from(Array(100));
  console.log(times);

  return (
    <main className="grid grid-cols-5">
      {times.map((_, i) => {
        const c1 = Color.random(0, 359, 20, 100, 30, 40);
        const c2 = Color.random(
          Math.max(0,   c1.h - rand(5, 60)),
          Math.min(359, c1.h + rand(5, 60)),
          70,
          90,
          70,
          85
        );
        const bg = Color.random(0, 359, 0, 50, 10, 100)

        console.log(c1, c2, bg)
        return (
          <div key={i} className="">
            <Crane
              color1={c1.toHSL()}
              color2={c2.toHSL()}
              bg={bg.toHSL()}
              i={i}
            />
          </div>
        );
      })}
    </main>
  );
}

class Color {
  constructor(h, s, l) {
    this.h = h;
    this.s = s;
    this.l = l;
  }

  toHSL() {
    return `hsl(${this.h}, ${this.s}%, ${this.l}%)`;
  }
}

Color.random = function (hMin, hMax, sMin, sMax, lMin, lMax) {
  return new Color(rand(hMin, hMax), rand(sMin, sMax), rand(lMin, lMax));
};

function rand(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function Crane({ color1, color2, bg, i }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048">
      <defs>
        <filter id={`S-${i}`} x="0" y="0">
          <feGaussianBlur in="SourceGraphic" stdDeviation="50" />
        </filter>
        <linearGradient x1="13%" y1="99%" x2="87%" y2="21.5%" id={`A-${i}`}>
          <stop stopColor={color1} offset="0%" />
          <stop stopColor={color2} offset="100%" />
        </linearGradient>
        <linearGradient x1="50%" y1="92.0%" x2="61.2%" y2="79.9%" id={`B-${i}`}>
          <stop stopColor={color1} offset="0%" />
          <stop stopColor={color2} offset="100%" />
        </linearGradient>
        <linearGradient
          x1="36.3%"
          y1="44.3%"
          x2="59.0%"
          y2="25.9%"
          id={`E-${i}`}
        >
          <stop stopColor={color1} offset="0%" />
          <stop stopColor={color2} offset="100%" />
        </linearGradient>
        <linearGradient
          x1="-17.9%"
          y1="79.6%"
          x2="57.4%"
          y2="11.3%"
          id={`F-${i}`}
        >
          <stop stopColor={color1} offset="0%" />
          <stop stopColor={color2} offset="100%" />
        </linearGradient>
        <linearGradient
          x1="43.7%"
          y1="57.6%"
          x2="75.1%"
          y2="8.1%"
          id={`H-${i}`}
        >
          <stop stopColor={color1} offset="0%" />
          <stop stopColor={color2} offset="100%" />
        </linearGradient>
        <linearGradient x1="100%" y1="42.2%" x2="50%" y2="58.4%" id={`I-${i}`}>
          <stop stopColor={color1} offset="0%" />
          <stop stopColor={color2} offset="100%" />
        </linearGradient>
      </defs>
      <g fill="none" fillRule="evenodd">
        <path fill={bg} d="M0 0h2048v2048H0z" />
        <polygon
          filter={`url(#S-${i})`}
          fill="rgba(0,0,0,.3)"
          points="271 562 783 1247 1005 999 1930 643 1637 1256 1871 1510 1607 1355 1149 1775 1047 1641 55 1434 576 1195"
        ></polygon>
        <g>
          {/* <animateTransform */}
          {/*   attributeName="transform" */}
          {/*   type="translate" */}
          {/*   values="82 186;82 140;82 186" */}
          {/*   dur="4s" */}
          {/*   repeatCount="indefinite" */}
          {/* /> */}
          <path
            fill={`url(#A-${i})`}
            d="M833 785l115-264 936-425-335 796-317 189z"
          />
          <path fill={`url(#B-${i})`} d="M572 851L219 0l576 932z" />
          <path fill={color1} d="M994 706l238 330-144 88z" />
          <path fill={color1} d="M1165 1398l405-466.286L1521.949 870z" />
          <path
            d="M1550 834c20.633-11.828 63.814.701 88 30 16.124 19.533 72.457 108.199 169 266l-285-269c4.911-10.115 14.245-19.115 28-27z"
            fill={`url(#E-${i})`}
          />
          <path
            d="M1063 1109l400-264c19-13 52-25 84-7 21.333 12 108 109.333 260 292l-279-216-363 484-68 41-34-330z"
            fill={`url(#F-${i})`}
          />
          <path fill={color1} d="M1097 1439l47-206-150 33z" />
          <path fill={`url(#H-${i})`} d="M651 857l343-151 150 527z" />
          <path
            fill={`url(#I-${i})`}
            d="M0 1035l498-267 213 62 433 403-113 52z"
          />
        </g>
        <path fill={color2} d="M0 1968h80v80H0z" />
        <path fill={color1} d="M80 1968h80v80H80z" />
      </g>
      <text
        fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, monospace"
        fontSize="50"
        fontWeight="bold"
        fill="rgba(255,255,255,.9)"
        x="180"
        y="2023"
      >
        2021-13
      </text>
    </svg>
  );
}
