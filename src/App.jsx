import { useState, useEffect, useRef } from "react";

const BLUE="#003E74",BLUE2="#1A5FA8",BLUE_L="#E8F0FA",WHITE="#FFFFFF",BG="#EEF1F8",BORDER="#DDE3EE",TEXT="#0A1628",MUTED="#6B7A99",GREEN="#16A34A",GREEN_BG="#DCFCE7";
const G_NAV="linear-gradient(135deg,#003E74 0%,#1A5FA8 100%)";
const G_HERO="linear-gradient(135deg,#002D5C 0%,#1A5FA8 60%,#2176C2 100%)";
const G_BLUE="linear-gradient(135deg,#003E74 0%,#1565C0 100%)";
const G_GREEN="linear-gradient(135deg,#14532D 0%,#16A34A 100%)";
const G_CARD="linear-gradient(160deg,#ffffff 0%,#f0f4ff 100%)";
const PIEZAS_TIPOS=["Mobiliario","Llaveros","Portapapeles","Otros"];
const PIEZAS_ICONS=["🪑","🔑","📋","✨"];
const PIEZAS_COLORS=[BLUE,BLUE2,"#7C3AED","#0891B2"];
const PIEZAS_GRADS=["linear-gradient(135deg,#002D5C,#1A5FA8)","linear-gradient(135deg,#1A5FA8,#2176C2)","linear-gradient(135deg,#4C1D95,#7C3AED)","linear-gradient(135deg,#0891B2,#22D3EE)"];
const PLUMAS_POR_KG=45;
const ETAPAS=["Recepción","Limpieza","Molienda","Placas","Corte","Ensamble","Entregado","Facturado","Pagado"];
const PROCESO_PRODUCCION=["Recolección","Triturado","Fabricación de molde en CNC","Prensado y vulcanización","Desmoldeo","Aplanado","Corte en CNC","Lijado y pulido","Armado"];
const PROCESO_ICONS=["🚚","🔨","🛠️","🔥","📤","🟦","✂️","✨","🧩"];
const PIEZAS_HISTORIA=[
  {nombre:"Bancos altos",cantidad:8,icon:"🪑"},
  {nombre:"Bancos bajos",cantidad:2,icon:"🪵"},
  {nombre:"Mesas",cantidad:2,icon:"🍽️"},
  {nombre:"Macetas",cantidad:2,icon:"🪴"},
  {nombre:"Logo de piso",cantidad:1,icon:"🏷️"},
  {nombre:"Logotipos para oficinas",cantidad:8,icon:"🔖"},
  {nombre:"Reconocimientos",cantidad:98,icon:"🏆"},
  {nombre:"Mural interactivo",cantidad:1,icon:"🖼️"},
  {nombre:"Bote de desechos electrónicos",cantidad:1,icon:"♻️"},
  {nombre:"Contenedor de plumas",cantidad:1,icon:"🖊️"},
  {nombre:"Contenedores pequeños",cantidad:3,icon:"📦"},
  {nombre:"Invitaciones",cantidad:17,icon:"💌"},
  {nombre:"Llaveros",cantidad:200,icon:"🔑"},
];
const HISTORIA_SECTIONS=[
  {type:"intro",label:"Inicio"},
  {type:"objetivo",label:"Objetivo"},
  {type:"ruta-accion",label:"Ruta de Acción"},
  {type:"proyecto",label:"Proyecto"},
  {type:"trayecto",label:"Trayecto"},
  {type:"produccion",label:"Producción"},
  {type:"piezas",label:"Piezas"},
  {type:"descubrimientos",label:"Descubrimientos"},
  {type:"proyecciones",label:"Proyecciones"},
];
const fmt=n=>Number(n).toLocaleString("es-MX");

const FONT=`*{font-family:'Montserrat',sans-serif;box-sizing:border-box;margin:0;padding:0;}
::-webkit-scrollbar{width:6px;height:6px;}::-webkit-scrollbar-track{background:transparent;}::-webkit-scrollbar-thumb{background:#C5CFDF;border-radius:99px;}
input,select,textarea{font-family:'Montserrat',sans-serif;}
@keyframes histModalIn{from{opacity:0;}to{opacity:1;}}
@keyframes histPop{from{opacity:0;transform:scale(0.85);}to{opacity:1;transform:scale(1);}}
.hist-stat{animation:histPop 0.5s cubic-bezier(0.22,1,0.36,1) backwards;}
.hist-nav-btn{transition:transform 0.15s ease,background 0.15s ease;}
.hist-nav-btn:hover:not(:disabled){transform:scale(1.1);background:rgba(255,255,255,0.22);}
.hist-dot:hover{background:rgba(255,255,255,0.5)!important;}`;

const RECEPCIONES_INIT=[
  {id:1,fecha:"2024-09-30",kgBruto:150,kgReal:120,estado:"Transformado",transformadoEn:"2 Mesas (28kg), 2 Macetas (18kg), 2 Bancos (14kg), 8 Logotipos (56kg)",obs:"Primer entrega",desglose:[{cantidad:28,descripcion:"2 Mesas",estado:"Transformado"},{cantidad:18,descripcion:"2 Macetas",estado:"Transformado"},{cantidad:14,descripcion:"2 Bancos",estado:"Transformado"},{cantidad:56,descripcion:"8 Logotipos",estado:"Transformado"}]},
  {id:2,fecha:"2024-11-04",kgBruto:50,kgReal:40,estado:"Transformado",transformadoEn:"Molidos y entregados a Universum (4kg), Reparación de piezas",obs:"",desglose:[{cantidad:4,descripcion:"Molidos y entregados a Universum",estado:"Transformado"},{cantidad:36,descripcion:"Reparación de piezas",estado:"Transformado"}]},
  {id:3,fecha:"2024-11-12",kgBruto:230,kgReal:184,estado:"Transformado",transformadoEn:"8 Bancos altos (170kg), Mural (30kg), Logo grande (15kg)",obs:"Segunda entrega",desglose:[{cantidad:170,descripcion:"8 Bancos altos",estado:"Transformado"},{cantidad:30,descripcion:"Mural",estado:"Transformado"},{cantidad:15,descripcion:"Logo grande",estado:"Transformado"}]},
  {id:4,fecha:"2024-11-08",kgBruto:50,kgReal:0,estado:"En Stock",transformadoEn:"",obs:"Material flexible de otro plástico",desglose:[]},
  {id:5,fecha:"2024-11-10",kgBruto:50,kgReal:40,estado:"Transformado",transformadoEn:"Complemento entrega anterior (32kg), Bases para trofeos (18kg)",obs:"El resto se utilizó con polvo de molienda",desglose:[{cantidad:32,descripcion:"Complemento entrega anterior",estado:"Transformado"},{cantidad:18,descripcion:"Bases para trofeos",estado:"Transformado"}]},
  {id:6,fecha:"2025-10-02",kgBruto:50,kgReal:40,estado:"Transformado",transformadoEn:"Fabricación de contenedor (31kg), Restauración de contenedor",obs:"Tenemos plástico recuperado del sobrante",desglose:[{cantidad:31,descripcion:"Fabricación de contenedor",estado:"Transformado"},{cantidad:9,descripcion:"Restauración de contenedor",estado:"Transformado"}]},
  {id:7,fecha:"2026-02-17",kgBruto:650,kgReal:520,estado:"En Placas",transformadoEn:"",obs:"Destinado a fabricación de 700 piezas",desglose:[]},
  {id:8,fecha:"2026-02-23",kgBruto:1.75,kgReal:1.4,estado:"En Stock",transformadoEn:"",obs:"",desglose:[]},
  {id:9,fecha:"2026-05-04",kgBruto:60,kgReal:48,estado:"Transformado",transformadoEn:"17 Invitaciones ISTH",obs:"",desglose:[{cantidad:48,descripcion:"17 Invitaciones ISTH",estado:"Transformado"}]},
  {id:10,fecha:"2026-05-04",kgBruto:2049,kgReal:1800,estado:"En Placas",transformadoEn:"Se transformará en 350 organizadores Sogoya, 200 llaveros (8kg), 22 reconocimientos (22kg)",obs:"El material útil para transformar fue más de lo que esperábamos por lo que nos sobrarán aprox. 400 kg de plástico a transformar",desglose:[{cantidad:1400,descripcion:"350 organizadores Sogoya",estado:"En Placas"},{cantidad:8,descripcion:"200 llaveros",estado:"Transformado"},{cantidad:22,descripcion:"22 reconocimientos",estado:"Transformado"},{cantidad:370,descripcion:"Excedente disponible para transformar",estado:"En Placas"}]},
];
const PEDIDOS_INIT=[
  {id:1,nombre:"700 Artículos varios",cliente:"Novo Nordisk",kgReq:520,kgDisponible:true,fechaEst:"2026-08-30",etapa:3,cotizacion:"",oc:"",obs:"Destinado al material molido de Feb 2026"},
];
const PROYECTOS_INIT=[
  {id:1,nombre:"2 Mesas",kg:28,etapa:8,fecha:"2024-09-30"},
  {id:2,nombre:"2 Macetas",kg:18,etapa:8,fecha:"2024-09-30"},
  {id:3,nombre:"2 Bancos",kg:14,etapa:8,fecha:"2024-09-30"},
  {id:4,nombre:"8 Logotipos",kg:56,etapa:8,fecha:"2024-09-30"},
  {id:7,nombre:"8 Bancos altos",kg:170,etapa:8,fecha:"2024-11-12"},
  {id:8,nombre:"Mural",kg:30,etapa:8,fecha:"2024-11-12"},
  {id:9,nombre:"Logo grande",kg:15,etapa:8,fecha:"2024-11-12"},
  {id:12,nombre:"Fabricación de contenedor",kg:31,etapa:8,fecha:"2025-10-02"},
  {id:14,nombre:"17 Invitaciones ISTH",kg:48,etapa:7,fecha:"2026-05-04"},
  {id:15,nombre:"350 organizadores Sogoya",kg:1400,etapa:3,fecha:"2026-05-04"},
  {id:16,nombre:"200 llaveros",kg:8,etapa:7,fecha:"2026-05-04"},
  {id:17,nombre:"22 reconocimientos",kg:22,etapa:7,fecha:"2026-05-04"},
  {id:19,nombre:"700 Organizadores viales",kg:520,etapa:4,fecha:"2026-02-17"},
  {id:20,nombre:"700 Portapapeles",kg:420,etapa:3,fecha:"2026-05-04"},
];
const HISTORICO_FULL=[
  {mes:"Sep 24",kg:120},{mes:"Oct 24",kg:0},{mes:"Nov 24",kg:264},{mes:"Dic 24",kg:0},
  {mes:"Ene 25",kg:0},{mes:"Feb 25",kg:0},{mes:"Mar 25",kg:0},{mes:"Abr 25",kg:0},{mes:"May 25",kg:0},{mes:"Jun 25",kg:0},{mes:"Jul 25",kg:0},{mes:"Ago 25",kg:0},{mes:"Sep 25",kg:0},{mes:"Oct 25",kg:40},{mes:"Nov 25",kg:0},{mes:"Dic 25",kg:0},
  {mes:"Ene 26",kg:0},{mes:"Feb 26",kg:521.4},{mes:"Mar 26",kg:0},{mes:"Abr 26",kg:0},{mes:"May 26",kg:1848},
];
const DETALLE_INIT={
  Mobiliario:[
    {id:1,nombre:"Mesa",cantidad:2,kgPieza:14,imagen:""},
    {id:2,nombre:"Banco alto",cantidad:8,kgPieza:21.25,imagen:""},
    {id:3,nombre:"Maceta",cantidad:2,kgPieza:9,imagen:""},
    {id:4,nombre:"Banco bajo",cantidad:2,kgPieza:7,imagen:""},
  ],
  Llaveros:[
    {id:1,nombre:"Llavero",cantidad:200,kgPieza:0.04,imagen:""},
  ],
  Portapapeles:[],
  Otros:[
    {id:1,nombre:"Logo de piso",cantidad:1,kgPieza:15,imagen:""},
    {id:2,nombre:"Logotipo para oficinas",cantidad:8,kgPieza:7,imagen:""},
    {id:3,nombre:"Reconocimiento",cantidad:98,kgPieza:1,imagen:""},
    {id:4,nombre:"Mural interactivo",cantidad:1,kgPieza:30,imagen:""},
    {id:5,nombre:"Bote de desechos electrónicos",cantidad:1,kgPieza:0,imagen:""},
    {id:6,nombre:"Contenedor de plumas",cantidad:1,kgPieza:31,imagen:""},
    {id:7,nombre:"Contenedores pequeños",cantidad:3,kgPieza:0,imagen:""},
    {id:8,nombre:"Invitación",cantidad:17,kgPieza:2.82,imagen:""},
  ],
};

const inpSm={padding:"5px 8px",borderRadius:6,border:`1.5px solid ${BLUE}`,fontSize:12,fontWeight:600,outline:"none",background:WHITE,width:"100%"};
const ESTADOS=["Transformado","Molido","En Stock","En Placas"];

