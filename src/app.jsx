/* App entry: hero + composition + Tweaks. */
const { useEffect: aUE, useState: aUS } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "cyan",
  "ghostOpacity": 0.18,
  "density": "comfy",
  "animateChart": true,
  "headlineMode": "split"
}/*EDITMODE-END*/;

const ACCENTS = {
  cyan:   { primary:'#00D4FF', secondary:'#7B61FF' },
  emerald:{ primary:'#00FF85', secondary:'#00D4FF' },
  violet: { primary:'#A78BFA', secondary:'#00D4FF' },
  amber:  { primary:'#FFB547', secondary:'#FF3B5C' },
};

function Hero({ ghostOpacity, animateChart, headlineMode }) {
  const headlines = {
    split: ['Your AI Mentor.','Your Edge.','Real Futures.'],
    rules: ['Rules in.','Discipline out.','Real Futures.'],
    edge:  ['Trade your edge.','Not your impulses.','Real Futures.'],
  };
  const lines = headlines[headlineMode] || headlines.split;
  return (
    <section style={{position:'relative',padding:'80px 0 100px',overflow:'hidden'}}>
      <div className="grid-bg" style={{position:'absolute',inset:0,opacity:.6}}/>
      <div style={{position:'absolute',inset:0}}>
        <div style={{position:'absolute',inset:0,opacity:ghostOpacity}}>
          <CandlesChart width={1600} height={760} count={140} seed={42} vol={42}
            vwap={true} ema={false} ob={false} ghostOpacity={1} animate={false}/>
        </div>
      </div>
      <div style={{position:'absolute',inset:0,background:
        'radial-gradient(ellipse 60% 50% at 30% 30%, rgba(0,212,255,.10), transparent 60%),'+
        'radial-gradient(ellipse 50% 50% at 80% 20%, rgba(123,97,255,.10), transparent 60%),'+
        'linear-gradient(180deg, transparent 0%, rgba(10,12,15,.5) 70%, var(--bg) 100%)'
      }}/>

      <div className="container" style={{position:'relative',display:'grid',gridTemplateColumns:'1.05fr 1fr',gap:64,alignItems:'center'}} >
        <div className="hero-grid" style={{display:'contents'}}>
          {/* Left: Copy */}
          <div className="reveal in">
            <div className="eyebrow" style={{marginBottom:18}}>
              <span>v1.4 · NEW · MNQ + ES + CL coverage</span>
            </div>
            <h1 style={{
              fontSize:'clamp(40px, 6.2vw, 76px)',
              fontWeight:800,letterSpacing:'-0.04em',lineHeight:1.0,
              color:'#fff',textWrap:'balance'
            }}>
              {lines.map((l,i)=>(
                <span key={i} style={{display:'block',
                  background: i===2 ? 'linear-gradient(180deg,#fff 0%, #A0AABD 110%)' : 'none',
                  WebkitBackgroundClip: i===2?'text':'unset',
                  WebkitTextFillColor: i===2?'transparent':'inherit',
                }}>{l}</span>
              ))}
            </h1>
            <p style={{fontSize:18,marginTop:24,maxWidth:520,color:'#A0AABD',lineHeight:1.5}}>
              ScalTrade connects directly to Interactive Brokers to validate every trade against your strategy — in real time. <span style={{color:'#fff'}}>Stop reacting. Start trading with discipline.</span>
            </p>
            <div style={{display:'flex',gap:12,marginTop:32,flexWrap:'wrap'}}>
              <button className="btn btn-primary" style={{padding:'14px 22px',fontSize:15}} onClick={goWaitlist}>
                Get Early Access <Icon.ArrowRight size={15}/>
              </button>
              <button className="btn btn-ghost" style={{padding:'14px 20px',fontSize:15}}>
                <Icon.Play size={12} color="#fff"/> Watch demo
              </button>
            </div>
            <div style={{display:'flex',gap:18,marginTop:32,flexWrap:'wrap',fontSize:12,color:'var(--muted-2)'}} className="mono">
              <span style={{display:'flex',alignItems:'center',gap:6}}>
                <span className="pulse-dot" style={{width:7,height:7,borderRadius:'50%',background:'var(--green)'}}/>
                CME · LIVE FEED
              </span>
              <span>· IBKR Native</span>
              <span>· Event Sourced</span>
              <span>· No look-ahead bias</span>
            </div>
          </div>

          {/* Right: Split mockup */}
          <div className="reveal in" style={{position:'relative'}}>
            <div style={{
              position:'absolute',inset:'-40px -20px',
              background:'radial-gradient(ellipse at 70% 30%, rgba(0,212,255,.18), transparent 60%), radial-gradient(ellipse at 30% 80%, rgba(123,97,255,.15), transparent 60%)',
              filter:'blur(30px)', pointerEvents:'none'
            }}/>
            <div style={{position:'relative',display:'flex',flexDirection:'column',gap:14}}>
              <div style={{transform:'translateX(-12px)'}}><HeroChartPanel/></div>
              <div style={{transform:'translateX(28px)'}}><HeroMentorPanel/></div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1080px){
          section .hero-grid{display:contents}
          section > .container{grid-template-columns:1fr!important}
        }
      `}</style>
    </section>
  );
}

function App() {
  // Production: tweaks panel removed. Freeze the design defaults so the
  // rendered output matches the prototype's initial state pixel-for-pixel.
  const tweaks = TWEAK_DEFAULTS;
  useReveal();

  // Hide preloader
  aUE(() => {
    const t = setTimeout(() => {
      document.getElementById('preload')?.classList.add('gone');
    }, 350);
    return () => clearTimeout(t);
  }, []);

  // Apply accent colors via CSS vars
  aUE(() => {
    const a = ACCENTS[tweaks.accent] || ACCENTS.cyan;
    document.documentElement.style.setProperty('--cyan', a.primary);
    document.documentElement.style.setProperty('--purple', a.secondary);
  }, [tweaks.accent]);

  // Apply density
  aUE(() => {
    document.documentElement.style.setProperty('--space-scale', tweaks.density==='compact'?'.85':'1');
  }, [tweaks.density]);

  return (
    <>
      <Nav/>
      <Hero ghostOpacity={tweaks.ghostOpacity} animateChart={tweaks.animateChart} headlineMode={tweaks.headlineMode}/>
      <SocialProof/>
      <ProblemSolution/>
      <Features/>
      <ProductShot/>
      <Compare/>
      <Testimonials/>
      <Pricing/>
      <FinalCTA/>
      <Footer/>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
