/* All page sections except hero (which the App composes directly). */
const { useEffect: sUE, useState: sUS, useRef: sUR } = React;

/* Reveal-on-scroll observer */
function useReveal() {
  sUE(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
    }, { threshold: 0.12 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* Count up animation */
function CountUp({ to, suffix='', prefix='', decimals=0, duration=1400 }) {
  const [n, setN] = sUS(0);
  const ref = sUR(null);
  sUE(() => {
    const el = ref.current; if (!el) return;
    let started = false; let raf;
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && !started) {
          started = true;
          const t0 = performance.now();
          const tick = () => {
            const t = Math.min(1, (performance.now() - t0) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            setN(to * eased);
            if (t < 1) raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [to]);
  return <span ref={ref} className="num-tab">{prefix}{n.toLocaleString(undefined,{minimumFractionDigits:decimals,maximumFractionDigits:decimals})}{suffix}</span>;
}

/* ============== NAV ============== */
function Nav() {
  const [scrolled, setScrolled] = sUS(false);
  sUE(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <nav className={`nav ${scrolled?'scrolled':''}`}>
      <div className="container" style={{display:'flex',alignItems:'center',height:64,gap:24}}>
        <a href="#" style={{display:'flex',alignItems:'center',gap:10,minWidth:0}}>
          <Icon.Logo size={26}/>
          <span style={{fontWeight:700,letterSpacing:'-0.02em',fontSize:16}}>ScalTrade</span>
          <span className="mono" style={{
            marginLeft:6,fontSize:9,letterSpacing:'.18em',
            padding:'2px 6px',borderRadius:3,
            color:'var(--cyan)',border:'1px solid rgba(0,212,255,.3)',background:'rgba(0,212,255,.06)'
          }}>BETA</span>
        </a>
        <div style={{flex:1,display:'flex',justifyContent:'center',gap:28}} className="hide-md">
          {['Features','AI Mentor','Backtesting','Pricing','Docs'].map(t=>(
            <a key={t} href={`#${t.toLowerCase().replace(/\s+/g,'-')}`}
              style={{fontSize:14,color:'var(--muted)',transition:'color .15s'}}
              onMouseEnter={e=>e.currentTarget.style.color='#fff'}
              onMouseLeave={e=>e.currentTarget.style.color='var(--muted)'}
            >{t}</a>
          ))}
        </div>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <button className="btn btn-ghost btn-sm hide-sm">
            <span style={{width:6,height:6,borderRadius:'50%',background:'var(--green)',boxShadow:'0 0 6px var(--green)'}}/>
            Connect IBKR
          </button>
          <button className="btn btn-primary btn-sm">
            Get Early Access <Icon.ArrowRight size={14}/>
          </button>
        </div>
      </div>
      <style>{`
        @media (max-width: 960px){.hide-md{display:none!important}}
        @media (max-width: 560px){.hide-sm{display:none!important}}
      `}</style>
    </nav>
  );
}

/* ============== SOCIAL PROOF ============== */
function SocialProof() {
  const stats = [
    { icon: Icon.ChartBar, num: 12400, suffix: '+', label: 'Trades validated by AI Mentor', sub: 'live + replay' },
    { icon: Icon.Bolt, num: 8, prefix: '< ', suffix: 'ms', label: 'Avg IBKR execution latency', sub: 'p99 in NA-East' },
    { icon: Icon.Lock, num: 0, suffix: '', label: 'Look-ahead bias incidents', sub: 'Event-sourced backtests' },
  ];
  return (
    <section style={{background:'var(--surface-2)',borderTop:'1px solid var(--border)',borderBottom:'1px solid var(--border)'}}>
      <div className="container" style={{padding:'28px 32px'}}>
        <div style={{display:'flex',alignItems:'center',gap:32,flexWrap:'wrap'}}>
          <div style={{display:'flex',alignItems:'center',gap:18,minWidth:280}}>
            <div style={{display:'flex'}}>
              {['#7B61FF','#00D4FF','#00FF85','#FFB547','#FF3B5C'].map((c,i)=>(
                <div key={i} style={{
                  width:32,height:32,borderRadius:'50%',
                  background:`linear-gradient(135deg, ${c}, #1E2330)`,
                  border:'2px solid var(--surface-2)',
                  marginLeft:i===0?0:-10,
                  display:'grid',placeItems:'center',
                  fontFamily:'JetBrains Mono, monospace',fontSize:11,fontWeight:700,color:'#0A0C0F'
                }}>
                  {['AT','MD','SK','JR','LK'][i]}
                </div>
              ))}
            </div>
            <div>
              <div style={{fontSize:13,color:'#fff',fontWeight:500}}>Trusted by traders managing</div>
              <div className="mono" style={{fontSize:13,color:'var(--cyan)',marginTop:2}}>$2.4M+ in Futures positions</div>
            </div>
          </div>

          <div style={{flex:1,display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:24}}>
            {stats.map((s,i)=>{
              const I = s.icon;
              return (
                <div key={i} style={{display:'flex',alignItems:'center',gap:14,paddingLeft:24,borderLeft:'1px solid var(--border)'}}>
                  <div style={{width:32,height:32,borderRadius:8,background:'rgba(0,212,255,.06)',border:'1px solid rgba(0,212,255,.2)',display:'grid',placeItems:'center',color:'var(--cyan)'}}>
                    <I size={15}/>
                  </div>
                  <div>
                    <div className="mono" style={{fontSize:20,color:'#fff',fontWeight:600,letterSpacing:'-0.01em'}}>
                      <CountUp to={s.num} prefix={s.prefix||''} suffix={s.suffix||''}/>
                    </div>
                    <div style={{fontSize:12,color:'var(--muted)'}}>{s.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============== PROBLEM / SOLUTION ============== */
function ProblemSolution() {
  return (
    <section style={{padding:'120px 0'}}>
      <div className="container">
        <div className="reveal" style={{maxWidth:720,marginBottom:60}}>
          <div className="eyebrow">The discipline gap</div>
          <h2 style={{marginTop:14,fontSize:48,textWrap:'pretty'}}>You don't lack a strategy. <span style={{color:'var(--muted-2)'}}>You lack a referee.</span></h2>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:24}} className="ps-grid">
          {/* Problem */}
          <div className="reveal lift" style={{
            position:'relative',padding:'32px',borderRadius:16,
            background:'linear-gradient(180deg, rgba(255,59,92,.06) 0%, rgba(255,59,92,.0) 80%), var(--surface)',
            border:'1px solid rgba(255,59,92,.18)',
            overflow:'hidden'
          }}>
            <div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 100% 0%, rgba(255,59,92,.12), transparent 50%)',pointerEvents:'none'}}/>
            <div style={{position:'relative'}}>
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:20}}>
                <div style={{width:36,height:36,borderRadius:9,background:'rgba(255,59,92,.1)',border:'1px solid rgba(255,59,92,.3)',color:'var(--red)',display:'grid',placeItems:'center'}}>
                  <Icon.Broken size={18}/>
                </div>
                <span className="chip red">PROBLEM</span>
              </div>
              <h3 style={{fontSize:26,letterSpacing:'-0.02em',lineHeight:1.15,marginBottom:14}}>You have a strategy. <br/>You don't follow it.</h3>
              <p style={{fontSize:15}}>The market moves fast. You override your rules, revenge-trade after a losing streak, or miss the setup window because you were second-guessing. Every breach costs compounding returns.</p>

              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginTop:24}}>
                {[
                  ['Rule breaches / week','11.2'],
                  ['Avg revenge trades','3.4'],
                  ['Edge lost to override','-23%'],
                  ['Setups missed','38%'],
                ].map(([k,v],i)=>(
                  <div key={i} style={{padding:'12px 14px',background:'rgba(0,0,0,.25)',border:'1px solid var(--border)',borderRadius:8}}>
                    <div className="mono" style={{fontSize:10,letterSpacing:'.14em',color:'var(--muted-2)'}}>{k.toUpperCase()}</div>
                    <div className="mono" style={{fontSize:18,color:'var(--red)',marginTop:2}}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Solution */}
          <div className="reveal lift" style={{
            position:'relative',padding:'32px',borderRadius:16,
            background:'linear-gradient(180deg, rgba(0,212,255,.06) 0%, rgba(123,97,255,.04) 100%), var(--surface)',
            border:'1px solid rgba(0,212,255,.22)',
            overflow:'hidden'
          }}>
            <div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 100% 0%, rgba(0,212,255,.12), transparent 50%)',pointerEvents:'none'}}/>
            <div style={{position:'relative'}}>
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:20}}>
                <div style={{width:36,height:36,borderRadius:9,background:'rgba(0,212,255,.08)',border:'1px solid rgba(0,212,255,.3)',display:'grid',placeItems:'center',position:'relative'}}>
                  <Icon.ShieldCheck size={18} color="var(--cyan)"/>
                </div>
                <span className="chip cyan">SCALTRADE</span>
              </div>
              <h3 style={{fontSize:26,letterSpacing:'-0.02em',lineHeight:1.15,marginBottom:14}}>ScalTrade holds you accountable. <br/>In real time.</h3>
              <p style={{fontSize:15}}>Your AI Mentor reads your rules, reads the market, and flags every non-compliant trade <em style={{color:'#fff',fontStyle:'normal'}}>before</em> you click Send. Not after.</p>

              <div style={{display:'flex',flexDirection:'column',gap:10,marginTop:24}}>
                {[
                  ['Pre-trade rule check', '< 200ms'],
                  ['Strategy ingestion', 'RAG + Gemini'],
                  ['Validation surface', '12 dimensions'],
                  ['False-positive rate', '< 2%'],
                ].map(([k,v],i)=>(
                  <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 14px',background:'rgba(0,0,0,.25)',border:'1px solid var(--border)',borderRadius:8}}>
                    <span style={{fontSize:13,color:'var(--muted)'}}>{k}</span>
                    <span className="mono" style={{fontSize:13,color:'var(--cyan)'}}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`@media (max-width: 880px){.ps-grid{grid-template-columns:1fr!important}}`}</style>
    </section>
  );
}

/* ============== FEATURES ============== */
function FeatureCard({ icon:I, color, title, body, tags, accent }) {
  return (
    <div className="reveal lift" style={{
      padding:'28px',borderRadius:14,background:'var(--surface)',
      border:'1px solid var(--border)',
      display:'flex',flexDirection:'column',gap:14,height:'100%'
    }}>
      <div style={{
        width:40,height:40,borderRadius:10,
        background:`${color}14`,border:`1px solid ${color}55`,
        color, display:'grid',placeItems:'center'
      }}>
        <I size={20}/>
      </div>
      <h3 style={{fontSize:19,letterSpacing:'-0.02em',marginTop:6,textWrap:'balance'}}>{title}</h3>
      <p style={{fontSize:14}}>{body}</p>
      {tags && tags.length>0 && (
        <div style={{display:'flex',flexWrap:'wrap',gap:6,marginTop:'auto',paddingTop:10}}>
          {tags.map((t,i)=>(
            <span key={i} className={`chip ${accent||''}`}>{t}</span>
          ))}
        </div>
      )}
    </div>
  );
}

function Features() {
  const cards = [
    { icon: Icon.Brain, color:'#7B61FF', title:'A trading coach that never sleeps',
      body:'Built on Gemini with RAG + Event Sourcing. The Mentor validates each signal against your strategy rules, SMC structure, VWAP levels, and multi-timeframe alignment — and explains why.',
      tags:['AI-Powered','RAG','Gemini'], accent:'purple' },
    { icon: Icon.Plug, color:'#00D4FF', title:'One connection. Zero friction.',
      body:'Direct IB Gateway API bridge. Bracket orders, partial fills, reconnection handling. Monitor latency in real time. No middleware, no delay.',
      tags:['Interactive Brokers','< 8ms latency'], accent:'cyan' },
    { icon: Icon.Clock, color:'#00FF85', title:'Backtest like it\'s live',
      body:'Event Sourcing ensures your backtest engine never sees future data. Each bar closes exactly once. Your edge is real, or it isn\'t.',
      tags:['Event Sourcing','No Look-Ahead Bias'], accent:'green' },
    { icon: Icon.Layers, color:'#00D4FF', title:'When 1H and 10m agree, you trade',
      body:'Alerts are grouped by temporal alignment windows. When MNQ signals converge across timeframes, ScalTrade notifies you with full context — not pings.',
      tags:['Multi-Timeframe','MTF Alignment'], accent:'cyan' },
    { icon: Icon.Journal, color:'#7B61FF', title:'Relive every trade. Honestly.',
      body:'Each trade snapshot is stored as an immutable event. Go back to trade #705 and see exactly what the market looked like at 19:07:28. No revisionism.',
      tags:['Immutable Journal','Replay'], accent:'purple' },
    { icon: Icon.Gauge, color:'#FF3B5C', title:'Your risk, at a glance',
      body:'Margin Used, Available Buying Power, Max Daily Drawdown, and intraday vs overnight limits — all live, all in one panel. Hard stops are hard stops.',
      tags:['Risk Limits','Live Margin'], accent:'red' },
  ];
  return (
    <section id="features" style={{padding:'120px 0',position:'relative'}}>
      <div className="container">
        <div className="reveal" style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',gap:30,flexWrap:'wrap',marginBottom:48}}>
          <div style={{maxWidth:640}}>
            <div className="eyebrow">Core capability</div>
            <h2 style={{marginTop:14}}>Built like the desk you wish your prop shop had.</h2>
          </div>
          <p style={{maxWidth:380,fontSize:15}}>Six systems, one rulebook. Every component is event-sourced, observable, and answerable to the same Mentor that reviews your trades.</p>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(3, 1fr)',gap:18}} className="feat-grid">
          {cards.map((c,i)=> <FeatureCard key={i} {...c}/>)}
        </div>
      </div>
      <style>{`
        @media (max-width: 980px){.feat-grid{grid-template-columns:repeat(2,1fr)!important}}
        @media (max-width: 640px){.feat-grid{grid-template-columns:1fr!important}}
      `}</style>
    </section>
  );
}

/* ============== PRODUCT SCREENSHOT ============== */
function ProductShot() {
  return (
    <section style={{padding:'40px 0 120px'}}>
      <div className="container">
        <div className="reveal" style={{maxWidth:780,marginBottom:48}}>
          <div className="eyebrow">The workspace</div>
          <h2 style={{marginTop:14}}>One window. The market, your rules, and the AI watching both.</h2>
        </div>

        <div className="reveal" style={{position:'relative'}}>
          {/* glow */}
          <div style={{
            position:'absolute',inset:'-40px -10px',
            background:'radial-gradient(ellipse at 50% 0%, rgba(0,212,255,.18), transparent 60%), radial-gradient(ellipse at 50% 100%, rgba(123,97,255,.15), transparent 60%)',
            filter:'blur(30px)',pointerEvents:'none',zIndex:0
          }}/>
          <div style={{position:'relative',zIndex:1}}>
            <FullDashboardMock/>
          </div>
        </div>
        <p className="reveal" style={{textAlign:'center',marginTop:30,fontSize:14,color:'var(--muted-2)'}}>
          Designed for traders who think in <span style={{color:'#fff'}}>edge</span>, not luck.
        </p>
      </div>
    </section>
  );
}

/* ============== COMPARISON ============== */
function Compare() {
  const rows = [
    ['AI Trade Validation',     'check', 'x', 'x', 'x'],
    ['Native IBKR Bridge',      'check', 'x', 'check', 'check'],
    ['Event-Sourced Backtest',  'check', 'x', 'tilde', 'x'],
    ['Real-Time Mentor Chat',   'check', 'x', 'x', 'x'],
    ['Futures-First Design',    'check', 'tilde', 'check', 'check'],
    ['Zero Look-Ahead Bias',    'check', 'dash', 'tilde', 'x'],
  ];
  const sym = (s) => {
    if (s==='check') return <Icon.Check size={16} color="var(--green)"/>;
    if (s==='x') return <Icon.X size={14} color="var(--muted-2)"/>;
    if (s==='tilde') return <Icon.Tilde size={16} color="var(--amber)"/>;
    return <Icon.Dash size={16} color="var(--muted-2)"/>;
  };
  return (
    <section id="backtesting" style={{padding:'40px 0 120px'}}>
      <div className="container">
        <div className="reveal" style={{maxWidth:680,marginBottom:40}}>
          <div className="eyebrow">Honest comparison</div>
          <h2 style={{marginTop:14}}>Why pro traders chose ScalTrade.</h2>
          <p style={{marginTop:12,fontSize:15}}>We're not the biggest. We're the most accountable.</p>
        </div>

        <div className="reveal" style={{
          background:'var(--surface)',border:'1px solid var(--border)',borderRadius:14,
          overflow:'hidden'
        }}>
          <table className="cmp">
            <thead>
              <tr>
                <th></th>
                <th className="col-rd">
                  <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
                    <Icon.Logo size={20}/>
                    <span style={{color:'#fff',fontSize:13,fontFamily:'Inter,sans-serif',letterSpacing:'-0.01em',textTransform:'none'}}>ScalTrade</span>
                  </div>
                </th>
                <th>TradingView</th>
                <th>QuantConnect</th>
                <th>NinjaTrader</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r,i)=>(
                <tr key={i}>
                  <td>{r[0]}</td>
                  <td className="col-rd">{sym(r[1])}</td>
                  <td>{sym(r[2])}</td>
                  <td>{sym(r[3])}</td>
                  <td>{sym(r[4])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{display:'flex',gap:18,fontSize:12,color:'var(--muted-2)',marginTop:14,flexWrap:'wrap'}} className="mono">
          <span style={{display:'flex',alignItems:'center',gap:6}}><Icon.Check size={12} color="var(--green)"/> SUPPORTED</span>
          <span style={{display:'flex',alignItems:'center',gap:6}}><Icon.Tilde size={12} color="var(--amber)"/> PARTIAL</span>
          <span style={{display:'flex',alignItems:'center',gap:6}}><Icon.X size={11} color="var(--muted-2)"/> NOT SUPPORTED</span>
          <span style={{display:'flex',alignItems:'center',gap:6}}><Icon.Dash size={12} color="var(--muted-2)"/> N/A</span>
        </div>
      </div>
    </section>
  );
}

/* ============== TESTIMONIALS ============== */
function Testimonials() {
  const items = [
    { q:'The AI Mentor caught me about to overtrade after a losing streak. That single block saved me $1,200 in revenge trades.',
      who:'Alex T.', role:'ES Futures · Chicago', avatar:'AT', color:'#00D4FF' },
    { q:'I\'ve used NinjaTrader and TradingView for years. ScalTrade is the first platform that actually respects my strategy rules.',
      who:'Marcus D.', role:'MNQ Scalper · London', avatar:'MD', color:'#7B61FF' },
    { q:'The backtesting is honest. No tricks. Event Sourcing means what worked, really worked.',
      who:'Sarah K.', role:'Quant Trader · Paris', avatar:'SK', color:'#00FF85' },
  ];
  return (
    <section style={{padding:'40px 0 120px',background:'linear-gradient(180deg, transparent, rgba(123,97,255,.04), transparent)'}}>
      <div className="container">
        <div className="reveal" style={{maxWidth:680,marginBottom:48}}>
          <div className="eyebrow">From the desk</div>
          <h2 style={{marginTop:14}}>Used by people who watch every tick.</h2>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:18}} className="t-grid">
          {items.map((t,i)=>(
            <div key={i} className="reveal lift" style={{padding:'28px',borderRadius:14,background:'var(--surface)',border:'1px solid var(--border)'}}>
              <div style={{fontSize:32,color:'var(--cyan)',lineHeight:1,fontFamily:'JetBrains Mono'}}>“</div>
              <p style={{color:'#E6EBF5',fontSize:15,lineHeight:1.6,marginTop:8,marginBottom:24,textWrap:'pretty'}}>{t.q}</p>
              <div style={{display:'flex',alignItems:'center',gap:12,paddingTop:18,borderTop:'1px solid var(--border)'}}>
                <div style={{
                  width:36,height:36,borderRadius:'50%',
                  background:`linear-gradient(135deg, ${t.color}, #1E2330)`,
                  display:'grid',placeItems:'center',
                  fontFamily:'JetBrains Mono',fontWeight:700,fontSize:12,color:'#0A0C0F'
                }}>{t.avatar}</div>
                <div>
                  <div style={{fontSize:13,fontWeight:600}}>{t.who}</div>
                  <div className="mono" style={{fontSize:11,color:'var(--muted-2)',letterSpacing:'.06em'}}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 880px){.t-grid{grid-template-columns:1fr!important}}
      `}</style>
    </section>
  );
}

/* ============== PRICING ============== */
function Pricing() {
  const plans = [
    { name:'SOLO', price:'$79', sub:'/month', desc:'For 1 account',
      features:['Mentor: 50 reviews/day','Basic backtest engine','IBKR · 1 connection','Trade journal · 90 days','Email support'],
      cta:'Start free trial', ctaVar:'ghost', highlight:false },
    { name:'PRO', price:'$189', sub:'/month', desc:'Up to 3 accounts',
      features:['Mentor: Unlimited','Full backtest + replay','IBKR · 3 connections','Journal · unbounded','Multi-timeframe alerts','Priority support'],
      cta:'Start free trial', ctaVar:'primary', highlight:true,
      tag:'MOST CHOSEN' },
    { name:'INSTITUTIONAL', price:'Custom', sub:'', desc:'Unlimited accounts',
      features:['Everything in Pro','API access (REST + WS)','SSO · audit log · roles','SLA 99.95% uptime','Dedicated success engineer','Compliance hand-off pack'],
      cta:'Contact sales', ctaVar:'ghost', highlight:false },
  ];
  return (
    <section id="pricing" style={{padding:'40px 0 120px',position:'relative'}}>
      <div className="container">
        <div className="reveal" style={{textAlign:'center',maxWidth:640,margin:'0 auto 56px'}}>
          <div className="eyebrow" style={{justifyContent:'center'}}>Pricing</div>
          <h2 style={{marginTop:14}}>Priced for serious traders.</h2>
          <p style={{marginTop:12,fontSize:15}}>14-day free trial on Solo and Pro. No credit card required. Cancel any time before your first live signal.</p>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:18,alignItems:'stretch'}} className="p-grid">
          {plans.map((p,i)=>(
            <div key={i} className="reveal" style={{
              position:'relative',padding:'32px 28px',borderRadius:16,
              background: p.highlight
                ? 'linear-gradient(180deg, rgba(0,212,255,.08), rgba(123,97,255,.04)), var(--surface)'
                : 'var(--surface)',
              border:`1px solid ${p.highlight?'rgba(0,212,255,.45)':'var(--border)'}`,
              boxShadow: p.highlight ? '0 0 0 1px rgba(0,212,255,.25), 0 30px 80px -20px rgba(0,212,255,.25)' : 'none',
              transform: p.highlight?'translateY(-6px)':'none',
              display:'flex',flexDirection:'column'
            }}>
              {p.tag && (
                <div style={{
                  position:'absolute',top:-12,left:'50%',transform:'translateX(-50%)',
                  padding:'4px 10px',borderRadius:999,
                  background:'linear-gradient(180deg, #25E0FF, #00B8E6)',
                  color:'#001019',fontFamily:'JetBrains Mono',fontSize:10,fontWeight:700,letterSpacing:'.14em'
                }}>{p.tag}</div>
              )}
              <div className="mono" style={{fontSize:11,letterSpacing:'.2em',color: p.highlight?'var(--cyan)':'var(--muted-2)',marginBottom:14}}>{p.name}</div>
              <div style={{display:'flex',alignItems:'baseline',gap:6}}>
                <div style={{fontSize:48,fontWeight:700,letterSpacing:'-0.03em',color:'#fff'}}>{p.price}</div>
                <div style={{color:'var(--muted)',fontSize:14}}>{p.sub}</div>
              </div>
              <div style={{fontSize:13,color:'var(--muted)',marginTop:4}}>{p.desc}</div>

              <div style={{height:1,background:'var(--border)',margin:'24px 0'}}/>

              <ul style={{listStyle:'none',padding:0,margin:0,display:'flex',flexDirection:'column',gap:12,flex:1}}>
                {p.features.map((f,j)=>(
                  <li key={j} style={{display:'flex',gap:10,fontSize:13.5,color:'#D7DCEA',alignItems:'flex-start'}}>
                    <span style={{
                      width:18,height:18,borderRadius:'50%',
                      background:p.highlight?'rgba(0,212,255,.15)':'rgba(255,255,255,.05)',
                      color:p.highlight?'var(--cyan)':'var(--green)',
                      display:'grid',placeItems:'center',flex:'0 0 auto',marginTop:1
                    }}>
                      <Icon.Check size={11}/>
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <button className={`btn ${p.ctaVar==='primary'?'btn-primary':'btn-ghost'}`} style={{marginTop:28,justifyContent:'center'}}>
                {p.cta} {p.ctaVar==='primary' && <Icon.ArrowRight size={14}/>}
              </button>
            </div>
          ))}
        </div>

        <p className="reveal" style={{textAlign:'center',marginTop:36,fontSize:13,color:'var(--muted-2)'}}>
          Pricing in USD. IBKR account required to connect live trading. Backtesting and Mentor work without a broker connected.
        </p>
      </div>
      <style>{`
        @media (max-width: 980px){.p-grid{grid-template-columns:1fr!important}}
      `}</style>
    </section>
  );
}

/* ============== FINAL CTA ============== */
function FinalCTA() {
  return (
    <section style={{position:'relative',padding:'120px 0',overflow:'hidden'}}>
      <div className="grid-bg" style={{position:'absolute',inset:0,opacity:.5,maskImage:'radial-gradient(ellipse at center, #000 30%, transparent 75%)',WebkitMaskImage:'radial-gradient(ellipse at center, #000 30%, transparent 75%)'}}/>
      <div style={{position:'absolute',inset:0,opacity:.18}}>
        <CandlesChart width={1600} height={500} count={140} seed={71} vol={45} ghostOpacity={1} animate={false}/>
      </div>
      <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 50% 100%, rgba(0,212,255,.15), transparent 60%), radial-gradient(ellipse at 50% 0%, rgba(123,97,255,.1), transparent 60%)'}}/>

      <div className="container" style={{position:'relative',textAlign:'center',maxWidth:780}}>
        <div className="reveal">
          <div className="eyebrow" style={{justifyContent:'center'}}>Waitlist · Early Q3</div>
          <h2 style={{marginTop:18,fontSize:62,letterSpacing:'-0.035em',lineHeight:1.02,textWrap:'balance'}}>
            Stop trading <span style={{color:'var(--muted-2)'}}>against</span> yourself.
          </h2>
          <p style={{marginTop:18,fontSize:18,maxWidth:480,margin:'18px auto 0'}}>Join the waitlist. Your AI Mentor is ready when you are.</p>

          <div style={{display:'flex',gap:10,justifyContent:'center',marginTop:32,flexWrap:'wrap'}}>
            <div style={{
              display:'flex',alignItems:'center',gap:8,
              background:'var(--surface)',border:'1px solid var(--border)',borderRadius:10,
              padding:'4px 4px 4px 16px',
              boxShadow:'0 0 0 1px rgba(0,212,255,.2), 0 20px 60px -20px rgba(0,212,255,.4)'
            }}>
              <input placeholder="trader@yourdesk.com" style={{
                background:'transparent',border:'none',outline:'none',color:'#fff',
                fontSize:14,fontFamily:'inherit',padding:'10px 8px',width:260
              }}/>
              <button className="btn btn-primary">Get Early Access <Icon.ArrowRight size={14}/></button>
            </div>
          </div>

          <div style={{display:'flex',gap:24,justifyContent:'center',marginTop:24,flexWrap:'wrap',fontSize:12,color:'var(--muted-2)'}} className="mono">
            <span style={{display:'flex',alignItems:'center',gap:6}}><Icon.Check size={12} color="var(--green)"/> No credit card required</span>
            <span style={{display:'flex',alignItems:'center',gap:6}}><Icon.Lock size={12}/> SOC 2 Type II in progress</span>
            <span style={{display:'flex',alignItems:'center',gap:6}}><Icon.Plug size={12} color="var(--cyan)"/> IBKR account required for live</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============== FOOTER ============== */
function Footer() {
  const cols = [
    ['Product', ['Features','AI Mentor','Backtesting','Risk Dashboard','Pricing','Changelog']],
    ['Resources', ['Docs','API Reference','Strategy Library','Backtest Methodology','Status','Security']],
    ['Company', ['About','Manifesto','Careers','Press kit','Contact']],
    ['Legal', ['Terms','Privacy','Cookie policy','Disclosure','Risk warning']],
  ];
  return (
    <footer style={{borderTop:'1px solid var(--border)',padding:'72px 0 36px',background:'#08090C'}}>
      <div className="container">
        <div style={{display:'grid',gridTemplateColumns:'1.4fr 1fr 1fr 1fr 1fr',gap:32}} className="f-grid">
          <div>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <Icon.Logo size={28}/>
              <span style={{fontWeight:700,letterSpacing:'-0.02em',fontSize:17}}>ScalTrade</span>
            </div>
            <p style={{marginTop:14,fontSize:13.5,maxWidth:300}}>An AI-mentored Futures workspace for traders who would rather be correct than busy.</p>
            <div style={{display:'flex',gap:10,marginTop:20}}>
              {[Icon.XSocial, Icon.GH, Icon.Linked].map((I,i)=>(
                <a key={i} href="#" style={{
                  width:34,height:34,borderRadius:8,
                  display:'grid',placeItems:'center',
                  border:'1px solid var(--border)',color:'var(--muted)',transition:'all .15s'
                }}
                  onMouseEnter={e=>{e.currentTarget.style.color='#fff';e.currentTarget.style.borderColor='var(--border-strong)'}}
                  onMouseLeave={e=>{e.currentTarget.style.color='var(--muted)';e.currentTarget.style.borderColor='var(--border)'}}
                ><I size={15}/></a>
              ))}
            </div>
          </div>
          {cols.map(([title, items])=>(
            <div key={title}>
              <div className="mono" style={{fontSize:11,letterSpacing:'.18em',color:'var(--muted-2)',marginBottom:14}}>{title.toUpperCase()}</div>
              <ul style={{listStyle:'none',padding:0,margin:0,display:'flex',flexDirection:'column',gap:10}}>
                {items.map(it=>(
                  <li key={it}><a href="#" style={{fontSize:13.5,color:'#D7DCEA',transition:'color .15s'}}
                    onMouseEnter={e=>e.currentTarget.style.color='var(--cyan)'}
                    onMouseLeave={e=>e.currentTarget.style.color='#D7DCEA'}
                  >{it}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="hr" style={{margin:'56px 0 24px'}}/>
        <div style={{display:'flex',justifyContent:'space-between',gap:20,flexWrap:'wrap',fontSize:12,color:'var(--muted-2)'}} className="mono">
          <div>© 2025 ScalTrade · Built for traders, by traders.</div>
          <div style={{display:'flex',gap:18}}>
            <span style={{display:'flex',alignItems:'center',gap:6}}>
              <span className="pulse-dot" style={{width:6,height:6,background:'var(--green)',borderRadius:'50%'}}/>
              All systems operational
            </span>
            <span>v1.4.7</span>
            <span>NA-East · CME</span>
          </div>
        </div>
        <div style={{marginTop:20,fontSize:11,color:'var(--muted-2)',lineHeight:1.6,maxWidth:920}}>
          Trading futures involves substantial risk and is not suitable for every investor. Past performance is not indicative of future results.
          ScalTrade is a software platform; it is not a broker, advisor, or fiduciary. Interactive Brokers is a registered trademark of Interactive Brokers LLC. ScalTrade is not affiliated with Interactive Brokers.
        </div>
      </div>
      <style>{`
        @media (max-width: 980px){.f-grid{grid-template-columns:1fr 1fr 1fr!important}}
        @media (max-width: 640px){.f-grid{grid-template-columns:1fr 1fr!important}}
      `}</style>
    </footer>
  );
}

window.useReveal = useReveal;
window.Nav = Nav;
window.SocialProof = SocialProof;
window.ProblemSolution = ProblemSolution;
window.Features = Features;
window.ProductShot = ProductShot;
window.Compare = Compare;
window.Testimonials = Testimonials;
window.Pricing = Pricing;
window.FinalCTA = FinalCTA;
window.Footer = Footer;