function EstadoBadge({estado}){
  const map={Transformado:{bg:GREEN_BG,c:GREEN},Molido:{bg:BLUE_L,c:BLUE},"En Stock":{bg:"#FEF9C3",c:"#A16207"},"En Placas":{bg:"#EDE9FE",c:"#7C3AED"}};
  const s=map[estado]||{bg:BG,c:MUTED};
  return <span style={{background:s.bg,color:s.c,borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:700,whiteSpace:"nowrap"}}>{estado}</span>;
}
function EtapaBadge({i}){
  return <span style={{display:"inline-flex",alignItems:"center",gap:4,background:BLUE_L,color:BLUE,borderRadius:20,padding:"3px 9px",fontSize:10,fontWeight:700,whiteSpace:"nowrap"}}><EtapaIcon i={i} size={11}/> {ETAPAS[i]}</span>;
}
function EtapaIcon({i,size=14,color="currentColor"}){
  const p={width:size,height:size,viewBox:"0 0 24 24",fill:"none",stroke:color,strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round",style:{flexShrink:0}};
  switch(i){
    case 0: return <svg {...p}><path d="M21 8 12 3 3 8v8l9 5 9-5V8z"/><path d="M3 8l9 5 9-5"/><path d="M12 13v8"/></svg>;
    case 1: return <svg {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8"/></svg>;
    case 2: return <svg {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
    case 3: return <svg {...p}><path d="M12 2 2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>;
    case 4: return <svg {...p}><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>;
    case 5: return <svg {...p}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>;
    case 6: return <svg {...p}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
    case 7: return <svg {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>;
    case 8: return <svg {...p}><circle cx="12" cy="12" r="10"/><path d="M12 6v12M15 9.5c0-1.38-1.34-2.5-3-2.5s-3 1.12-3 2.5 1.34 2.5 3 2.5 3 1.12 3 2.5-1.34 2.5-3 2.5-3-1.12-3-2.5"/></svg>;
    default: return null;
  }
}
function EditBtn({onClick}){return <button onClick={onClick} title="Editar" style={{background:BLUE_L,color:BLUE,border:"none",borderRadius:6,width:28,height:28,cursor:"pointer",fontSize:13,display:"inline-flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>✏️</button>;}
function SaveBtn({onClick}){return <button onClick={onClick} style={{background:BLUE,color:WHITE,border:"none",borderRadius:6,padding:"5px 12px",fontSize:11,fontWeight:700,cursor:"pointer"}}>Guardar</button>;}
function CancelBtn({onClick}){return <button onClick={onClick} style={{background:WHITE,color:MUTED,border:`1px solid ${BORDER}`,borderRadius:6,padding:"5px 12px",fontSize:11,fontWeight:700,cursor:"pointer"}}>Cancelar</button>;}
function DelBtn({onClick}){return <button onClick={onClick} style={{background:"#FEE2E2",color:"#DC2626",border:"none",borderRadius:6,width:28,height:28,cursor:"pointer",fontSize:12,display:"inline-flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>🗑</button>;}

function LineChart({data}){
  const [hover,setHover]=useState(null);
  const nonZero=data.filter(d=>d.kg>0);
  if(nonZero.length<2) return <div style={{padding:"2rem",textAlign:"center",color:MUTED,fontSize:13,fontWeight:600}}>No hay suficientes datos para graficar este período</div>;
  const W=880,H=200,PL=52,PR=20,PT=16,PB=36,iW=W-PL-PR,iH=H-PT-PB;
  const maxV=Math.max(...data.map(d=>d.kg));
  const xs=data.map((_,i)=>PL+(i/(data.length-1))*iW);
  const ys=data.map(d=>PT+iH-(d.kg/maxV)*iH);
  const path=xs.map((x,i)=>`${i===0?"M":"L"}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(" ");
  const area=`${path} L${xs[xs.length-1].toFixed(1)},${(PT+iH).toFixed(1)} L${xs[0].toFixed(1)},${(PT+iH).toFixed(1)} Z`;
  const yTicks=[0,Math.round(maxV*0.5),maxV];
  const showEvery=data.length>16?2:1;
  return(
    <div style={{width:"100%",overflowX:"auto"}}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",minWidth:400,display:"block"}}>
        <defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={BLUE} stopOpacity="0.15"/><stop offset="100%" stopColor={BLUE} stopOpacity="0"/></linearGradient></defs>
        {yTicks.map(v=>{const y=PT+iH-(v/maxV)*iH;return(<g key={v}><line x1={PL} x2={PL+iW} y1={y} y2={y} stroke={BORDER} strokeWidth="1"/><text x={PL-6} y={y+4} textAnchor="end" fontSize="10" fill={MUTED} fontFamily="Montserrat" fontWeight="600">{v}</text></g>);})}
        <path d={area} fill="url(#ag)"/>
        <path d={path} fill="none" stroke={BLUE} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
        {data.map((d,i)=>d.kg>0&&(<circle key={i} cx={xs[i]} cy={ys[i]} r={hover===i?5:3} fill={WHITE} stroke={BLUE} strokeWidth="2" style={{cursor:"pointer"}} onMouseEnter={()=>setHover(i)} onMouseLeave={()=>setHover(null)}/>))}
        {data.map((d,i)=>i%showEvery===0&&(<text key={i} x={xs[i]} y={H-4} textAnchor="middle" fontSize="9" fill={MUTED} fontFamily="Montserrat" fontWeight="700">{d.mes}</text>))}
        {hover!==null&&data[hover].kg>0&&(<g><line x1={xs[hover]} x2={xs[hover]} y1={PT} y2={PT+iH} stroke={BLUE} strokeWidth="1" strokeDasharray="4,3"/><rect x={xs[hover]-30} y={ys[hover]-28} width={60} height={20} rx="6" fill={BLUE}/><text x={xs[hover]} y={ys[hover]-14} textAnchor="middle" fontSize="10" fill={WHITE} fontFamily="Montserrat" fontWeight="800">{data[hover].kg} kg</text></g>)}
      </svg>
    </div>
  );
}

const RUTA_STEPS=[
  {id:0,x:44,y:36,dy:86,num:"01",lines:["RECEPCIÓN","DE MATERIAL"]},
  {id:1,x:187,y:36,dy:86,num:"02",lines:["LIMPIEZA Y","DESENSAMBLAJE"]},
  {id:2,x:330,y:36,dy:86,num:"03",lines:["MOLIENDA"]},
  {id:3,x:473,y:36,dy:86,num:"04",lines:["PRENSADO"]},
  {id:4,x:616,y:36,dy:86,num:"05",lines:["DESMOLDEO"]},
  {id:5,x:84,y:176,dy:226,num:"06",lines:["OBTENCIÓN","DE PLACAS"]},
  {id:6,x:248,y:176,dy:226,num:"07",lines:["CORTE","EN CNC"]},
  {id:7,x:412,y:176,dy:226,num:"08",lines:["LIJADO","Y PULIDO"]},
  {id:8,x:576,y:176,dy:226,num:"09",lines:["ENSAMBLAJE"]},
];
const RUTA_SEGS=[
  {id:"sg0",x1:44,x2:187,y:86,step:1},
  {id:"sg1",x1:187,x2:330,y:86,step:2},
  {id:"sg2",x1:330,x2:473,y:86,step:3},
  {id:"sg3",x1:473,x2:616,y:86,step:4},
  {id:"sg4",x1:84,x2:248,y:226,step:6},
  {id:"sg5",x1:248,x2:412,y:226,step:7},
  {id:"sg6",x1:412,x2:576,y:226,step:8},
];
function RutaIcon({idx,lit}){
  const s=lit?"#fff":"rgba(255,255,255,0.38)";
  const f=lit?"#fff":"rgba(255,255,255,0.38)";
  const p={fill:"none",stroke:s,strokeWidth:1.6,strokeLinecap:"round",strokeLinejoin:"round"};
  if(idx===0) return (
    <g {...p}>
      <rect x="-10" y="-6" width="13" height="10" rx="1.2"/>
      <path d="M3 -4h4l3 4v6H3v-10z"/>
      <circle cx="-5" cy="5" r="2.2"/><circle cx="7" cy="5" r="2.2"/>
      <line x1="-10" y1="-1" x2="3" y2="-1"/>
      <line x1="-14" y1="-4" x2="-10" y2="-4" strokeWidth="1.8"/>
      <line x1="-14.5" y1="-1" x2="-10" y2="-1" strokeWidth="1.4"/>
      <line x1="-14" y1="2" x2="-10" y2="2" strokeWidth="1"/>
    </g>
  );
  if(idx===1) return (
    <g {...p}>
      <path d="M-2 -11 C-5 -11 -6 -9 -6 -7 L-6 1 C-6 3 -5 4 -3 4 L3 4 C5 4 6 3 6 1 L6 -7 C6 -9 5 -11 3 -11 Z"/>
      <line x1="-3" y1="-11" x2="-3" y2="-13"/><line x1="0" y1="-11" x2="0" y2="-13"/><line x1="3" y1="-11" x2="3" y2="-13"/>
      <line x1="-5" y1="-5" x2="5" y2="-5" strokeWidth="0.8"/>
      <line x1="-5" y1="-1" x2="5" y2="-1" strokeWidth="0.8"/>
      <path d="M-9 9 Q-5 6 0 7 Q5 6 9 9"/>
      <circle cx="-6" cy="9" r="0.9" fill={f} stroke="none"/>
      <circle cx="-2" cy="8" r="0.9" fill={f} stroke="none"/>
      <circle cx="2" cy="8" r="0.9" fill={f} stroke="none"/>
      <circle cx="6" cy="9" r="0.9" fill={f} stroke="none"/>
    </g>
  );
  if(idx===2) return (
    <g>
      <polygon points="-2,-10 4,-12 7,-6 1,-4 -2,-7" fill={f}/>
      <polygon points="5,-3 10,-5 11,2 6,3" fill={f}/>
      <polygon points="-10,-2 -5,-4 -2,3 -8,4 -11,1" fill={f}/>
      <polygon points="-3,5 4,4 5,10 -2,11 -4,8" fill={f}/>
    </g>
  );
  if(idx===3) return (
    <g {...p}>
      <path d="M-6 -11 A2.2 2.2 0 0 1 -1 -11" strokeWidth="1.8"/>
      <path d="M1 -11 A2.2 2.2 0 0 1 6 -11" strokeWidth="1.8"/>
      <rect x="-9" y="-10" width="18" height="3" rx="0.8"/>
      <line x1="-7" y1="-7" x2="-7" y2="9"/>
      <line x1="7" y1="-7" x2="7" y2="9"/>
      <path d="M-6 -7 L-6 0 L-3 0 L-3 -2.5 Q0 -4 3 -2.5 L3 0 L6 0 L6 -7"/>
      <path d="M-6 3 L-6 7 L-3 7 L-3 4.5 Q0 6 3 4.5 L3 7 L6 7 L6 3"/>
      <rect x="-9" y="8" width="18" height="3" rx="0.8"/>
      <line x1="-6" y1="9.5" x2="-4" y2="9.5" strokeWidth="1.4"/>
      <line x1="4" y1="9.5" x2="6" y2="9.5" strokeWidth="1.4"/>
    </g>
  );
  if(idx===4) return (
    <g {...p}>
      <path d="M-9 4 L-9 10 L-4 10 L-4 7 L-1 7 L-1 10 L3 10 L3 7 L6 7 L6 10 L10 10 L10 4 Z"/>
      <g transform="rotate(-20,0,-4)">
        <path d="M-9 -10 L-9 -4 L-4 -4 L-4 -7 L-1 -7 L-1 -4 L3 -4 L3 -7 L6 -7 L6 -4 L10 -4 L10 -10 Z"/>
      </g>
    </g>
  );
  if(idx===5) return (
    <g {...p}>
      <path d="M0 2 L-8 7 L0 12 L8 7 Z"/>
      <path d="M-8 7 L-8 10 L0 15 L0 12"/>
      <path d="M8 7 L8 10 L0 15"/>
      <line x1="-5" y1="-11" x2="-5" y2="-1" strokeWidth="1.8"/>
      <polyline points="-8,-3 -5,1 -2,-3" strokeWidth="1.8"/>
      <line x1="5" y1="-11" x2="5" y2="-1" strokeWidth="1.8"/>
      <polyline points="2,-3 5,1 8,-3" strokeWidth="1.8"/>
    </g>
  );
  if(idx===6) return (
    <g {...p}>
      <rect x="-10" y="-12" width="20" height="3.5" rx="1.8"/>
      <rect x="-4" y="-8.5" width="8" height="5" rx="1"/>
      <rect x="-2" y="-3.5" width="4" height="7" rx="1"/>
      <rect x="-1" y="-2.5" width="2" height="1.8" rx="0.4" strokeWidth="0.7"/>
      <rect x="-1" y="0.5" width="2" height="1.8" rx="0.4" strokeWidth="0.7"/>
      <line x1="0" y1="3.5" x2="0" y2="6"/>
      <line x1="-4" y1="7" x2="-6" y2="9.5" strokeWidth="1.5"/>
      <line x1="-1.5" y1="7.5" x2="-2" y2="10" strokeWidth="1.5"/>
      <line x1="1.5" y1="7.5" x2="2" y2="10" strokeWidth="1.5"/>
      <line x1="4" y1="7" x2="6" y2="9.5" strokeWidth="1.5"/>
      <rect x="-10" y="10" width="20" height="2.5" rx="1.2"/>
    </g>
  );
  if(idx===7) return (
    <g {...p}>
      <path d="M-7 -8 Q-9 -8 -9 -6 L-9 1 Q-9 3 -7 3 L5 3 Q7 3 7 1 L7 -6 Q7 -8 5 -8 Z"/>
      <rect x="-4" y="-6.5" width="6" height="2" rx="0.8" strokeWidth="0.8"/>
      <circle cx="0" cy="-1.5" r="1.5" strokeWidth="0.8"/>
      <rect x="7" y="-4" width="5" height="3.5" rx="1"/>
      <path d="M-9 -2 Q-11 -2 -11 0 Q-11 2 -9.5 2"/>
      <rect x="-9" y="3" width="16" height="2.5" rx="1"/>
      <line x1="-10" y1="7" x2="10" y2="7" strokeWidth="1.2"/>
      <path d="M-8 10 Q-6 8 -4 10 Q-2 12 0 10 Q2 8 4 10 Q6 12 8 10" strokeWidth="1"/>
    </g>
  );
  if(idx===8) return (
    <g {...p} strokeWidth="1.8">
      <path d="M-10 -10 L-10 -3 Q-7 -3 -7 -1 Q-7 1 -10 1 L-10 10 L-1 10 Q-1 7 1 7 Q3 7 3 10 L10 10 L10 1 Q7 1 7 -1 Q7 -3 10 -3 L10 -10 Z"/>
    </g>
  );
  return null;
}
function RutaAccionDiagram({cur,setCur}){
  const [auto,setAuto]=useState(null);
  const total=RUTA_STEPS.length;
  useEffect(()=>()=>{if(auto) clearInterval(auto);},[auto]);
  const startAuto=()=>{
    if(auto){clearInterval(auto);setAuto(null);return;}
    let c=cur>=total?0:cur;
    if(c===0) setCur(0);
    const t=setInterval(()=>{
      c++;
      setCur(c);
      if(c>=total){clearInterval(t);setAuto(null);}
    },950);
    setAuto(t);
  };
  const btn=(style)=>({
    background:style==="pri"?"#fff":"rgba(255,255,255,0.1)",
    color:style==="pri"?BLUE:"rgba(255,255,255,0.85)",
    border:"1px solid rgba(255,255,255,0.2)",
    borderRadius:8,padding:"7px 16px",fontSize:11,fontWeight:800,
    cursor:"pointer",fontFamily:"'Montserrat',system-ui",
  });
  return (
    <div style={{background:BLUE,padding:"2.5rem 2rem 1.8rem",borderRadius:12,fontFamily:"'Montserrat',system-ui"}}>
      <div style={{fontSize:10,fontWeight:800,color:"rgba(255,255,255,0.5)",letterSpacing:2,textTransform:"uppercase",marginBottom:4}}>Novo Nordisk × D·Coder Studio</div>
      <div style={{fontSize:36,fontWeight:900,color:"#fff",lineHeight:1,marginBottom:3,letterSpacing:-0.5}}>RUTA DE ACCIÓN</div>
      <div style={{fontSize:10,fontWeight:800,color:"rgba(255,255,255,0.5)",letterSpacing:1.5,textTransform:"uppercase",marginBottom:"2rem"}}>¿Cómo logramos nuestro objetivo?</div>
      <svg viewBox="0 0 660 310" style={{width:"100%",display:"block"}}>
        <line x1="44" y1="86" x2="616" y2="86" stroke="rgba(255,255,255,0.12)" strokeWidth="2"/>
        <line x1="84" y1="226" x2="576" y2="226" stroke="rgba(255,255,255,0.12)" strokeWidth="2"/>
        {RUTA_SEGS.map(sg=>(
          <line key={sg.id} x1={sg.x1} y1={sg.y} x2={sg.x2} y2={sg.y}
            stroke={cur>=sg.step?"#fff":"transparent"} strokeWidth="2" strokeLinecap="round"
            style={{transition:"stroke 0.4s ease"}}/>
        ))}
        {RUTA_STEPS.map(st=>{
          const on=cur>st.id;
          const op=on?1:0;
          return (
            <g key={st.id} style={{opacity:op,transition:"opacity 0.45s ease"}}>
              <circle cx={st.x} cy={st.y} r="25"
                fill={on?"rgba(255,255,255,0.18)":"rgba(255,255,255,0.08)"}
                stroke={on?"rgba(255,255,255,0.5)":"rgba(255,255,255,0.18)"} strokeWidth="1.5"/>
              <g transform={`translate(${st.x},${st.y})`}>
                <RutaIcon idx={st.id} lit={on}/>
              </g>
              <circle cx={st.x} cy={st.dy} r="6" fill={on?"#fff":"rgba(255,255,255,0.2)"}
                style={{transition:"fill 0.3s"}}/>
              <text x={st.x} y={st.dy+14} textAnchor="middle"
                style={{fontFamily:"'Montserrat',system-ui",fontSize:8,fontWeight:800,fill:on?"rgba(255,255,255,0.55)":"rgba(255,255,255,0.22)"}}>
                {st.num}
              </text>
              {st.lines.map((ln,li)=>(
                <text key={li} x={st.x} y={st.dy+25+li*10} textAnchor="middle"
                  style={{fontFamily:"'Montserrat',system-ui",fontSize:9,fontWeight:800,fill:on?"rgba(255,255,255,0.9)":"rgba(255,255,255,0.3)",letterSpacing:0.4}}>
                  {ln}
                </text>
              ))}
            </g>
          );
        })}
      </svg>
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginTop:"1.2rem"}}>
        <span style={{fontSize:11,color:"rgba(255,255,255,0.4)",fontWeight:800,minWidth:44,textAlign:"center"}}>{cur} / {total}</span>
        <button style={btn()} onClick={startAuto}>{auto?"⏸ Pausar":"▶ Auto"}</button>
      </div>
    </div>
  );
}

function HistoriaModal({showHistoria,setShowHistoria,slideIdx,setSlideIdx,recs,totalReal,totalPiezas,pct,isAdmin,objetivoInicial,setObjetivoInicial,descubrimientos,setDescubrimientos,proyecciones,setProyecciones}){
    const HISTORIA_PAGES=[{type:"intro"}];
    HISTORIA_PAGES.push({type:"objetivo"});
    HISTORIA_PAGES.push({type:"ruta-accion"});
    HISTORIA_PAGES.push({type:"proyecto"});
    HISTORIA_PAGES.push({type:"trayecto"});
    HISTORIA_PAGES.push({type:"produccion"});
    HISTORIA_PAGES.push({type:"piezas"});
    descubrimientos.forEach((_,i)=>HISTORIA_PAGES.push({type:"descubrimientos",i}));
    proyecciones.forEach((_,i)=>HISTORIA_PAGES.push({type:"proyecciones",i}));
    const curIdx=Math.max(0,Math.min(slideIdx,HISTORIA_PAGES.length-1));
    const [rutaStep,setRutaStep]=useState(0);
    const goTo=i=>{
      const idx=Math.max(0,Math.min(HISTORIA_PAGES.length-1,i));
      if(HISTORIA_PAGES[idx].type==="ruta-accion") setRutaStep(0);
      setSlideIdx(idx);
    };
    const navigate=dir=>{
      const cur=HISTORIA_PAGES[curIdx];
      if(cur.type==="ruta-accion"){
        if(dir>0&&rutaStep<RUTA_STEPS.length){setRutaStep(s=>s+1);return;}
        if(dir<0&&rutaStep>0){setRutaStep(s=>s-1);return;}
      }
      const nextIdx=curIdx+dir;
      if(nextIdx<0||nextIdx>HISTORIA_PAGES.length-1) return;
      if(HISTORIA_PAGES[nextIdx].type==="ruta-accion") setRutaStep(dir>0?0:RUTA_STEPS.length);
      setSlideIdx(nextIdx);
    };

    useEffect(()=>{
      if(!showHistoria) return;
      const handler=e=>{
        if(e.key==="ArrowRight"){e.preventDefault();navigate(1);}
        else if(e.key==="ArrowLeft"){e.preventDefault();navigate(-1);}
        else if(e.key==="Escape"){setShowHistoria(false);setSlideIdx(0);}
      };
      window.addEventListener("keydown",handler);
      return ()=>window.removeEventListener("keydown",handler);
    },[showHistoria,curIdx,rutaStep,HISTORIA_PAGES.length]);

    useEffect(()=>{
      if(!showHistoria) return;
      document.body.style.background=G_HERO;
      return ()=>{document.body.style.background="";};
    },[showHistoria]);

    if(!showHistoria) return null;
    const close=()=>{setShowHistoria(false);setSlideIdx(0);};
    const sortedRecs=[...recs].sort((a,b)=>a.fecha.localeCompare(b.fecha));
    const page=HISTORIA_PAGES[curIdx];
    const BULLET_META={
      descubrimientos:{titulo:"Descubrimientos sobre la marcha",subtitulo:"Aprendizajes",items:descubrimientos,setItems:setDescubrimientos},
      proyecciones:{titulo:"Proyecciones a futuro",subtitulo:"Lo que viene",items:proyecciones,setItems:setProyecciones},
    };
    const navBtn=(dir)=>{
      const atEdge=dir<0?curIdx===0:curIdx===HISTORIA_PAGES.length-1;
      const midRuta=page.type==="ruta-accion"&&(dir<0?rutaStep>0:rutaStep<RUTA_STEPS.length);
      const disabled=atEdge&&!midRuta;
      return(
        <button className="hist-nav-btn" onClick={()=>navigate(dir)} disabled={disabled} style={{background:"rgba(255,255,255,0.12)",border:"1px solid rgba(255,255,255,0.25)",color:WHITE,borderRadius:"50%",width:44,height:44,fontSize:18,cursor:disabled?"default":"pointer",display:"flex",alignItems:"center",justifyContent:"center",opacity:disabled?0.3:1,flexShrink:0}}>{dir<0?"←":"→"}</button>
      );
    };
    return(
      <div style={{position:"fixed",inset:0,background:G_HERO,zIndex:200,display:"flex",flexDirection:"column",color:WHITE,animation:"histModalIn 0.35s ease"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"1.25rem 2rem",flexShrink:0}}>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:2,textTransform:"uppercase",opacity:0.5}}>Waste Into Value — Nuestra Historia</div>
          <div style={{display:"flex",alignItems:"center",gap:16}}>
            <div style={{fontSize:11,fontWeight:700,opacity:0.4,letterSpacing:1}}>{curIdx+1} / {HISTORIA_PAGES.length}</div>
            <button onClick={close} style={{background:"rgba(255,255,255,0.12)",border:"none",color:WHITE,borderRadius:8,width:32,height:32,fontSize:16,cursor:"pointer"}}>✕</button>
          </div>
        </div>
        <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 2rem 1rem",overflow:"hidden"}}>
        <div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center"}}>
          {page.type==="intro"&&(
            <div style={{textAlign:"center",maxWidth:760}}>
              <div style={{fontSize:13,fontWeight:700,letterSpacing:3,textTransform:"uppercase",opacity:0.55,marginBottom:14}}>Programa de Economía Circular</div>
              <div style={{fontSize:"clamp(40px,8vw,72px)",fontWeight:900,marginBottom:18,lineHeight:1.05}}>Waste Into Value</div>
              <div style={{fontSize:16,opacity:0.7,marginBottom:40,lineHeight:1.6,maxWidth:560,marginLeft:"auto",marginRight:"auto"}}>De residuo plástico a productos con propósito: este es el recorrido del proyecto desde su primera entrega hasta hoy.</div>
              <div style={{display:"flex",justifyContent:"center",gap:"clamp(20px,5vw,56px)",flexWrap:"wrap"}}>
                {[{v:"+500kg",l:"transformados actualmente"},{v:"+2,000kg",l:"en proceso de transformación"},{v:"+150",l:"personas interactuando con las piezas"},{v:"+1000",l:"piezas en fabricación"},{v:"344",l:"piezas creadas"}].map((s,i)=>(
                  <div key={s.l} className="hist-stat" style={{animationDelay:`${0.15+i*0.1}s`}}>
                    <div style={{fontSize:"clamp(28px,5vw,44px)",fontWeight:900}}>{s.v}</div>
                    <div style={{fontSize:11,opacity:0.55,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginTop:4}}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {page.type==="objetivo"&&(
            <div style={{maxWidth:760,width:"100%",textAlign:"center"}}>
              <div style={{fontSize:13,fontWeight:700,letterSpacing:3,textTransform:"uppercase",opacity:0.5,marginBottom:10}}>¿Por qué nacimos?</div>
              <div style={{fontSize:"clamp(22px,4vw,32px)",fontWeight:900,marginBottom:32}}>Objetivo Inicial del Proyecto</div>
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                {objetivoInicial.map((txt,i)=>(
                  <div key={i} className="hist-stat" style={{animationDelay:`${0.1+i*0.1}s`,display:"flex",alignItems:"flex-start",gap:16,textAlign:"left",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:18,padding:"1.25rem 1.5rem"}}>
                    <div style={{flexShrink:0,width:34,height:34,borderRadius:"50%",background:"rgba(255,255,255,0.12)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:900}}>{i+1}</div>
                    {isAdmin
                      ?<div style={{flex:1,display:"flex",flexDirection:"column",gap:8}}>
                         <textarea value={txt} onChange={e=>setObjetivoInicial(arr=>arr.map((x,j)=>j===i?e.target.value:x))} style={{width:"100%",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:12,color:WHITE,fontSize:15,fontWeight:600,lineHeight:1.6,padding:"0.85rem 1rem",resize:"vertical",minHeight:80,outline:"none",fontFamily:"inherit"}}/>
                         <button onClick={()=>setObjetivoInicial(arr=>arr.filter((_,j)=>j!==i))} style={{alignSelf:"flex-end",background:"rgba(255,255,255,0.1)",border:"none",color:WHITE,borderRadius:8,padding:"6px 12px",fontSize:11,fontWeight:700,cursor:"pointer"}}>🗑 Eliminar</button>
                       </div>
                      :<div style={{fontSize:"clamp(15px,2vw,18px)",fontWeight:600,lineHeight:1.65,paddingTop:4}}>{txt}</div>
                    }
                  </div>
                ))}
              </div>
              {isAdmin&&(
                <div style={{marginTop:18}}>
                  <button onClick={()=>setObjetivoInicial(arr=>[...arr,""])} style={{background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.25)",color:WHITE,borderRadius:8,padding:"8px 16px",fontSize:12,fontWeight:700,cursor:"pointer"}}>+ Agregar punto</button>
                </div>
              )}
            </div>
          )}
          {["descubrimientos","proyecciones"].includes(page.type)&&(()=>{
            const meta=BULLET_META[page.type];
            const i=page.i;
            return(
              <div style={{maxWidth:760,width:"100%",textAlign:"center"}}>
                <div style={{fontSize:13,fontWeight:700,letterSpacing:3,textTransform:"uppercase",opacity:0.5,marginBottom:10}}>{meta.subtitulo}</div>
                <div style={{fontSize:"clamp(22px,4vw,32px)",fontWeight:900,marginBottom:36}}>{meta.titulo}</div>
                {isAdmin
                  ?<textarea value={meta.items[i]} onChange={e=>meta.setItems(arr=>arr.map((x,j)=>j===i?e.target.value:x))} style={{width:"100%",maxWidth:680,background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:18,color:WHITE,fontSize:"clamp(18px,3vw,26px)",fontWeight:700,lineHeight:1.6,padding:"1.75rem",resize:"vertical",minHeight:140,outline:"none",fontFamily:"inherit",textAlign:"center"}}/>
                  :<div className="hist-stat" style={{fontSize:"clamp(19px,3.4vw,30px)",fontWeight:700,lineHeight:1.65,padding:"2rem 2.5rem",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:20}}>{meta.items[i]}</div>
                }
                <div style={{fontSize:12,opacity:0.4,fontWeight:800,letterSpacing:2,marginTop:28}}>{i+1} / {meta.items.length}</div>
                {isAdmin&&(
                  <div style={{display:"flex",gap:8,justifyContent:"center",marginTop:16}}>
                    <button onClick={()=>meta.setItems(arr=>arr.filter((_,j)=>j!==i))} style={{background:"rgba(255,255,255,0.1)",border:"none",color:WHITE,borderRadius:8,padding:"8px 16px",fontSize:12,fontWeight:700,cursor:"pointer"}}>🗑 Eliminar punto</button>
                    <button onClick={()=>meta.setItems(arr=>[...arr,""])} style={{background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.25)",color:WHITE,borderRadius:8,padding:"8px 16px",fontSize:12,fontWeight:700,cursor:"pointer"}}>+ Agregar punto</button>
                  </div>
                )}
              </div>
            );
          })()}
          {page.type==="ruta-accion"&&(
            <div style={{maxWidth:760,width:"100%"}}>
              <RutaAccionDiagram cur={rutaStep} setCur={setRutaStep}/>
            </div>
          )}
          {page.type==="proyecto"&&(
            <div style={{maxWidth:820,width:"100%"}}>
              <div style={{textAlign:"center",marginBottom:28}}>
                <div style={{fontSize:13,fontWeight:700,letterSpacing:3,textTransform:"uppercase",opacity:0.55,marginBottom:8}}>El Proyecto</div>
                <div style={{fontSize:"clamp(26px,5vw,38px)",fontWeight:900}}>Objetivo y Contexto</div>
              </div>
              <div style={{fontSize:15,opacity:0.75,lineHeight:1.7,textAlign:"center",maxWidth:680,margin:"0 auto 32px"}}>
                Crear objetos funcionales y decorativos para las nuevas oficinas de Novo Nordisk México a partir de plumas de inyección recicladas: un entorno de trabajo inspirador que respalda el compromiso de la empresa con la sustentabilidad y la reducción de residuos.
              </div>
              <div style={{display:"flex",justifyContent:"center",gap:"clamp(16px,4vw,40px)",flexWrap:"wrap"}}>
                {[{v:"78%",l:"de residuos se recicla"},{v:"0.3%",l:"a vertederos"},{v:"100%",l:"energía renovable"},{v:"2030",l:"meta cero emisiones CO₂"}].map((s,i)=>(
                  <div key={s.l} className="hist-stat" style={{animationDelay:`${0.1+i*0.08}s`,background:"rgba(255,255,255,0.08)",borderRadius:14,padding:"1rem 1.25rem",minWidth:130,textAlign:"center"}}>
                    <div style={{fontSize:"clamp(22px,4vw,32px)",fontWeight:900}}>{s.v}</div>
                    <div style={{fontSize:10,opacity:0.55,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginTop:4}}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {page.type==="trayecto"&&(
            <div style={{maxWidth:980,width:"100%",textAlign:"center"}}>
              <div style={{fontSize:13,fontWeight:700,letterSpacing:3,textTransform:"uppercase",opacity:0.55,marginBottom:8}}>El Trayecto</div>
              <div style={{fontSize:"clamp(26px,5vw,38px)",fontWeight:900,marginBottom:36}}>{recs.length} recepciones desde {sortedRecs[0]?.fecha}</div>
              <div style={{display:"flex",justifyContent:"center",gap:12,flexWrap:"wrap"}}>
                {sortedRecs.map((r,i)=>(
                  <div key={r.id} className="hist-stat" style={{animationDelay:`${0.05+i*0.05}s`,background:"rgba(255,255,255,0.1)",borderRadius:14,padding:"1rem 1.1rem",minWidth:150,maxWidth:200,textAlign:"left"}}>
                    <div style={{fontSize:11,fontWeight:800,opacity:0.5,letterSpacing:1}}>{r.fecha}</div>
                    <div style={{fontSize:18,fontWeight:900,marginTop:2}}>{fmt(r.kgReal)} kg</div>
                    <div style={{fontSize:11,fontWeight:700,opacity:0.55,marginTop:2}}>{r.estado}</div>
                    {r.transformadoEn&&<div style={{fontSize:11,opacity:0.6,marginTop:6,lineHeight:1.4}}>{r.transformadoEn}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}
          {page.type==="produccion"&&(
            <div style={{maxWidth:900,width:"100%",textAlign:"center"}}>
              <div style={{fontSize:13,fontWeight:700,letterSpacing:3,textTransform:"uppercase",opacity:0.55,marginBottom:8}}>Ruta de Acción</div>
              <div style={{fontSize:"clamp(26px,5vw,38px)",fontWeight:900,marginBottom:8}}>¿Cómo logramos nuestro objetivo?</div>
              <div style={{fontSize:15,opacity:0.6,marginBottom:36}}>De residuo plástico a producto terminado, paso a paso</div>
              <div style={{display:"flex",justifyContent:"center",gap:10,flexWrap:"wrap"}}>
                {PROCESO_PRODUCCION.map((e,i)=>(
                  <div key={i} className="hist-stat" style={{animationDelay:`${0.06+i*0.06}s`,background:"rgba(255,255,255,0.1)",borderRadius:14,padding:"1.25rem 1rem",minWidth:120,maxWidth:150,position:"relative"}}>
                    <div style={{position:"absolute",top:8,left:10,fontSize:10,opacity:0.35,fontWeight:800}}>{i+1}</div>
                    <div style={{fontSize:28,marginBottom:6}}>{PROCESO_ICONS[i]}</div>
                    <div style={{fontSize:12,fontWeight:800,lineHeight:1.3}}>{e}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {page.type==="piezas"&&(
            <div style={{maxWidth:860,width:"100%",textAlign:"center"}}>
              <div style={{fontSize:13,fontWeight:700,letterSpacing:3,textTransform:"uppercase",opacity:0.55,marginBottom:8}}>Lo que hemos creado</div>
              <div style={{fontSize:"clamp(26px,5vw,38px)",fontWeight:900,marginBottom:8}}>344 piezas creadas</div>
              <div style={{fontSize:15,opacity:0.6,marginBottom:36}}>a partir de plástico reciclado · +500 kg transformados hasta ahora</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:14}}>
                {PIEZAS_HISTORIA.map((p,i)=>(
                  <div key={p.nombre} className="hist-stat" style={{animationDelay:`${0.06+i*0.05}s`,background:"rgba(255,255,255,0.1)",borderRadius:16,padding:"1.25rem"}}>
                    <div style={{fontSize:28,marginBottom:8}}>{p.icon}</div>
                    <div style={{fontSize:28,fontWeight:900}}>{p.cantidad}</div>
                    <div style={{fontSize:11,opacity:0.6,fontWeight:700,marginTop:4,lineHeight:1.3}}>{p.nombre}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        </div>
        <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:20,padding:"1.5rem 2rem 2rem",flexShrink:0}}>
          {navBtn(-1)}
          <div style={{display:"flex",gap:8}}>
            {HISTORIA_SECTIONS.map(sec=>{
              const firstIdx=HISTORIA_PAGES.findIndex(p=>p.type===sec.type);
              if(firstIdx===-1) return null;
              const active=page.type===sec.type;
              return(
                <div key={sec.type} className="hist-dot" onClick={()=>goTo(firstIdx)} title={sec.label} style={{width:active?28:9,height:9,borderRadius:99,background:active?WHITE:"rgba(255,255,255,0.25)",cursor:"pointer",transition:"all 0.25s"}}/>
              );
            })}
          </div>
          {navBtn(1)}
        </div>
      </div>
    );
}

export default function App(){
  const [recs,setRecs]=useState(RECEPCIONES_INIT);
  const [pedidos,setPedidos]=useState(PEDIDOS_INIT);
  const [detalle,setDetalle]=useState(DETALLE_INIT);
  const [metaKg,setMetaKg]=useState(3000);
  const [tab,setTab]=useState("inicio");
  const [yrFilter,setYrFilter]=useState("Todo");
  const [isAdmin,setIsAdmin]=useState(false);
  const [piezaTab,setPiezaTab]=useState(null);
  const [openRecs,setOpenRecs]=useState([]);
  const [editRecId,setEditRecId]=useState(null);
  const [editRecData,setEditRecData]=useState(null);
  const [showNewRec,setShowNewRec]=useState(false);
  const [newRecData,setNewRecData]=useState({fecha:"",kgBruto:"",kgReal:"",estado:"En Stock",transformadoEn:"",obs:""});
  const [editPedId,setEditPedId]=useState(null);
  const [editPedData,setEditPedData]=useState(null);
  const [showNewPed,setShowNewPed]=useState(false);
  const [newPedData,setNewPedData]=useState({nombre:"",cliente:"Novo Nordisk",kgReq:"",kgDisponible:false,fechaEst:"",etapa:0,cotizacion:"",oc:"",obs:""});
  const [proyectos,setProyectos]=useState(PROYECTOS_INIT);
  const [editProyId,setEditProyId]=useState(null);
  const [editProyData,setEditProyData]=useState(null);
  const [showNewProy,setShowNewProy]=useState(false);
  const [newProyData,setNewProyData]=useState({nombre:"",kg:"",etapa:0,fecha:""});
  const [dragInfo,setDragInfo]=useState(null);
  const [dragOverEtapa,setDragOverEtapa]=useState(null);
  const [focusEtapa,setFocusEtapa]=useState(0);
  const [collapsedEtapas,setCollapsedEtapas]=useState({});
  const proyColRefs=useRef([]);
  const scrollToEtapa=(i)=>{setFocusEtapa(i);proyColRefs.current[i]?.scrollIntoView({behavior:"smooth",inline:"start",block:"nearest"});};
  const [editMeta,setEditMeta]=useState(false);
  const [editPiezaId,setEditPiezaId]=useState(null);
  const [editPiezaData,setEditPiezaData]=useState(null);
  const [showNewPieza,setShowNewPieza]=useState(false);
  const [newPiezaData,setNewPiezaData]=useState({nombre:"",cantidad:1,kgPieza:0,imagen:""});
  const [showHistoria,setShowHistoria]=useState(false);
  const [slideIdx,setSlideIdx]=useState(0);
  const [objetivoInicial,setObjetivoInicial]=useState([
    "Transformar las plumas de inyección recicladas de Novo Nordisk México en objetos funcionales y decorativos de alto valor estético: aplicaciones útiles, duraderas y representativas de la marca.",
    "Extender la vida útil del material una vez concluida su función original, incorporándolo en nuevos productos con propósito — la esencia de la economía circular: convertir un residuo en un recurso valioso.",
    "Fortalecer el compromiso de Novo Nordisk con la sustentabilidad, la reducción de residuos y la generación de impacto positivo a través del diseño.",
  ]);
  const [descubrimientos,setDescubrimientos]=useState([
    "Desperdicio mínimo del material: las piezas que sobran o se descartan se pueden volver a moler y prensar de nuevo, y el polvo también se reutiliza — prácticamente cero desperdicio.",
    "Alta resistencia estructural con refuerzo metálico y uniones mecánicas: usamos varilla metálica reciclada de alta resistencia y tuercas en las uniones.",
    "Impacto positivo en las personas: genera asombro y conversación, reforzando el mensaje de sostenibilidad de la marca.",
  ]);
  const [proyecciones,setProyecciones]=useState([
    "Unificar procesos en una sola locación, para optimizar tiempos, recursos, control de calidad y responsabilidad ambiental.",
    "Mejorar procesos de producción: aumentar eficiencia y escalabilidad (horno y prensa más grandes y efectivos), sin perder el detalle y proceso humano.",
    "Elevar los estándares de seguridad y calidad.",
    "Colaborar con artistas, diseñadores y comunidades locales para crear piezas con valor cultural y social.",
    "Generar empleo y capacitación para más personas, según el proyecto lo requiera.",
  ]);

  const totalBruto=recs.reduce((s,r)=>s+Number(r.kgBruto),0);
  const totalReal=recs.reduce((s,r)=>s+Number(r.kgReal),0);
  const totalPiezas=Object.values(detalle).reduce((s,arr)=>s+arr.reduce((a,p)=>a+p.cantidad,0),0);
  const kgPorEstado=estado=>recs.filter(r=>r.estado===estado).reduce((s,r)=>s+Number(r.kgReal),0);
  const enPlacasKg=kgPorEstado("En Placas");
  const transformadoKg=recs.reduce((s,r)=>{
    if((r.desglose||[]).length>0) return s+r.desglose.reduce((a,d)=>a+(d.estado==="Transformado"?Number(d.cantidad||0):0),0);
    return s+(r.estado==="Transformado"?Number(r.kgReal):0);
  },0);
  const pct=Math.min(100,Math.round((transformadoKg/metaKg)*100));
  const totalAsignado=recs.reduce((s,r)=>s+(r.desglose||[]).reduce((a,d)=>a+Number(d.cantidad||0),0),0);
  const libreKg=totalReal-totalAsignado;

  const slices={"Todo":HISTORICO_FULL,"2024":HISTORICO_FULL.slice(0,4),"2025":HISTORICO_FULL.slice(4,16),"2026":HISTORICO_FULL.slice(16)};
  const filtered=slices[yrFilter];
  const filtNonZero=filtered.filter(d=>d.kg>0);
  const filtTot=filtered.reduce((s,d)=>s+d.kg,0);
  const filtAvg=filtNonZero.length?Math.round(filtTot/filtNonZero.length):0;
  const filtBest=filtNonZero.length?Math.max(...filtNonZero.map(d=>d.kg)):0;
  const filtBestMes=filtNonZero.find(d=>d.kg===filtBest)?.mes||"";
  const acColor=yrFilter==="2025"?BLUE2:yrFilter==="2026"?GREEN:BLUE;
  const acGrad=yrFilter==="2025"?"linear-gradient(135deg,#1A5FA8,#2176C2)":yrFilter==="2026"?G_GREEN:G_BLUE;

  const exitAdmin=()=>{setIsAdmin(false);setEditRecId(null);setEditPedId(null);setShowNewRec(false);setShowNewPed(false);setEditProyId(null);setShowNewProy(false);setEditMeta(false);};

  const saveRec=(d)=>{
    if(d.id) setRecs(rs=>rs.map(r=>r.id===d.id?{...d,kgBruto:Number(d.kgBruto),kgReal:Number(d.kgReal)}:r));
    else{const id=Math.max(0,...recs.map(r=>r.id))+1;setRecs(rs=>[...rs,{...d,id,kgBruto:Number(d.kgBruto),kgReal:Number(d.kgReal)}]);}
    setEditRecId(null);setShowNewRec(false);setNewRecData({fecha:"",kgBruto:"",kgReal:"",estado:"En Stock",transformadoEn:"",obs:""});
  };
  const delRec=(id)=>setRecs(rs=>rs.filter(r=>r.id!==id));
  const toggleRec=(id)=>setOpenRecs(o=>o.includes(id)?o.filter(x=>x!==id):[...o,id]);
  const addDesglose=(id)=>setRecs(rs=>rs.map(r=>r.id===id?{...r,desglose:[...(r.desglose||[]),{cantidad:0,descripcion:"",estado:"Transformado"}]}:r));
  const updDesglose=(id,idx,field,val)=>setRecs(rs=>rs.map(r=>r.id===id?{...r,desglose:r.desglose.map((d,j)=>j===idx?{...d,[field]:val}:d)}:r));
  const delDesglose=(id,idx)=>setRecs(rs=>rs.map(r=>r.id===id?{...r,desglose:r.desglose.filter((_,j)=>j!==idx)}:r));

  const savePed=(d)=>{
    if(d.id) setPedidos(ps=>ps.map(p=>p.id===d.id?{...d,kgReq:Number(d.kgReq),etapa:Number(d.etapa)}:p));
    else{const id=Math.max(0,...pedidos.map(p=>p.id))+1;setPedidos(ps=>[...ps,{...d,id,kgReq:Number(d.kgReq),etapa:Number(d.etapa)}]);}
    setEditPedId(null);setShowNewPed(false);setNewPedData({nombre:"",cliente:"Novo Nordisk",kgReq:"",kgDisponible:false,fechaEst:"",etapa:0,cotizacion:"",oc:"",obs:""});
  };
  const delPed=(id)=>setPedidos(ps=>ps.filter(p=>p.id!==id));

  const saveProy=(d)=>{
    if(d.id) setProyectos(ps=>ps.map(p=>p.id===d.id?{...d,kg:Number(d.kg),etapa:Number(d.etapa)}:p));
    else{const id=Math.max(0,...proyectos.map(p=>p.id))+1;setProyectos(ps=>[...ps,{...d,id,kg:Number(d.kg),etapa:Number(d.etapa)}]);}
    setEditProyId(null);setShowNewProy(false);setNewProyData({nombre:"",kg:"",etapa:0,fecha:""});
  };
  const delProy=(id)=>setProyectos(ps=>ps.filter(p=>p.id!==id));

  const onCardDragStart=(board,id)=>e=>{setDragInfo({board,id});e.dataTransfer.effectAllowed="move";};
  const onCardDragEnd=()=>{setDragInfo(null);setDragOverEtapa(null);};
  const onColDragOver=(board,etapa)=>e=>{
    if(!dragInfo||dragInfo.board!==board) return;
    e.preventDefault();
    setDragOverEtapa(o=>(o&&o.board===board&&o.etapa===etapa)?o:{board,etapa});
  };
  const onColDragLeave=(board,etapa)=>e=>{
    if(e.currentTarget.contains(e.relatedTarget)) return;
    setDragOverEtapa(o=>(o&&o.board===board&&o.etapa===etapa)?null:o);
  };
  const onColDrop=(board,etapa)=>e=>{
    e.preventDefault();
    if(!dragInfo||dragInfo.board!==board) return;
    if(board==="ped") setPedidos(ps=>ps.map(p=>p.id===dragInfo.id?{...p,etapa}:p));
    else setProyectos(ps=>ps.map(p=>p.id===dragInfo.id?{...p,etapa}:p));
    setDragInfo(null);setDragOverEtapa(null);
  };

  const savePieza=(cat,d)=>{
    setDetalle(prev=>{
      const arr=prev[cat];
      if(d.id) return {...prev,[cat]:arr.map(p=>p.id===d.id?{...d,cantidad:Number(d.cantidad),kgPieza:Number(d.kgPieza)}:p)};
      const id=arr.length?Math.max(...arr.map(p=>p.id))+1:1;
      return {...prev,[cat]:[...arr,{...d,id,cantidad:Number(d.cantidad),kgPieza:Number(d.kgPieza)}]};
    });
    setEditPiezaId(null);setShowNewPieza(false);setNewPiezaData({nombre:"",cantidad:1,kgPieza:0,imagen:""});
  };
  const delPieza=(cat,id)=>setDetalle(prev=>({...prev,[cat]:prev[cat].filter(p=>p.id!==id)}));

  const TABS=[{id:"inicio",label:"Inicio"},{id:"registros",label:"Registros"},{id:"pipeline",label:"Pipeline"},{id:"tendencia",label:"Tendencia"},{id:"impacto",label:"Impacto"},{id:"piezas",label:"Piezas"}];

  const RecInlineForm=({data,onChange,onSave,onCancel})=>(
    <div style={{background:BLUE_L,borderRadius:12,padding:"1rem",border:`1.5px solid ${BLUE}`,marginBottom:8}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:8,marginBottom:8}}>
        {[["Fecha","date","fecha"],["KG Brutos","number","kgBruto"],["KG Reales","number","kgReal"]].map(([lbl,type,key])=>(
          <div key={key}><div style={{fontSize:9,fontWeight:700,color:BLUE,textTransform:"uppercase",letterSpacing:0.5,marginBottom:3}}>{lbl}</div>
          <input style={inpSm} type={type} value={data[key]} onChange={e=>onChange({...data,[key]:e.target.value})}/></div>
        ))}
        <div><div style={{fontSize:9,fontWeight:700,color:BLUE,textTransform:"uppercase",letterSpacing:0.5,marginBottom:3}}>Estado</div>
          <select style={inpSm} value={data.estado} onChange={e=>onChange({...data,estado:e.target.value})}>
            {ESTADOS.map(s=><option key={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div style={{marginBottom:6}}><div style={{fontSize:9,fontWeight:700,color:BLUE,textTransform:"uppercase",letterSpacing:0.5,marginBottom:3}}>Transformado en</div>
        <textarea style={{...inpSm,resize:"vertical",minHeight:40,width:"100%"}} value={data.transformadoEn} onChange={e=>onChange({...data,transformadoEn:e.target.value})}/></div>
      <div style={{marginBottom:10}}><div style={{fontSize:9,fontWeight:700,color:BLUE,textTransform:"uppercase",letterSpacing:0.5,marginBottom:3}}>Observaciones</div>
        <textarea style={{...inpSm,resize:"vertical",minHeight:36,width:"100%"}} value={data.obs} onChange={e=>onChange({...data,obs:e.target.value})}/></div>
      <div style={{display:"flex",gap:6}}><SaveBtn onClick={()=>onSave(data)}/><CancelBtn onClick={onCancel}/></div>
    </div>
  );

  const PedInlineForm=({data,onChange,onSave,onCancel})=>(
    <div style={{background:BLUE_L,borderRadius:12,padding:"1rem",border:`1.5px solid ${BLUE}`,marginBottom:8}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:8,marginBottom:8}}>
        {[["Pedido","text","nombre"],["Cliente","text","cliente"],["KG req.","number","kgReq"],["Fecha entrega","date","fechaEst"]].map(([lbl,type,key])=>(
          <div key={key}><div style={{fontSize:9,fontWeight:700,color:BLUE,textTransform:"uppercase",letterSpacing:0.5,marginBottom:3}}>{lbl}</div>
          <input style={inpSm} type={type} value={data[key]} onChange={e=>onChange({...data,[key]:e.target.value})}/></div>
        ))}
        <div><div style={{fontSize:9,fontWeight:700,color:BLUE,textTransform:"uppercase",letterSpacing:0.5,marginBottom:3}}>Etapa</div>
          <select style={inpSm} value={data.etapa} onChange={e=>onChange({...data,etapa:Number(e.target.value)})}>
            {ETAPAS.map((e,i)=><option key={i} value={i}>{e}</option>)}
          </select>
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
        <input type="checkbox" checked={data.kgDisponible} onChange={e=>onChange({...data,kgDisponible:e.target.checked})} style={{width:15,height:15,accentColor:BLUE}}/>
        <span style={{fontSize:12,fontWeight:700,color:TEXT}}>Material disponible en stock</span>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
        {[["Cotización PDF","cotizacion"],["Orden de Compra PDF","oc"]].map(([lbl,key])=>(
          <div key={key}><div style={{fontSize:9,fontWeight:700,color:BLUE,textTransform:"uppercase",letterSpacing:0.5,marginBottom:3}}>{lbl}</div>
          <input style={inpSm} placeholder="Nombre o URL" value={data[key]} onChange={e=>onChange({...data,[key]:e.target.value})}/></div>
        ))}
      </div>
      <div style={{marginBottom:10}}><div style={{fontSize:9,fontWeight:700,color:BLUE,textTransform:"uppercase",letterSpacing:0.5,marginBottom:3}}>Observaciones</div>
        <textarea style={{...inpSm,resize:"vertical",minHeight:40,width:"100%"}} value={data.obs} onChange={e=>onChange({...data,obs:e.target.value})}/></div>
      <div style={{display:"flex",gap:6}}><SaveBtn onClick={()=>onSave(data)}/><CancelBtn onClick={onCancel}/></div>
    </div>
  );

  const ProyInlineForm=({data,onChange,onSave,onCancel})=>(
    <div style={{background:BLUE_L,borderRadius:12,padding:"1rem",border:`1.5px solid ${BLUE}`,marginBottom:8}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:8,marginBottom:10}}>
        {[["Proyecto / pieza","text","nombre"],["KG","number","kg"],["Fecha origen","date","fecha"]].map(([lbl,type,key])=>(
          <div key={key}><div style={{fontSize:9,fontWeight:700,color:BLUE,textTransform:"uppercase",letterSpacing:0.5,marginBottom:3}}>{lbl}</div>
          <input style={inpSm} type={type} value={data[key]} onChange={e=>onChange({...data,[key]:e.target.value})}/></div>
        ))}
        <div><div style={{fontSize:9,fontWeight:700,color:BLUE,textTransform:"uppercase",letterSpacing:0.5,marginBottom:3}}>Etapa</div>
          <select style={inpSm} value={data.etapa} onChange={e=>onChange({...data,etapa:Number(e.target.value)})}>
            {ETAPAS.map((e,i)=><option key={i} value={i}>{e}</option>)}
          </select>
        </div>
      </div>
      <div style={{display:"flex",gap:6}}><SaveBtn onClick={()=>onSave(data)}/><CancelBtn onClick={onCancel}/></div>
    </div>
  );

  const PiezaForm=({data,onChange,onSave,onCancel})=>{
    const handleImagen=e=>{
      const file=e.target.files[0];
      if(!file) return;
      const reader=new FileReader();
      reader.onload=()=>onChange({...data,imagen:reader.result});
      reader.readAsDataURL(file);
    };
    return(
      <div style={{background:BLUE_L,borderRadius:12,padding:"1rem",border:`1.5px solid ${BLUE}`,marginBottom:10}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:8,marginBottom:8}}>
          {[["Nombre","text","nombre"],["Cantidad","number","cantidad"],["KG por pieza","number","kgPieza"]].map(([lbl,type,key])=>(
            <div key={key}><div style={{fontSize:9,fontWeight:700,color:BLUE,textTransform:"uppercase",letterSpacing:0.5,marginBottom:3}}>{lbl}</div>
            <input style={inpSm} type={type} value={data[key]} onChange={e=>onChange({...data,[key]:e.target.value})}/></div>
          ))}
        </div>
        <div style={{marginBottom:10}}>
          <div style={{fontSize:9,fontWeight:700,color:BLUE,textTransform:"uppercase",letterSpacing:0.5,marginBottom:3}}>Foto del producto (opcional)</div>
          <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
            {data.imagen&&<img src={data.imagen} alt="" style={{width:48,height:48,borderRadius:8,objectFit:"cover",border:`1px solid ${BORDER}`}}/>}
            <input style={{...inpSm,padding:"5px 6px",width:"auto",flex:1}} type="file" accept="image/*" onChange={handleImagen}/>
            {data.imagen&&<button type="button" onClick={()=>onChange({...data,imagen:""})} style={{background:WHITE,color:"#DC2626",border:`1px solid ${BORDER}`,borderRadius:6,padding:"5px 10px",fontSize:11,fontWeight:700,cursor:"pointer"}}>Quitar</button>}
          </div>
        </div>
        <div style={{display:"flex",gap:6}}><SaveBtn onClick={()=>onSave(data)}/><CancelBtn onClick={onCancel}/></div>
      </div>
    );
  };

  return(
    <>
      <style>{FONT}</style>
      <HistoriaModal showHistoria={showHistoria} setShowHistoria={setShowHistoria} slideIdx={slideIdx} setSlideIdx={setSlideIdx} recs={recs} totalReal={totalReal} totalPiezas={totalPiezas} pct={pct} isAdmin={isAdmin} objetivoInicial={objetivoInicial} setObjetivoInicial={setObjetivoInicial} descubrimientos={descubrimientos} setDescubrimientos={setDescubrimientos} proyecciones={proyecciones} setProyecciones={setProyecciones}/>
      <div style={{minHeight:"100vh",background:BG,color:TEXT}}>
        <div style={{background:G_NAV,padding:"0 2rem",height:64,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:50}}>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <img src="/logonovo.svg" alt="Novo Nordisk" style={{height:36,width:"auto"}}/>
            <div style={{color:"rgba(255,255,255,0.5)",fontSize:10,fontWeight:600,letterSpacing:1,textTransform:"uppercase"}}>Programa de Economía Circular</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <button style={{background:"rgba(255,255,255,0.12)",border:"1px solid rgba(255,255,255,0.2)",color:WHITE,borderRadius:8,padding:"6px 14px",fontSize:12,fontWeight:700,cursor:"pointer"}} onClick={()=>setShowHistoria(true)}>📖 Ver Historia</button>
            {!isAdmin
              ?<button style={{background:"rgba(255,255,255,0.12)",border:"1px solid rgba(255,255,255,0.2)",color:WHITE,borderRadius:8,padding:"6px 14px",fontSize:12,fontWeight:700,cursor:"pointer"}} onClick={()=>setIsAdmin(true)}>⚙ Admin</button>
              :<div style={{display:"flex",alignItems:"center",gap:8}}>
                 <span style={{color:"#FDE68A",fontSize:11,fontWeight:700}}>✏️ Editando</span>
                 <button style={{background:"rgba(255,255,255,0.12)",border:"1px solid rgba(255,255,255,0.2)",color:WHITE,borderRadius:8,padding:"6px 14px",fontSize:12,fontWeight:700,cursor:"pointer"}} onClick={exitAdmin}>Salir</button>
               </div>
            }
          </div>
        </div>
        {isAdmin&&<div style={{background:"#FFFBEB",borderBottom:`1px solid #FDE68A`,padding:"7px 2rem",display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:12,fontWeight:700,color:"#92400E"}}>✏️ Modo edición activo</span>
          <span style={{fontSize:11,color:"#A16207"}}>— Usa los botones ✏️ para editar cualquier elemento</span>
        </div>}
        <div style={{background:WHITE,borderBottom:`1px solid ${BORDER}`,padding:"0 1.5rem",display:"flex",position:"sticky",top:isAdmin?99:64,zIndex:9,overflowX:"auto"}}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>{setTab(t.id);setPiezaTab(null);}} style={{background:"none",border:"none",borderBottom:tab===t.id?`3px solid ${BLUE}`:"3px solid transparent",color:tab===t.id?BLUE:MUTED,padding:"14px 18px",fontSize:13,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap",transition:"all 0.15s"}}>{t.label}</button>
          ))}
        </div>

        <div style={{maxWidth:1100,margin:"0 auto",padding:"2rem 1.5rem"}}>

          {tab==="inicio"&&(
            <>
              <div style={{marginBottom:20}}>
                <div style={{fontSize:24,fontWeight:900,color:TEXT,marginBottom:4}}>Waste Into Value</div>
                <div style={{fontSize:14,color:MUTED,fontWeight:500}}>Programa de Economía Circular — Novo Nordisk</div>
              </div>
              <div style={{background:G_HERO,borderRadius:20,padding:"2rem",marginBottom:20,position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",right:-40,top:-40,width:260,height:260,background:"rgba(255,255,255,0.06)",borderRadius:"50%"}}/>
                <div style={{position:"absolute",right:90,bottom:-80,width:340,height:340,background:"rgba(255,255,255,0.04)",borderRadius:"50%"}}/>
                <div style={{position:"absolute",left:-20,bottom:-60,width:200,height:200,background:"rgba(255,255,255,0.03)",borderRadius:"50%"}}/>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.5)",letterSpacing:1.5,textTransform:"uppercase",marginBottom:8}}>Meta de transformación</div>
                  {isAdmin&&<button onClick={()=>setEditMeta(v=>!v)} style={{background:"rgba(255,255,255,0.15)",border:"none",color:WHITE,borderRadius:6,padding:"4px 10px",fontSize:11,fontWeight:700,cursor:"pointer"}}>✏️ Editar meta</button>}
                </div>
                {isAdmin&&editMeta&&(
                  <div style={{marginBottom:12,display:"flex",gap:8,alignItems:"center"}}>
                    <input type="number" value={metaKg} onChange={e=>setMetaKg(Number(e.target.value))} style={{background:"rgba(255,255,255,0.2)",border:"1.5px solid rgba(255,255,255,0.4)",borderRadius:8,padding:"6px 12px",fontSize:18,fontWeight:800,color:WHITE,outline:"none",width:140}}/>
                    <span style={{color:"rgba(255,255,255,0.6)",fontSize:13,fontWeight:600}}>kg</span>
                    <button onClick={()=>setEditMeta(false)} style={{background:"rgba(255,255,255,0.2)",border:"none",color:WHITE,borderRadius:6,padding:"5px 10px",fontSize:11,fontWeight:700,cursor:"pointer"}}>✓ Ok</button>
                  </div>
                )}
                <div style={{display:"flex",alignItems:"flex-end",gap:16,marginBottom:16,flexWrap:"wrap"}}>
                  <div style={{fontSize:64,fontWeight:900,color:WHITE,lineHeight:1}}>{fmt(transformadoKg)}</div>
                  <div style={{paddingBottom:8}}>
                    <div style={{fontSize:20,fontWeight:700,color:"rgba(255,255,255,0.45)"}}>/ {fmt(metaKg)} kg</div>
                    <div style={{fontSize:12,color:"rgba(255,255,255,0.3)",fontWeight:600}}>= {fmt(Math.round(metaKg*PLUMAS_POR_KG))} plumas</div>
                    <div style={{fontSize:13,color:"rgba(255,255,255,0.45)",fontWeight:600,marginTop:2}}>kg Transformado - Entregado</div>
                  </div>
                  <div style={{marginLeft:"auto",paddingBottom:4}}>
                    <div style={{fontSize:56,fontWeight:900,color:WHITE,lineHeight:1,textAlign:"right"}}>{pct}<span style={{fontSize:28}}>%</span></div>
                    <div style={{fontSize:12,color:"rgba(255,255,255,0.5)",fontWeight:600,textAlign:"right"}}>completado</div>
                  </div>
                </div>
                <div style={{background:"rgba(255,255,255,0.15)",borderRadius:999,height:10,overflow:"hidden"}}>
                  <div style={{background:WHITE,height:"100%",borderRadius:999,width:`${pct}%`,transition:"width 0.8s"}}/>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))",gap:14,marginBottom:20}}>
                {[
                  {label:"KG brutos recibidos",val:fmt(totalBruto),unit:"kg",plumas:fmt(Math.round(totalBruto*PLUMAS_POR_KG)),grad:G_BLUE},
                  {label:"KG reales netos",val:fmt(totalReal),unit:"kg",plumas:fmt(Math.round(totalReal*PLUMAS_POR_KG)),grad:"linear-gradient(135deg,#1A5FA8,#2176C2)"},
                  {label:"Transformado - Entregado",val:fmt(transformadoKg),unit:"kg",plumas:fmt(Math.round(transformadoKg*PLUMAS_POR_KG)),grad:G_GREEN},
                  {label:"Recepciones",val:recs.length,unit:"lotes",grad:"linear-gradient(135deg,#4C1D95,#7C3AED)"},
                  {label:"Plumas recicladas",val:fmt(Math.round(transformadoKg*PLUMAS_POR_KG)),unit:"plumas",meta:`meta: ${fmt(Math.round(metaKg*PLUMAS_POR_KG))} plumas`,grad:G_BLUE},
                  {label:"Piezas creadas",val:"344",unit:"piezas",grad:"linear-gradient(135deg,#4C1D95,#7C3AED)"},
                  {label:"Proyectos activos",val:"2",unit:"en proceso",grad:G_GREEN},
                ].map(k=>(
                  <div key={k.label} style={{background:k.grad,borderRadius:16,padding:"1.25rem",boxShadow:"0 4px 20px rgba(0,0,0,0.12)"}}>
                    <div style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.6)",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>{k.label}</div>
                    <div style={{fontSize:30,fontWeight:900,color:WHITE,lineHeight:1}}>{k.val}</div>
                    <div style={{fontSize:11,color:"rgba(255,255,255,0.6)",fontWeight:600,marginTop:4}}>{k.unit}</div>
                    {k.plumas&&<div style={{fontSize:10,color:"rgba(255,255,255,0.5)",fontWeight:700,marginTop:5,borderTop:"1px solid rgba(255,255,255,0.15)",paddingTop:5}}>≈ {k.plumas} plumas</div>}
                    {k.meta&&<div style={{fontSize:10,color:"rgba(255,255,255,0.5)",fontWeight:700,marginTop:5,borderTop:"1px solid rgba(255,255,255,0.15)",paddingTop:5}}>🎯 {k.meta}</div>}
                  </div>
                ))}
              </div>
              <div style={{background:WHITE,borderRadius:16,border:`1px solid ${BORDER}`,overflow:"hidden"}}>
                <div style={{padding:"1rem 1.5rem",borderBottom:`1px solid ${BORDER}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{fontSize:11,fontWeight:700,color:MUTED,textTransform:"uppercase",letterSpacing:1}}>Últimas recepciones</div>
                  <button style={{background:"none",border:"none",color:BLUE,fontSize:12,fontWeight:700,cursor:"pointer"}} onClick={()=>setTab("registros")}>Ver todas →</button>
                </div>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                  <thead><tr style={{background:BG}}>{["Fecha","KG Brutos","KG Reales","Plumas aprox.","Estado"].map(h=><th key={h} style={{textAlign:"left",padding:"9px 14px",color:MUTED,fontWeight:700,fontSize:10,textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
                  <tbody>{[...recs].sort((a,b)=>b.fecha.localeCompare(a.fecha)).slice(0,4).map((r,i)=>(
                    <tr key={r.id} style={{borderTop:`1px solid ${BORDER}`,background:i%2===0?WHITE:"#FAFBFD"}}>
                      <td style={{padding:"10px 14px",fontWeight:700}}>{r.fecha}</td>
                      <td style={{padding:"10px 14px",color:MUTED,fontWeight:600}}>{fmt(r.kgBruto)} kg</td>
                      <td style={{padding:"10px 14px",fontWeight:800,color:BLUE}}>{fmt(r.kgReal)} kg</td>
                      <td style={{padding:"10px 14px",color:MUTED,fontWeight:600}}>≈ {fmt(Math.round(r.kgReal*PLUMAS_POR_KG))}</td>
                      <td style={{padding:"10px 14px"}}><EstadoBadge estado={r.estado}/></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </>
          )}

          {tab==="registros"&&(
            <>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20,flexWrap:"wrap",gap:12}}>
                <div>
                  <div style={{fontSize:24,fontWeight:900,color:TEXT,marginBottom:4}}>Registros de material</div>
                  <div style={{fontSize:14,color:MUTED,fontWeight:500}}>{recs.length} recepciones · {fmt(totalBruto)} kg brutos · {fmt(totalReal)} kg reales</div>
                </div>
                {isAdmin&&<button style={{background:G_BLUE,color:WHITE,border:"none",borderRadius:10,padding:"9px 18px",fontSize:12,fontWeight:700,cursor:"pointer"}} onClick={()=>{setShowNewRec(true);setEditRecId(null);}}>+ Nueva recepción</button>}
              </div>
              {isAdmin&&showNewRec&&<RecInlineForm data={newRecData} onChange={setNewRecData} onSave={saveRec} onCancel={()=>setShowNewRec(false)}/>}
              <div style={{background:WHITE,borderRadius:16,border:`1px solid ${BORDER}`,overflow:"auto",marginBottom:16}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:12,minWidth:600}}>
                  <thead><tr style={{background:BG}}>
                    {["","Fecha","KG Brutos","KG Reales","Plumas aprox.","Estado","Transformado en","Observaciones",...(isAdmin?[""]:[])].map((h,hi)=>(
                      <th key={h+hi} style={{textAlign:"left",padding:"10px 14px",color:MUTED,fontWeight:700,fontSize:10,textTransform:"uppercase",letterSpacing:0.8,whiteSpace:"nowrap"}}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>{[...recs].sort((a,b)=>a.fecha.localeCompare(b.fecha)).map((r,i)=>{
                    if(editRecId===r.id) return <tr key={r.id}><td colSpan={isAdmin?9:8} style={{padding:"8px 14px"}}><RecInlineForm data={editRecData} onChange={setEditRecData} onSave={saveRec} onCancel={()=>setEditRecId(null)}/></td></tr>;
                    const open=openRecs.includes(r.id);
                    const usado=(r.desglose||[]).reduce((s,d)=>s+Number(d.cantidad||0),0);
                    const restante=Number(r.kgReal)-usado;
                    const rows=[
                      <tr key={r.id} style={{borderTop:`1px solid ${BORDER}`,background:i%2===0?WHITE:"#FAFBFD"}}>
                        <td style={{padding:"11px 6px",textAlign:"center"}}>
                          <button onClick={()=>toggleRec(r.id)} title="Ver desglose" style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:MUTED,padding:2}}>
                            <span style={{display:"inline-block",transform:open?"rotate(90deg)":"rotate(0deg)",transition:"transform 0.15s"}}>▸</span>
                          </button>
                        </td>
                        <td style={{padding:"11px 14px",fontWeight:800,whiteSpace:"nowrap"}}>{r.fecha}</td>
                        <td style={{padding:"11px 14px",color:MUTED,fontWeight:600,whiteSpace:"nowrap"}}>{fmt(r.kgBruto)} kg</td>
                        <td style={{padding:"11px 14px",whiteSpace:"nowrap"}}><span style={{fontSize:15,fontWeight:900,color:BLUE}}>{fmt(r.kgReal)}</span><span style={{fontSize:11,color:MUTED,fontWeight:600}}> kg</span></td>
                        <td style={{padding:"11px 14px",whiteSpace:"nowrap",color:MUTED,fontWeight:600}}>≈ {fmt(Math.round(r.kgReal*PLUMAS_POR_KG))} <span style={{fontSize:10}}>plumas</span></td>
                        <td style={{padding:"11px 14px"}}>
                          {(r.desglose||[]).length>0
                            ?<div style={{display:"flex",flexWrap:"wrap",gap:4}}>{[...new Set(r.desglose.map(d=>d.estado).filter(Boolean))].map(e=><EstadoBadge key={e} estado={e}/>)}</div>
                            :<EstadoBadge estado={r.estado}/>
                          }
                        </td>
                        <td style={{padding:"11px 14px",fontSize:11,color:TEXT,maxWidth:200}}>{r.transformadoEn||<span style={{color:MUTED}}>—</span>}</td>
                        <td style={{padding:"11px 14px",fontSize:11,color:MUTED,maxWidth:180}}>{r.obs||"—"}</td>
                        {isAdmin&&<td style={{padding:"11px 14px"}}><div style={{display:"flex",gap:4}}><EditBtn onClick={()=>{setEditRecId(r.id);setEditRecData({...r});}}/><DelBtn onClick={()=>delRec(r.id)}/></div></td>}
                      </tr>
                    ];
                    if(open) rows.push(
                      <tr key={`${r.id}-d`} style={{background:BLUE_L}}>
                        <td colSpan={isAdmin?9:8} style={{padding:"14px 20px 18px 44px"}}>
                          <div style={{fontSize:10,fontWeight:700,color:BLUE,textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>Material real a transformar: {fmt(r.kgReal)} kg · ≈ {fmt(Math.round(r.kgReal*PLUMAS_POR_KG))} plumas</div>
                          <div style={{display:"flex",flexDirection:"column",gap:6,maxWidth:540}}>
                            {(r.desglose||[]).map((d,j)=>(
                              <div key={j} style={{display:"flex",alignItems:"center",gap:8,background:WHITE,borderRadius:8,padding:"6px 10px",border:`1px solid ${BORDER}`}}>
                                {isAdmin
                                  ?<>
                                    <input type="number" value={d.cantidad} onChange={e=>updDesglose(r.id,j,"cantidad",e.target.value)} style={{...inpSm,width:70,flexShrink:0}}/>
                                    <span style={{fontSize:11,color:MUTED,fontWeight:700,flexShrink:0}}>kg</span>
                                    <input type="text" value={d.descripcion} onChange={e=>updDesglose(r.id,j,"descripcion",e.target.value)} style={{...inpSm,flex:1}} placeholder="¿En qué se usó?"/>
                                    <select value={d.estado||"Transformado"} onChange={e=>updDesglose(r.id,j,"estado",e.target.value)} style={{...inpSm,width:120,flexShrink:0}}>
                                      {ESTADOS.map(s=><option key={s}>{s}</option>)}
                                    </select>
                                    <DelBtn onClick={()=>delDesglose(r.id,j)}/>
                                  </>
                                  :<>
                                    <span style={{fontSize:13,fontWeight:900,color:BLUE,minWidth:64,flexShrink:0}}>{fmt(d.cantidad)} kg</span>
                                    <span style={{fontSize:12,color:TEXT,fontWeight:600,flex:1}}>{d.descripcion||"—"}</span>
                                    {d.estado&&<EstadoBadge estado={d.estado}/>}
                                  </>
                                }
                              </div>
                            ))}
                            {restante>0.001&&(
                              <div style={{display:"flex",alignItems:"center",gap:8,padding:"6px 10px"}}>
                                <span style={{fontSize:13,fontWeight:900,color:MUTED,minWidth:64}}>{fmt(restante)} kg</span>
                                <span style={{fontSize:12,color:MUTED,fontStyle:"italic"}}>Sin especificar todavía</span>
                              </div>
                            )}
                            {(r.desglose||[]).length===0&&restante<=0.001&&(
                              <div style={{fontSize:12,color:MUTED,fontStyle:"italic"}}>Sin desglose registrado</div>
                            )}
                          </div>
                          {isAdmin&&<button onClick={()=>addDesglose(r.id)} style={{marginTop:10,background:WHITE,border:`1px solid ${BLUE}`,color:BLUE,borderRadius:8,padding:"6px 14px",fontSize:11,fontWeight:700,cursor:"pointer"}}>+ Agregar destino</button>}
                        </td>
                      </tr>
                    );
                    return rows;
                  })}</tbody>
                </table>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:12}}>
                {[
                  {label:"Recibido",val:`${fmt(totalBruto)} kg`,plumas:fmt(Math.round(totalBruto*PLUMAS_POR_KG)),grad:"linear-gradient(135deg,#475569,#6B7A99)"},
                  {label:"Transformado - Entregado",val:`${fmt(transformadoKg)} kg`,plumas:fmt(Math.round(transformadoKg*PLUMAS_POR_KG)),grad:G_GREEN},
                  {label:"En placas",val:`${fmt(enPlacasKg)} kg`,plumas:fmt(Math.round(enPlacasKg*PLUMAS_POR_KG)),grad:"linear-gradient(135deg,#4C1D95,#7C3AED)"},
                  {label:"Libre para transformar",val:`${fmt(libreKg)} kg`,plumas:fmt(Math.round(libreKg*PLUMAS_POR_KG)),grad:G_BLUE},
                ].map(k=>(
                  <div key={k.label} style={{background:k.grad,borderRadius:12,padding:"1rem 1.25rem",boxShadow:"0 3px 12px rgba(0,0,0,0.1)"}}>
                    <div style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.6)",textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>{k.label}</div>
                    <div style={{fontSize:22,fontWeight:900,color:WHITE}}>{k.val}</div>
                    <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",fontWeight:700,marginTop:4}}>≈ {k.plumas} plumas</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {tab==="pipeline"&&(
            <>
              {isAdmin&&<div style={{background:BLUE_L,color:BLUE,borderRadius:10,padding:"8px 14px",fontSize:11,fontWeight:700,marginBottom:16}}>⠿ Arrastra una ficha y suéltala en la fase donde quedaría</div>}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16,flexWrap:"wrap",gap:12}}>
                <div>
                  <div style={{fontSize:24,fontWeight:900,color:TEXT,marginBottom:4}}>Proyectos</div>
                  <div style={{fontSize:14,color:MUTED,fontWeight:500}}>{proyectos.length} proyecto{proyectos.length!==1?"s":""} generado{proyectos.length!==1?"s":""} a partir del material recibido</div>
                </div>
                {isAdmin&&<button style={{background:G_BLUE,color:WHITE,border:"none",borderRadius:10,padding:"9px 18px",fontSize:12,fontWeight:700,cursor:"pointer"}} onClick={()=>{setShowNewProy(true);setEditProyId(null);}}>+ Nuevo proyecto</button>}
              </div>
              <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:16}}>
                {ETAPAS.map((etapa,i)=>(
                  <button key={i} onClick={()=>scrollToEtapa(i)} style={{flex:"0 0 auto",display:"flex",alignItems:"center",gap:6,background:focusEtapa===i?G_BLUE:BG,color:focusEtapa===i?WHITE:MUTED,border:focusEtapa===i?"none":`1px solid ${BORDER}`,borderRadius:20,padding:"7px 14px",fontSize:11,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>
                    <EtapaIcon i={i} size={13}/><span>{etapa}</span>
                  </button>
                ))}
              </div>
              {isAdmin&&showNewProy&&<ProyInlineForm data={newProyData} onChange={setNewProyData} onSave={saveProy} onCancel={()=>setShowNewProy(false)}/>}
              {proyectos.length===0&&!showNewProy&&<div style={{background:WHITE,borderRadius:16,padding:"3rem",textAlign:"center",border:`1.5px dashed ${BORDER}`}}><div style={{fontSize:32,marginBottom:8}}>🧩</div><div style={{fontSize:14,color:MUTED,fontWeight:600}}>No hay proyectos aún</div></div>}
              <div style={{display:"flex",gap:10,overflowX:"auto",paddingBottom:8}}>
                {ETAPAS.map((etapa,i)=>{
                  const items=proyectos.filter(p=>p.etapa===i);
                  const active=items.length>0;
                  const over=dragOverEtapa?.board==="proy"&&dragOverEtapa.etapa===i;
                  const collapsible=items.length>5;
                  const collapsed=collapsible&&(collapsedEtapas[i]!==undefined?collapsedEtapas[i]:true);
                  return(
                    <div key={i} ref={el=>proyColRefs.current[i]=el} onDragOver={onColDragOver("proy",i)} onDragLeave={onColDragLeave("proy",i)} onDrop={onColDrop("proy",i)}
                      style={{minWidth:170,flex:"0 0 auto",borderRadius:12,border:`2px dashed ${over?BLUE:"transparent"}`,background:over?BLUE_L:"transparent",padding:4,transition:"background 0.15s,border-color 0.15s"}}>
                      <div style={{background:active?G_BLUE:BG,borderRadius:10,padding:"10px 12px",marginBottom:10,border:active?"none":`1px solid ${BORDER}`}}>
                        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:2}}>
                          <EtapaIcon i={i} size={18} color={active?WHITE:MUTED}/>
                          {collapsible&&<button onClick={()=>setCollapsedEtapas(c=>({...c,[i]:!c[i]}))} title={collapsed?"Mostrar fichas":"Ocultar fichas"} style={{background:"rgba(255,255,255,0.2)",border:"none",borderRadius:6,width:20,height:20,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:WHITE,fontSize:11,padding:0}}>{collapsed?"▾":"▴"}</button>}
                        </div>
                        <div style={{fontSize:11,fontWeight:800,color:active?WHITE:MUTED}}>{etapa}</div>
                        {active&&<div style={{fontSize:10,color:"rgba(255,255,255,0.6)",fontWeight:600,marginTop:1}}>{items.length} proyecto{items.length>1?"s":""}</div>}
                      </div>
                      {collapsed
                        ?<div style={{background:WHITE,border:`1.5px dashed ${BORDER}`,borderRadius:10,padding:"14px 12px",textAlign:"center"}}><div style={{fontSize:10,color:MUTED,fontWeight:600}}>{items.length} ocultos</div></div>
                        :items.map(p=>(
                          editProyId===p.id
                            ?<div key={p.id} style={{marginBottom:8}}><ProyInlineForm data={editProyData} onChange={setEditProyData} onSave={saveProy} onCancel={()=>setEditProyId(null)}/></div>
                            :<div key={p.id} draggable={isAdmin} onDragStart={onCardDragStart("proy",p.id)} onDragEnd={onCardDragEnd}
                                style={{background:G_CARD,border:`1px solid ${BORDER}`,borderRadius:12,padding:"12px",marginBottom:8,position:"relative",boxShadow:"0 2px 8px rgba(0,0,0,0.06)",cursor:isAdmin?"grab":"default",opacity:dragInfo?.board==="proy"&&dragInfo.id===p.id?0.4:1}}>
                              {isAdmin&&<div style={{position:"absolute",top:8,right:8,display:"flex",gap:4}}><EditBtn onClick={()=>{setEditProyId(p.id);setEditProyData({...p});}}/><DelBtn onClick={()=>delProy(p.id)}/></div>}
                              <div style={{fontSize:12,fontWeight:800,color:TEXT,marginBottom:6,paddingRight:isAdmin?60:0}}>{p.nombre}</div>
                              <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:8}}>
                                <span style={{fontSize:18,fontWeight:900,color:BLUE}}>{fmt(p.kg)}</span>
                                <span style={{fontSize:10,color:MUTED,fontWeight:600}}>kg</span>
                              </div>
                              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:4,flexWrap:"wrap",borderTop:`1px solid ${BORDER}`,paddingTop:8}}>
                                <EtapaBadge i={p.etapa}/>
                                {p.fecha&&<span style={{fontSize:10,color:MUTED,fontWeight:600}}>📅 {p.fecha}</span>}
                              </div>
                            </div>
                        ))
                      }
                      {items.length===0&&<div style={{background:WHITE,border:`1.5px dashed ${BORDER}`,borderRadius:10,padding:"14px 12px",textAlign:"center"}}><div style={{fontSize:10,color:MUTED,fontWeight:600}}>Sin proyectos</div></div>}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {tab==="tendencia"&&(
            <>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20,flexWrap:"wrap",gap:12}}>
                <div>
                  <div style={{fontSize:24,fontWeight:900,color:TEXT,marginBottom:4}}>Tendencia histórica</div>
                  <div style={{fontSize:14,color:MUTED,fontWeight:500}}>{yrFilter==="Todo"?"Sep 2024 — 2026":`Desglose ${yrFilter}`}</div>
                </div>
                <div style={{display:"flex",gap:8,background:WHITE,borderRadius:12,padding:5,border:`1px solid ${BORDER}`}}>
                  {["Todo","2024","2025","2026"].map(y=>(
                    <button key={y} onClick={()=>setYrFilter(y)} style={{background:yrFilter===y?G_BLUE:"transparent",color:yrFilter===y?WHITE:MUTED,border:"none",borderRadius:8,padding:"7px 14px",fontSize:13,fontWeight:700,cursor:"pointer"}}>{y}</button>
                  ))}
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:14,marginBottom:20}}>
                {[
                  {label:"Total período",val:`${fmt(filtTot)} kg`,grad:acGrad},
                  {label:"Promedio activo",val:`${filtAvg} kg`,grad:"linear-gradient(135deg,#1A5FA8,#2176C2)"},
                  {label:"Mejor mes",val:`${filtBest} kg`,sub:filtBestMes,grad:G_GREEN},
                  {label:"Meses con recepción",val:filtNonZero.length,grad:"linear-gradient(135deg,#475569,#6B7A99)"},
                ].map(k=>(
                  <div key={k.label} style={{background:k.grad,borderRadius:16,padding:"1.25rem",boxShadow:"0 4px 16px rgba(0,0,0,0.12)"}}>
                    <div style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.6)",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>{k.label}</div>
                    <div style={{fontSize:24,fontWeight:900,color:WHITE,lineHeight:1}}>{k.val}</div>
                    {k.sub&&<div style={{fontSize:11,color:"rgba(255,255,255,0.65)",fontWeight:600,marginTop:4}}>{k.sub}</div>}
                  </div>
                ))}
              </div>
              <div style={{background:WHITE,borderRadius:16,padding:"1.5rem",border:`1px solid ${BORDER}`,marginBottom:16}}>
                <div style={{fontSize:11,fontWeight:700,color:MUTED,textTransform:"uppercase",letterSpacing:1,marginBottom:16}}>KG reales por mes</div>
                <LineChart data={filtered}/>
              </div>
              <div style={{background:WHITE,borderRadius:16,border:`1px solid ${BORDER}`,overflow:"hidden"}}>
                <div style={{padding:"1rem 1.5rem",borderBottom:`1px solid ${BORDER}`}}><div style={{fontSize:11,fontWeight:700,color:MUTED,textTransform:"uppercase",letterSpacing:1}}>Desglose mensual</div></div>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                  <thead><tr style={{background:BG}}>{["Mes","KG reales","vs anterior",""].map(h=><th key={h} style={{textAlign:"left",padding:"9px 14px",color:MUTED,fontWeight:700,fontSize:10,textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
                  <tbody>{filtered.map((d,i)=>{
                    const prev=i>0?filtered[i-1].kg:null;
                    const diff=prev!==null?+(d.kg-prev).toFixed(2):null;
                    const barW=filtBest>0?Math.round((d.kg/filtBest)*100):0;
                    return(
                      <tr key={d.mes} style={{borderTop:`1px solid ${BORDER}`,background:i%2===0?WHITE:"#FAFBFD",opacity:d.kg===0?0.4:1}}>
                        <td style={{padding:"10px 14px",fontWeight:700}}>{d.mes}</td>
                        <td style={{padding:"10px 14px"}}><span style={{fontSize:15,fontWeight:900,color:d.kg>0?acColor:MUTED}}>{fmt(d.kg)}</span><span style={{fontSize:11,color:MUTED,fontWeight:600}}> kg</span></td>
                        <td style={{padding:"10px 14px"}}>{diff===null||diff===0?<span style={{color:MUTED,fontSize:11}}>—</span>:<span style={{fontSize:12,fontWeight:800,color:diff>0?GREEN:"#DC2626"}}>{diff>0?"+":""}{diff} kg</span>}</td>
                        <td style={{padding:"10px 14px",minWidth:100}}><div style={{background:BG,borderRadius:999,height:5}}><div style={{background:acGrad,height:"100%",borderRadius:999,width:`${barW}%`}}/></div></td>
                      </tr>
                    );
                  })}</tbody>
                </table>
              </div>
              {yrFilter==="Todo"&&(
                <div style={{background:WHITE,borderRadius:16,padding:"1.5rem",border:`1px solid ${BORDER}`,marginTop:16}}>
                  <div style={{fontSize:11,fontWeight:700,color:MUTED,textTransform:"uppercase",letterSpacing:1,marginBottom:14}}>Comparativo por año</div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:12}}>
                    {[{yr:"2024",d:HISTORICO_FULL.slice(0,4),grad:G_BLUE},{yr:"2025",d:HISTORICO_FULL.slice(4,16),grad:"linear-gradient(135deg,#1A5FA8,#2176C2)"},{yr:"2026",d:HISTORICO_FULL.slice(16),grad:G_GREEN}].map(({yr,d,grad})=>{
                      const t2=d.reduce((s,x)=>s+x.kg,0);
                      const nz=d.filter(x=>x.kg>0);
                      return(
                        <div key={yr} style={{background:grad,borderRadius:12,padding:"1rem 1.25rem",cursor:"pointer",boxShadow:"0 4px 14px rgba(0,0,0,0.12)"}} onClick={()=>setYrFilter(yr)}>
                          <div style={{fontSize:14,fontWeight:900,color:WHITE,marginBottom:6}}>{yr} <span style={{fontSize:10,color:"rgba(255,255,255,0.6)",fontWeight:600}}>→ ver detalle</span></div>
                          <div style={{fontSize:26,fontWeight:900,color:WHITE}}>{fmt(t2)} <span style={{fontSize:12,color:"rgba(255,255,255,0.6)",fontWeight:600}}>kg</span></div>
                          <div style={{fontSize:11,color:"rgba(255,255,255,0.6)",fontWeight:600,marginTop:4}}>{nz.length} meses con recepción</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}

          {tab==="impacto"&&(
            <>
              <div style={{marginBottom:20}}>
                <div style={{fontSize:24,fontWeight:900,color:TEXT,marginBottom:4}}>Impacto ambiental</div>
                <div style={{fontSize:14,color:MUTED,fontWeight:500}}>{fmt(totalReal)} kg de plástico transformado desde el inicio del programa</div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:14,marginBottom:20}}>
                {[
                  {icon:"🌿",label:"kg de CO₂ evitados",val:(totalReal*2.5).toFixed(1),grad:G_GREEN},
                  {icon:"🍾",label:"plumas recicladas equiv.",val:fmt(Math.round(totalReal*PLUMAS_POR_KG)),grad:G_BLUE},
                  {icon:"🌳",label:"árboles equiv.",val:(totalReal*0.12).toFixed(1),grad:"linear-gradient(135deg,#14532D,#65A30D)"},
                  {icon:"⚡",label:"kWh ahorrados",val:(totalReal*5.8).toFixed(1),grad:"linear-gradient(135deg,#92400E,#D97706)"},
                ].map(it=>(
                  <div key={it.label} style={{background:it.grad,borderRadius:16,padding:"1.25rem",boxShadow:"0 4px 16px rgba(0,0,0,0.13)"}}>
                    <div style={{fontSize:26,marginBottom:8}}>{it.icon}</div>
                    <div style={{fontSize:28,fontWeight:900,color:WHITE,lineHeight:1,marginBottom:4}}>{it.val}</div>
                    <div style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.65)",textTransform:"uppercase",letterSpacing:0.5}}>{it.label}</div>
                  </div>
                ))}
              </div>
              <div style={{background:G_HERO,borderRadius:20,padding:"1.5rem 2rem",position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",right:-10,top:-10,width:160,height:160,background:"rgba(255,255,255,0.05)",borderRadius:"50%"}}/>
                <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.5)",textTransform:"uppercase",letterSpacing:1.2,marginBottom:12}}>Acumulado total</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:16}}>
                  {[{label:"kg transformados",val:fmt(totalReal)},{label:"recepciones",val:recs.length},{label:"pedidos gestionados",val:pedidos.length},{label:"piezas creadas",val:fmt(totalPiezas)}].map(k=>(
                    <div key={k.label}><div style={{fontSize:32,fontWeight:900,color:WHITE,lineHeight:1}}>{k.val}</div><div style={{fontSize:10,color:"rgba(255,255,255,0.5)",fontWeight:700,textTransform:"uppercase",letterSpacing:0.5,marginTop:4}}>{k.label}</div></div>
                  ))}
                </div>
              </div>
            </>
          )}

          {tab==="piezas"&&(
            piezaTab
              ?(()=>{
                  const idx=PIEZAS_TIPOS.indexOf(piezaTab);
                  const items=detalle[piezaTab];
                  const totalKgCat=items.reduce((s,p)=>s+p.cantidad*p.kgPieza,0);
                  const totalUndCat=items.reduce((s,p)=>s+p.cantidad,0);
                  const totalPlumasCat=Math.round(totalKgCat*PLUMAS_POR_KG);
                  const totalCO2Cat=(totalKgCat*2.5).toFixed(1);
                  return(
                    <>
                      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20,flexWrap:"wrap"}}>
                        <button onClick={()=>{setPiezaTab(null);setShowNewPieza(false);setEditPiezaId(null);}} style={{background:BLUE_L,color:BLUE,border:"none",borderRadius:8,padding:"7px 14px",fontSize:12,fontWeight:700,cursor:"pointer"}}>← Volver</button>
                        <div style={{flex:1}}>
                          <div style={{display:"flex",alignItems:"center",gap:10}}>
                            <span style={{fontSize:28}}>{PIEZAS_ICONS[idx]}</span>
                            <div style={{fontSize:24,fontWeight:900,color:TEXT}}>{piezaTab}</div>
                          </div>
                          <div style={{fontSize:13,color:MUTED,fontWeight:500,marginTop:2}}>{totalUndCat} pieza{totalUndCat!==1?"s":""} · {fmt(totalKgCat)} kg utilizados</div>
                        </div>
                        {isAdmin&&<button style={{background:G_BLUE,color:WHITE,border:"none",borderRadius:10,padding:"9px 16px",fontSize:12,fontWeight:700,cursor:"pointer"}} onClick={()=>{setShowNewPieza(true);setEditPiezaId(null);}}>+ Agregar pieza</button>}
                      </div>
                      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:14,marginBottom:20}}>
                        {[
                          {label:"Piezas totales",val:totalUndCat,unit:"unidades",grad:PIEZAS_GRADS[idx]},
                          {label:"Material usado",val:`${fmt(totalKgCat)} kg`,unit:"plástico real",grad:G_BLUE},
                          {label:"Plumas recicladas",val:fmt(totalPlumasCat),unit:"equivalentes",grad:G_GREEN},
                          {label:"CO₂ evitado",val:`${totalCO2Cat} kg`,unit:"carbono",grad:"linear-gradient(135deg,#14532D,#65A30D)"},
                        ].map(k=>(
                          <div key={k.label} style={{background:k.grad,borderRadius:16,padding:"1.25rem",boxShadow:"0 4px 16px rgba(0,0,0,0.12)"}}>
                            <div style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.6)",textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>{k.label}</div>
                            <div style={{fontSize:24,fontWeight:900,color:WHITE,lineHeight:1}}>{k.val}</div>
                            <div style={{fontSize:10,color:"rgba(255,255,255,0.55)",fontWeight:600,marginTop:4}}>{k.unit}</div>
                          </div>
                        ))}
                      </div>
                      {isAdmin&&showNewPieza&&<PiezaForm data={newPiezaData} onChange={setNewPiezaData} onSave={d=>savePieza(piezaTab,d)} onCancel={()=>setShowNewPieza(false)}/>}
                      {items.length===0&&!showNewPieza&&(
                        <div style={{background:WHITE,borderRadius:16,padding:"3rem",textAlign:"center",border:`1.5px dashed ${BORDER}`}}>
                          <div style={{fontSize:36,marginBottom:8}}>{PIEZAS_ICONS[idx]}</div>
                          <div style={{fontSize:14,color:MUTED,fontWeight:600}}>No hay piezas en esta categoría</div>
                        </div>
                      )}
                      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:14}}>
                        {items.map(p=>(
                          editPiezaId===p.id
                            ?<div key={p.id}><PiezaForm data={editPiezaData} onChange={setEditPiezaData} onSave={d=>savePieza(piezaTab,d)} onCancel={()=>setEditPiezaId(null)}/></div>
                            :<div key={p.id} style={{background:WHITE,borderRadius:16,border:`1px solid ${BORDER}`,overflow:"hidden",boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
                              {p.imagen
                                ?<div style={{height:140,background:BG,overflow:"hidden"}}><img src={p.imagen} alt={p.nombre} style={{width:"100%",height:"100%",objectFit:"cover"}}/></div>
                                :<div style={{height:80,background:PIEZAS_GRADS[idx],display:"flex",alignItems:"center",justifyContent:"center",fontSize:36}}>{PIEZAS_ICONS[idx]}</div>
                              }
                              <div style={{padding:"1rem"}}>
                                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                                  <div style={{fontSize:14,fontWeight:800,color:TEXT}}>{p.nombre}</div>
                                  {isAdmin&&<div style={{display:"flex",gap:4,flexShrink:0,marginLeft:8}}><EditBtn onClick={()=>{setEditPiezaId(p.id);setEditPiezaData({...p});}}/><DelBtn onClick={()=>delPieza(piezaTab,p.id)}/></div>}
                                </div>
                                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                                  <div style={{background:BG,borderRadius:8,padding:"8px 10px"}}>
                                    <div style={{fontSize:9,fontWeight:700,color:MUTED,textTransform:"uppercase",letterSpacing:0.5,marginBottom:2}}>Cantidad</div>
                                    <div style={{fontSize:18,fontWeight:900,color:PIEZAS_COLORS[idx]}}>{p.cantidad}</div>
                                  </div>
                                  <div style={{background:BG,borderRadius:8,padding:"8px 10px"}}>
                                    <div style={{fontSize:9,fontWeight:700,color:MUTED,textTransform:"uppercase",letterSpacing:0.5,marginBottom:2}}>KG / pieza</div>
                                    <div style={{fontSize:18,fontWeight:900,color:PIEZAS_COLORS[idx]}}>{p.kgPieza}</div>
                                    <div style={{fontSize:10,color:MUTED,fontWeight:600,marginTop:2}}>≈ {Math.round(p.kgPieza*PLUMAS_POR_KG)} plumas</div>
                                  </div>
                                </div>
                                <div style={{marginTop:8,background:BLUE_L,borderRadius:8,padding:"6px 10px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                                  <span style={{fontSize:9,fontWeight:700,color:BLUE,textTransform:"uppercase",letterSpacing:0.5}}>Total</span>
                                  <div style={{textAlign:"right"}}>
                                    <div style={{fontSize:14,fontWeight:900,color:BLUE}}>{fmt(p.cantidad*p.kgPieza)} kg</div>
                                    <div style={{fontSize:10,color:BLUE2,fontWeight:700}}>≈ {fmt(Math.round(p.cantidad*p.kgPieza*PLUMAS_POR_KG))} plumas</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                        ))}
                      </div>
                    </>
                  );
                })()
              :(
                <>
                  <div style={{marginBottom:20}}>
                    <div style={{fontSize:24,fontWeight:900,color:TEXT,marginBottom:4}}>Piezas fabricadas</div>
                    <div style={{fontSize:14,color:MUTED,fontWeight:500}}>{totalPiezas} piezas en total · {fmt(Object.values(detalle).reduce((s,arr)=>s+arr.reduce((a,p)=>a+p.cantidad*p.kgPieza,0),0))} kg utilizados</div>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:16}}>
                    {PIEZAS_TIPOS.map((tipo,i)=>{
                      const items=detalle[tipo];
                      const totalKg=items.reduce((s,p)=>s+p.cantidad*p.kgPieza,0);
                      const totalUnd=items.reduce((s,p)=>s+p.cantidad,0);
                      return(
                        <div key={tipo} style={{background:PIEZAS_GRADS[i],borderRadius:20,padding:"1.5rem",cursor:"pointer",boxShadow:"0 4px 20px rgba(0,0,0,0.15)",position:"relative",overflow:"hidden"}} onClick={()=>setPiezaTab(tipo)}>
                          <div style={{position:"absolute",right:-20,bottom:-20,fontSize:80,opacity:0.12,lineHeight:1}}>{PIEZAS_ICONS[i]}</div>
                          <div style={{fontSize:36,marginBottom:12}}>{PIEZAS_ICONS[i]}</div>
                          <div style={{fontSize:18,fontWeight:900,color:WHITE,marginBottom:4}}>{tipo}</div>
                          <div style={{fontSize:28,fontWeight:900,color:WHITE,lineHeight:1,marginBottom:4}}>{totalUnd}</div>
                          <div style={{fontSize:11,color:"rgba(255,255,255,0.65)",fontWeight:600,marginBottom:4}}>piezas · {fmt(totalKg)} kg</div>
                          <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",fontWeight:700,marginBottom:8}}>≈ {fmt(Math.round(totalKg*PLUMAS_POR_KG))} plumas</div>
                          <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",fontWeight:700}}>Ver detalle →</div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )
          )}

        </div>
      </div>
    </>
  );
}
