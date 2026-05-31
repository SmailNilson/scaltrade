/* Procedurally-generated candlestick chart that animates in.
   Used both as ghost backdrop and inside product mockups. */
const { useEffect, useRef, useState, useMemo } = React;

function genCandles(count, seed = 1, base = 19200, vol = 35) {
  // simple deterministic LCG
  let s = seed * 9301 + 49297;
  const rand = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  const out = [];
  let price = base;
  for (let i = 0; i < count; i++) {
    const drift = (rand() - 0.48) * vol;
    const open = price;
    const close = price + drift;
    const high = Math.max(open, close) + rand() * vol * 0.6;
    const low  = Math.min(open, close) - rand() * vol * 0.6;
    out.push({ open, close, high, low });
    price = close;
  }
  return out;
}

/* SVG candlestick chart. props: width, height, count, seed, vwap, accent, ghost, opacity */
function CandlesChart({
  width = 800, height = 320, count = 80, seed = 7, base = 19200, vol = 38,
  vwap = true, ema = false, ob = false, ghostOpacity = 1, animate = true,
  showAxes = false, padX = 16, padY = 24,
}) {
  const candles = useMemo(() => genCandles(count, seed, base, vol), [count, seed, base, vol]);
  const highs = candles.map(c=>c.high), lows = candles.map(c=>c.low);
  const max = Math.max(...highs), min = Math.min(...lows);
  const range = max - min || 1;
  const w = width - padX * 2;
  const h = height - padY * 2;
  const cw = w / count;
  const bodyW = Math.max(2, cw * 0.6);
  const y = (price) => padY + (1 - (price - min) / range) * h;
  const x = (i) => padX + i * cw + cw / 2;

  // VWAP line (running)
  const vwapPts = [];
  let cum = 0, cumV = 0;
  candles.forEach((c, i) => {
    const v = 1 + ((i * 1103) % 7);
    cum += ((c.high + c.low + c.close) / 3) * v;
    cumV += v;
    vwapPts.push([x(i), y(cum / cumV)]);
  });
  const vwapPath = vwapPts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');

  // EMAs
  const emaPath = (period, color) => {
    const k = 2 / (period + 1);
    let prev = candles[0].close;
    const pts = candles.map((c, i) => {
      prev = c.close * k + prev * (1 - k);
      return [x(i), y(prev)];
    });
    return pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  };

  // Order block (a rectangle on a region of recent candles)
  const obIdx = Math.floor(count * 0.62);
  const obCandle = candles[obIdx];
  const obX = x(obIdx) - cw * 2.2;
  const obW = cw * 4.4;
  const obYTop = y(obCandle.high + vol * 0.4);
  const obYBot = y(obCandle.low - vol * 0.4);

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none"
      style={{ display: 'block', opacity: ghostOpacity }}>
      <defs>
        <linearGradient id="up" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#00FF85" stopOpacity="1"/>
          <stop offset="100%" stopColor="#00B36A" stopOpacity="1"/>
        </linearGradient>
        <linearGradient id="down" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#FF4D6E" stopOpacity="1"/>
          <stop offset="100%" stopColor="#C9233F" stopOpacity="1"/>
        </linearGradient>
        <linearGradient id="vwapG" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#7B61FF" stopOpacity=".0"/>
          <stop offset="20%" stopColor="#7B61FF" stopOpacity=".9"/>
          <stop offset="100%" stopColor="#7B61FF" stopOpacity=".9"/>
        </linearGradient>
        <linearGradient id="ob" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#00D4FF" stopOpacity=".25"/>
          <stop offset="100%" stopColor="#00D4FF" stopOpacity=".05"/>
        </linearGradient>
      </defs>

      {showAxes && (
        <g>
          {[0,0.25,0.5,0.75,1].map((t,i)=>(
            <line key={i} x1={padX} x2={width-padX}
              y1={padY + t*h} y2={padY + t*h}
              stroke="#1E2330" strokeWidth="1" strokeDasharray="2 4"/>
          ))}
        </g>
      )}

      {ob && (
        <g>
          <rect x={obX} y={obYTop} width={obW} height={obYBot - obYTop}
            fill="url(#ob)" stroke="#00D4FF" strokeOpacity=".5" strokeDasharray="3 3" rx="2"/>
          <text x={obX+6} y={obYTop+12} fontSize="9" fill="#00D4FF"
            fontFamily="JetBrains Mono, monospace" letterSpacing=".06em">BEARISH OB</text>
        </g>
      )}

      <g>
        {candles.map((c, i) => {
          const up = c.close >= c.open;
          const cx = x(i);
          const yo = y(c.open), yc = y(c.close);
          const top = Math.min(yo, yc), bot = Math.max(yo, yc);
          const dur = animate ? 1.0 + (i / count) * 0.8 : 0;
          return (
            <g key={i} style={animate ? {
              opacity: 0,
              animation: `cIn .45s ease forwards`,
              animationDelay: `${(i/count)*0.9}s`
            } : null}>
              <line x1={cx} x2={cx} y1={y(c.high)} y2={y(c.low)}
                stroke={up ? '#00FF85' : '#FF3B5C'} strokeOpacity=".55" strokeWidth="1"/>
              <rect x={cx - bodyW/2} y={top} width={bodyW} height={Math.max(1, bot - top)}
                fill={up ? 'url(#up)' : 'url(#down)'} rx="0.5"/>
            </g>
          );
        })}
      </g>

      {ema && (
        <>
          <path d={emaPath(9, '#00D4FF')} fill="none" stroke="#00D4FF" strokeWidth="1.2" strokeOpacity=".75"/>
          <path d={emaPath(21, '#FFB547')} fill="none" stroke="#FFB547" strokeWidth="1.2" strokeOpacity=".7"/>
          <path d={emaPath(50, '#A0AABD')} fill="none" stroke="#A0AABD" strokeWidth="1.2" strokeOpacity=".5"/>
        </>
      )}
      {vwap && (
        <path d={vwapPath} fill="none" stroke="url(#vwapG)" strokeWidth="1.6" strokeDasharray="4 4"/>
      )}

      <style>{`@keyframes cIn { from{opacity:0; transform: translateY(6px)} to{opacity:1; transform:none} }`}</style>
    </svg>
  );
}

/* Ghost candle backdrop — wider, slower, faint. */
function GhostChart({ opacity = 0.18 }) {
  return (
    <div style={{position:'absolute',inset:0,pointerEvents:'none',
      maskImage:'radial-gradient(ellipse at 50% 60%, #000 35%, transparent 80%)',
      WebkitMaskImage:'radial-gradient(ellipse at 50% 60%, #000 35%, transparent 80%)'}}>
      <CandlesChart width={1600} height={760} count={140} seed={42} vol={42}
        vwap={true} ema={false} ob={false} ghostOpacity={opacity} animate={false}/>
    </div>
  );
}

/* Tiny sparkline used in stats / cards */
function Sparkline({ data, color='#00D4FF', width=120, height=32, fill=true }) {
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * width,
    height - ((v - min) / range) * height
  ]);
  const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const area = d + ` L ${width} ${height} L 0 ${height} Z`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {fill && <path d={area} fill={color} fillOpacity=".12"/>}
      <path d={d} fill="none" stroke={color} strokeWidth="1.4"/>
    </svg>
  );
}

window.CandlesChart = CandlesChart;
window.GhostChart = GhostChart;
window.Sparkline = Sparkline;
