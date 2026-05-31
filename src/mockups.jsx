/* Product mockup pieces: terminal chrome, dashboard, AI mentor chat */
const { useEffect: mUE, useState: mUS, useRef: mUR } = React;

function TerminalChrome({ children, title = 'ScalTrade · MNQ — 1m', tag = 'LIVE', pad = true }) {
  return (
    <div style={{
      borderRadius: 14, border: '1px solid var(--border)',
      background: 'linear-gradient(180deg, #0F1218 0%, #0B0E13 100%)',
      boxShadow: '0 40px 80px -30px rgba(0,0,0,.7), 0 0 0 1px rgba(255,255,255,.02) inset',
      overflow: 'hidden',
    }}>
      <div style={{
        display:'flex',alignItems:'center',gap:12,
        padding:'10px 14px',borderBottom:'1px solid var(--border)',
        background:'#0C0F14'
      }}>
        <div style={{display:'flex',gap:6}}>
          <span style={{width:10,height:10,borderRadius:'50%',background:'#FF5F57'}}/>
          <span style={{width:10,height:10,borderRadius:'50%',background:'#FEBC2E'}}/>
          <span style={{width:10,height:10,borderRadius:'50%',background:'#28C840'}}/>
        </div>
        <div className="mono" style={{fontSize:11,color:'#6B7589',letterSpacing:'.06em',flex:1,textAlign:'center'}}>{title}</div>
        <div className="mono" style={{
          fontSize:10,color:'var(--green)',
          padding:'3px 8px',border:'1px solid rgba(0,255,133,.3)',
          borderRadius:4,letterSpacing:'.18em',display:'flex',alignItems:'center',gap:6
        }}>
          <span className="pulse-dot" style={{width:6,height:6,borderRadius:'50%',background:'var(--green)'}}/>
          {tag}
        </div>
      </div>
      <div style={pad ? {padding:0} : {padding:0}}>{children}</div>
    </div>
  );
}

function PriceTicker({ price = 19243.75, change = +47.25, pct = +0.24 }) {
  return (
    <div style={{display:'flex',alignItems:'baseline',gap:14}}>
      <div className="mono" style={{fontSize:28,fontWeight:600,color:'#fff',letterSpacing:'-0.02em'}}>
        {price.toLocaleString(undefined,{minimumFractionDigits:2})}
      </div>
      <div className="mono" style={{color:change>=0?'var(--green)':'var(--red)',fontSize:13}}>
        {change>=0?'▲':'▼'} {Math.abs(change).toFixed(2)} ({pct>=0?'+':''}{pct.toFixed(2)}%)
      </div>
    </div>
  );
}

/* ========== HERO LEFT: live chart panel ========== */
function HeroChartPanel() {
  return (
    <TerminalChrome title="MNQ · DEC25 · 1m  ·  CME">
      <div style={{padding:'14px 16px 0'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:12}}>
          <div>
            <div className="mono" style={{fontSize:10,letterSpacing:'.18em',color:'var(--muted-2)'}}>MICRO E-MINI NASDAQ-100</div>
            <PriceTicker/>
          </div>
          <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:6}}>
            <span className="chip green"><span style={{width:6,height:6,background:'var(--green)',borderRadius:'50%'}}/>P&amp;L &nbsp;<span className="mono">+$347.50</span></span>
            <span className="chip"><span className="mono">VOL 12,847</span></span>
          </div>
        </div>

        <div style={{display:'flex',gap:10,marginTop:10,flexWrap:'wrap'}}>
          {['1m','5m','15m','1H','4H','1D'].map((t,i)=>(
            <span key={t} className="mono" style={{
              fontSize:11,padding:'3px 8px',borderRadius:4,
              background:i===0?'rgba(0,212,255,.1)':'transparent',
              color:i===0?'var(--cyan)':'var(--muted)',
              border:`1px solid ${i===0?'rgba(0,212,255,.3)':'transparent'}`
            }}>{t}</span>
          ))}
          <span style={{flex:1}}/>
          <span className="mono" style={{fontSize:11,color:'var(--muted-2)'}}>VWAP · EMA 9/21/50 · OB</span>
        </div>
      </div>

      <div style={{height:240,position:'relative',marginTop:8}}>
        <CandlesChart width={620} height={240} count={62} seed={11} base={19200} vol={28}
          vwap ema ob/>
        {/* price label */}
        <div style={{position:'absolute',right:8,top:'42%',
          background:'rgba(0,212,255,.12)',border:'1px solid rgba(0,212,255,.4)',
          padding:'2px 8px',borderRadius:3,fontSize:11}}
          className="mono">
          <span style={{color:'var(--cyan)'}}>19,243.75</span>
        </div>
      </div>

      <div style={{
        display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:1,
        background:'var(--border)',borderTop:'1px solid var(--border)'
      }}>
        {[
          ['HIGH','19,287.25'],
          ['LOW','19,156.50'],
          ['BID','19,243.50','green'],
          ['ASK','19,244.00','red'],
        ].map(([k,v,c],i)=>(
          <div key={i} style={{background:'#0C0F14',padding:'10px 12px'}}>
            <div className="mono" style={{fontSize:9,letterSpacing:'.18em',color:'var(--muted-2)'}}>{k}</div>
            <div className="mono" style={{fontSize:13,color: c==='green'?'var(--green)':c==='red'?'var(--red)':'#fff',marginTop:2}}>{v}</div>
          </div>
        ))}
      </div>
    </TerminalChrome>
  );
}

