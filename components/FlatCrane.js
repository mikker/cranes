export default function FlatCrane({ background, color1, color2 }) {
  return (
    <svg viewBox="0 0 314 314">
      <style>{`
        @keyframes shadow {
          0% { transform: scale(1) }
          50% { transform: scale(1.05) }
          100% { transform: scale(1) }
        }
        #bird, shadow {
          will-change: transform;
        }
        #shadow {
          animation: shadow 4s infinite linear;
          transform-origin: 50% 75%;
        }
      `}</style>
      <defs>
        <filter id="blur" x="0" y="0">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
        </filter>
        <linearGradient
          x1="17.028%"
          y1="80.949%"
          x2="86.755%"
          y2="21.255%"
          id="a"
        >
          <stop stopColor={color1} offset="0%" />
          <stop stopColor={color2} offset="100%" />
        </linearGradient>
        <linearGradient x1="50%" y1="92.043%" x2="61.228%" y2="79.915%" id="b">
          <stop stopColor={color1} offset="0%" />
          <stop stopColor={color2} offset="100%" />
          <stop stopColor={color2} offset="100%" />
        </linearGradient>
        <linearGradient x1="45.274%" y1="50%" x2="57.468%" y2="89.513%" id="c">
          <stop stopColor={color1} offset="0%" />
          <stop stopColor={color2} offset="100%" />
        </linearGradient>
        <linearGradient x1="76.452%" y1="19.303%" x2="24.94%" y2="100%" id="d">
          <stop stopColor={color1} offset="0%" />
          <stop stopColor={color2} offset="100%" />
        </linearGradient>
        <linearGradient
          x1="36.227%"
          y1="44.325%"
          x2="59.155%"
          y2="25.95%"
          id="e"
        >
          <stop stopColor={color1} offset="0%" />
          <stop stopColor={color2} offset="100%" />
        </linearGradient>
        <linearGradient
          x1="-17.911%"
          y1="78.895%"
          x2="57.417%"
          y2="12.381%"
          id="f"
        >
          <stop stopColor={color1} offset="0%" />
          <stop stopColor={color2} offset="100%" />
        </linearGradient>
        <linearGradient
          x1="61.904%"
          y1="12.128%"
          x2="41.347%"
          y2="106.349%"
          id="g"
        >
          <stop stopColor={color1} offset="0%" />
          <stop stopColor={color2} offset="100%" />
        </linearGradient>
        <linearGradient
          x1="43.546%"
          y1="57.677%"
          x2="75.824%"
          y2="8.185%"
          id="h"
        >
          <stop stopColor={color1} offset="0%" />
          <stop stopColor={color2} offset="100%" />
        </linearGradient>
        <linearGradient x1="100%" y1="42.302%" x2="50%" y2="58.31%" id="i">
          <stop stopColor={color1} offset="0%" />
          <stop stopColor={color2} offset="100%" />
        </linearGradient>
      </defs>
      <path fill={background} d="M0 0h314v314H0z" />
      <path
        d="m64.057 84 65.465 105.992 15.01-6.393 13.874-32.319 120.88-54.88-39.891 94.773c3.007.046 6.602 1.29 8.424 4.194l19.869 31.807 2.74 3.12-1.438-1.036.553.885-2.258-2.11-30.31-21.796-45.855 52.073-4.722 6.343-8.932 5.347-.012-.11-.025.11-13.832-21.611-127.883-31.035 64.769-34.154 5.238 1.492L64.057 84z"
        fillOpacity=".2"
        fill="#000"
        id="shadow"
        filter="url(#blur)"
      />
      <g fill="none" fillRule="evenodd">
        <animate
          attributeName="transform"
          values="translate(0 5);translate(0 -5);translate(0 5)"
          dur="4s"
          repeatCount="indefinite"
        />
        <path
          fill="url(#a)"
          d="m122 114.452 16.522-38.49L275 14l-48.952 116.301L179.945 158z"
          transform="translate(20 40)"
        />
        <path
          fill="url(#b)"
          d="M83.455 124.354 32 0l84 136z"
          transform="translate(20 40)"
        />
        <path
          fill="url(#c)"
          d="m145 105 20.382 27.003L180 151.371 159.396 166z"
          transform="translate(20 40)"
        />
        <path
          fill="url(#d)"
          d="m160 209 10-6 59-67-7-9z"
          transform="translate(20 40)"
        />
        <path
          d="M225.991 121.72c3.258-1.556 10.489-.754 13.482 4.017L264 165l-42-39.263 3.991-4.016z"
          fill="url(#e)"
          transform="translate(20 40)"
        />
        <path
          d="m155 161.705 58.491-38.234c5.448-3.103 8.328-3.103 12.102-1.006 2.515 1.398 15.651 15.633 39.407 42.705l-38.399-27.613-4.034-4.024-52.44 70.43L160.042 210 155 161.705z"
          fill="url(#f)"
          transform="translate(20 40)"
        />
        <path
          fill="url(#g)"
          d="m160 210 7-30-17 6-6-1z"
          transform="translate(20 40)"
        />
        <path
          fill="url(#h)"
          d="M94 124.741 145.052 103 167 180z"
          transform="translate(20 40)"
        />
        <path
          fill="url(#i)"
          d="M0 150.561 73.126 112l31.13 8.86L167 180.09 150.153 187z"
          transform="translate(20 40)"
        />
      </g>
    </svg>
  );
}
