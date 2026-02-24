import { useState, useRef, useCallback, useEffect } from "react";
import * as XLSX from "xlsx";

/* ═══════════════════════════════════════════════════════════════════
   DESIGN SYSTEM — Enterprise FinTech Light Theme
   ═══════════════════════════════════════════════════════════════════ */
var C={bg:"#FFFFFF",surface:"#F8FAFC",surfaceHi:"#F1F5F9",border:"#E2E8F0",borderHi:"#CBD5E1",text:"#0F172A",textMuted:"#334155",textDim:"#64748B",accent:"#4F46E5",accentMuted:"#6366F1",positive:"#059669",negative:"#DC2626",warning:"#D97706",gold:"#92400E"};
var F={sans:"'Inter',-apple-system,system-ui,sans-serif",mono:"'JetBrains Mono','SF Mono',ui-monospace,monospace"};
/* ═══════════════════════════════════════════════════════════════════
   MARKDOWN RENDERER — Enterprise Light
   ═══════════════════════════════════════════════════════════════════ */
function Md({text}){if(!text)return null;var lines=text.split("\n"),els=[],i=0,k=0;
  while(i<lines.length){var L=lines[i];
    if(L.startsWith("```")){var c=[];i++;while(i<lines.length&&!lines[i].startsWith("```")){c.push(lines[i]);i++;}i++;els.push(<pre key={k++} style={{background:"#F8FAFC",border:"1px solid #E2E8F0",borderRadius:6,padding:"14px 16px",fontFamily:F.mono,fontSize:11,margin:"12px 0",lineHeight:1.7,color:"#334155",whiteSpace:"pre-wrap"}}>{c.join("\n")}</pre>);continue;}
    if(L.includes("|")&&i+1<lines.length&&lines[i+1].replace(/[^|:\-\s]/g,"").match(/^[\s|:\-]+$/)){var hdr=L.split("|").map(function(x){return x.trim();}).filter(Boolean);i+=2;var rows=[];while(i<lines.length&&lines[i].includes("|")&&lines[i].trim()!==""){rows.push(lines[i].split("|").map(function(x){return x.trim();}).filter(Boolean));i++;}
      els.push(<div key={k++} style={{overflowX:"auto",margin:"14px 0",borderRadius:8,border:"1px solid #E2E8F0"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:12,fontFamily:F.mono}}><thead><tr>{hdr.map(function(h,j){return <th key={j} style={{padding:"10px 14px",textAlign:"right",fontWeight:500,fontSize:10,letterSpacing:"0.05em",textTransform:"uppercase",color:"#64748B",borderBottom:"1px solid #E2E8F0",background:"#F8FAFC"}}>{h}</th>;})}</tr></thead><tbody>{rows.map(function(r,ri){return <tr key={ri} style={{borderBottom:"1px solid #F1F5F9"}}>{r.map(function(cell,ci){var neg=cell.startsWith("-")||(cell.includes("(")&&cell.includes(")"));return <td key={ci} style={{padding:"10px 14px",textAlign:ci>0?"right":"left",fontVariantNumeric:"tabular-nums",color:neg?"#DC2626":"#0F172A"}}>{cell}</td>;})}</tr>;})}</tbody></table></div>);continue;}
    if(/^-{3,}$/.test(L.trim())){els.push(<hr key={k++} style={{border:"none",borderTop:"1px solid #E2E8F0",margin:"16px 0"}}/>);i++;continue;}
    if(L.trim()===""){els.push(<div key={k++} style={{height:8}}/>);i++;continue;}
    var h1m=L.match(/^# (.+)/);if(h1m){els.push(<h1 key={k++} style={{fontSize:18,fontWeight:600,color:"#0F172A",margin:"24px 0 8px",letterSpacing:"-0.02em"}}>{doInl(h1m[1])}</h1>);i++;continue;}
    var h2m=L.match(/^## (.+)/);if(h2m){els.push(<h2 key={k++} style={{fontSize:15,fontWeight:600,color:"#0F172A",margin:"20px 0 6px",letterSpacing:"-0.01em"}}>{doInl(h2m[1])}</h2>);i++;continue;}
    var h3m=L.match(/^### (.+)/);if(h3m){els.push(<h3 key={k++} style={{fontSize:13,fontWeight:600,color:"#334155",margin:"16px 0 4px"}}>{doInl(h3m[1])}</h3>);i++;continue;}
    var numm=L.match(/^(\d+)\.\s+(.+)/);if(numm){els.push(<div key={k++} style={{display:"flex",gap:8,margin:"3px 0"}}><span style={{fontWeight:500,color:"#64748B",fontSize:11,minWidth:18,fontFamily:F.mono}}>{numm[1]+"."}</span><span style={{lineHeight:1.7}}>{doInl(numm[2])}</span></div>);i++;continue;}
    var bulm=L.match(/^[-*]\s+(.+)/);if(bulm){els.push(<div key={k++} style={{display:"flex",gap:10,margin:"3px 0"}}><span style={{color:"#94A3B8",fontSize:6,marginTop:7}}>{"●"}</span><span style={{lineHeight:1.7}}>{doInl(bulm[1])}</span></div>);i++;continue;}
    els.push(<p key={k++} style={{margin:"4px 0",lineHeight:1.7,color:"#334155"}}>{doInl(L)}</p>);i++;}
  return <div style={{fontSize:13}}>{els}</div>;}
function doInl(t){if(!t)return t;var p=[];var rx=/(\*\*(.+?)\*\*|`([^`]+)`)/g;var m,li=0,idx=0;while((m=rx.exec(t))!==null){if(m.index>li)p.push(t.slice(li,m.index));if(m[2])p.push(<strong key={idx++} style={{fontWeight:600,color:"#0F172A"}}>{m[2]}</strong>);else if(m[3])p.push(<code key={idx++} style={{background:"rgba(79,70,229,0.06)",padding:"2px 6px",borderRadius:4,fontFamily:F.mono,fontSize:11,color:"#4F46E5"}}>{m[3]}</code>);li=m.index+m[0].length;}if(li<t.length)p.push(t.slice(li));return p.length?p:t;}

/* ═══════════════════════════════════════════════════════════════════
   PIXEL ART (preserved)
   ═══════════════════════════════════════════════════════════════════ */
var PAL={maya:{skin:"#EDCBA4",hair:"#1C1008",top:"#4338CA",acc:"#818CF8",gl:false,er:true,hat:false},raj:{skin:"#C1884D",hair:"#0F0F0F",top:"#DC2626",acc:"#F87171",gl:true,er:false,hat:false},priya:{skin:"#C1884D",hair:"#0F0F0F",top:"#D97706",acc:"#FBBF24",gl:false,er:true,hat:false},alex:{skin:"#EDCBA4",hair:"#5C3A1E",top:"#059669",acc:"#34D399",gl:false,er:false,hat:true},sam:{skin:"#F5D6B8",hair:"#C4956A",top:"#7C3AED",acc:"#A78BFA",gl:true,er:false,hat:false},jordan:{skin:"#8B5E34",hair:"#0F0F0F",top:"#0891B2",acc:"#22D3EE",gl:false,er:false,hat:false}};
function Pix({id,size,mood,bounce,anim,frame}){var s=size||40;var p=PAL[id];if(!p)return null;var hp=mood==="happy";var isT=anim==="type",fr=frame||0;var lAy=8.5,rAy=8.5;if(isT){lAy=fr%2===0?7.2:9.8;rAy=fr%2===0?9.8:7.2;}return <div style={{width:s,height:s,flexShrink:0,animation:bounce?"pixBounce 0.6s ease infinite":"none"}}><svg viewBox="0 0 16 16" width={s} height={s} style={{imageRendering:"pixelated"}}><rect x="5" y="1.5" width="6" height="2.5" fill={p.hair} rx="1"/>{p.hat&&<><rect x="4" y="0.5" width="8" height="1.5" fill={p.acc} rx="0.5"/><rect x="3" y="1.5" width="10" height="1" fill={p.acc}/></>}<rect x="5" y="2" width="6" height="5.5" fill={p.skin} rx="1"/>{!p.hat&&<><rect x="4" y="2" width="1.2" height="3" fill={p.hair}/><rect x="10.8" y="2" width="1.2" height="3" fill={p.hair}/></>}{p.gl?<><rect x="5.5" y="4" width="2" height="1.2" rx="0.3" fill="none" stroke="#334155" strokeWidth="0.4"/><rect x="8.5" y="4" width="2" height="1.2" rx="0.3" fill="none" stroke="#334155" strokeWidth="0.4"/><rect x="7.5" y="4.3" width="1" height="0.4" fill="#334155"/><rect x="6.2" y="4.2" width="0.8" height="0.8" fill="#1a1a1a" rx="0.2"/><rect x="9.2" y="4.2" width="0.8" height="0.8" fill="#1a1a1a" rx="0.2"/></>:<><rect x="6" y="4" width="1" height="1.2" fill="#1a1a1a" rx="0.3"/><rect x="9" y="4" width="1" height="1.2" fill="#1a1a1a" rx="0.3"/></>}{hp?<path d="M6.8 5.8 Q8 7 9.2 5.8" fill="none" stroke="#B45A3C" strokeWidth="0.5"/>:<rect x="7.2" y="6" width="1.5" height="0.5" fill="#D4956A" rx="0.25"/>}{p.er&&<circle cx="4.3" cy="4.5" r="0.5" fill={p.acc}/>}<rect x="4" y="7.5" width="8" height="5" fill={p.top} rx="1"/><rect x="3" y={lAy} width="1.2" height="2.5" fill={p.top} rx="0.5"/><rect x="11.8" y={rAy} width="1.2" height="2.5" fill={p.top} rx="0.5"/><rect x="6.5" y="7.5" width="3" height="1" fill="white" opacity="0.3" rx="0.3"/><rect x="5" y="12.5" width="2.2" height="2.5" fill="#334155" rx="0.3"/><rect x="8.8" y="12.5" width="2.2" height="2.5" fill="#334155" rx="0.3"/><rect x="4.5" y="14.5" width="3" height="1.5" fill="#1E293B" rx="0.5"/><rect x="8.5" y="14.5" width="3" height="1.5" fill="#1E293B" rx="0.5"/></svg></div>;}

/* ═══════════════════════════════════════════════════════════════════
   LIVE OFFICE — Persistent Top-Down SVG Floor Plan (pixel-agents inspired)
   ═══════════════════════════════════════════════════════════════════ */
var AGENTS_REF=[];
/* ── ACTION DIALOGS — dynamic text driven by the routing plan task ── */
var ACTION_DIALOGS={
  maya:{"default":["Routing to specialists...","Decomposing task...","Collecting specialist outputs...","Synthesizing executive brief..."]},
  raj:{"Variance bridge analysis":["Building variance bridge...","Isolating volume vs rate impact...","Decomposing regional miss..."],"Regional P&L analysis":["Computing regional EBITDA...","Aggregating expense line items...","Calculating margin spread..."],"Expense variance analysis":["Scanning expense categories...","Budget vs actual by line...","Flagging overruns..."],"Regional variance":["Extracting regional variance...","Decomposing revenue miss...","Bridge analysis running..."],"Variance overview":["Revenue variance scan...","Isolating -$K drivers...","Bridge complete"],"default":["Isolating volume variance...","Rate impact: calculating...","Decomposing regional miss..."]},
  priya:{"Denial/AR analysis":["Scanning denial codes by region...","Computing DSO and AR aging...","Quantifying recovery opportunity..."],"default":["Scanning denial codes...","CO-4: AT modifier miss...","Scrubbing claims..."]},
  alex:{"Forecast modeling":["Running 3 scenarios...","Base case: current trajectory...","Upside: denial fix + growth..."],"default":["Running 3 scenarios...","Forecasting month 7..."]},
  sam:{"PE commentary / SSS analysis":["Evaluating CAC efficiency...","Analyzing Same-Store Sales...","Drafting Vistria commentary..."],"Executive summary":["Compiling board metrics...","PE-grade KPI formatting...","Lead with the number..."],"default":["PE format: 3 paras...","Reading regional_metrics...","Polishing commentary..."]},
  jordan:{"Ops / provider analysis":["Extracting regional utilization...","Computing tech-to-doc ratios...","Scoring clinic health..."],"Health scoring":["Scanning clinic vitals...","Risk flagging by region...","Ranking health scores..."],"default":["Reading regional_metrics...","Utilization scan...","Ranking regions..."]}
};
var DESK_POS={maya:{x:310,y:40},raj:{x:40,y:200},priya:{x:170,y:200},alex:{x:300,y:200},sam:{x:430,y:200},jordan:{x:560,y:200}};

function LiveOffice({scene,handoffs,ebitdaVar,agents,decomp}){
  var _t=useState(0),tick=_t[0];
  var _pk=useState(null),packet=_pk[0],setPacket=_pk[1];
  var _spawn=useState(null),spawnId=_spawn[0],setSpawnId=_spawn[1];
  /* Fast animation tick — 280ms for character frame cycling (pixel-agents: 300ms type, 150ms walk) */
  useEffect(function(){var iv=setInterval(function(){_t[1](function(t){return t+1;});},280);return function(){clearInterval(iv);};},[]);
  var isActive=scene.type!=="idle";
  /* Scene changes trigger data packet + spawn — only during real work */
  useEffect(function(){if(scene.type==="chat"||scene.type==="handoff"||scene.type==="working"){setPacket({from:scene.from,to:scene.to,key:Date.now()});if(scene.to){setSpawnId(scene.to);setTimeout(function(){setSpawnId(null);},800);}var tm=setTimeout(function(){setPacket(null);},1800);return function(){clearTimeout(tm);};}},[scene]);
  /* Agent animation — DYNAMICALLY driven by scene.activeAgents array */
  var dynAgents=scene.activeAgents||[];
  function isOn(id){
    if(!isActive)return false;
    /* If activeAgents array exists, use it — otherwise fall back to from/to */
    if(dynAgents.length>0)return dynAgents.indexOf(id)>=0||scene.from===id;
    return scene.from===id||scene.to===id;
  }
  function isTyping(id){
    if(!isActive)return false;
    if(dynAgents.length>0)return(dynAgents.indexOf(id)>=0&&tick>2)||scene.from===id;
    return scene.from===id||(scene.to===id&&tick>2);
  }
  function getSpeech(id){
    if(!isActive)return null;
    /* Only show bubbles for dynamically-selected activeAgents */
    if(dynAgents.length>0&&dynAgents.indexOf(id)<0&&scene.from!==id)return null;
    if(dynAgents.indexOf(id)<0&&scene.from!==id&&scene.to!==id)return null;
    /* Look up agent's assigned task from the routing plan */
    var task=null;var rp=scene.routingPlan||[];
    rp.forEach(function(p){if(p.agent.toLowerCase()===id)task=p.task;});
    /* Get action-specific dialog lines, fall back to default */
    var ad=ACTION_DIALOGS[id]||{};
    var lines=(task&&ad[task])?ad[task]:(ad["default"]||["Working..."]);
    return lines[Math.floor(tick/5)%lines.length];
  }

  function DeskG({id,x,y,on,isFrom}){
    var a=(agents||AGENTS_REF).find(function(ag){return ag.id===id;});
    var col=a?a.color:"#64748B";var isMaya=id==="maya";var dw=isMaya?80:68;var monW=isMaya?50:38;
    var typing=isTyping(id);var sp=getSpeech(id);var isSpawn=spawnId===id;
    var sx=x+(dw-monW)/2;var monH=isMaya?28:24;var scrH=isMaya?22:18;
    return <g>
      {/* ── Activation glow ── */}
      {on&&<rect x={x-4} y={y+28} width={dw+8} height={isMaya?100:90} rx="6" fill="none" stroke={col} strokeWidth="1" opacity="0.15"><animate attributeName="opacity" values="0.1;0.25;0.1" dur="2s" repeatCount="indefinite"/></rect>}
      {/* ── Spawn pulse rings ── */}
      {isSpawn&&<><circle cx={x+dw/2} cy={y+60} r="5" fill="none" stroke={col} strokeWidth="2" opacity="0.8"><animate attributeName="r" values="5;35;50" dur="0.8s" fill="freeze"/><animate attributeName="opacity" values="0.8;0.2;0" dur="0.8s" fill="freeze"/></circle><circle cx={x+dw/2} cy={y+60} r="3" fill="none" stroke={col} strokeWidth="1.5" opacity="0.5"><animate attributeName="r" values="3;25;40" dur="0.8s" fill="freeze" begin="0.1s"/><animate attributeName="opacity" values="0.5;0.1;0" dur="0.8s" fill="freeze" begin="0.1s"/></circle></>}
      {/* ── Chair ── */}
      <ellipse cx={x+dw/2} cy={y+(isMaya?108:100)} rx="10" ry="8" fill={on?"#E0E7FF":"#F1F5F9"} stroke={on?col:"#CBD5E1"} strokeWidth="0.8"/>
      {/* ── Desk surface ── */}
      <rect x={x} y={y+60} width={dw} height={isMaya?22:18} rx="3" fill="#D4C4A8" stroke="#BBA888" strokeWidth="0.8"/>
      <rect x={x+2} y={y+62} width={dw-4} height={isMaya?18:14} rx="2" fill="#E8DCC8" opacity="0.5"/>
      {/* ── Desk legs ── */}
      <rect x={x+4} y={y+(isMaya?82:78)} width="3" height="8" rx="1" fill="#BBA888"/>
      <rect x={x+dw-7} y={y+(isMaya?82:78)} width="3" height="8" rx="1" fill="#BBA888"/>
      {/* ── Monitor housing ── */}
      <rect x={sx} y={y+34} width={monW} height={monH} rx="2" fill={on?"#1E293B":"#334155"} stroke={on?col:"#94A3B8"} strokeWidth={on?1.5:0.6}/>
      {/* ── Monitor LED indicator ── */}
      <circle cx={sx+monW-4} cy={y+36.5} r="1.2" fill={on?"#22C55E":"#94A3B8"}>{on&&<animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite"/>}</circle>
      {/* ── Screen panel ── */}
      <rect x={sx+3} y={y+37} width={monW-6} height={scrH} rx="1" fill={on?col+"15":"#F1F5F9"}/>
      {/* ── Screen content: scrolling code + cursor (active) or dim lines (idle) ── */}
      {on?<>{[0,1,2,3,4].map(function(li){var w=6+(((li*7+tick*3)%18));var bright=li===(tick%5);return <rect key={li} x={sx+6} y={y+39+li*3.5} width={w} height="1.8" rx="0.5" fill={col} opacity={bright?0.7:0.2+((li+tick)%3)*0.12}/>;})}<rect x={sx+6+6+((tick*3)%10)} y={y+39+(tick%5)*3.5} width="1" height="2.2" fill={col} opacity="0.9"><animate attributeName="opacity" values="0.9;0;0.9" dur="0.5s" repeatCount="indefinite"/></rect></>:[0,1,2].map(function(li){return <rect key={li} x={sx+6} y={y+41+li*5} width={8+li*5} height="1.5" rx="0.75" fill="#CBD5E1" opacity="0.4"/>;})}
      {/* ── Monitor stand ── */}
      <rect x={x+dw/2-3} y={y+(isMaya?62:58)} width="6" height="3" fill="#94A3B8"/>
      {/* ── Keyboard with key-press animation ── */}
      <rect x={x+dw/2-11} y={y+64} width="22" height="4" rx="1.5" fill={on?"#E0E7FF":"#E2E8F0"} stroke={on?col:"#CBD5E1"} strokeWidth="0.5">{typing&&<animate attributeName="fill" values="#E0E7FF;#C7D2FE;#E0E7FF" dur="0.56s" repeatCount="indefinite"/>}</rect>
      {on&&[0,1,2,3].map(function(ki){return <rect key={ki} x={x+dw/2-8+ki*5} y={y+65.5} width="3" height="1.5" rx="0.5" fill={typing&&tick%2===ki%2?col:"#CBD5E1"} opacity={typing&&tick%2===ki%2?0.6:0.3}/>;})}
      {/* ── Coffee mug + handle ── */}
      <rect x={x+dw-16} y={y+63} width="5" height="5" rx="1.5" fill="#F3E8D4" stroke="#D4C4A8" strokeWidth="0.5"/>
      <rect x={x+dw-11} y={y+64.5} width="1.8" height="2" rx="0.9" fill="none" stroke="#D4C4A8" strokeWidth="0.4"/>
      {/* ── Coffee steam ── */}
      <g opacity={on?0.5:0.2}><circle cx={x+dw-14} cy={y+61} r="0.6" fill="#CBD5E1"><animate attributeName="cy" values={(y+61)+";"+(y+56)} dur="2s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.5;0" dur="2s" repeatCount="indefinite"/></circle><circle cx={x+dw-12.5} cy={y+60} r="0.5" fill="#CBD5E1"><animate attributeName="cy" values={(y+60)+";"+(y+54)} dur="2.5s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.4;0" dur="2.5s" repeatCount="indefinite"/></circle></g>
      {/* ── Speech bubble removed — rendered in overlay layer ── */}
      {/* ── Name plate ── */}
      <text x={x+dw/2} y={y+(isMaya?122:112)} textAnchor="middle" fill={on?"#0F172A":"#64748B"} fontSize="7" fontWeight={on?"600":"500"} fontFamily="monospace">{a?a.name:id}</text>
      {on&&<text x={x+dw/2} y={y+(isMaya?130:120)} textAnchor="middle" fill={col} fontSize="5" fontFamily="monospace" opacity="0.7">{typing?"typing...":"active"}</text>}
    </g>;
  }

  /* Data packet path animation — particle trail (pixel-agents style) */
  var packetEl=null;
  if(packet&&DESK_POS[packet.from]&&DESK_POS[packet.to]){
    var fp=DESK_POS[packet.from],tp=DESK_POS[packet.to];
    var isMF=packet.from==="maya",isMT=packet.to==="maya";
    var fx=fp.x+(isMF?40:34),fy=fp.y+70;var tx=tp.x+(isMT?40:34),ty=tp.y+70;
    var mid=(fy+ty)/2*0.6;var pathD="M"+fx+","+fy+" Q"+(fx+tx)/2+","+mid+" "+tx+","+ty;
    var pcAgent=(agents||AGENTS_REF).find(function(ag){return ag.id===packet.to;});var pcol=pcAgent?pcAgent.color:C.warning;
    packetEl=<g key={packet.key}>
      {/* Trail particles — decreasing size + opacity */}
      <circle r="2" fill={pcol} opacity="0.15"><animateMotion dur="1.5s" fill="freeze" path={pathD}/><animate attributeName="opacity" values="0.15;0.15;0" dur="1.5s" fill="freeze"/></circle>
      <circle r="2.5" fill={pcol} opacity="0.25"><animateMotion dur="1.5s" fill="freeze" path={pathD} begin="0.08s"/><animate attributeName="opacity" values="0.25;0.25;0" dur="1.5s" fill="freeze" begin="0.08s"/></circle>
      <circle r="3" fill={pcol} opacity="0.35"><animateMotion dur="1.5s" fill="freeze" path={pathD} begin="0.15s"/><animate attributeName="opacity" values="0.35;0.35;0" dur="1.5s" fill="freeze" begin="0.15s"/></circle>
      {/* Main data orb with pulse */}
      <g><animateMotion dur="1.5s" fill="freeze" path={pathD} begin="0.2s"/><circle r="5" fill={pcol} opacity="0.85"><animate attributeName="r" values="5;4;5" dur="0.4s" repeatCount="3"/></circle><circle r="2.5" fill="white" opacity="0.5"/><animate attributeName="opacity" values="1;1;0" dur="1.5s" fill="freeze" begin="0.2s"/></g>
      {/* Glow halo around orb */}
      <circle r="10" fill={pcol} opacity="0.08"><animateMotion dur="1.5s" fill="freeze" path={pathD} begin="0.2s"/><animate attributeName="r" values="8;14;8" dur="0.6s" repeatCount="2"/><animate attributeName="opacity" values="0.12;0;0" dur="1.5s" fill="freeze" begin="0.2s"/></circle>
    </g>;
  }

  return <div style={{height:"100%",display:"flex",flexDirection:"column",background:"#FAFAF8",borderLeft:"1px solid "+C.border,overflow:"hidden"}}>
    <div style={{padding:"10px 14px",borderBottom:"1px solid "+C.border,display:"flex",justifyContent:"space-between",alignItems:"center",background:"white"}}>
      <div style={{display:"flex",alignItems:"center",gap:6}}>
        <div style={{width:6,height:6,borderRadius:"50%",background:isActive?C.warning:C.positive,animation:isActive?"pulse 1.5s ease infinite":"none"}}/>
        <span style={{fontSize:10,fontWeight:600,color:isActive?C.warning:C.positive,fontFamily:F.mono,textTransform:"uppercase",letterSpacing:"0.06em"}}>{isActive?"Processing":"Standby"}</span>
      </div>
      <span style={{fontSize:9,color:C.textDim,fontFamily:F.mono}}>Live Office</span>
    </div>
    <div style={{flex:1,padding:8,overflow:"hidden"}}>
      <svg viewBox="0 0 700 360" style={{width:"100%",height:"100%",imageRendering:"auto"}} preserveAspectRatio="xMidYMid meet">
        <defs>
          <filter id="shadow"><feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.08"/></filter>
          <filter id="bshadow"><feDropShadow dx="0" dy="2" stdDeviation="4" floodOpacity="0.15"/></filter>
          <filter id="glow"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        {/* ── Floor ── */}
        <rect x="0" y="0" width="700" height="360" rx="6" fill="#FAF8F5"/>
        {/* ── Floor grid ── */}
        {Array.from({length:13}).map(function(_,i){return <line key={"h"+i} x1="0" y1={i*30} x2="700" y2={i*30} stroke="#EDE9E0" strokeWidth="0.3"/>;})}
        {Array.from({length:24}).map(function(_,i){return <line key={"v"+i} x1={i*30} y1="0" x2={i*30} y2="360" stroke="#EDE9E0" strokeWidth="0.3"/>;})}
        {/* ── Wall header ── */}
        <rect x="0" y="0" width="700" height="8" fill="#E2E8F0"/>
        {/* ── Director area accent ── */}
        <rect x="260" y="12" width="180" height="160" rx="10" fill="#EEF2FF" opacity="0.5"/>
        <rect x="260" y="12" width="180" height="160" rx="10" fill="none" stroke="#C7D2FE" strokeWidth="0.5" strokeDasharray="5,3"/>
        {/* ── Plants with gentle sway ── */}
        {[[15,14],[660,14],[15,310],[660,310]].map(function(p,i){return <g key={"p"+i}><ellipse cx={p[0]+10} cy={p[1]+12} rx="8" ry="6" fill="#D1FAE5" opacity="0.6"/><rect x={p[0]+7} y={p[1]+14} width="6" height="8" rx="2" fill="#A3886C"/><circle cx={p[0]+10} cy={p[1]+8} r="6" fill="#34D399" opacity="0.4"><animate attributeName="cx" values={(p[0]+10)+";"+(p[0]+11)+";"+(p[0]+10)} dur={(3.5+i*0.7)+"s"} repeatCount="indefinite"/></circle><circle cx={p[0]+7} cy={p[1]+10} r="4" fill="#059669" opacity="0.3"/><circle cx={p[0]+14} cy={p[1]+10} r="4" fill="#059669" opacity="0.3"/></g>;})}
        {/* ── Section labels ── */}
        <text x="350" y="28" textAnchor="middle" fill="#94A3B8" fontSize="7" fontFamily="monospace" letterSpacing="0.15em">DIRECTOR</text>
        {/* ── Divider ── */}
        <line x1="30" y1="178" x2="670" y2="178" stroke="#CBD5E1" strokeWidth="0.5" strokeDasharray="3,3"/>
        <text x="350" y="194" textAnchor="middle" fill="#94A3B8" fontSize="7" fontFamily="monospace" letterSpacing="0.15em">ANALYSTS</text>
        {/* ── Maya desk + avatar ── */}
        <DeskG id="maya" x={DESK_POS.maya.x} y={DESK_POS.maya.y} on={isOn("maya")} isFrom={scene.from==="maya"}/>
        <foreignObject x={DESK_POS.maya.x+20} y={DESK_POS.maya.y+2} width="44" height="44"><div xmlns="http://www.w3.org/1999/xhtml"><Pix id="maya" size={40} mood={isOn("maya")?"happy":"idle"} anim={isTyping("maya")?"type":null} frame={tick%2}/></div></foreignObject>
        {/* ── Specialist desks + avatars ── */}
        {["raj","priya","alex","sam","jordan"].map(function(id){var d=DESK_POS[id];var agOn=isOn(id);return <g key={id}>
          <DeskG id={id} x={d.x} y={d.y} on={agOn} isFrom={scene.from===id}/>
          <foreignObject x={d.x+17} y={d.y+4} width="36" height="36"><div xmlns="http://www.w3.org/1999/xhtml"><Pix id={id} size={32} mood={agOn?"happy":"idle"} anim={isTyping(id)?"type":null} frame={tick%2}/></div></foreignObject>
        </g>;})}
        {/* ── EBITDA wall display ── */}
        <rect x="540" y="18" width="105" height="48" rx="4" fill="white" stroke="#E2E8F0" strokeWidth="0.8" filter="url(#shadow)"/>
        <text x="592" y="34" textAnchor="middle" fill="#94A3B8" fontSize="6" fontFamily="monospace" letterSpacing="0.04em">EBITDA VAR</text>
        <text x="592" y="54" textAnchor="middle" fill={ebitdaVar<0?"#DC2626":"#059669"} fontSize="14" fontFamily="monospace" fontWeight="bold">{(ebitdaVar<0?"-$":"+$")+Math.abs(ebitdaVar)+"K"}</text>
        {/* ── Data packet animation ── */}
        {packetEl}
        {/* ════ SPEECH BUBBLE OVERLAY — rendered LAST so it paints ON TOP of all foreignObjects ════ */}
        {["maya","raj","priya","alex","sam","jordan"].map(function(aid){
          var sp=getSpeech(aid);if(!sp)return null;
          var a=(agents||AGENTS_REF).find(function(ag){return ag.id===aid;});var col=a?a.color:"#64748B";
          var dp=DESK_POS[aid];var isMaya=aid==="maya";var dw=isMaya?80:68;
          var cx=dp.x+dw/2;var by=dp.y-(isMaya?12:8);
          var bw=114;var bh=26;var bx=cx-bw/2;var btop=by-bh;
          return <g key={"bub-"+aid}>
            <rect x={bx+1} y={btop+2} width={bw} height={bh} rx="10" fill="rgba(0,0,0,0.06)"/>
            <rect x={bx} y={btop} width={bw} height={bh} rx="10" fill="white" stroke={col} strokeWidth="1.2"/>
            <rect x={bx+3} y={btop+5} width="4" height={bh-10} rx="2" fill={col}/>
            <path d={"M"+(cx-5)+","+by+" L"+cx+","+(by+7)+" L"+(cx+5)+","+by+" Z"} fill="white" stroke={col} strokeWidth="0.8" strokeLinejoin="round"/>
            <rect x={cx-6} y={by-1.5} width="12" height="3" fill="white"/>
            <text x={cx+3} y={btop+bh/2+4} textAnchor="middle" fill="#1E293B" fontSize="7.5" fontWeight="600" fontFamily="monospace">{sp}</text>
          </g>;
        })}
      </svg>
    </div>
    {/* Decomposition status */}
    {decomp&&decomp.length>0&&<div style={{padding:"8px 12px",borderTop:"1px solid "+C.border,background:"white"}}>
      <div style={{fontSize:9,fontWeight:600,color:C.accent,fontFamily:F.mono,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4}}>Task Decomposition</div>
      {decomp.map(function(d,i){return <div key={i} style={{display:"flex",alignItems:"center",gap:6,fontSize:10,fontFamily:F.mono,color:d.done?C.positive:C.textDim,marginBottom:2}}>
        <span>{d.done?"✓":"→"}</span><span style={{fontWeight:500}}>{d.agent}</span><span style={{color:"#94A3B8"}}>·</span><span>{d.task}</span>
      </div>;})}
    </div>}
    {/* Handoff log */}
    {handoffs.length>0&&<div style={{padding:"6px 12px",borderTop:"1px solid "+C.border,display:"flex",alignItems:"center",gap:6,fontSize:9,fontFamily:F.mono,background:"white"}}>
      <span style={{color:C.accent,fontWeight:600}}>LOG</span>
      <span style={{color:C.text,fontWeight:500}}>{handoffs[handoffs.length-1].from}</span>
      <span style={{color:C.warning}}>{"→"}</span>
      <span style={{color:C.text,fontWeight:500}}>{handoffs[handoffs.length-1].to}</span>
      <span style={{color:C.textDim,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1}}>{handoffs[handoffs.length-1].topic}</span>
    </div>}
  </div>;
}

/* ═══════════════════════════════════════════════════════════════════
   PHASE 8: ETL PARSER — SheetJS Excel → CLINICS + AR + Provider
   ═══════════════════════════════════════════════════════════════════ */
var GEO_LOOKUP={"IL01":{lat:41.833,lng:-87.929},"IL02":{lat:41.786,lng:-88.147},"IL03":{lat:41.882,lng:-87.628},"IL04":{lat:42.031,lng:-88.084},"IL05":{lat:42.045,lng:-87.688},"IL06":{lat:41.630,lng:-87.854},"IL07":{lat:42.271,lng:-89.094},"IL08":{lat:39.781,lng:-89.650},"IN01":{lat:39.769,lng:-86.158},"IN02":{lat:41.079,lng:-85.139},"IN03":{lat:39.978,lng:-86.118},"IN04":{lat:39.165,lng:-86.526},"IN05":{lat:37.975,lng:-87.556},"KY01":{lat:38.254,lng:-85.760},"KY02":{lat:38.040,lng:-84.504},"KY03":{lat:36.990,lng:-86.444},"KY04":{lat:39.084,lng:-84.509},"KY05":{lat:37.774,lng:-87.113},"KY06":{lat:38.201,lng:-84.873},"PNW01":{lat:45.515,lng:-122.676},"PNW02":{lat:47.606,lng:-122.332},"PNW03":{lat:44.052,lng:-123.087},"PNW04":{lat:47.253,lng:-122.444},"AZ01":{lat:33.449,lng:-112.074},"AZ02":{lat:33.494,lng:-111.926},"AZ03":{lat:32.222,lng:-110.975},"AZ04":{lat:33.415,lng:-111.831},"MOKS01":{lat:39.100,lng:-94.579},"MOKS02":{lat:38.627,lng:-90.200},"MOKS03":{lat:37.209,lng:-93.292}};
var REGION_CODE_MAP={"Illinois":"IL","Indiana":"IN","Kentucky":"KY","Pacific NW":"PNW","Arizona":"AZ","MO-KS":"MOKS"};

function parseDataRoom(workbook){
  var result={clinics:[],arAging:{},providerData:{},expenses:[],regionalExpenses:{},denialLog:[],payerMix:{},monthlyTrend:{},budgetAssumptions:{},dataRoomIndex:[],meta:{company:"TVG-Medulla",period:"January 2026",pe:"Vistria Group",peAUM:"$16B",denialTarget:8.0},extraction:[]};
  /* ── 1. Data Room Index ── */
  var idxSheet=workbook.Sheets["Data Room Index"];
  if(idxSheet){var idxRows=XLSX.utils.sheet_to_json(idxSheet,{header:1});result.dataRoomIndex=idxRows;result.extraction.push({sheet:"Data Room Index",rows:idxRows.length,cols:1,status:"meta"});}
  /* ── 2. Clinic Export ── */
  var ceSheet=workbook.Sheets["Clinic Export"];
  if(ceSheet){XLSX.utils.sheet_to_json(ceSheet).forEach(function(row){
    var cid=row["Clinic_ID"]||"";var geo=GEO_LOOKUP[cid]||{lat:39,lng:-89};
    var regionStr=row["Region"]||"";var regionCode=REGION_CODE_MAP[regionStr]||regionStr.replace(/[^A-Z]/g,"").slice(0,4);
    result.clinics.push({id:cid,name:row["Clinic_Name"]||cid,region:regionCode,tag:row["Status_Tag"]||"Core_SSS",lat:geo.lat,lng:geo.lng,
      revBud:Math.round((parseFloat(row["Net_Revenue_Budget"])||0)/1000),revAct:Math.round((parseFloat(row["Net_Revenue_Actual"])||0)/1000),
      visits:parseInt(row["Visits_Actual"])||0,visitsBud:parseInt(row["Visits_Budget"])||0,
      denial:parseFloat(row["Denial_Rate_Pct"])||0,collection:parseFloat(row["Collection_Rate_Pct"])||0,
      prepaidCash:parseInt(row["Prepaid_Cash_Collected"])||0,deferredRev:parseInt(row["Deferred_Revenue_Balance"])||0,
      newPatients:parseInt(row["New_Patients"])||0,blendedCAC:parseInt(row["Blended_CAC"])||0});
  });result.extraction.push({sheet:"Clinic Export",rows:result.clinics.length,cols:15,status:"ok"});}
  /* ── 3. Expense Detail — aggregate company-wide + by region ── */
  var expSheet=workbook.Sheets["Expense Detail"];
  var expRawCount=0;
  if(expSheet){var expAgg={};var catMap={DRCOMP:"labor",CTECH:"labor",STAFF:"labor",BEN:"labor",RENT:"occupancy",MKT:"growth",SUPPLY:"ops",TECH:"ops"};
    var expRows=XLSX.utils.sheet_to_json(expSheet);expRawCount=expRows.length;
    /* Company-wide aggregation */
    expRows.forEach(function(row){var code=row["Expense_Code"];if(!expAgg[code])expAgg[code]={id:code,name:row["Expense_Category"],budget:0,actual:0};expAgg[code].budget+=(parseInt(row["Budget_Amount"])||0);expAgg[code].actual+=(parseInt(row["Actual_Amount"])||0);});
    Object.keys(expAgg).forEach(function(k){var e=expAgg[k];result.expenses.push({id:k,name:e.name,budget:Math.round(e.budget/1000),actual:Math.round(e.actual/1000),category:catMap[k]||"ops"});});
    /* Regional expense aggregation — group by Region + Expense_Code */
    var regExpAgg={};
    expRows.forEach(function(row){
      var regionStr=row["Region"]||"";var regionCode=REGION_CODE_MAP[regionStr]||regionStr.replace(/[^A-Z]/g,"").slice(0,4);
      var code=row["Expense_Code"];var key=regionCode+"|"+code;
      if(!regExpAgg[key])regExpAgg[key]={region:regionCode,id:code,name:row["Expense_Category"],budget:0,actual:0,category:catMap[code]||"ops"};
      regExpAgg[key].budget+=(parseInt(row["Budget_Amount"])||0);regExpAgg[key].actual+=(parseInt(row["Actual_Amount"])||0);
    });
    result.regionalExpenses={};
    Object.values(regExpAgg).forEach(function(re){
      if(!result.regionalExpenses[re.region])result.regionalExpenses[re.region]=[];
      result.regionalExpenses[re.region].push({id:re.id,name:re.name,budget:Math.round(re.budget/1000),actual:Math.round(re.actual/1000),category:re.category});
    });
    result.extraction.push({sheet:"Expense Detail",rows:expRawCount,cols:7,status:"ok",note:"→ "+result.expenses.length+" categories × "+Object.keys(result.regionalExpenses).length+" regions"});
  }
  if(result.expenses.length===0){result.expenses=[{id:"DRCOMP",name:"Doctor Comp",budget:1450,actual:1420,category:"labor"},{id:"CTECH",name:"Clinical Tech",budget:400,actual:385,category:"labor"},{id:"STAFF",name:"Front Desk",budget:400,actual:390,category:"labor"},{id:"RENT",name:"Rent",budget:620,actual:625,category:"occupancy"},{id:"SUPPLY",name:"Supplies",budget:185,actual:192,category:"ops"},{id:"MKT",name:"Marketing",budget:165,actual:178,category:"growth"},{id:"BEN",name:"Benefits",budget:310,actual:305,category:"labor"},{id:"TECH",name:"Technology",budget:95,actual:92,category:"ops"}];}
  /* ── 4. Denial Log ── */
  var dlSheet=workbook.Sheets["Denial Log"];
  if(dlSheet){var dlRows=XLSX.utils.sheet_to_json(dlSheet);
    dlRows.forEach(function(row){result.denialLog.push({claimId:row["Claim_ID"],clinicId:row["Clinic_ID"],region:row["Region"],serviceDate:row["Service_Date"],cptCode:row["CPT_Code"],cptDesc:row["CPT_Description"],payer:row["Payer"],chargeAmount:parseFloat(row["Charge_Amount"])||0,denialCode:row["Denial_Reason_Code"],denialReason:row["Denial_Reason"],remediation:row["Remediation"]});});
    result.extraction.push({sheet:"Denial Log",rows:result.denialLog.length,cols:11,status:"ok"});
  }
  /* ── 5. Payer Mix ── */
  var pmSheet=workbook.Sheets["Payer Mix"];
  if(pmSheet){var pmRows=XLSX.utils.sheet_to_json(pmSheet);
    pmRows.forEach(function(row){var cid=row["Clinic_ID"];if(!result.payerMix[cid])result.payerMix[cid]=[];
      result.payerMix[cid].push({payer:row["Payer_Name"],grossCharges:parseFloat(row["Gross_Charges"])||0,adjustments:parseFloat(row["Contractual_Adjustments"])||0,netRevenue:parseFloat(row["Net_Revenue"])||0,claims:parseInt(row["Claims_Count"])||0,denials:parseInt(row["Denial_Count"])||0,denialRate:parseFloat(row["Denial_Rate_Pct"])||0});});
    result.extraction.push({sheet:"Payer Mix",rows:pmRows.length,cols:9,status:"ok",note:"→ "+Object.keys(result.payerMix).length+" clinics"});
  }
  /* ── 6. Provider Productivity ── */
  var ppSheet=workbook.Sheets["Provider Productivity"];
  if(ppSheet){var ppRows=XLSX.utils.sheet_to_json(ppSheet);
    ppRows.forEach(function(row){
    var cid=row["Clinic_ID"];if(!result.providerData[cid])result.providerData[cid]=[];
    result.providerData[cid].push({id:row["Provider_ID"],name:row["Provider_Name"],credentials:row["Credentials"]||"",visits:parseInt(row["Visits_Completed"])||0,revenue:parseInt(row["Revenue_Generated"])||0,comp:parseInt(row["Compensation"])||0,compRatio:parseFloat(row["Comp_Ratio_Pct"])||0,avgRPV:parseFloat(row["Avg_Revenue_Per_Visit"])||0,newPatients:parseInt(row["New_Patients"])||0,returning:parseInt(row["Returning_Patients"])||0,utilization:parseFloat(row["Utilization_Pct"])||0,techRatio:parseFloat(row["Tech_to_Doc_Ratio"])||0,slots:parseInt(row["Available_Schedule_Slots"])||0});
    });result.extraction.push({sheet:"Provider Productivity",rows:ppRows.length,cols:15,status:"ok",note:"→ "+Object.keys(result.providerData).length+" clinics"});
  }
  /* ── 7. Monthly Trend ── */
  var mtSheet=workbook.Sheets["Monthly Trend"];
  if(mtSheet){var mtRows=XLSX.utils.sheet_to_json(mtSheet);
    mtRows.forEach(function(row){var cid=row["Clinic_ID"];var period=row["Period"];if(!result.monthlyTrend[cid])result.monthlyTrend[cid]=[];
      result.monthlyTrend[cid].push({period:period,region:row["Region"],tag:row["Status_Tag"],visits:parseInt(row["Visits"])||0,netRevenue:parseFloat(row["Net_Revenue"])||0,denialRate:parseFloat(row["Denial_Rate_Pct"])||0,collectionRate:parseFloat(row["Collection_Rate_Pct"])||0,rpv:parseFloat(row["RPV"])||0,prepaidCash:parseInt(row["Prepaid_Cash_Collected"])||0,deferredRev:parseInt(row["Deferred_Revenue_Balance"])||0,newPatients:parseInt(row["New_Patients"])||0,totalAcqCost:parseInt(row["Total_Acquisition_Cost"])||0,blendedCAC:parseInt(row["Blended_CAC"])||0});});
    var periods=[...new Set(mtRows.map(function(r){return r["Period"];}))];
    result.extraction.push({sheet:"Monthly Trend",rows:mtRows.length,cols:14,status:"ok",note:"→ "+periods.length+" periods"});
  }
  /* ── 8. Budget Assumptions ── */
  var baSheet=workbook.Sheets["Budget Assumptions"];
  if(baSheet){var baRows=XLSX.utils.sheet_to_json(baSheet);
    baRows.forEach(function(row){result.budgetAssumptions[row["Clinic_ID"]]={clinicName:row["Clinic_Name"],region:row["Region"],tag:row["Status_Tag"],annualRevBudget:parseFloat(row["FY2026_Annual_Revenue_Budget"])||0,monthlyRevBudget:parseFloat(row["Monthly_Revenue_Budget"])||0,visitsBudget:parseInt(row["Visits_Budget_Monthly"])||0,rpvAssumption:parseFloat(row["RPV_Assumption"])||0,denialTarget:parseFloat(row["Denial_Rate_Target_Pct"])||0,collectionTarget:parseFloat(row["Collection_Rate_Target_Pct"])||0,doctorCount:parseInt(row["Doctor_Count"])||0,breakevenRev:parseFloat(row["Breakeven_Revenue"])||0,ebitdaMarginTarget:parseFloat(row["EBITDA_Margin_Target_Pct"])||0,notes:row["Notes"]||""};});
    result.extraction.push({sheet:"Budget Assumptions",rows:baRows.length,cols:14,status:"ok"});
  }
  /* ── 9. AR Aging ── */
  var arSheet=workbook.Sheets["AR Aging"];
  if(arSheet){var arRows=XLSX.utils.sheet_to_json(arSheet);
    arRows.forEach(function(row){
    result.arAging[row["Clinic_ID"]]={d030:parseInt(row["0_30_Days"])||0,d3160:parseInt(row["31_60_Days"])||0,d6190:parseInt(row["61_90_Days"])||0,d90p:parseInt(row["90_Plus_Days"])||0,totalAR:parseInt(row["Total_AR"])||0,pctOver90:parseFloat(row["Pct_Over_90"])||0,dso:parseInt(row["Days_Sales_Outstanding_DSO"])||0};
    });result.extraction.push({sheet:"AR Aging",rows:arRows.length,cols:11,status:"ok"});
  }
  /* ── 10. Regional Metrics — Pre-computed averages (CAC, Utilization, Tech-to-Doc) ── */
  var regionNames={};Object.keys(REGION_CODE_MAP).forEach(function(name){regionNames[REGION_CODE_MAP[name]]=name;});
  result.regionalMetrics={};
  /* CAC averages from Clinic Export */
  var cacByReg={};result.clinics.forEach(function(cl){if(!cacByReg[cl.region])cacByReg[cl.region]={cacSum:0,clinics:0};cacByReg[cl.region].cacSum+=cl.blendedCAC;cacByReg[cl.region].clinics++;});
  /* Utilization + Tech-to-Doc from Provider Productivity */
  var provByReg={};result.clinics.forEach(function(cl){var provs=result.providerData[cl.id]||[];provs.forEach(function(p){if(!provByReg[cl.region])provByReg[cl.region]={utilSum:0,techSum:0,compSum:0,providers:0};provByReg[cl.region].utilSum+=p.utilization;provByReg[cl.region].techSum+=p.techRatio;provByReg[cl.region].compSum+=p.compRatio;provByReg[cl.region].providers++;});});
  /* Assemble per-region metrics object */
  Object.keys(cacByReg).forEach(function(rid){
    var c=cacByReg[rid];var p=provByReg[rid]||{utilSum:0,techSum:0,compSum:0,providers:0};
    result.regionalMetrics[rid]={regionId:rid,regionName:regionNames[rid]||rid,clinicCount:c.clinics,providerCount:p.providers,
      avgBlendedCAC:c.clinics?Math.round(c.cacSum/c.clinics):0,
      avgUtilizationPct:p.providers?Math.round(p.utilSum/p.providers*10)/10:0,
      avgTechToDocRatio:p.providers?Math.round(p.techSum/p.providers*100)/100:0,
      avgCompRatioPct:p.providers?Math.round(p.compSum/p.providers*10)/10:0};
  });
  result.extraction.push({sheet:"Regional Metrics",rows:Object.keys(result.regionalMetrics).length,cols:7,status:"computed",note:"CAC+Util+TechToDoc per region"});

  return result;
}

/* ═══════════════════════════════════════════════════════════════════
   REGION META + MUTABLE DB + FINANCE ENGINE
   ═══════════════════════════════════════════════════════════════════ */
var REGION_META={IL:{name:"Illinois",tag:"Core",denialTarget:8.0,topDenialCodes:[{code:"CO-16",pct:35,reason:"Medical necessity"},{code:"CO-4",pct:25,reason:"Modifier issue"}]},IN:{name:"Indiana",tag:"",denialTarget:8.0,topDenialCodes:[{code:"CO-16",pct:30,reason:"Medical necessity"}]},KY:{name:"Kentucky",tag:"Acquired",denialTarget:8.0,topDenialCodes:[{code:"CO-4",pct:42,reason:"Missing AT modifier"},{code:"CO-16",pct:30,reason:"Medical necessity / CPT mismatch"},{code:"PR-1",pct:12,reason:"Deductible"}]},PNW:{name:"Pacific NW",tag:"",denialTarget:8.0,topDenialCodes:[]},AZ:{name:"Arizona",tag:"",denialTarget:8.0,topDenialCodes:[{code:"CO-16",pct:40,reason:"Medical necessity"},{code:"CO-4",pct:20,reason:"Modifier"}]},MOKS:{name:"MO-KS",tag:"",denialTarget:8.0,topDenialCodes:[]}};

var CLINICS=[];
var DB={meta:{company:"TVG-Medulla",period:"January 2026",pe:"Vistria Group",peAUM:"$16B",denialTarget:8.0},get clinics(){return CLINICS;},expenses:[],regionalExpenses:{},regionalMetrics:{},arAging:{},providerData:{},denialLog:[],payerMix:{},monthlyTrend:{},budgetAssumptions:{},extraction:[],
  denialCPT:{"98940":{desc:"CMT 1-2 spinal regions",avgCharge:52},"98941":{desc:"CMT 3-4 spinal regions",avgCharge:76},"98942":{desc:"CMT 5 spinal regions",avgCharge:92},"97140":{desc:"Manual therapy",avgCharge:45}},
  get regions(){var rMap={};CLINICS.forEach(function(cl){if(!rMap[cl.region])rMap[cl.region]={id:cl.region,clinics:0,budRev:0,actRev:0,budVisits:0,actVisits:0,denialSum:0};var r=rMap[cl.region];r.clinics++;r.budRev+=cl.revBud;r.actRev+=cl.revAct;r.budVisits+=(cl.visitsBud||cl.visits);r.actVisits+=cl.visits;r.denialSum+=cl.denial;});
    return Object.keys(rMap).map(function(rid){var r=rMap[rid];var m=REGION_META[rid]||{name:rid,tag:"",denialTarget:8,topDenialCodes:[]};var avgDenial=r.denialSum/r.clinics;var avgRpvBud=r.budRev/r.clinics;var avgRpvAct=r.actRev/r.clinics;
      return{id:rid,name:m.name,tag:m.tag,clinics:r.clinics,revenue:{budget:r.budRev,actual:r.actRev},visits:{budget:r.budVisits,actual:r.actVisits},rpv:{budget:Math.round(avgRpvBud*100)/100,actual:Math.round(avgRpvAct*100)/100},denial:{current:Math.round(avgDenial*10)/10,target:m.denialTarget},collection:Math.round(CLINICS.filter(function(c){return c.region===rid;}).reduce(function(s,c){return s+c.collection;},0)/r.clinics),topDenialCodes:m.topDenialCodes};});},
  get clinicCount(){return CLINICS.length;}};

var FE={
  revenueSummary:function(){var budR=0,actR=0,budE=0,actE=0,denN=0,clinN=0;DB.regions.forEach(function(r){budR+=r.revenue.budget;actR+=r.revenue.actual;denN+=r.denial.current*r.clinics;clinN+=r.clinics;});DB.expenses.forEach(function(e){budE+=e.budget;actE+=e.actual;});var ebBud=budR-budE,ebAct=actR-actE;return{revenue:{budget:budR,actual:actR,variance:actR-budR,variancePct:budR?((actR-budR)/budR*100):0},expenses:{budget:budE,actual:actE,variance:actE-budE},ebitda:{budget:ebBud,actual:ebAct,variance:ebAct-ebBud,marginBud:budR?(ebBud/budR*100):0,marginAct:actR?(ebAct/actR*100):0},denial:{weighted:clinN?Math.round(denN/clinN*10)/10:0,target:DB.meta.denialTarget||8},clinics:clinN,period:DB.meta.period};},
  varianceBridge:function(regionId){var regions=regionId?DB.regions.filter(function(r){return r.id===regionId;}):DB.regions;var rows=regions.map(function(r){var volImpact=(r.visits.actual-r.visits.budget)*r.rpv.budget/1000;var rateImpact=(r.rpv.actual-r.rpv.budget)*r.visits.actual/1000;var denialExcess=Math.max(0,r.denial.current-r.denial.target);var denialImpact=-(r.revenue.actual*denialExcess/100);var totalVar=r.revenue.actual-r.revenue.budget;var residual=totalVar-volImpact-rateImpact-denialImpact;return{region:r.name,tag:r.tag,clinics:r.clinics,budgetRev:r.revenue.budget,actualRev:r.revenue.actual,totalVariance:totalVar,volumeImpact:Math.round(volImpact*10)/10,rateImpact:Math.round(rateImpact*10)/10,denialImpact:Math.round(denialImpact*10)/10,residual:Math.round(residual*10)/10,denialRate:r.denial.current,denialTarget:r.denial.target};});var totals={volumeImpact:0,rateImpact:0,denialImpact:0,totalVariance:0,residual:0};rows.forEach(function(r){totals.volumeImpact+=r.volumeImpact;totals.rateImpact+=r.rateImpact;totals.denialImpact+=r.denialImpact;totals.totalVariance+=r.totalVariance;totals.residual+=r.residual;});return{rows:rows,totals:totals,period:DB.meta.period};},
  denialAnalysis:function(regionId){var regions=regionId?DB.regions.filter(function(r){return r.id===regionId;}):DB.regions;var results=regions.map(function(r){var excessRate=Math.max(0,r.denial.current-r.denial.target);var monthlyLoss=Math.round(r.revenue.actual*excessRate/100);var annualLoss=monthlyLoss*12;var recoveryAt80=Math.round(monthlyLoss*0.8);return{region:r.name,clinics:r.clinics,currentRate:r.denial.current,targetRate:r.denial.target,excessRate:excessRate,monthlyLoss:monthlyLoss,annualLoss:annualLoss,recoverable80:recoveryAt80,collection:r.collection,topCodes:r.topDenialCodes};});var totalMonthly=0,totalAnnual=0,totalRecoverable=0;results.forEach(function(r){totalMonthly+=r.monthlyLoss;totalAnnual+=r.annualLoss;totalRecoverable+=r.recoverable80;});return{regions:results,totals:{monthlyLoss:totalMonthly,annualLoss:totalAnnual,recoverable:totalRecoverable}};},
  expenseVariance:function(regionId){
    var src=regionId&&DB.regionalExpenses[regionId]?DB.regionalExpenses[regionId]:DB.expenses;
    var rows=src.map(function(e){var v=e.actual-e.budget;return{id:e.id,name:e.name,category:e.category,budget:e.budget,actual:e.actual,variance:v,variancePct:e.budget?Math.round(v/e.budget*1000)/10:0,favorable:v<=0};});
    var totBud=0,totAct=0;rows.forEach(function(r){totBud+=r.budget;totAct+=r.actual;});
    return{rows:rows,totals:{budget:totBud,actual:totAct,variance:totAct-totBud},region:regionId||"ALL"};
  },
  regionalPnL:function(regionId){
    var regions=regionId?DB.regions.filter(function(r){return r.id===regionId;}):DB.regions;
    return regions.map(function(r){
      var regExp=DB.regionalExpenses[r.id]||[];
      var expBud=0,expAct=0;regExp.forEach(function(e){expBud+=e.budget;expAct+=e.actual;});
      var ebitdaBud=r.revenue.budget-expBud;var ebitdaAct=r.revenue.actual-expAct;
      var expRows=regExp.map(function(e){var v=e.actual-e.budget;return{id:e.id,name:e.name,category:e.category,budget:e.budget,actual:e.actual,variance:v,variancePct:e.budget?Math.round(v/e.budget*1000)/10:0,favorable:v<=0};});
      return{region:r.name,regionId:r.id,tag:r.tag,clinics:r.clinics,revenue:{budget:r.revenue.budget,actual:r.revenue.actual,variance:r.revenue.actual-r.revenue.budget},expenses:{budget:expBud,actual:expAct,variance:expAct-expBud,lines:expRows},ebitda:{budget:ebitdaBud,actual:ebitdaAct,variance:ebitdaAct-ebitdaBud,marginBud:r.revenue.budget?Math.round(ebitdaBud/r.revenue.budget*1000)/10:0,marginAct:r.revenue.actual?Math.round(ebitdaAct/r.revenue.actual*1000)/10:0}};
    });
  },
  forecast:function(){var sum=FE.revenueSummary();var base=sum.revenue.actual;var denialFix=FE.denialAnalysis().totals.monthlyLoss;var scenarios=[{name:"Downside",desc:"5% reimbursement cut",months:[]},{name:"Base",desc:"Current trajectory",months:[]},{name:"Upside",desc:"Full denial fix + 2% growth",months:[]}];for(var m=1;m<=12;m++){scenarios[0].months.push({month:m,revenue:Math.round(base*Math.pow(0.996,m))});scenarios[1].months.push({month:m,revenue:Math.round(base+denialFix*0.05*m)});scenarios[2].months.push({month:m,revenue:Math.round(base+denialFix*0.1*m+base*0.002*m)});}scenarios.forEach(function(sc){sc.annualRevenue=sc.months.reduce(function(s,m){return s+m.revenue;},0);});return{baseMonthly:base,scenarios:scenarios};},
  clinicHealth:function(){return DB.regions.map(function(r){var visitPct=(r.visits.actual/r.visits.budget*100);var revPct=(r.revenue.actual/r.revenue.budget*100);var denialScore=Math.max(0,100-(r.denial.current-r.denial.target)*10);var health=Math.round((visitPct*0.3+revPct*0.3+denialScore*0.2+r.collection*0.2));return{region:r.name,clinics:r.clinics,visitPct:Math.round(visitPct*10)/10,revPct:Math.round(revPct*10)/10,denialRate:r.denial.current,collection:r.collection,healthScore:health,status:health>=90?"Healthy":health>=80?"Watch":"At Risk"};}).sort(function(a,b){return a.healthScore-b.healthScore;});},
  doctorCompImpact:function(){var sum=FE.revenueSummary();var drComp=DB.expenses.find(function(e){return e.id==="DRCOMP";});var compPct=drComp?(drComp.actual/sum.revenue.actual):0.3;return DB.regions.map(function(r){var miss=r.revenue.actual-r.revenue.budget;return{region:r.name,revenueMiss:miss,compRatio:Math.round(compPct*1000)/10,compImpact:Math.round(miss*compPct),quarterlyImpact:Math.round(miss*compPct)*3};});},
  clinicDetail:function(clinicId){var cl=CLINICS.find(function(c){return c.id===clinicId;});if(!cl)return null;var v=cl.revAct-cl.revBud;var denExcess=Math.max(0,cl.denial-(DB.meta.denialTarget||8));var denLoss=Math.round(cl.revAct*denExcess/100);var ar=DB.arAging[cl.id];var provs=DB.providerData[cl.id]||[];return{id:cl.id,name:cl.name,region:REGION_META[cl.region]?REGION_META[cl.region].name:cl.region,lat:cl.lat,lng:cl.lng,revenueBudget:cl.revBud,revenueActual:cl.revAct,variance:v,variancePct:cl.revBud?Math.round(v/cl.revBud*1000)/10:0,visits:cl.visits,denialRate:cl.denial,denialTarget:DB.meta.denialTarget||8,denialExcess:denExcess,denialLoss:denLoss,annualDenialLoss:denLoss*12,collection:cl.collection,recoverable80:Math.round(denLoss*0.8),dso:ar?ar.dso:0,pctOver90:ar?ar.pctOver90:0,totalAR:ar?ar.totalAR:0,prepaidCash:cl.prepaidCash||0,deferredRev:cl.deferredRev||0,blendedCAC:cl.blendedCAC||0,providers:provs};},
  executiveSummary:function(){return{summary:FE.revenueSummary(),varianceBridge:FE.varianceBridge(),topDenialRegion:FE.denialAnalysis("KY"),expenseVariance:FE.expenseVariance(),regionalPnL:FE.regionalPnL(),forecast:FE.forecast()};},
};
/* ═══════════════════════════════════════════════════════════════════
   AGENTS + COMPUTE MAP (preserved, +clinic detail routing)
   ═══════════════════════════════════════════════════════════════════ */
var AGENTS=[
  {id:"maya",name:"Maya",title:"FP&A Director",color:"#4F46E5",data_access:[],skills:["route_query","decompose_task","synthesize_responses","executive_brief"],canCallOn:["raj","priya","alex","sam","jordan"],focus:"Orchestrates the team. Routes queries to specialists. Cannot access raw data directly.",sysBase:"You are Maya, FP&A Director at TVG-Medulla (30 chiropractic clinics, 6 regions, PE-backed by Vistria $16B AUM). You ORCHESTRATE the analyst team. Below is ROUTING METADATA showing which specialists were engaged and their pre-computed outputs. You do NOT recalculate. Synthesize into a concise executive brief using markdown. When decomposing complex queries, explain which specialists you routed to and why."},
  {id:"raj",name:"Raj",title:"Variance Analyst",color:"#DC2626",data_access:["Variance_Data","Regional_PnL"],skills:["variance_bridge","volume_decomposition","rate_analysis","expense_variance","regional_ebitda"],canCallOn:["priya","jordan"],focus:"Every dollar missed, decomposed deterministically. Access: Variance_Data + Regional_PnL.",sysBase:"You are Raj, Variance Analyst at TVG-Medulla. SKILL FILE: data_access=[Variance_Data, Regional_PnL], skills=[variance_bridge, volume_decomposition, rate_analysis, expense_variance, regional_ebitda]. Below is MATHEMATICALLY VERIFIED variance data including REGIONAL P&L (per-region revenue, expenses by category, EBITDA, and margin). You can answer region-specific EBITDA, margin, and expense variance questions. DO NOT access denial or forecast data. Format into clear executive variance commentary with markdown tables."},
  {id:"priya",name:"Priya",title:"Revenue Cycle",color:"#D97706",data_access:["AR_Aging","Denial_Logs"],skills:["denial_analysis","cpt_code_audit","recovery_modeling","collection_optimization"],canCallOn:["raj","jordan"],focus:"Denial expert. Every code quantified in dollars. Access: AR_Aging, Denial_Logs only.",sysBase:"You are Priya, Revenue Cycle Specialist at TVG-Medulla. SKILL FILE: data_access=[AR_Aging, Denial_Logs], skills=[denial_analysis, cpt_code_audit, recovery_modeling, collection_optimization]. Below is MATHEMATICALLY VERIFIED denial/AR data from your authorized access. DO NOT access variance bridge or forecast data. Format into an executive denial report with CPT codes and recovery opportunity. CRITICAL RULE: When queried about AR Aging or DSO, you MUST extract and output the exact quantitative metrics for the specified clinics. You must list the specific Days_Sales_Outstanding_DSO average, the Pct_Over_90 days percentage, and the Total_AR dollar amount. Never use generic qualitative phrases like extended DSO."},
  {id:"alex",name:"Alex",title:"Forecasting",color:"#059669",data_access:["Forecast_Models"],skills:["scenario_modeling","driver_based_forecast","sensitivity_analysis","trend_projection"],canCallOn:["raj","jordan"],focus:"Driver-based forecasts. Three scenarios. Access: Forecast_Models only.",sysBase:"You are Alex, Forecasting Analyst at TVG-Medulla. SKILL FILE: data_access=[Forecast_Models], skills=[scenario_modeling, driver_based_forecast, sensitivity_analysis]. Below is MATHEMATICALLY VERIFIED forecast data. DO NOT access raw clinic data or denial logs. Format into a clear forecast summary with tables."},
  {id:"sam",name:"Sam",title:"Board Reporter",color:"#7C3AED",data_access:["PE_Metrics","SSS","CAC","Regional_Metrics"],skills:["pe_commentary","board_package","investor_narrative","kpi_formatting"],canCallOn:["maya","raj"],focus:"PE-grade commentary for Vistria. Access: PE_Metrics, SSS, CAC, Regional_Metrics.",sysBase:"You are Sam, Board Reporter at TVG-Medulla. SKILL FILE: data_access=[PE_Metrics, SSS, CAC, Regional_Metrics], skills=[pe_commentary, board_package, investor_narrative]. Below is MATHEMATICALLY VERIFIED PE metrics including PRE-COMPUTED regional_metrics. DO NOT access raw denial logs or clinic-level data. Write 3 paragraphs of PE-style commentary. Lead with the number, explain the driver, state the corrective action. CRITICAL RULE: NEVER calculate CAC, Utilization_Pct, or Tech_to_Doc_Ratio by dividing expense or revenue data. ONLY read and report the exact pre-computed values from the regional_metrics JSON object. These are mathematically verified averages computed directly from source spreadsheet data."},
  {id:"jordan",name:"Jordan",title:"Ops Intel",color:"#0891B2",data_access:["Clinic_Health","Ops_Metrics","Regional_Metrics"],skills:["clinic_health_scoring","regional_ranking","risk_flagging","comp_analysis"],canCallOn:["raj","priya"],focus:"Clinic vital signs. Health scores from real metrics. Access: Clinic_Health, Ops_Metrics, Regional_Metrics.",sysBase:"You are Jordan, Ops Intelligence at TVG-Medulla. SKILL FILE: data_access=[Clinic_Health, Ops_Metrics, Regional_Metrics], skills=[clinic_health_scoring, regional_ranking, risk_flagging, comp_analysis]. Below is MATHEMATICALLY VERIFIED clinic health data including PRE-COMPUTED regional_metrics. DO NOT access forecast models or PE metrics. Format into a report with rankings, risk flags, and recommendations. CRITICAL RULE: NEVER calculate Utilization_Pct, Tech_to_Doc_Ratio, Comp_Ratio, or Blended_CAC by dividing expense or revenue data. ONLY read and report the exact pre-computed values from the regional_metrics JSON object. These are mathematically verified averages computed directly from source spreadsheet data."},
];
/* AGENT_COMPUTE — Enforces data_access boundaries per agent skill file */
var AGENT_COMPUTE={
  maya:function(q,routePlan){
    /* Maya CANNOT access raw data. She uses the DYNAMIC ROUTER's plan. */
    var plan=routePlan||[];
    if(plan.length===0){
      /* Fallback: if called without pre-routed plan, use inline intent detection */
      var lc=q.toLowerCase();
      if(/\b(variance|revenue|budget|expense|ebitda|margin)\b/.test(lc))plan.push({agent:"Raj",task:"Variance / P&L analysis",data:"Variance_Data, Regional_PnL"});
      if(/\b(denial|ar |aging|collection|dso|billing|cpt)\b/.test(lc))plan.push({agent:"Priya",task:"Denial/AR analysis",data:"AR_Aging, Denial_Logs"});
      if(/\b(forecast|scenario|projection)\b/.test(lc))plan.push({agent:"Alex",task:"Forecast modeling",data:"Forecast_Models"});
      if(/\b(board|vistria|pe |investor|sss|cac|deferred)\b/.test(lc))plan.push({agent:"Sam",task:"PE commentary",data:"PE_Metrics, SSS, CAC"});
      if(/\b(clinic|health|ops|utilization|provider|comp|tech.to)\b/.test(lc))plan.push({agent:"Jordan",task:"Ops analysis",data:"Clinic_Health, Ops_Metrics"});
      if(plan.length===0)plan=[{agent:"Raj",task:"Variance overview"},{agent:"Jordan",task:"Health scoring"},{agent:"Sam",task:"Executive summary"}];
    }
    /* Collect pre-computed outputs from each routed specialist */
    var routed={};plan.forEach(function(p){var aid=p.agent.toLowerCase();if(AGENT_COMPUTE[aid])routed[p.agent]=AGENT_COMPUTE[aid](q);});
    return{routing_plan:plan,specialist_outputs:routed,meta:{company:"TVG-Medulla",period:"January 2026",clinics:DB.clinicCount,orchestrator:"Maya",routingMethod:"dynamic_intent"}};
  },
  raj:function(q){/* Boundary: Variance_Data + Regional_PnL — no denial, no forecast */
    var lc=q.toLowerCase();
    var rid=null;DB.regions.forEach(function(r){if(lc.includes(r.name.toLowerCase().split(" ")[0])||lc.includes(r.id.toLowerCase()))rid=r.id;});
    /* Detect intent: expense, EBITDA/margin, or revenue variance */
    var wantsExpense=lc.includes("expense")||lc.includes("cost")||lc.includes("spend");
    var wantsEbitda=lc.includes("ebitda")||lc.includes("margin")||lc.includes("p&l")||lc.includes("pnl")||lc.includes("profit");
    if(lc.includes("clinic:")){var cid=q.match(/clinic:(\w+)/);if(cid){var d=FE.clinicDetail(cid[1]);return d?{id:d.id,name:d.name,revenueBudget:d.revenueBudget,revenueActual:d.revenueActual,variance:d.variance,variancePct:d.variancePct,visits:d.visits}:null;}}
    /* Build comprehensive response */
    var result={varianceBridge:FE.varianceBridge(rid)};
    if(wantsExpense||wantsEbitda||rid){result.expenseVariance=FE.expenseVariance(rid);result.regionalPnL=FE.regionalPnL(rid);}
    if(!wantsExpense&&!wantsEbitda&&!rid){result.expenseVariance=FE.expenseVariance();result.regionalPnL=FE.regionalPnL();}
    return result;
  },
  priya:function(q){/* Boundary: AR_Aging + Denial_Logs + Payer_Mix only — no variance bridge */
    var lc=q.toLowerCase();var rid=null;DB.regions.forEach(function(r){if(lc.includes(r.name.toLowerCase().split(" ")[0]))rid=r.id;});
    var base=FE.denialAnalysis(rid);
    /* Enrich with actual Denial Log data */
    var filteredDenials=rid?DB.denialLog.filter(function(d){return d.region&&d.region.toLowerCase().includes(rid.toLowerCase());}):DB.denialLog;
    var cptBreakdown={};filteredDenials.forEach(function(d){var c=d.cptCode||"Unknown";if(!cptBreakdown[c])cptBreakdown[c]={code:c,desc:d.cptDesc||"",count:0,totalCharged:0,topReasons:{}};cptBreakdown[c].count++;cptBreakdown[c].totalCharged+=d.chargeAmount;var rc=d.denialCode||"Unknown";if(!cptBreakdown[c].topReasons[rc])cptBreakdown[c].topReasons[rc]={code:rc,reason:d.denialReason||"",count:0};cptBreakdown[c].topReasons[rc].count++;});
    var payerBreakdown={};filteredDenials.forEach(function(d){var p=d.payer||"Unknown";if(!payerBreakdown[p])payerBreakdown[p]={payer:p,count:0,totalCharged:0};payerBreakdown[p].count++;payerBreakdown[p].totalCharged+=d.chargeAmount;});
    base.denialLogDetail={totalClaims:filteredDenials.length,cptBreakdown:Object.values(cptBreakdown).sort(function(a,b){return b.count-a.count;}).slice(0,10).map(function(c){return{code:c.code,desc:c.desc,count:c.count,totalCharged:Math.round(c.totalCharged),topReasons:Object.values(c.topReasons).sort(function(a,b){return b.count-a.count;}).slice(0,3)};}),payerBreakdown:Object.values(payerBreakdown).sort(function(a,b){return b.count-a.count;}).slice(0,8)};
    /* AR Aging clinic-level data */
    var arClinics=CLINICS.filter(function(c){return rid?c.region===rid:true;});
    var arDetail=[];var arTotals={totalAR:0,totalOver90:0,dsoSum:0,count:0};
    arClinics.forEach(function(c){var ar=DB.arAging[c.id];if(ar){arDetail.push({clinicId:c.id,clinicName:c.name,d030:ar.d030,d3160:ar.d3160,d6190:ar.d6190,d90p:ar.d90p,totalAR:ar.totalAR,pctOver90:ar.pctOver90,dso:ar.dso});arTotals.totalAR+=ar.totalAR;arTotals.dsoSum+=ar.dso;arTotals.count++;if(ar.pctOver90)arTotals.totalOver90+=ar.pctOver90;}});
    base.arAgingDetail={clinics:arDetail,summary:{avgDSO:arTotals.count?Math.round(arTotals.dsoSum/arTotals.count):0,avgPctOver90:arTotals.count?Math.round(arTotals.totalOver90/arTotals.count*10)/10:0,totalAR:arTotals.totalAR,clinicCount:arTotals.count}};
    /* Payer Mix data */
    if(Object.keys(DB.payerMix).length>0){var payerAgg={};var pmClinics=rid?Object.keys(DB.payerMix).filter(function(cid){var cl=CLINICS.find(function(c){return c.id===cid;});return cl&&cl.region===rid;}):Object.keys(DB.payerMix);pmClinics.forEach(function(cid){(DB.payerMix[cid]||[]).forEach(function(pm){if(!payerAgg[pm.payer])payerAgg[pm.payer]={payer:pm.payer,grossCharges:0,adjustments:0,netRevenue:0,claims:0,denials:0};payerAgg[pm.payer].grossCharges+=pm.grossCharges;payerAgg[pm.payer].adjustments+=pm.adjustments;payerAgg[pm.payer].netRevenue+=pm.netRevenue;payerAgg[pm.payer].claims+=pm.claims;payerAgg[pm.payer].denials+=pm.denials;});});base.payerMixSummary=Object.values(payerAgg).map(function(p){return{payer:p.payer,grossCharges:Math.round(p.grossCharges/1000),netRevenue:Math.round(p.netRevenue/1000),claims:p.claims,denials:p.denials,denialRate:p.claims?Math.round(p.denials/p.claims*1000)/10:0};}).sort(function(a,b){return b.grossCharges-a.grossCharges;});}
    return base;
  },
  alex:function(q){/* Boundary: Forecast_Models + Monthly_Trend + Budget_Assumptions only */
    var base=FE.forecast();
    /* Enrich with monthly trend data */
    if(Object.keys(DB.monthlyTrend).length>0){var periodAgg={};Object.values(DB.monthlyTrend).forEach(function(clinicTrends){clinicTrends.forEach(function(t){if(!periodAgg[t.period])periodAgg[t.period]={period:t.period,visits:0,revenue:0,avgDenial:0,clinicCount:0};periodAgg[t.period].visits+=t.visits;periodAgg[t.period].revenue+=t.netRevenue;periodAgg[t.period].avgDenial+=t.denialRate;periodAgg[t.period].clinicCount++;});});base.historicalTrend=Object.values(periodAgg).map(function(p){return{period:p.period,visits:p.visits,revenue:Math.round(p.revenue/1000),avgDenialRate:Math.round(p.avgDenial/p.clinicCount*10)/10};}).sort(function(a,b){return a.period<b.period?-1:1;});}
    /* Enrich with budget assumptions */
    if(Object.keys(DB.budgetAssumptions).length>0){var baSum={totalAnnualBudget:0,avgRPV:0,avgDenialTarget:0,avgEbitdaTarget:0,count:0};Object.values(DB.budgetAssumptions).forEach(function(ba){baSum.totalAnnualBudget+=ba.annualRevBudget;baSum.avgRPV+=ba.rpvAssumption;baSum.avgDenialTarget+=ba.denialTarget;baSum.avgEbitdaTarget+=ba.ebitdaMarginTarget;baSum.count++;});base.budgetContext={totalAnnualBudget:Math.round(baSum.totalAnnualBudget/1000),avgRPV:Math.round(baSum.avgRPV/baSum.count),avgDenialTarget:Math.round(baSum.avgDenialTarget/baSum.count*10)/10,avgEbitdaTarget:Math.round(baSum.avgEbitdaTarget/baSum.count*10)/10};}
    return base;
  },
  sam:function(q){/* Boundary: PE_Metrics, SSS, CAC only — receives executive summary (aggregated, not raw) */
    var base=FE.executiveSummary();
    /* Enrich with SSS (Same-Store Sales) vs Acquired breakdown + CAC + Deferred Revenue */
    var sssData={core:{clinics:0,revBud:0,revAct:0,visits:0,visitsBud:0,newPatients:0,totalCAC:0,prepaidCash:0,deferredRev:0},acquired:{clinics:0,revBud:0,revAct:0,visits:0,visitsBud:0,newPatients:0,totalCAC:0,prepaidCash:0,deferredRev:0}};
    CLINICS.forEach(function(cl){var bucket=(cl.region==="KY")?"acquired":"core";sssData[bucket].clinics++;sssData[bucket].revBud+=cl.revBud;sssData[bucket].revAct+=cl.revAct;sssData[bucket].visits+=cl.visits;sssData[bucket].visitsBud+=cl.visitsBud;sssData[bucket].newPatients+=cl.newPatients;sssData[bucket].totalCAC+=(cl.blendedCAC*cl.newPatients);sssData[bucket].prepaidCash+=cl.prepaidCash;sssData[bucket].deferredRev+=cl.deferredRev;});
    sssData.core.variance=sssData.core.revAct-sssData.core.revBud;sssData.core.variancePct=sssData.core.revBud?Math.round(sssData.core.variance/sssData.core.revBud*1000)/10:0;sssData.core.avgCAC=sssData.core.newPatients?Math.round(sssData.core.totalCAC/sssData.core.newPatients):0;
    sssData.acquired.variance=sssData.acquired.revAct-sssData.acquired.revBud;sssData.acquired.variancePct=sssData.acquired.revBud?Math.round(sssData.acquired.variance/sssData.acquired.revBud*1000)/10:0;sssData.acquired.avgCAC=sssData.acquired.newPatients?Math.round(sssData.acquired.totalCAC/sssData.acquired.newPatients):0;
    /* Per-region breakdown for core */
    var regionSSS=[];DB.regions.filter(function(r){return r.id!=="KY";}).forEach(function(r){var regClinics=CLINICS.filter(function(c){return c.region===r.id;});var np=0,cac=0,pp=0,dr=0;regClinics.forEach(function(c){np+=c.newPatients;cac+=(c.blendedCAC*c.newPatients);pp+=c.prepaidCash;dr+=c.deferredRev;});regionSSS.push({region:r.name,clinics:r.clinics,revBud:r.revenue.budget,revAct:r.revenue.actual,variance:r.revenue.actual-r.revenue.budget,variancePct:r.revenue.budget?Math.round((r.revenue.actual-r.revenue.budget)/r.revenue.budget*1000)/10:0,newPatients:np,avgCAC:np?Math.round(cac/np):0,prepaidCash:pp,deferredRev:dr});});
    base.sssBreakdown={core:sssData.core,acquired:sssData.acquired,coreRegions:regionSSS};
    /* ── PRE-COMPUTED REGIONAL METRICS (deterministic, no LLM math) ── */
    base.regional_metrics=JSON.parse(JSON.stringify(DB.regionalMetrics));
    return base;
  },
  jordan:function(q){/* Boundary: Clinic_Health, Ops_Metrics + Provider_Productivity + Regional_Metrics only */var lc=q.toLowerCase();
    var wantsComp=lc.includes("comp")||lc.includes("doctor")||lc.includes("provider")||lc.includes("tech-to");
    var rid=null;DB.regions.forEach(function(r){if(lc.includes(r.name.toLowerCase().split(" ")[0])||lc.includes(r.id.toLowerCase()))rid=r.id;});
    var base=wantsComp?FE.doctorCompImpact():FE.clinicHealth();
    /* ── PRE-COMPUTED REGIONAL METRICS (deterministic, no LLM math) ── */
    base.regional_metrics=rid?{[rid]:DB.regionalMetrics[rid]}:JSON.parse(JSON.stringify(DB.regionalMetrics));
    /* Enrich with provider productivity — regional breakdown */
    if(Object.keys(DB.providerData).length>0){
      var regionProv={};CLINICS.forEach(function(cl){var provs=DB.providerData[cl.id];if(!provs)return;if(!regionProv[cl.region])regionProv[cl.region]={region:cl.region,providers:0,avgUtil:0,avgCompRatio:0,avgTechRatio:0,totalRevenue:0,totalComp:0,clinicDetail:[]};var rp=regionProv[cl.region];var clinicProvs=[];provs.forEach(function(p){rp.providers++;rp.avgUtil+=p.utilization;rp.avgCompRatio+=p.compRatio;rp.avgTechRatio+=p.techRatio;rp.totalRevenue+=p.revenue;rp.totalComp+=p.comp;clinicProvs.push({name:p.name,credentials:p.credentials,visits:p.visits,revenue:p.revenue,comp:p.comp,compRatio:p.compRatio,utilization:p.utilization,techRatio:p.techRatio,newPatients:p.newPatients});});rp.clinicDetail.push({clinicId:cl.id,clinicName:cl.name,providers:clinicProvs});});
      var regionProvSummary=Object.values(regionProv).map(function(rp){return{region:rp.region,providers:rp.providers,avgUtilization:rp.providers?Math.round(rp.avgUtil/rp.providers*10)/10:0,avgCompRatio:rp.providers?Math.round(rp.avgCompRatio/rp.providers*10)/10:0,avgTechToDocRatio:rp.providers?Math.round(rp.avgTechRatio/rp.providers*100)/100:0,totalRevenue:Math.round(rp.totalRevenue/1000),totalComp:Math.round(rp.totalComp/1000),clinicDetail:rp.clinicDetail};});
      var allProv={totalProviders:0,avgUtil:0,avgCompRatio:0,totalRevenue:0,totalComp:0};Object.values(DB.providerData).forEach(function(provs){provs.forEach(function(p){allProv.totalProviders++;allProv.avgUtil+=p.utilization;allProv.avgCompRatio+=p.compRatio;allProv.totalRevenue+=p.revenue;allProv.totalComp+=p.comp;});});
      base.providerSummary={totalProviders:allProv.totalProviders,avgUtilization:Math.round(allProv.avgUtil/allProv.totalProviders*10)/10,avgCompRatio:Math.round(allProv.avgCompRatio/allProv.totalProviders*10)/10,totalRevenue:Math.round(allProv.totalRevenue/1000),totalComp:Math.round(allProv.totalComp/1000)};
      base.providerByRegion=regionProvSummary;
    }
    return base;
  }
};
var QUICK={maya:[{l:"Executive summary",p:"Write January 2026 executive summary for CFO."},{l:"Board checklist",p:"What does Vistria need in the board package?"}],raj:[{l:"Revenue variance bridge",p:"Full variance bridge: volume, rate, denial by region."},{l:"Expense variance",p:"Analyze all expense lines vs budget."}],priya:[{l:"KY denial deep dive",p:"Root cause analysis on Kentucky 16% denial rate."},{l:"Recovery model",p:"If all regions hit 8% target, what is the annual recovery?"}],alex:[{l:"12-month forecast",p:"Show base, upside, and downside scenarios."},{l:"Upside detail",p:"What happens if we fix denials AND grow 2% organically?"}],sam:[{l:"Board commentary",p:"3-paragraph variance commentary for Vistria board package."},{l:"Email to VP Finance",p:"Email to Sean McMahon: January findings + 3 next steps."}],jordan:[{l:"Clinic health rankings",p:"Rank all regions by health score with risk flags."},{l:"Doctor comp impact",p:"Revenue miss impact on quarterly doctor comp."}]};
var INSIGHTS=[{sev:"critical",title:"Kentucky denial rate 16%+",metric:null,agent:"priya",actions:[{label:"Standardize billing codes",detail:"Migrate KY clinics to CPT library.",agent:"priya"},{label:"Pre-submission scrubbing",detail:"Auto-catch 60-70% of coding errors.",agent:"priya"}]},{sev:"warning",title:"Arizona volumes below budget",metric:null,agent:"jordan",actions:[{label:"Targeted marketing",detail:"Reallocate to AZ campaigns.",agent:"jordan"},{label:"Referral audit",detail:"Re-engage top 10 PCPs.",agent:"jordan"}]},{sev:"info",title:"Marketing over budget",metric:null,agent:"raj",actions:[{label:"Attribution tracking",detail:"UTM to measure cost per patient.",agent:"raj"},{label:"Consolidate agencies",detail:"Centralize buying.",agent:"raj"}]}];
/* INSIGHTS metrics computed dynamically in handleDrop after ETL completes */


/* ═══════════════════════════════════════════════════════════════════
   US MAP — Pure SVG with proper Mercator projection
   Each state defined as [lng,lat] polygon points using real coordinates
   ═══════════════════════════════════════════════════════════════════ */
function proj(lng,lat){return[(lng+130)/65*960,(50-lat)/26*420];}
function polyPath(pts){return pts.map(function(p,i){var xy=proj(p[0],p[1]);return(i===0?"M":"L")+xy[0].toFixed(1)+","+xy[1].toFixed(1);}).join(" ")+"Z";}
var US_SHAPES=[
  {id:"WA",pts:[[-124.7,49],[-117,49],[-117,46],[-122.5,46],[-124.7,46.3]]},
  {id:"OR",pts:[[-124.5,46.2],[-117,46],[-117,42],[-124.5,42]]},
  {id:"CA",pts:[[-124.4,42],[-120,42],[-117.5,37],[-117,34],[-120,33],[-122,37],[-124.4,40]]},
  {id:"NV",pts:[[-120,42],[-114,42],[-114,35],[-117.5,37]]},
  {id:"ID",pts:[[-117,49],[-114,49],[-111,44],[-111,42],[-117,42]]},
  {id:"MT",pts:[[-116,49],[-104,49],[-104,45],[-111,44],[-116,46]]},
  {id:"WY",pts:[[-111.1,45],[-104.1,45],[-104.1,41],[-111.1,41]]},
  {id:"UT",pts:[[-114.1,42],[-109,42],[-109,37],[-114.1,37]]},
  {id:"CO",pts:[[-109.1,41],[-102,41],[-102,37],[-109.1,37]]},
  {id:"AZ",pts:[[-114.8,37],[-109,37],[-109,31.3],[-114.8,32.5]]},
  {id:"NM",pts:[[-109.1,37],[-103,37],[-103,32],[-109.1,32]]},
  {id:"ND",pts:[[-104.1,49],[-96.5,49],[-96.5,46],[-104.1,46]]},
  {id:"SD",pts:[[-104.1,46],[-96.5,46],[-96.5,43],[-104.1,43]]},
  {id:"NE",pts:[[-104.1,43],[-96,43],[-95.5,40],[-104.1,40]]},
  {id:"KS",pts:[[-102.1,40],[-94.6,40],[-94.6,37],[-102.1,37]]},
  {id:"OK",pts:[[-103,37],[-94.4,37],[-94.4,33.8],[-100,33.8],[-103,36.5]]},
  {id:"TX",pts:[[-103.1,36.5],[-100,33.8],[-94,33.8],[-94,30],[-97,26],[-103,32]]},
  {id:"MN",pts:[[-97.2,49],[-89.5,49],[-89.5,43.5],[-96.5,43.5]]},
  {id:"IA",pts:[[-96.6,43.5],[-90,43.5],[-90,40.5],[-96.6,40.5]]},
  {id:"MO",pts:[[-95.8,40.6],[-89,40.6],[-89,36],[-95.8,36]]},
  {id:"AR",pts:[[-94.5,36.5],[-89.6,36.5],[-89.6,33],[-94.5,33]]},
  {id:"LA",pts:[[-94.1,33],[-89,33],[-89,29.5],[-92,29],[-94.1,30]]},
  {id:"WI",pts:[[-92.9,47],[-86.8,47],[-86.8,42.5],[-92.9,42.5]]},
  {id:"IL",pts:[[-91.5,42.5],[-87.5,42.5],[-87.5,37],[-91.5,37]]},
  {id:"IN",pts:[[-88,42],[-84.8,42],[-84.8,38],[-88,38]]},
  {id:"MI",pts:[[-87,46],[-82.5,46],[-82.5,41.7],[-84.5,41.7],[-87,43]]},
  {id:"OH",pts:[[-84.9,42],[-80.5,42],[-80.5,38.4],[-84.9,38.4]]},
  {id:"KY",pts:[[-89.6,39],[-82,39],[-82,36.5],[-89.6,36.5]]},
  {id:"TN",pts:[[-90.3,36.7],[-82,36.7],[-82,35],[-90.3,35]]},
  {id:"MS",pts:[[-91.7,35],[-88.3,35],[-88.3,30.2],[-91.7,30.2]]},
  {id:"AL",pts:[[-88.5,35],[-85,35],[-85,30.2],[-88.5,30.2]]},
  {id:"GA",pts:[[-85.6,35],[-81,35],[-81,30.4],[-85.6,30.4]]},
  {id:"FL",pts:[[-87.6,31],[-80,31],[-80,25],[-82,24.5],[-87.6,30]]},
  {id:"SC",pts:[[-83.4,35],[-79,35],[-79,32],[-83.4,32]]},
  {id:"NC",pts:[[-84.3,36.6],[-75.5,36.6],[-75.5,34],[-84.3,34.5]]},
  {id:"VA",pts:[[-83.7,39.5],[-76,39.5],[-75.5,37],[-83.7,36.6]]},
  {id:"WV",pts:[[-82.6,40.6],[-79.5,40.6],[-79.5,37.2],[-82.6,37.2]]},
  {id:"PA",pts:[[-80.5,42.3],[-74.7,42.3],[-74.7,39.7],[-80.5,39.7]]},
  {id:"NY",pts:[[-79.8,45],[-73,45],[-73,40.5],[-79.8,40.5]]},
  {id:"ME",pts:[[-71.1,47.5],[-67,47],[-67,43.5],[-70.7,43.1],[-71.1,45]]},
  {id:"VT",pts:[[-73.4,45],[-72.5,45],[-72.5,42.7],[-73.4,42.7]]},
  {id:"NH",pts:[[-72.6,45.3],[-71,45],[-71,42.7],[-72.6,42.7]]},
  {id:"MA",pts:[[-73.5,42.7],[-70,42.7],[-70,41.2],[-73.5,41.2]]},
  {id:"CT",pts:[[-73.7,42],[-72,42],[-72,41],[-73.7,41]]},
  {id:"NJ",pts:[[-75.6,41.4],[-74,41.4],[-74,38.9],[-75.6,38.9]]},
  {id:"MD",pts:[[-79.5,39.7],[-75.1,39.7],[-75.1,38],[-79.5,38]]},
];
var ACT_STATES=["IL","IN","KY","WA","OR","AZ","MO","KS"];

function ClinicMap({clinics,onSelect,clinicColor}){
  var _h=useState(null),hov=_h[0],setHov=_h[1];
  var _p=useState({x:0,y:0}),tp=_p[0],setTp=_p[1];
  return <div style={{position:"relative"}}>
    <svg viewBox="0 0 960 420" style={{width:"100%",height:"auto",display:"block"}}>
      {US_SHAPES.map(function(st){var isA=ACT_STATES.indexOf(st.id)>=0;return <path key={st.id} d={polyPath(st.pts)} fill={isA?"rgba(79,70,229,0.06)":"#F8FAFC"} stroke={isA?"rgba(79,70,229,0.25)":"#E2E8F0"} strokeWidth={isA?1:0.5}/>;})}
      {clinics.map(function(cl){var xy=proj(cl.lng,cl.lat);var r=5+(cl.visits-280)/280*6;var col=clinicColor(cl);var isH=hov&&hov.id===cl.id;
        return <circle key={cl.id} cx={xy[0]} cy={xy[1]} r={isH?r+3:r} fill={col} fillOpacity={isH?1:0.75} stroke={isH?"#0F172A":col} strokeWidth={isH?1.5:0.8} style={{cursor:"pointer",transition:"all 0.15s"}} onMouseEnter={function(e){setHov(cl);setTp({x:e.nativeEvent.offsetX,y:e.nativeEvent.offsetY});}} onMouseLeave={function(){setHov(null);}} onClick={function(){onSelect(cl);}}/>;
      })}
      {[{id:"IL",lng:-89.5,lat:44},{id:"IN",lng:-86.5,lat:43.5},{id:"KY",lng:-86,lat:36},{id:"PNW",lng:-123,lat:48.5},{id:"AZ",lng:-112,lat:35},{id:"MO-KS",lng:-95.5,lat:39.5}].map(function(rl){var xy=proj(rl.lng,rl.lat);return <text key={rl.id} x={xy[0]} y={xy[1]} textAnchor="middle" fill="#94A3B8" fontSize="11" fontFamily={F.mono} fontWeight="500">{rl.id}</text>;})}
    </svg>
    {hov&&<div style={{position:"absolute",left:Math.min(tp.x+12,780),top:Math.max(tp.y-110,10),pointerEvents:"none",zIndex:20}}>
      <div style={{background:"white",border:"1px solid "+C.border,borderRadius:8,padding:"12px 16px",boxShadow:"0 4px 16px rgba(0,0,0,0.08)",minWidth:200}}>
        <div style={{fontSize:13,fontWeight:600,color:C.text,marginBottom:4}}>{hov.name}</div>
        <div style={{fontSize:10,color:C.textDim,fontFamily:F.mono,marginBottom:8}}>{REGION_META[hov.region]?REGION_META[hov.region].name:hov.region}</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"4px 16px",fontSize:11,fontFamily:F.mono}}>
          <span style={{color:C.textDim}}>Revenue</span><span style={{textAlign:"right",fontVariantNumeric:"tabular-nums"}}>{"$"+hov.revAct+"K"}</span>
          <span style={{color:C.textDim}}>Variance</span><span style={{textAlign:"right",color:(hov.revAct-hov.revBud)>=0?C.positive:C.negative,fontWeight:500,fontVariantNumeric:"tabular-nums"}}>{((hov.revAct-hov.revBud)>=0?"+":"")+(hov.revAct-hov.revBud)+"K"}</span>
          <span style={{color:C.textDim}}>Denial</span><span style={{textAlign:"right",color:hov.denial>12?C.negative:hov.denial>9?C.warning:C.positive,fontWeight:500}}>{hov.denial+"%"}</span>
          <span style={{color:C.textDim}}>Visits</span><span style={{textAlign:"right"}}>{hov.visits}</span>
        </div>
      </div>
    </div>}
  </div>;
}

/* Inline editable cell for the clinic data grid */
function EditCell({val,suffix,color,onSave}){
  var _e=useState(false),ed=_e[0],setEd=_e[1];
  var _v=useState(val+""),ev=_v[0],setEv=_v[1];
  function commit(){var n=parseFloat(ev);if(!isNaN(n)){onSave(n);}setEd(false);}
  if(ed)return <input autoFocus value={ev} onChange={function(e){setEv(e.target.value);}} onBlur={commit} onKeyDown={function(e){if(e.key==="Enter")commit();if(e.key==="Escape")setEd(false);}} style={{width:52,padding:"2px 4px",borderRadius:4,border:"1px solid "+C.accent,background:"white",color:C.text,fontSize:11,fontFamily:F.mono,textAlign:"right",outline:"none"}}/>;
  return <span onClick={function(){setEv(val+"");setEd(true);}} style={{cursor:"pointer",color:color||C.text,fontWeight:500,padding:"2px 4px",borderRadius:3,transition:"background 0.1s"}} title="Click to edit">{suffix==="K"?"$"+val+"K":suffix==="%"?val+"%":""+val}</span>;
}

/* ═══════════════════════════════════════════════════════════════════
   SCENARIO SANDBOX — click a clinic on the map, model recovery
   ═══════════════════════════════════════════════════════════════════ */
function Sandbox({clinic,onClose}){
  if(!clinic)return null;
  var base=FE.clinicDetail(clinic.id);if(!base)return null;
  var _den=useState(base.denialRate),newDen=_den[0],setNewDen=_den[1];
  var _vis=useState(base.visits),newVis=_vis[0],setNewVis=_vis[1];
  var _col=useState(base.collection),newCol=_col[0],setNewCol=_col[1];
  var newRevEst=Math.round(newVis*(base.revenueActual/base.visits)*(1-(newDen-base.denialTarget)/100)*(newCol/base.collection));
  var uplift=newRevEst-base.revenueActual;
  return <div style={{background:"white",border:"1px solid "+C.border,borderRadius:12,padding:"20px 24px",marginTop:16,boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
      <div><div style={{fontSize:10,fontWeight:500,color:C.accent,fontFamily:F.mono,textTransform:"uppercase",letterSpacing:"0.06em"}}>SCENARIO SANDBOX</div><div style={{fontSize:16,fontWeight:600,letterSpacing:"-0.02em",marginTop:4,color:C.text}}>{base.name}</div></div>
      <button onClick={onClose} style={{background:"none",border:"1px solid "+C.border,borderRadius:6,color:C.textDim,cursor:"pointer",padding:"4px 10px",fontSize:11,fontFamily:F.sans}}>Close</button>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:16}}>
      <div><div style={{fontSize:10,color:C.textDim,fontFamily:F.mono,marginBottom:6}}>Denial Rate %</div><input type="range" min="2" max="20" step="0.5" value={newDen} onChange={function(e){setNewDen(parseFloat(e.target.value));}} style={{width:"100%",accentColor:C.accent}}/><div style={{display:"flex",justifyContent:"space-between",fontSize:11,fontFamily:F.mono,marginTop:2}}><span style={{color:C.textDim}}>Current: {base.denialRate}%</span><span style={{color:newDen<base.denialRate?C.positive:C.text,fontWeight:500}}>{newDen}%</span></div></div>
      <div><div style={{fontSize:10,color:C.textDim,fontFamily:F.mono,marginBottom:6}}>Monthly Visits</div><input type="range" min={Math.round(base.visits*0.8)} max={Math.round(base.visits*1.3)} step="10" value={newVis} onChange={function(e){setNewVis(parseInt(e.target.value));}} style={{width:"100%",accentColor:C.accent}}/><div style={{display:"flex",justifyContent:"space-between",fontSize:11,fontFamily:F.mono,marginTop:2}}><span style={{color:C.textDim}}>Current: {base.visits}</span><span style={{color:newVis>base.visits?C.positive:C.text,fontWeight:500}}>{newVis}</span></div></div>
      <div><div style={{fontSize:10,color:C.textDim,fontFamily:F.mono,marginBottom:6}}>Collection %</div><input type="range" min="75" max="98" step="1" value={newCol} onChange={function(e){setNewCol(parseInt(e.target.value));}} style={{width:"100%",accentColor:C.accent}}/><div style={{display:"flex",justifyContent:"space-between",fontSize:11,fontFamily:F.mono,marginTop:2}}><span style={{color:C.textDim}}>Current: {base.collection}%</span><span style={{color:newCol>base.collection?C.positive:C.text,fontWeight:500}}>{newCol}%</span></div></div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
      {[{l:"Current Rev",v:"$"+base.revenueActual+"K",col:C.text},{l:"Modeled Rev",v:"$"+newRevEst+"K",col:uplift>0?C.positive:C.negative},{l:"Monthly Uplift",v:(uplift>=0?"+":"")+uplift+"K",col:uplift>0?C.positive:C.negative},{l:"Annual Impact",v:(uplift>=0?"+":"")+uplift*12+"K",col:uplift>0?C.positive:C.negative}].map(function(m,i){return <div key={i} style={{background:C.surface,border:"1px solid "+C.border,borderRadius:8,padding:"12px 14px",textAlign:"center"}}><div style={{fontSize:9,color:C.textDim,fontFamily:F.mono,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:4}}>{m.l}</div><div style={{fontSize:18,fontWeight:600,fontFamily:F.mono,color:m.col,fontVariantNumeric:"tabular-nums"}}>{m.v}</div></div>;})}
    </div>
  </div>;
}
AGENTS_REF=AGENTS;

/* ═══════════════════════════════════════════════════════════════════
   ETL LOADING SEQUENCE — Terminal-style animation
   ═══════════════════════════════════════════════════════════════════ */
var ETL_STEPS=[
  {text:"[1/9] Extracting Data Room Index...",delay:0},
  {text:"[2/9] Parsing Clinic Export — 30 clinics, 15 fields...",delay:400},
  {text:"[3/9] Loading Expense Detail — 240 line items → 8 categories...",delay:800},
  {text:"[4/9] Ingesting Denial Log — 372 claims with CPT codes...",delay:1200},
  {text:"[5/9] Mapping Payer Mix — gross charges, adjustments, denial rates...",delay:1600},
  {text:"[6/9] Parsing Provider Productivity — 65 providers, utilization...",delay:2000},
  {text:"[7/9] Loading Monthly Trend — 4-month clinic time series...",delay:2400},
  {text:"[8/9] Reading Budget Assumptions — targets, breakeven, EBITDA...",delay:2800},
  {text:"[9/9] Mapping AR Aging — DSO, 90+ day buckets...",delay:3200},
  {text:"[Building] FinanceEngine variance bridge + agent compute...",delay:3500},
  {text:"[Ready] All 9 sheets extracted. Initializing agents.",delay:3800},
];

/* ═══════════════════════════════════════════════════════════════════
   MAIN APP — Phase 8: ETL-Gated Dashboard
   ═══════════════════════════════════════════════════════════════════ */
export default function App(){
  /* === ETL STATE === */
  var _loaded=useState(false),isDataLoaded=_loaded[0],setDataLoaded=_loaded[1];
  var _etl=useState(null),etlPhase=_etl[0],setEtlPhase=_etl[1]; // null | "loading" | "done"
  var _etlLines=useState([]),etlLines=_etlLines[0],setEtlLines=_etlLines[1];
  var _etlStats=useState(null),etlStats=_etlStats[0],setEtlStats=_etlStats[1];
  var _dragOver=useState(false),dragOver=_dragOver[0],setDragOver=_dragOver[1];
  var _etlErr=useState(null),etlErr=_etlErr[0],setEtlErr=_etlErr[1];

  /* === DASHBOARD STATE (preserved from v7) === */
  var _v=useState("home"),view=_v[0],setView=_v[1];
  var _a=useState(null),agent=_a[0],setAgent=_a[1];
  var _m=useState({}),msgs=_m[0],setMsgs=_m[1];
  var _i=useState(""),input=_i[0],setInput=_i[1];
  var _b=useState(false),busy=_b[0],setBusy=_b[1];
  var _ho=useState([]),handoffs=_ho[0],setHandoffs=_ho[1];
  var _sc=useState({type:"idle",from:"maya",to:"raj"}),scene=_sc[0],setScene=_sc[1];
  var _tk=useState({calls:0,inp:0,out:0}),tk=_tk[0],setTk=_tk[1];
  var _sb=useState(null),sandbox=_sb[0],setSandbox=_sb[1];
  var _ver=useState(0),ver=_ver[0],setVer=_ver[1];
  var _decomp=useState([]),decomp=_decomp[0],setDecomp=_decomp[1];
  var _apiKey=useState(localStorage.getItem("medulla_api_key")||""),apiKey=_apiKey[0],setApiKey=_apiKey[1];
  var _showKey=useState(!localStorage.getItem("medulla_api_key")),showKeyInput=_showKey[0],setShowKeyInput=_showKey[1];
  var _layout=useState("default"),layout=_layout[0],setLayout=_layout[1]; // "default" | "chat" | "office"
  var LAYOUTS={default:{left:"60%",right:"40%"},chat:{left:"100%",right:"0%"},office:{left:"35%",right:"65%"}};
  var endRef=useRef(null);
  function saveApiKey(k){setApiKey(k);localStorage.setItem("medulla_api_key",k);setShowKeyInput(false);}

  function updateClinic(clinicId,field,value){
    var cl=CLINICS.find(function(c){return c.id===clinicId;});
    if(cl){cl[field]=value;setVer(function(v){return v+1;});}
  }

  /* === HANDLE DROP — ETL Pipeline === */
  function handleDrop(e){
    e.preventDefault();e.stopPropagation();setDragOver(false);setEtlErr(null);
    var files=e.dataTransfer?e.dataTransfer.files:e.target.files;
    if(!files||files.length===0)return;
    var file=files[0];
    if(!file.name.match(/\.xlsx?$/i)){setEtlErr("Please drop an .xlsx file");return;}

    setEtlPhase("loading");setEtlLines([]);
    var reader=new FileReader();
    reader.onload=function(evt){
      try{
        var data=new Uint8Array(evt.target.result);
        var workbook=XLSX.read(data,{type:"array"});
        var parsed=parseDataRoom(workbook);
        if(parsed.clinics.length===0){setEtlErr("No clinic data found. Ensure 'Clinic Export' sheet exists.");setEtlPhase(null);return;}

        /* Populate mutable globals — all 9 sheets */
        CLINICS.length=0;
        parsed.clinics.forEach(function(c){CLINICS.push(c);});
        DB.expenses=parsed.expenses;
        DB.regionalExpenses=parsed.regionalExpenses||{};
        DB.regionalMetrics=parsed.regionalMetrics||{};
        DB.arAging=parsed.arAging;
        DB.providerData=parsed.providerData;
        DB.denialLog=parsed.denialLog;
        DB.payerMix=parsed.payerMix;
        DB.monthlyTrend=parsed.monthlyTrend;
        DB.budgetAssumptions=parsed.budgetAssumptions;
        DB.extraction=parsed.extraction;

        /* Compute INSIGHTS metrics now that data is loaded */
        try{
          var da=FE.denialAnalysis("KY");INSIGHTS[0].metric="$"+da.totals.monthlyLoss+"K/mo";
          var azBridge=FE.varianceBridge("AZ");INSIGHTS[1].metric="$"+Math.abs(azBridge.totals.totalVariance)+"K/mo";
          var exp=FE.expenseVariance();var mkt=exp.rows.find(function(r){return r.name&&r.name.includes("Marketing");});if(mkt)INSIGHTS[2].metric="$"+mkt.actual+"K vs $"+mkt.budget+"K";
        }catch(e2){}

        /* Stats for the loading screen */
        var totalRows=parsed.extraction.reduce(function(s,e){return s+e.rows;},0);
        var stats={clinics:parsed.clinics.length,regions:DB.regions.length,arClinics:Object.keys(parsed.arAging).length,providers:Object.values(parsed.providerData).reduce(function(s,arr){return s+arr.length;},0),denials:parsed.denialLog.length,payerClinics:Object.keys(parsed.payerMix).length,trendPeriods:Object.keys(parsed.monthlyTrend).length>0?parsed.monthlyTrend[Object.keys(parsed.monthlyTrend)[0]].length:0,budgetClinics:Object.keys(parsed.budgetAssumptions).length,sheets:workbook.SheetNames.length,sheetNames:workbook.SheetNames,totalRows:totalRows,extraction:parsed.extraction,fileName:file.name,fileSize:Math.round(file.size/1024)+"KB"};
        setEtlStats(stats);

        /* Run terminal animation — show extraction receipt at end */
        ETL_STEPS.forEach(function(step,idx){
          setTimeout(function(){setEtlLines(function(prev){return prev.concat(step.text);});
            if(idx===ETL_STEPS.length-1){
              setTimeout(function(){setEtlPhase("done");},400);
            }
          },step.delay);
        });
      }catch(err){setEtlErr("Parse error: "+err.message);setEtlPhase(null);}
    };
    reader.onerror=function(){setEtlErr("Failed to read file");setEtlPhase(null);};
    reader.readAsArrayBuffer(file);
  }

  var SUM=isDataLoaded?FE.revenueSummary():{revenue:{budget:0,actual:0,variance:0,variancePct:0},expenses:{budget:0,actual:0},ebitda:{budget:0,actual:0,variance:0,marginBud:0,marginAct:0},denial:{weighted:0,target:8},clinics:0,period:""};

  /* ═══ DYNAMIC INTENT ROUTER — analyzes query to determine activeAgents ═══ */
  function routeIntent(query){
    var lc=query.toLowerCase();var agents=[];var tasks=[];
    /* ── Financial variance / revenue / budget / expense / EBITDA / margin ── */
    if(/\b(variance|revenue|budget|miss|expense|cost|spend|ebitda|margin|p&l|pnl|profit)\b/.test(lc)){
      agents.push("raj");tasks.push({agent:"Raj",task:(/\b(ebitda|margin|p&l|pnl|profit)\b/.test(lc))?"Regional P&L analysis":(/\b(expense|cost|spend)\b/.test(lc))?"Expense variance analysis":"Variance bridge analysis",data:"Variance_Data, Regional_PnL"});
    }
    /* ── Denial / AR / collection / DSO / billing codes ── */
    if(/\b(denial|denied|ar |ar$|aging|collection|dso|billing|cpt|payer|claim|scrub|modifier|co-4|co-16)\b/.test(lc)){
      agents.push("priya");tasks.push({agent:"Priya",task:"Denial/AR analysis",data:"AR_Aging, Denial_Logs"});
    }
    /* ── Forecast / scenario / projection ── */
    if(/\b(forecast|scenario|projection|predict|model|upside|downside|base case)\b/.test(lc)){
      agents.push("alex");tasks.push({agent:"Alex",task:"Forecast modeling",data:"Forecast_Models"});
    }
    /* ── Board / PE / investor / Vistria ── */
    if(/\b(board|vistria|pe |investor|package|commentary|sss|same.store|cac|deferred)\b/.test(lc)){
      agents.push("sam");tasks.push({agent:"Sam",task:"PE commentary / SSS analysis",data:"PE_Metrics, SSS, CAC"});
    }
    /* ── Clinic ops / health / utilization / provider / comp / tech-to-doc ── */
    if(/\b(clinic|health|ops|region|utilization|provider|tech.to|comp.ratio|doctor comp|ranking|risk)\b/.test(lc)){
      agents.push("jordan");tasks.push({agent:"Jordan",task:"Ops / provider analysis",data:"Clinic_Health, Ops_Metrics"});
    }
    /* ── Region name triggers — add relevant agents for cross-cutting queries ── */
    var hasRegion=false;DB.regions.forEach(function(r){if(lc.includes(r.name.toLowerCase().split(" ")[0])||lc.includes(r.id.toLowerCase()))hasRegion=true;});
    if(hasRegion&&agents.indexOf("raj")<0){agents.push("raj");tasks.push({agent:"Raj",task:"Regional variance",data:"Variance_Data, Regional_PnL"});}
    /* ── Fallback if nothing matched ── */
    if(agents.length===0){agents=["raj","jordan","sam"];tasks=[{agent:"Raj",task:"Variance overview"},{agent:"Jordan",task:"Health scoring"},{agent:"Sam",task:"Executive summary"}];}
    return{activeAgents:agents,routing_plan:tasks};
  }

  var send=useCallback(async function(agentId,text){
    if(!text.trim()||busy)return;var a=AGENTS.find(function(x){return x.id===agentId;});
    setMsgs(function(prev){var n=Object.assign({},prev);n[agentId]=(prev[agentId]||[]).concat({role:"user",text:text});return n;});
    setInput("");setBusy(true);

    /* ═══ DYNAMIC ROUTING — determine activeAgents before LLM call ═══ */
    var route=routeIntent(text);
    var activeAgents=route.activeAgents;

    /* Set scene to animate the PRIMARY active agent (first routed) */
    var primaryTarget=(agentId==="maya"&&activeAgents.length>0)?activeAgents[0]:a.canCallOn[0]||"maya";
    setScene({type:"working",from:agentId,to:primaryTarget,activeAgents:activeAgents,routingPlan:route.routing_plan});

    /* Maya decomposition: show dynamic routing plan in chat + Live Office */
    var decompTimers=[];
    if(agentId==="maya"){
      var plan=route.routing_plan;
      if(plan.length>0){
        var steps=plan.map(function(p){return{agent:p.agent,task:p.task||p.data||"analysis",done:false,active:false};});
        steps[0].active=true;
        setDecomp(steps);
        setMsgs(function(prev){var n=Object.assign({},prev);n[agentId]=(prev[agentId]||[]).concat({role:"decomp",steps:steps});return n;});
        /* Animate through ONLY the dynamically-routed agents */
        steps.forEach(function(s,i){
          decompTimers.push(setTimeout(function(){
            var aid=s.agent.toLowerCase();
            setScene({type:"handoff",from:"maya",to:aid,activeAgents:activeAgents,routingPlan:route.routing_plan});
            setDecomp(function(prev){return prev.map(function(p,pi){return{agent:p.agent,task:p.task,done:pi<i,active:pi===i};});});
          },i*800+400));
        });
        decompTimers.push(setTimeout(function(){setDecomp(function(prev){return prev.map(function(p){return{agent:p.agent,task:p.task,done:true,active:false};});});},steps.length*800+400));
      }
    }else{
      /* Direct agent query — still show who's active with routing context */
      setScene({type:"working",from:agentId,to:agentId,activeAgents:[agentId],routingPlan:route.routing_plan});
    }

    try{/* Pass dynamic routing plan to Maya so she uses the same agents the router selected */
      var computed;if(agentId==="maya"){computed=AGENT_COMPUTE.maya(text,route.routing_plan);}else if(AGENT_COMPUTE[agentId]){computed=AGENT_COMPUTE[agentId](text);}else{computed=FE.revenueSummary();}
      var computedJSON=JSON.stringify(computed,null,2);var sysPrompt=a.sysBase+"\n\nVERIFIED DATA (scoped to data_access: ["+a.data_access.join(", ")+"]):\n"+computedJSON;var hist=(msgs[agentId]||[]).slice(-4).filter(function(m){return m.role==="user"||m.role==="assistant";}).map(function(m){return{role:m.role==="user"?"user":"assistant",content:m.text||""};});var maxTok=agentId==="sam"?2200:1500;
      if(!apiKey){setMsgs(function(prev){var n=Object.assign({},prev);n[agentId]=(prev[agentId]||[]).concat({role:"assistant",text:"Please set your Anthropic API key first (click the key icon in the header).",agent:a.name,agentId:agentId});return n;});setBusy(false);setScene({type:"idle",from:"maya",to:"raj"});setDecomp([]);return;}
      var res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":apiKey,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:maxTok,system:sysPrompt,messages:hist.concat({role:"user",content:text})})});
      var data=await res.json();if(!res.ok||data.error){throw new Error(data.error?data.error.message||JSON.stringify(data.error):"API returned "+res.status);}var reply=(data.content||[]).map(function(b){return b.text||"";}).join("")||"Processing complete.";
      var u=data.usage||{};setTk(function(p){return{calls:p.calls+1,inp:p.inp+(u.input_tokens||0),out:p.out+(u.output_tokens||0)};});
      /* Use dynamically-routed agents for handoff animation (not text scan) */
      if(activeAgents.length>0){setHandoffs(function(prev){return prev.slice(-14).concat({from:a.name,to:activeAgents.map(function(aid){var ag=AGENTS.find(function(x){return x.id===aid;});return ag?ag.name:aid;}).join(", "),topic:text.slice(0,50),time:new Date().toLocaleTimeString()});});}
      setScene({type:"chat",from:agentId,to:activeAgents[0]||a.canCallOn[0]||"maya",activeAgents:activeAgents,routingPlan:route.routing_plan});setTimeout(function(){setScene({type:"idle",from:"maya",to:"raj",activeAgents:[],routingPlan:[]});},4000);
      var boundary=a.data_access.length>0?"["+a.data_access.join(", ")+"]":"[routing]";
      setMsgs(function(prev){var n=Object.assign({},prev);n[agentId]=(prev[agentId]||[]).concat({role:"assistant",text:reply,agent:a.name,agentId:agentId,computed:true,boundary:boundary,routedTo:activeAgents});return n;});
    }catch(err){decompTimers.forEach(function(t){clearTimeout(t);});setMsgs(function(prev){var n=Object.assign({},prev);n[agentId]=(prev[agentId]||[]).concat({role:"assistant",text:"Error: "+err.message,agent:a.name,agentId:agentId});return n;});setScene({type:"idle",from:"maya",to:"raj",activeAgents:[]});}
    setBusy(false);setDecomp([]);setTimeout(function(){if(endRef.current)endRef.current.scrollIntoView({behavior:"smooth"});},150);
  },[msgs,busy]);

  function go(a){setAgent(a);setView("chat");}
  function clinicColor(cl){var v=cl.revAct-cl.revBud;var pct=v/cl.revBud;if(pct>=0)return C.positive;if(pct>=-0.05)return C.warning;return C.negative;}
  var navItems=[["home","Squad"],["map","Map"],["dashboard","Dashboard"],["insights","Insights"],["engine","Engine"],["arch","Architecture"]];

  return(
<div style={{fontFamily:F.sans,background:C.bg,color:C.text,minHeight:"100vh",display:"flex",flexDirection:"column",letterSpacing:"-0.01em"}}>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet"/>
<style>{"@keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}@keyframes pixBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}@keyframes typing{0%,100%{transform:translateY(0)}15%{transform:translateY(-2px)}30%{transform:translateY(0)}45%{transform:translateY(-3px)}60%{transform:translateY(0)}}@keyframes cursorBlink{0%,100%{opacity:1}50%{opacity:0}}@keyframes termBlink{0%,100%{opacity:1}50%{opacity:0.4}}@keyframes dropPulse{0%,100%{border-color:rgba(79,70,229,0.2)}50%{border-color:rgba(79,70,229,0.5)}}@keyframes scanLine{0%{top:0}100%{top:100%}}@keyframes decompIn{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:translateX(0)}}"}</style>

{/* ═══ DROP ZONE / ETL LOADING ═══ */}
{!isDataLoaded&&<div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:40}}>
  <div style={{maxWidth:640,width:"100%",textAlign:"center"}}>
    {/* Logo */}
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:12,marginBottom:32}}>
      <div style={{width:36,height:36,background:"linear-gradient(135deg,#4F46E5,#6366F1)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{color:"white",fontWeight:700,fontSize:16}}>M</span></div>
      <div><span style={{fontSize:20,fontWeight:700,letterSpacing:"-0.03em",color:C.text}}>Medulla</span><span style={{fontSize:14,color:C.textDim,fontWeight:500,marginLeft:8}}>FP&A Intelligence</span></div>
    </div>

    {!etlPhase&&<>
      {/* Drop Zone */}
      <div
        onDragOver={function(e){e.preventDefault();setDragOver(true);}}
        onDragLeave={function(){setDragOver(false);}}
        onDrop={handleDrop}
        style={{
          border:"2px dashed "+(dragOver?"rgba(79,70,229,0.6)":"rgba(79,70,229,0.2)"),
          borderRadius:16,
          padding:"60px 40px",
          background:dragOver?"rgba(79,70,229,0.03)":"#FAFAFA",
          cursor:"pointer",
          transition:"all 0.3s ease",
          animation:dragOver?"none":"dropPulse 3s ease infinite",
          position:"relative",
          overflow:"hidden",
        }}
        onClick={function(){document.getElementById("etl-file-input").click();}}
      >
        <div style={{position:"absolute",left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,rgba(79,70,229,0.1),transparent)",animation:"scanLine 3s linear infinite",pointerEvents:"none"}}/>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style={{margin:"0 auto 20px",display:"block",opacity:dragOver?1:0.4,transition:"opacity 0.3s"}}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#4F46E5" strokeWidth="1.5" strokeLinecap="round"/>
          <polyline points="14 2 14 8 20 8" stroke="#4F46E5" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="12" y1="18" x2="12" y2="12" stroke="#4F46E5" strokeWidth="1.5" strokeLinecap="round"/>
          <polyline points="9 15 12 12 15 15" stroke="#4F46E5" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <div style={{fontSize:18,fontWeight:600,letterSpacing:"-0.02em",marginBottom:8,color:C.text}}>Drop Medulla Data Room (.xlsx) to Initialize FinanceEngine</div>
        <div style={{fontSize:13,color:C.textDim,marginBottom:16}}>Drag the Excel workbook here, or click to browse</div>
        <div style={{display:"flex",justifyContent:"center",gap:16,fontSize:11,fontFamily:F.mono,color:C.textDim}}>
          <span>Clinic Export</span><span style={{color:C.border}}>|</span>
          <span>AR Aging</span><span style={{color:C.border}}>|</span>
          <span>Provider Productivity</span><span style={{color:C.border}}>|</span>
          <span>Expense Detail</span>
        </div>
        <input id="etl-file-input" type="file" accept=".xlsx,.xls" style={{display:"none"}} onChange={handleDrop}/>
      </div>
      {etlErr&&<div style={{marginTop:16,padding:"10px 16px",background:"rgba(220,38,38,0.04)",border:"1px solid rgba(220,38,38,0.15)",borderRadius:8,color:C.negative,fontSize:12,fontFamily:F.mono}}>{etlErr}</div>}
      <div style={{marginTop:24,fontSize:11,color:C.textDim}}>Client-side parsing via SheetJS — no data leaves your browser</div>
    </>}

    {/* === TERMINAL LOADING + EXTRACTION RECEIPT === */}
    {(etlPhase==="loading"||etlPhase==="done")&&<div style={{textAlign:"left",background:"white",border:"1px solid "+C.border,borderRadius:12,padding:"24px 28px",animation:"fadeUp 0.3s ease",boxShadow:"0 1px 3px rgba(0,0,0,0.04)",maxWidth:680,width:"100%"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
        <div style={{width:8,height:8,borderRadius:"50%",background:etlPhase==="done"?C.positive:C.accent,animation:etlPhase==="done"?"none":"termBlink 1s ease infinite"}}/>
        <span style={{fontSize:12,fontWeight:600,color:etlPhase==="done"?C.positive:C.accent,fontFamily:F.mono,textTransform:"uppercase",letterSpacing:"0.06em"}}>{etlPhase==="done"?"EXTRACTION COMPLETE":"INITIALIZING FINANCEENGINE"}</span>
        {etlPhase==="done"&&etlStats&&<span style={{fontSize:10,color:C.textDim,fontFamily:F.mono,marginLeft:"auto"}}>{etlStats.fileName+" · "+etlStats.fileSize}</span>}
      </div>
      {etlLines.map(function(line,i){
        var isLast=i===etlLines.length-1;
        var color=line.includes("[Ready]")?C.positive:line.includes("[Building]")?C.warning:C.accent;
        return <div key={i} style={{fontSize:11,fontFamily:F.mono,color:color,marginBottom:3,animation:"fadeUp 0.2s ease",display:"flex",alignItems:"center"}}>
          <span>{line}</span>
          {isLast&&!line.includes("[Ready]")&&etlPhase!=="done"&&<span style={{display:"inline-block",width:6,height:12,background:color,marginLeft:4,animation:"cursorBlink 0.5s step-end infinite"}}/>}
        </div>;
      })}
      {/* ── Extraction receipt ── */}
      {etlPhase==="done"&&etlStats&&<div style={{marginTop:16,borderTop:"1px solid "+C.border,paddingTop:16}}>
        <div style={{fontSize:10,fontWeight:600,color:C.textDim,fontFamily:F.mono,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:10}}>EXTRACTION SUMMARY</div>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:11,fontFamily:F.mono}}>
          <thead><tr style={{borderBottom:"1px solid "+C.border}}>
            <th style={{textAlign:"left",padding:"4px 8px",color:C.textDim,fontWeight:500,fontSize:9,textTransform:"uppercase",letterSpacing:"0.04em"}}>Sheet</th>
            <th style={{textAlign:"right",padding:"4px 8px",color:C.textDim,fontWeight:500,fontSize:9,textTransform:"uppercase"}}>Rows</th>
            <th style={{textAlign:"right",padding:"4px 8px",color:C.textDim,fontWeight:500,fontSize:9,textTransform:"uppercase"}}>Cols</th>
            <th style={{textAlign:"left",padding:"4px 8px",color:C.textDim,fontWeight:500,fontSize:9,textTransform:"uppercase"}}>Status</th>
          </tr></thead>
          <tbody>{etlStats.extraction.map(function(e,i){return <tr key={i} style={{borderBottom:"1px solid rgba(0,0,0,0.04)",animation:"fadeUp 0.2s ease "+(i*50)+"ms both"}}>
            <td style={{padding:"5px 8px",color:C.text,fontWeight:500}}>{e.sheet}</td>
            <td style={{padding:"5px 8px",textAlign:"right",color:C.accent}}>{e.rows.toLocaleString()}</td>
            <td style={{padding:"5px 8px",textAlign:"right",color:C.textMuted}}>{e.cols}</td>
            <td style={{padding:"5px 8px"}}><span style={{display:"inline-flex",alignItems:"center",gap:4}}><span style={{color:e.status==="ok"?C.positive:C.textDim}}>{e.status==="ok"?"✓":"ℹ"}</span>{e.note&&<span style={{color:C.textDim,fontSize:10}}>{e.note}</span>}</span></td>
          </tr>;})}</tbody>
        </table>
        {/* Totals bar */}
        <div style={{display:"flex",gap:16,flexWrap:"wrap",marginTop:14,padding:"10px 12px",background:C.surface,borderRadius:8,border:"1px solid "+C.border}}>
          {[{l:"Clinics",v:etlStats.clinics},{l:"Regions",v:etlStats.regions},{l:"Providers",v:etlStats.providers},{l:"Denial Claims",v:etlStats.denials},{l:"Payer Records",v:etlStats.payerClinics+" clinics"},{l:"Trend Periods",v:etlStats.trendPeriods},{l:"Total Rows",v:etlStats.totalRows.toLocaleString()}].map(function(s,i){return <div key={i} style={{minWidth:80}}>
            <div style={{fontSize:9,color:C.textDim,textTransform:"uppercase",letterSpacing:"0.04em",fontFamily:F.mono}}>{s.l}</div>
            <div style={{fontSize:14,fontWeight:600,color:C.text,fontFamily:F.mono}}>{s.v}</div>
          </div>;})}
        </div>
        <button onClick={function(){setDataLoaded(true);setVer(function(v){return v+1;});setScene({type:"chat",from:"maya",to:"raj"});setHandoffs([{from:"Maya",to:"Raj",topic:"Data Room ingested. Isolate KY variance + AR aging.",time:new Date().toLocaleTimeString()}]);setTimeout(function(){setScene({type:"idle",from:"maya",to:"raj"});},4000);}} style={{marginTop:16,width:"100%",padding:"12px 20px",borderRadius:8,border:"none",background:C.accent,color:"white",cursor:"pointer",fontWeight:600,fontSize:13,fontFamily:F.sans,transition:"background 0.2s"}}>Launch Dashboard →</button>
      </div>}
    </div>}
  </div>
</div>}

{/* ═══ MAIN DASHBOARD (gated by isDataLoaded) ═══ */}
{isDataLoaded&&<>
<header style={{borderBottom:"1px solid "+C.border,padding:"0 24px",height:52,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:50,background:"rgba(255,255,255,0.92)",backdropFilter:"blur(12px)"}}>
  <div style={{display:"flex",alignItems:"center",gap:12}}><div style={{width:24,height:24,background:"linear-gradient(135deg,#4F46E5,#6366F1)",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{color:"white",fontWeight:700,fontSize:11}}>M</span></div><span style={{fontSize:14,fontWeight:600,letterSpacing:"-0.02em",color:C.text}}>Medulla</span><span style={{fontSize:11,color:C.textDim,fontWeight:500}}>FP&A</span>{etlStats&&<span style={{fontSize:9,color:C.positive,fontFamily:F.mono,background:"rgba(5,150,105,0.06)",padding:"2px 8px",borderRadius:4,marginLeft:8}}>{etlStats.fileName+" · "+etlStats.clinics+" clinics · "+etlStats.sheets+" sheets"}</span>}</div>
  <nav style={{display:"flex",gap:1}}>{navItems.map(function(n){var act=view===n[0];return <button key={n[0]} onClick={function(){setView(n[0]);if(n[0]!=="chat")setAgent(null);}} style={{padding:"6px 14px",borderRadius:6,border:"none",cursor:"pointer",fontSize:12,fontWeight:act?500:400,background:act?C.surface:"transparent",color:act?C.text:C.textDim,fontFamily:F.sans,transition:"all 0.15s"}}>{n[1]}</button>;})}</nav>
  <div style={{display:"flex",alignItems:"center",gap:12}}>
    {tk.calls>0&&<span style={{fontSize:10,color:C.textDim,fontFamily:F.mono}}>{tk.calls+" calls"}</span>}
    {/* API Key button */}
    {showKeyInput&&<div style={{display:"flex",alignItems:"center",gap:4}}><input type="password" placeholder="sk-ant-..." value={apiKey} onChange={function(e){setApiKey(e.target.value);}} onKeyDown={function(e){if(e.key==="Enter"&&apiKey.trim())saveApiKey(apiKey.trim());}} style={{width:160,padding:"4px 8px",borderRadius:4,border:"1px solid "+C.border,fontSize:10,fontFamily:F.mono,background:C.surface,color:C.text,outline:"none"}}/><button onClick={function(){if(apiKey.trim())saveApiKey(apiKey.trim());}} style={{padding:"4px 8px",borderRadius:4,border:"none",background:C.accent,color:"white",fontSize:10,cursor:"pointer",fontFamily:F.mono}}>Set</button></div>}
    {!showKeyInput&&<button onClick={function(){setShowKeyInput(true);}} style={{background:"none",border:"1px solid "+C.border,borderRadius:4,padding:"3px 6px",cursor:"pointer",fontSize:11,color:apiKey?C.positive:C.textDim}} title={apiKey?"API key set — click to change":"Set API key"}>{"🔑"}</button>}
    <div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:5,height:5,borderRadius:"50%",background:C.positive}}/><span style={{fontSize:10,color:C.textDim,fontFamily:F.mono}}>live</span></div>
  </div>
</header>

<div style={{flex:1,display:"flex",overflow:"hidden"}}>
{/* HOME */}
{view==="home"&&<div style={{flex:1,padding:"32px 40px",overflowY:"auto"}}><div style={{maxWidth:960,margin:"0 auto"}}>
  <div style={{marginBottom:8}}><span style={{fontSize:11,fontWeight:500,color:C.accent,fontFamily:F.mono,letterSpacing:"0.02em"}}>SQUAD</span></div>
  <h1 style={{fontSize:28,fontWeight:600,letterSpacing:"-0.03em",marginBottom:4,color:C.text}}>Finance Intelligence</h1>
  <p style={{fontSize:14,color:C.textDim,marginBottom:28}}>{DB.clinicCount} clinics across 6 regions. Clinic-level data aggregated deterministically.</p>
  <div style={{border:"1px solid "+C.border,borderRadius:12,overflow:"hidden",height:460,marginBottom:20}}>
    <LiveOffice scene={scene} handoffs={handoffs} ebitdaVar={SUM.ebitda.variance} agents={AGENTS} decomp={decomp}/>
  </div>
  <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:8}}>{AGENTS.map(function(a,i){return <div key={a.id} onClick={function(){go(a);}} style={{background:"white",border:"1px solid "+C.border,borderRadius:10,padding:"16px 10px",textAlign:"center",cursor:"pointer",transition:"all 0.2s",animation:"fadeUp 0.3s ease "+(i*40)+"ms both",boxShadow:"0 1px 2px rgba(0,0,0,0.03)"}}><Pix id={a.id} size={36} mood="idle"/><div style={{fontSize:12,fontWeight:600,color:C.text,marginTop:8}}>{a.name}</div><div style={{fontSize:10,color:C.textDim,fontFamily:F.mono,marginTop:2}}>{a.title.split(" ")[0]}</div><div style={{fontSize:8,color:C.accent,fontFamily:F.mono,marginTop:4,opacity:0.7}}>{a.skills.length+" skills"}</div></div>;})}</div>
</div></div>}

{/* MAP — Geospatial + Editable Data Grid */}
{view==="map"&&<div style={{flex:1,padding:"28px 40px",overflowY:"auto"}}><div style={{maxWidth:1100,margin:"0 auto"}}>
  <div style={{marginBottom:6}}><span style={{fontSize:11,fontWeight:500,color:C.accent,fontFamily:F.mono,letterSpacing:"0.02em"}}>GEOSPATIAL</span></div>
  <h1 style={{fontSize:24,fontWeight:600,letterSpacing:"-0.03em",marginBottom:4,color:C.text}}>Clinic Performance Map</h1>
  <p style={{fontSize:13,color:C.textDim,marginBottom:20}}>{DB.clinicCount} locations. Click dots for sandbox. Click table values to edit live.</p>
  <div style={{display:"flex",gap:16,marginBottom:14,fontSize:11,fontFamily:F.mono}}>
    {[{c:C.positive,l:"On/above budget"},{c:C.warning,l:"Within 5%"},{c:C.negative,l:"Missed budget"}].map(function(leg,i){return <div key={i} style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:8,height:8,borderRadius:"50%",background:leg.c}}/><span style={{color:C.textDim}}>{leg.l}</span></div>;})}
    <span style={{color:C.textDim,marginLeft:"auto"}}>bubble size = visit volume</span>
  </div>
  <div style={{background:"white",border:"1px solid "+C.border,borderRadius:12,padding:"20px",position:"relative"}}>
    <ClinicMap clinics={CLINICS} onSelect={function(cl){setSandbox(cl);}} clinicColor={clinicColor}/>
  </div>
  {/* EDITABLE Clinic Data Grid */}
  <div style={{marginTop:16,background:"white",border:"1px solid "+C.border,borderRadius:10,overflow:"hidden"}}>
    <div style={{padding:"12px 16px",borderBottom:"1px solid "+C.border,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <span style={{fontSize:12,fontWeight:600,color:C.text}}>Clinic Data Grid</span>
      <span style={{fontSize:10,color:C.accent,fontFamily:F.mono}}>click any value to edit</span>
    </div>
    <div style={{maxHeight:400,overflowY:"auto"}}>
    <table style={{width:"100%",borderCollapse:"collapse"}}>
      <thead><tr>{["Clinic","Region","Budget","Actual","Var","Denial","Visits",""].map(function(h,hi){return <th key={h+hi} style={{textAlign:hi>1?"right":"left",padding:"8px 12px",fontSize:10,fontWeight:500,color:C.textDim,textTransform:"uppercase",letterSpacing:"0.05em",borderBottom:"1px solid "+C.border,fontFamily:F.mono,position:"sticky",top:0,background:"white",zIndex:2}}>{h}</th>;})}</tr></thead>
      <tbody>{CLINICS.slice().sort(function(a,b){return(a.revAct-a.revBud)-(b.revAct-b.revBud);}).map(function(cl,i){var v=cl.revAct-cl.revBud;return <tr key={cl.id} style={{borderBottom:"1px solid #F1F5F9"}}>
        <td style={{padding:"8px 12px",fontSize:12,fontWeight:500,maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:C.text}}>{cl.name}</td>
        <td style={{padding:"8px 12px",fontSize:10,color:C.textDim,fontFamily:F.mono}}>{REGION_META[cl.region]?REGION_META[cl.region].name:cl.region}</td>
        <td style={{padding:"8px 12px",fontSize:11,textAlign:"right",fontFamily:F.mono,fontVariantNumeric:"tabular-nums"}}><EditCell val={cl.revBud} suffix="K" onSave={function(n){updateClinic(cl.id,"revBud",n);}}/></td>
        <td style={{padding:"8px 12px",fontSize:11,textAlign:"right",fontFamily:F.mono,fontVariantNumeric:"tabular-nums"}}><EditCell val={cl.revAct} suffix="K" color={v<0?C.negative:C.positive} onSave={function(n){updateClinic(cl.id,"revAct",n);}}/></td>
        <td style={{padding:"8px 12px",fontSize:11,textAlign:"right",fontFamily:F.mono,fontVariantNumeric:"tabular-nums",color:v>=0?C.positive:C.negative,fontWeight:500}}>{(v>=0?"+":"")+v+"K"}</td>
        <td style={{padding:"8px 12px",textAlign:"right",fontFamily:F.mono,fontSize:11}}><EditCell val={cl.denial} suffix="%" color={cl.denial>12?C.negative:cl.denial>9?C.warning:C.positive} onSave={function(n){updateClinic(cl.id,"denial",n);}}/></td>
        <td style={{padding:"8px 12px",fontSize:11,textAlign:"right",fontFamily:F.mono,fontVariantNumeric:"tabular-nums"}}><EditCell val={cl.visits} suffix="" onSave={function(n){updateClinic(cl.id,"visits",Math.round(n));}}/></td>
        <td style={{padding:"8px 12px"}}><button onClick={function(){setSandbox(cl);}} style={{background:"none",border:"1px solid "+C.border,borderRadius:4,color:C.accent,cursor:"pointer",fontSize:9,padding:"2px 8px",fontFamily:F.mono}}>sandbox</button></td>
      </tr>;})}</tbody>
    </table>
    </div>
  </div>
  <Sandbox clinic={sandbox} onClose={function(){setSandbox(null);}}/>
</div></div>}

{/* DASHBOARD */}
{view==="dashboard"&&<div style={{flex:1,padding:"28px 40px",overflowY:"auto"}}><div style={{maxWidth:1060,margin:"0 auto"}}>
  <div style={{marginBottom:6}}><span style={{fontSize:11,fontWeight:500,color:C.accent,fontFamily:F.mono,letterSpacing:"0.02em"}}>DASHBOARD</span></div>
  <h1 style={{fontSize:24,fontWeight:600,letterSpacing:"-0.03em",marginBottom:20,color:C.text}}>January 2026 <span style={{fontSize:12,color:C.textDim,fontWeight:400}}>aggregated from {DB.clinicCount} clinics</span></h1>
  <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10,marginBottom:20}}>
    <Kpi l="Revenue" v={"$"+(SUM.revenue.actual/1000).toFixed(1)+"M"} sub={"Bud $"+(SUM.revenue.budget/1000).toFixed(1)+"M"} delta={SUM.revenue.variancePct.toFixed(1)+"%"} neg={SUM.revenue.variance<0}/>
    <Kpi l="EBITDA" v={"$"+SUM.ebitda.actual+"K"} sub={"Bud $"+SUM.ebitda.budget+"K"} delta={((SUM.ebitda.variance/SUM.ebitda.budget)*100).toFixed(1)+"%"} neg={SUM.ebitda.variance<0}/>
    <Kpi l="Margin" v={SUM.ebitda.marginAct.toFixed(1)+"%"} sub={"Tgt "+SUM.ebitda.marginBud.toFixed(1)+"%"} delta={(SUM.ebitda.marginAct-SUM.ebitda.marginBud).toFixed(1)+"pp"} neg={SUM.ebitda.marginAct<SUM.ebitda.marginBud}/>
    <Kpi l="Denial" v={SUM.denial.weighted+"%"} sub={"Tgt "+SUM.denial.target+"%"} delta={"+"+(SUM.denial.weighted-SUM.denial.target).toFixed(1)+"pp"} neg/>
    <Kpi l="Clinics" v={""+SUM.clinics} sub="6 regions" delta={DB.meta.pe}/>
  </div>
  <div style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:12,marginBottom:20}}>
    <div style={{background:"white",border:"1px solid "+C.border,borderRadius:10,padding:"20px 22px"}}>
      <div style={{fontSize:13,fontWeight:600,marginBottom:14,color:C.text}}>Revenue by Region</div>
      <div style={{display:"flex",alignItems:"flex-end",gap:16,height:140}}>{DB.regions.map(function(r,i){var v=r.revenue.actual-r.revenue.budget;return <div key={i} style={{flex:1,textAlign:"center",cursor:"pointer"}} onClick={function(){go(AGENTS[1]);setTimeout(function(){send("raj",r.name+" variance");},300);}}>
        <div style={{display:"flex",gap:3,justifyContent:"center",alignItems:"flex-end",height:110}}><div style={{width:14,borderRadius:"4px 4px 0 0",background:"#E2E8F0",height:r.revenue.budget/60*1.5}}/><div style={{width:14,borderRadius:"4px 4px 0 0",background:r.denial.current>=12?C.negative:r.denial.current>=10?C.warning:C.positive,opacity:0.75,height:r.revenue.actual/60*1.5}}/></div>
        <div style={{fontSize:10,color:C.textDim,marginTop:6,fontFamily:F.mono}}>{r.name.slice(0,4)}</div>
        <div style={{fontSize:10,color:v<0?C.negative:C.positive,fontFamily:F.mono,fontWeight:500}}>{(v<0?"-$":"+$")+Math.abs(v)+"K"}</div>
      </div>;})}</div>
    </div>
    <div style={{background:"white",border:"1px solid "+C.border,borderRadius:10,padding:"20px 22px"}}>
      <div style={{fontSize:13,fontWeight:600,marginBottom:14,color:C.text}}>Expenses</div>
      {DB.expenses.map(function(e,i){var o=e.actual>e.budget;return <div key={i} style={{marginBottom:8}}>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:3}}><span style={{color:C.textMuted}}>{e.name}</span><span style={{fontFamily:F.mono,fontVariantNumeric:"tabular-nums",color:o?C.negative:C.textDim,fontWeight:500}}>{"$"+e.actual+"K"}</span></div>
        <div style={{height:3,background:"#F1F5F9",borderRadius:2}}><div style={{height:"100%",borderRadius:2,width:Math.min(e.actual/e.budget*100,100)+"%",background:o?"rgba(217,119,6,0.4)":"rgba(79,70,229,0.3)"}}/></div>
      </div>;})}
    </div>
  </div>
  <div style={{background:"white",border:"1px solid "+C.border,borderRadius:10,overflow:"hidden"}}>
    <table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr>{["Region","Clinics","Budget","Actual","Variance","Denial","Status"].map(function(h,hi){return <th key={h} style={{textAlign:hi>0?"right":"left",padding:"12px 16px",fontSize:10,fontWeight:500,color:C.textDim,textTransform:"uppercase",letterSpacing:"0.05em",borderBottom:"1px solid "+C.border,fontFamily:F.mono,background:C.surface}}>{h}</th>;})}</tr></thead>
      <tbody>{DB.regions.map(function(r,i){var v=r.revenue.actual-r.revenue.budget;return <tr key={i} style={{cursor:"pointer",borderBottom:"1px solid #F1F5F9"}} onClick={function(){go(AGENTS[1]);setTimeout(function(){send("raj",r.name+" variance");},300);}}>
        <td style={{padding:"12px 16px",fontWeight:500,fontSize:13,color:C.text}}>{r.name}{r.tag&&<span style={{fontSize:9,color:C.gold,background:"rgba(146,64,14,0.06)",padding:"2px 6px",borderRadius:4,marginLeft:6,fontFamily:F.mono}}>{r.tag}</span>}</td>
        <td style={{padding:"12px 16px",fontFamily:F.mono,fontSize:12,textAlign:"right",color:C.textMuted}}>{r.clinics}</td>
        <td style={{padding:"12px 16px",fontFamily:F.mono,fontSize:12,textAlign:"right",fontVariantNumeric:"tabular-nums",color:C.text}}>{"$"+r.revenue.budget+"K"}</td>
        <td style={{padding:"12px 16px",fontFamily:F.mono,fontSize:12,textAlign:"right",fontVariantNumeric:"tabular-nums",color:C.text}}>{"$"+r.revenue.actual+"K"}</td>
        <td style={{padding:"12px 16px",fontFamily:F.mono,fontSize:12,textAlign:"right",color:v<0?C.negative:C.positive,fontWeight:500}}>{(v<0?"-$":"+$")+Math.abs(v)+"K"}</td>
        <td style={{padding:"12px 16px",textAlign:"right"}}><span style={{fontSize:11,fontFamily:F.mono,fontWeight:500,padding:"3px 8px",borderRadius:4,background:r.denial.current>=12?"rgba(220,38,38,0.06)":r.denial.current>=10?"rgba(217,119,6,0.06)":"rgba(5,150,105,0.06)",color:r.denial.current>=12?C.negative:r.denial.current>=10?C.warning:C.positive}}>{r.denial.current+"%"}</span></td>
        <td style={{padding:"12px 16px",fontSize:11,fontWeight:500,textAlign:"right",color:r.denial.current>=12?C.negative:r.denial.current>=10?C.warning:C.positive}}>{r.denial.current>=12?"Critical":r.denial.current>=10?"Watch":"Healthy"}</td>
      </tr>;})}</tbody>
    </table>
  </div>
</div></div>}

{/* INSIGHTS */}
{view==="insights"&&<div style={{flex:1,padding:"28px 40px",overflowY:"auto"}}><div style={{maxWidth:780,margin:"0 auto"}}>
  <div style={{marginBottom:6}}><span style={{fontSize:11,fontWeight:500,color:C.accent,fontFamily:F.mono,letterSpacing:"0.02em"}}>INSIGHTS</span></div>
  <h1 style={{fontSize:24,fontWeight:600,letterSpacing:"-0.03em",marginBottom:24,color:C.text}}>Action Items</h1>
  {INSIGHTS.map(function(ins,i){var sevCol=ins.sev==="critical"?C.negative:ins.sev==="warning"?C.warning:C.accent;return <div key={i} style={{background:"white",border:"1px solid "+C.border,borderRadius:10,padding:"22px 24px",marginBottom:12}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}><div><span style={{fontSize:9,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em",padding:"3px 8px",borderRadius:4,fontFamily:F.mono,background:sevCol+"10",color:sevCol}}>{ins.sev}</span><h3 style={{fontSize:15,fontWeight:600,margin:"8px 0 0",color:C.text}}>{ins.title}</h3></div><div style={{fontSize:16,fontWeight:600,color:sevCol,fontFamily:F.mono,fontVariantNumeric:"tabular-nums"}}>{ins.metric}</div></div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>{ins.actions.map(function(act,j){var tgt=AGENTS.find(function(a){return a.id===act.agent;});return <div key={j} style={{background:C.surface,border:"1px solid "+C.border,borderRadius:8,padding:"14px 16px",cursor:"pointer"}} onClick={function(){go(tgt);setTimeout(function(){send(act.agent,ins.title+": "+act.label);},300);}}><div style={{fontSize:13,fontWeight:500,marginBottom:3,color:C.text}}>{act.label}</div><div style={{fontSize:12,color:C.textDim,lineHeight:1.5}}>{act.detail}</div><div style={{fontSize:11,color:C.accent,fontWeight:500,marginTop:8,fontFamily:F.mono}}>{tgt.name+" >"}</div></div>;})}
    </div>
  </div>;})}
</div></div>}

{/* ENGINE */}
{view==="engine"&&<div style={{flex:1,padding:"28px 40px",overflowY:"auto"}}><div style={{maxWidth:780,margin:"0 auto"}}>
  <div style={{marginBottom:6}}><span style={{fontSize:11,fontWeight:500,color:C.positive,fontFamily:F.mono,letterSpacing:"0.02em"}}>ENGINE</span></div>
  <h1 style={{fontSize:24,fontWeight:600,letterSpacing:"-0.03em",marginBottom:4,color:C.text}}>FinanceEngine</h1>
  <p style={{fontSize:13,color:C.textDim,marginBottom:24}}>{DB.clinicCount} clinics aggregated to {DB.regions.length} regions. Loaded via SheetJS ETL. v{ver} edits applied.{etlStats&&<span style={{color:C.accent}}>{" Source: "+etlStats.fileName+" ("+etlStats.fileSize+")"}</span>}</p>
  {[{t:"DB.clinics ("+DB.clinicCount+")",d:CLINICS.slice(0,3).concat({id:"...",name:"..."+(DB.clinicCount-3)+" more"})},{t:"DB.regions (agg)",d:DB.regions},{t:"FE.varianceBridge()",d:FE.varianceBridge()},{t:"FE.denialAnalysis('KY')",d:FE.denialAnalysis("KY")},{t:"FE.forecast()",d:FE.forecast().scenarios.map(function(s){return{scenario:s.name,annual:s.annualRevenue};})}].map(function(sec,si){
    var json=JSON.stringify(sec.d,null,2);var lines=json.split("\n");var preview=lines.slice(0,12).join("\n")+(lines.length>12?"\n  ... ("+lines.length+" lines)":"");
    return <div key={si} style={{background:"white",border:"1px solid "+C.border,borderRadius:10,padding:"16px 20px",marginBottom:10}}>
      <div style={{fontSize:12,fontWeight:500,color:C.positive,marginBottom:8,fontFamily:F.mono}}>{sec.t}</div>
      <pre style={{fontSize:11,fontFamily:F.mono,color:C.textMuted,lineHeight:1.6,margin:0,whiteSpace:"pre-wrap",maxHeight:180,overflow:"auto"}}>{preview}</pre>
    </div>;})}
</div></div>}

{/* ARCHITECTURE */}
{view==="arch"&&<div style={{flex:1,padding:"28px 40px",overflowY:"auto"}}><div style={{maxWidth:780,margin:"0 auto"}}>
  <div style={{marginBottom:6}}><span style={{fontSize:11,fontWeight:500,color:C.accent,fontFamily:F.mono,letterSpacing:"0.02em"}}>ARCHITECTURE</span></div>
  <h1 style={{fontSize:24,fontWeight:600,letterSpacing:"-0.03em",marginBottom:24,color:C.text}}>System Design v9</h1>
  {[{t:"Phase 9: Enterprise UI + Agent Skill Files",col:C.accent,items:[{q:"Enterprise Light Theme",a:"Pristine white (#FFFFFF), slate text (#0F172A), ultra-subtle borders (#E2E8F0), muted semantics (forest green, crimson). Pixel avatars in elegant containers."},{q:"Strict Agent Skill Files",a:"Each agent has data_access[] and skills[]. Maya routes only. Raj: [Variance_Data]. Priya: [AR_Aging, Denial_Logs]. Sam: [PE_Metrics, SSS, CAC]. AGENT_COMPUTE enforces boundaries."},{q:"Live Office Split Pane",a:"Chat view: 60% chat + 40% persistent Live Office. Top-down SVG floor plan with desks, monitors, chairs. Maya at routing desk, specialists at workstations."},{q:"Collaboration Animations",a:"Task decomposition status in chat. SVG data packet travels desk-to-desk. Receiving agent's monitor lights up. Proves Swarm architecture."}]},{t:"Phase 8: Excel ETL Pipeline",col:C.positive,items:[{q:"Drag-and-Drop Ingestion",a:"Client-side SheetJS parser reads multi-tab Excel workbook. Zero server calls — no data leaves the browser."},{q:"Sheet Mapping",a:"Clinic Export → CLINICS array, AR Aging → DSO/aging buckets, Provider Productivity → utilization + tech ratios, Expense Detail → aggregated P&L."},{q:"PE-Grade Metrics",a:"Prepaid/Deferred Revenue, Blended CAC, Tech-to-Doc Ratio, Schedule Utilization, SSS tags parsed from Excel."}]},{t:"Core Architecture",col:C.warning,items:[{q:"Data Flow",a:"Excel → SheetJS → parseDataRoom() → CLINICS/DB mutables → FE aggregation → AGENT_COMPUTE (boundary-enforced) → Claude API"},{q:"Zero LLM Math",a:"FinanceEngine computes ALL numbers deterministically. Agents receive pre-computed JSON scoped to their data_access."},{q:"Mutable State",a:"CLINICS array is mutable. Editable grid + sandbox + ETL all write to the same source. DB.regions getter re-aggregates on read."}]}].map(function(sec,si){return <div key={si} style={{background:"white",border:"1px solid "+C.border,borderRadius:10,padding:"20px 22px",marginBottom:12}}>
    <div style={{fontSize:10,fontWeight:500,color:sec.col,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:14,fontFamily:F.mono}}>{sec.t}</div>
    {sec.items.map(function(it,ii){return <div key={ii} style={{padding:"10px 0",borderBottom:ii<sec.items.length-1?"1px solid #F1F5F9":"none"}}><div style={{fontSize:13,fontWeight:500,marginBottom:3,color:C.text}}>{it.q}</div><div style={{fontSize:12,color:C.textDim,lineHeight:1.6}}>{it.a}</div></div>;})}
  </div>;})}
</div></div>}

{/* CHAT — Full Width */}
{view==="chat"&&agent&&<div style={{flex:1,display:"flex",overflow:"hidden"}}>
  {/* Sidebar */}
  <div style={{width:220,background:C.surface,borderRight:"1px solid "+C.border,display:"flex",flexDirection:"column",flexShrink:0}}>
    <div style={{padding:"14px 16px",borderBottom:"1px solid "+C.border}}><button onClick={function(){setView("home");}} style={{background:"none",border:"none",color:C.textDim,cursor:"pointer",fontSize:11,padding:0,fontFamily:F.sans,marginBottom:10}}>{"← Back"}</button><div style={{display:"flex",alignItems:"center",gap:10}}><div style={{background:"white",borderRadius:8,padding:4,border:"1px solid "+C.border}}><Pix id={agent.id} size={36} mood="happy"/></div><div><div style={{fontSize:14,fontWeight:600,color:C.text}}>{agent.name}</div><div style={{fontSize:10,color:C.textDim,fontFamily:F.mono}}>{agent.title}</div></div></div>
      {/* Skill file badge */}
      <div style={{marginTop:8,padding:"6px 8px",background:"white",borderRadius:6,border:"1px solid "+C.border}}>
        <div style={{fontSize:8,fontWeight:600,color:C.accent,fontFamily:F.mono,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:3}}>SKILL FILE</div>
        <div style={{fontSize:9,color:C.textDim,fontFamily:F.mono}}>{agent.data_access.length>0?"data: "+agent.data_access.join(", "):"routing only"}</div>
        <div style={{fontSize:9,color:C.textMuted,fontFamily:F.mono,marginTop:2}}>{agent.skills.length+" skills"}</div>
      </div>
    </div>
    <div style={{padding:"10px 16px",borderBottom:"1px solid "+C.border,fontSize:12,color:C.textMuted,lineHeight:1.5}}>{agent.focus}</div>
    <div style={{padding:"10px 16px",flex:1,overflowY:"auto"}}>
      <div style={{fontSize:9,fontWeight:600,color:C.textDim,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>Quick Actions</div>
      {(QUICK[agent.id]||[]).map(function(q,i){return <button key={i} onClick={function(){send(agent.id,q.p);}} style={{display:"block",width:"100%",textAlign:"left",padding:"8px 10px",marginBottom:3,borderRadius:6,border:"1px solid "+C.border,background:"white",cursor:"pointer",fontSize:11,color:C.text,fontFamily:F.sans,lineHeight:1.4}}>{q.l}</button>;})}
      <div style={{marginTop:12,fontSize:9,fontWeight:600,color:C.textDim,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>Switch Agent</div>
      {AGENTS.filter(function(a2){return a2.id!==agent.id;}).map(function(a2){return <button key={a2.id} onClick={function(){setAgent(a2);}} style={{display:"flex",alignItems:"center",gap:6,width:"100%",padding:"5px 6px",borderRadius:6,border:"none",background:"transparent",cursor:"pointer",fontFamily:F.sans,marginBottom:1,color:C.text}}><Pix id={a2.id} size={18}/><span style={{fontSize:11,fontWeight:500}}>{a2.name}</span></button>;})}
    </div>
  </div>
  {/* Chat panel */}
  <div style={{flex:1,display:"flex",flexDirection:"column",background:"white"}}>
    {/* Agent status bar */}
    <div style={{padding:"8px 24px",borderBottom:"1px solid "+C.border,display:"flex",alignItems:"center",gap:8,background:C.surface}}>
      <div style={{width:6,height:6,borderRadius:"50%",background:busy?C.warning:C.positive,animation:busy?"pulse 1.5s ease infinite":"none"}}/>
      <span style={{fontSize:10,fontWeight:600,color:busy?C.warning:C.positive,fontFamily:F.mono,textTransform:"uppercase",letterSpacing:"0.06em"}}>{busy?"Processing":"Ready"}</span>
      {busy&&scene.from&&<span style={{fontSize:10,color:C.textDim,fontFamily:F.mono}}>{"· "+(AGENTS.find(function(a){return a.id===scene.from;})||{}).name+(scene.activeAgents&&scene.activeAgents.length>0?" → "+scene.activeAgents.map(function(aid){var ag=AGENTS.find(function(x){return x.id===aid;});return ag?ag.name:aid;}).join(", "):scene.to?" → "+(AGENTS.find(function(a){return a.id===scene.to;})||{}).name:"")}</span>}
      {decomp.length>0&&<span style={{fontSize:10,color:C.accent,fontFamily:F.mono,marginLeft:"auto"}}>{decomp.filter(function(d){return d.done;}).length+"/"+decomp.length+" tasks"}</span>}
    </div>
    <div style={{flex:1,overflowY:"auto",padding:"16px 24px"}}><div style={{maxWidth:720,margin:"0 auto"}}>
      {!(msgs[agent.id]||[]).length&&<div style={{textAlign:"center",padding:"40px 20px"}}><div style={{background:C.surface,display:"inline-block",borderRadius:12,padding:12,border:"1px solid "+C.border}}><Pix id={agent.id} size={48} mood="happy"/></div><h2 style={{fontSize:18,fontWeight:600,marginTop:12,color:C.text}}>{agent.name}</h2><p style={{fontSize:13,color:C.textDim,maxWidth:380,margin:"6px auto"}}>{agent.focus}</p></div>}
      {(msgs[agent.id]||[]).map(function(m,i){return <div key={i} style={{maxWidth:m.role==="user"?"70%":"100%",marginLeft:m.role==="user"?"auto":0,marginBottom:12,animation:"fadeUp 0.2s ease"}}>
        {m.role==="assistant"&&<div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}><Pix id={m.agentId||agent.id} size={16} mood="happy"/><span style={{fontSize:11,fontWeight:500,color:C.textMuted}}>{m.agent}</span>{m.computed&&<span style={{fontSize:8,padding:"2px 6px",background:"rgba(5,150,105,0.06)",color:C.positive,borderRadius:4,fontFamily:F.mono}}>verified</span>}{m.boundary&&<span style={{fontSize:8,padding:"2px 6px",background:"rgba(79,70,229,0.06)",color:C.accent,borderRadius:4,fontFamily:F.mono}}>{m.boundary}</span>}</div>}
        {/* Decomposition status card */}
        {m.role==="decomp"&&<div style={{background:C.surface,border:"1px solid "+C.border,borderRadius:8,padding:"12px 14px",animation:"decompIn 0.3s ease"}}>
          <div style={{fontSize:10,fontWeight:600,color:C.accent,fontFamily:F.mono,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>Task Decomposition</div>
          {m.steps.map(function(s,si){return <div key={si} style={{display:"flex",alignItems:"center",gap:6,fontSize:11,fontFamily:F.mono,color:s.done?C.positive:s.active?C.accent:C.textDim,marginBottom:3,animation:s.active?"fadeUp 0.2s ease":"none"}}>
            <span>{s.done?"✓":s.active?"▸":"○"}</span><span style={{fontWeight:500}}>{"→ "+s.agent}</span><span style={{color:"#94A3B8"}}>·</span><span>{s.task}</span>
          </div>;})}
        </div>}
        {m.role!=="decomp"&&<div style={{padding:m.role==="user"?"10px 14px":"14px 18px",borderRadius:m.role==="user"?"10px 10px 4px 10px":"10px 10px 10px 4px",background:m.role==="user"?C.accent:C.surface,color:m.role==="user"?"white":C.text,border:m.role==="user"?"none":"1px solid "+C.border,fontSize:13,lineHeight:1.7}}>{m.role==="user"?m.text:<Md text={m.text}/>}</div>}
      </div>;})}
      {busy&&<div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 0"}}><Pix id={agent.id} size={16} bounce={true}/><span style={{fontSize:12,color:C.textDim}}>Computing...</span></div>}
      <div ref={endRef}/>
    </div></div>
    <div style={{padding:"10px 24px 16px",borderTop:"1px solid "+C.border}}><div style={{maxWidth:720,margin:"0 auto"}}><div style={{display:"flex",gap:8,alignItems:"center"}}>
      <input value={input} onChange={function(e){setInput(e.target.value);}} onKeyDown={function(e){if(e.key==="Enter"&&!e.shiftKey)send(agent.id,input);}} placeholder={"Message "+agent.name+"..."} style={{flex:1,padding:"10px 14px",borderRadius:8,border:"1px solid "+C.border,fontSize:13,outline:"none",fontFamily:F.sans,background:C.surface,color:C.text}}/>
      <button onClick={function(){send(agent.id,input);}} disabled={busy||!input.trim()} style={{padding:"10px 20px",borderRadius:8,border:"none",background:busy?C.surfaceHi:C.accent,color:"white",cursor:busy?"not-allowed":"pointer",fontWeight:500,fontSize:13,fontFamily:F.sans,flexShrink:0}}>{busy?"...":"Send"}</button>
    </div></div></div>
  </div>
</div>}

</div>{/* end flex overflow:hidden */}
</>}{/* end isDataLoaded */}
</div>
);
}

function Kpi({l,v,sub,delta,neg}){return <div style={{background:"white",border:"1px solid "+C.border,borderRadius:10,padding:"16px 18px",boxShadow:"0 1px 2px rgba(0,0,0,0.03)"}}>
  <div style={{fontSize:10,fontWeight:500,color:C.textDim,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:8,fontFamily:F.mono}}>{l}</div>
  <div style={{fontSize:24,fontWeight:600,fontVariantNumeric:"tabular-nums",fontFamily:F.mono,color:C.text,letterSpacing:"-0.02em"}}>{v}</div>
  <div style={{fontSize:11,marginTop:6,color:neg?C.negative:C.positive,fontWeight:500,fontFamily:F.mono,fontVariantNumeric:"tabular-nums"}}>{delta} <span style={{color:C.textDim,fontWeight:400}}>{sub}</span></div>
</div>;}