/* ========== HERO RIGHT: AI Mentor chat ========== */
function MentorMsg({ kind = 'mentor', children, badge, time }) {
  const isUser = kind === 'user';
  const isAlert = kind === 'alert';
  return (
    <div style={{display:'flex',flexDirection:'column',gap:4,marginBottom:14, alignItems:isUser?'flex-end':'flex-start'}}>
      {!isUser && (
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <div style={{
            width:22,height:22,borderRadius:6,
            background:isAlert?'linear-gradient(135deg,#FF3B5C,#FF6E84)':'linear-gradient(135deg,#7B61FF,#00D4FF)',
            display:'grid',placeItems:'center',color:'#fff',fontSize:11,fontWeight:700
          }}>{isAlert?'!':'AI'}</div>
          <div className="mono" style={{fontSize:11,color:'var(--muted-2)',letterSpacing:'.06em'}}>
            {isAlert?'ScalTrade · ALERT':'AI Mentor'} · {time||'14:07:28'}
          </div>
          {badge}
        </div>
      )}
      <div style={{
        maxWidth:'92%',
        padding:'10px 12px',borderRadius:10,
        background: isUser ? 'rgba(0,212,255,.07)'
                  : isAlert ? 'rgba(255,59,92,.06)'
                  : 'rgba(255,255,255,.02)',
        border:`1px solid ${isUser?'rgba(0,212,255,.18)':isAlert?'rgba(255,59,92,.25)':'var(--border)'}`,
        color: isAlert?'#FFD9DF':'#E6EBF5',
        fontSize:13.5, lineHeight:1.55,
      }}>
        {children}
      </div>
    </div>
  );
}

function HeroMentorPanel() {
  return (
    <TerminalChrome title="AI MENTOR · STRATEGY: MNQ_SMC_v3" tag="THINKING">
      <div style={{padding:'14px 16px',display:'flex',flexDirection:'column',gap:0,height:418,overflow:'hidden',position:'relative'}}>

        <MentorMsg kind="user" time="14:06:51">
          Looking at MNQ short here below 19,250. EMA stack bearish.
        </MentorMsg>

        <MentorMsg kind="alert" time="14:07:28"
          badge={<span className="chip red" style={{padding:'2px 6px'}}>NON-COMPLIANT</span>}>
          <strong style={{color:'#fff'}}>⚠ Bearish Order Block ignored.</strong><br/>
          Price entered the 19,238–19,252 OB without rejection.
          Your rules require a confirmed <span className="mono" style={{color:'#fff'}}>retest</span> above
          <span className="mono" style={{color:'#fff'}}> 19,240</span> before a short entry.
        </MentorMsg>

        <MentorMsg time="14:07:30">
          Hold. 1H trend is up; 10m momentum is weakening but not flipped.
          Wait for displacement candle close below 19,232 — that's your trigger.
        </MentorMsg>

        <div style={{
          marginTop:'auto',padding:'10px 12px',borderRadius:10,
          background:'#0C0F14',border:'1px solid var(--border)',
          display:'flex',alignItems:'center',gap:10
        }}>
          <span className="mono" style={{fontSize:11,color:'var(--muted-2)'}}>›</span>
          <span style={{flex:1,fontSize:13,color:'var(--muted)'}}>Ask the Mentor or paste a setup…</span>
          <span className="mono" style={{
            fontSize:10,padding:'3px 6px',border:'1px solid var(--border)',borderRadius:4,
            color:'var(--muted-2)'
          }}>⌘ K</span>
        </div>
      </div>
    </TerminalChrome>
  );
}

/* ========== Full product screenshot (Section 6) ========== */
function FullDashboardMock() {
  return (
    <TerminalChrome title="scaltrade.app · workspace://default" tag="LIVE">
      <div style={{display:'grid',gridTemplateColumns:'56px 1fr 380px',height:540,background:'#0A0C0F'}}>
        {/* Sidebar */}
        <div style={{borderRight:'1px solid var(--border)',padding:'16px 0',display:'flex',flexDirection:'column',alignItems:'center',gap:18,background:'#0B0E13'}}>
          <Icon.Logo size={28}/>
          {[Icon.ChartBar,Icon.Brain,Icon.Layers,Icon.Journal,Icon.Gauge,Icon.Lock].map((I,i)=>(
            <div key={i} style={{
              width:32,height:32,borderRadius:8,display:'grid',placeItems:'center',
              background:i===0?'rgba(0,212,255,.1)':'transparent',
              color:i===0?'var(--cyan)':'var(--muted-2)',
              border:`1px solid ${i===0?'rgba(0,212,255,.25)':'transparent'}`
            }}><I size={16}/></div>
          ))}
        </div>

        {/* Chart workspace */}
        <div style={{display:'flex',flexDirection:'column',borderRight:'1px solid var(--border)'}}>
          <div style={{padding:'12px 18px',borderBottom:'1px solid var(--border)',display:'flex',gap:18,alignItems:'center'}}>
            <div>
              <div className="mono" style={{fontSize:10,color:'var(--muted-2)',letterSpacing:'.16em'}}>MNQ DEC25 · 1m</div>
              <PriceTicker price={19243.75} change={47.25} pct={0.24}/>
            </div>
            <div style={{display:'flex',gap:6,marginLeft:'auto',flexWrap:'wrap'}}>
              <span className="chip cyan">VWAP</span>
              <span className="chip">EMA 9/21/50</span>
              <span className="chip cyan">ORDER BLOCKS</span>
              <span className="chip purple">SMC</span>
            </div>
          </div>
          <div style={{flex:1,position:'relative',padding:'8px 4px'}}>
            <CandlesChart width={760} height={400} count={90} seed={3} base={19200} vol={36}
              vwap ema ob showAxes/>
            {/* Floating tooltip */}
            <div style={{
              position:'absolute',left:18,top:18,
              background:'rgba(11,14,19,.85)',border:'1px solid var(--border)',
              borderRadius:8,padding:'8px 10px',fontSize:11,minWidth:160,backdropFilter:'blur(10px)'
            }} className="mono">
              <div style={{color:'var(--muted-2)',marginBottom:4}}>14:07:28 · 1m</div>
              <div style={{display:'flex',justifyContent:'space-between'}}><span style={{color:'var(--muted)'}}>O</span><span>19,241.25</span></div>
              <div style={{display:'flex',justifyContent:'space-between'}}><span style={{color:'var(--muted)'}}>H</span><span style={{color:'var(--green)'}}>19,247.00</span></div>
              <div style={{display:'flex',justifyContent:'space-between'}}><span style={{color:'var(--muted)'}}>L</span><span style={{color:'var(--red)'}}>19,238.50</span></div>
              <div style={{display:'flex',justifyContent:'space-between'}}><span style={{color:'var(--muted)'}}>C</span><span>19,243.75</span></div>
              <div style={{display:'flex',justifyContent:'space-between',borderTop:'1px solid var(--border)',marginTop:6,paddingTop:6}}>
                <span style={{color:'var(--cyan)'}}>VWAP</span><span style={{color:'var(--cyan)'}}>19,219.42</span>
              </div>
            </div>
          </div>
          {/* Bottom strip */}
          <div style={{
            display:'flex',gap:18,padding:'10px 16px',borderTop:'1px solid var(--border)',
            background:'#0B0E13',alignItems:'center',fontSize:12
          }} className="mono">
            <span style={{display:'flex',alignItems:'center',gap:6,color:'var(--green)'}}>
              <span className="pulse-dot" style={{width:7,height:7,background:'var(--green)',borderRadius:'50%'}}/>
              IBKR · CONNECTED
            </span>
            <span style={{color:'var(--muted)'}}>LATENCY <span style={{color:'#fff'}}>6ms</span></span>
            <span style={{color:'var(--muted)'}}>P&amp;L <span style={{color:'var(--green)'}}>+$347.50</span></span>
            <span style={{color:'var(--muted)'}}>POS <span style={{color:'#fff'}}>+2 MNQ</span></span>
            <span style={{flex:1}}/>
            <span style={{color:'var(--muted-2)'}}>v1.4.7 · event #38,492</span>
          </div>
        </div>

        {/* Mentor side panel */}
        <div style={{display:'flex',flexDirection:'column',background:'#0B0E13'}}>
          <div style={{padding:'12px 14px',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',gap:8}}>
            <div style={{width:24,height:24,borderRadius:6,background:'linear-gradient(135deg,#7B61FF,#00D4FF)',display:'grid',placeItems:'center',fontSize:11,fontWeight:700,color:'#fff'}}>AI</div>
            <div>
              <div style={{fontSize:13,fontWeight:600}}>AI Mentor</div>
              <div className="mono" style={{fontSize:10,color:'var(--muted-2)'}}>MNQ_SMC_v3 · 1H+10m aligned</div>
            </div>
            <span className="chip green" style={{marginLeft:'auto'}}>WATCHING</span>
          </div>

          <div style={{flex:1,padding:'14px 14px',overflow:'hidden'}}>
            <MentorMsg time="14:02:15"
              badge={<span className="chip green" style={{padding:'2px 6px'}}>TRADE OK ✓</span>}>
              Long MNQ at 19,212. Inside 1H demand zone, EMA9 reclaim, VWAP rising. <strong style={{color:'#fff'}}>All rules satisfied.</strong>
            </MentorMsg>
            <MentorMsg kind="alert" time="14:07:28"
              badge={<span className="chip red" style={{padding:'2px 6px'}}>NON-COMPLIANT ✗</span>}>
              Short attempt blocked. Bearish OB requires retest above 19,240 first.
            </MentorMsg>
            <MentorMsg time="14:09:02"
              badge={<span className="chip cyan" style={{padding:'2px 6px'}}>WAITING</span>}>
              Holding flat. Watching displacement on 10m close below 19,232.
            </MentorMsg>
          </div>

          <div style={{padding:'10px 12px',borderTop:'1px solid var(--border)',display:'flex',gap:8,alignItems:'center'}}>
            <span className="mono" style={{fontSize:11,color:'var(--muted-2)'}}>›</span>
            <span style={{flex:1,fontSize:12,color:'var(--muted)'}}>Ask Mentor…</span>
            <span className="mono" style={{fontSize:10,padding:'2px 5px',border:'1px solid var(--border)',borderRadius:3,color:'var(--muted-2)'}}>⌘K</span>
          </div>
        </div>
      </div>
    </TerminalChrome>
  );
}

window.TerminalChrome = TerminalChrome;
window.HeroChartPanel = HeroChartPanel;
window.HeroMentorPanel = HeroMentorPanel;
window.FullDashboardMock = FullDashboardMock;
window.MentorMsg = MentorMsg;
window.PriceTicker = PriceTicker;
