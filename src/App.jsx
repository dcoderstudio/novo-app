import { useState } from "react";

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
const KG_POR_PLUMA=0.04;
const ETAPAS=["Recepción","Limpieza","Molienda","Placas","Corte","Ensamble","Entregado","Facturado","Pagado"];
const ETAPA_ICONS=["📦","🧹","⚙️","🟦","✂️","🔩","✅","🧾","💰"];
const fmt=n=>Number(n).toLocaleString("es-MX");

const FONT=`*{font-family:'Montserrat',sans-serif;box-sizing:border-box;margin:0;padding:0;}
::-webkit-scrollbar{width:6px;height:6px;}::-webkit-scrollbar-track{background:transparent;}::-webkit-scrollbar-thumb{background:#C5CFDF;border-radius:99px;}
input,select,textarea{font-family:'Montserrat',sans-serif;}`;

const RECEPCIONES_INIT=[
  {id:1,fecha:"2024-09-30",kgBruto:150,kgReal:120,estado:"Transformado",transformadoEn:"2 Mesas (28kg), 2 Macetas (18kg), 2 Bancos (14kg), 8 Logotipos (56kg)",obs:"Primer entrega"},
  {id:2,fecha:"2024-11-04",kgBruto:50,kgReal:40,estado:"Transformado",transformadoEn:"Molidos y entregados a Universum (4kg), Reparación de piezas",obs:""},
  {id:3,fecha:"2024-11-12",kgBruto:230,kgReal:184,estado:"Transformado",transformadoEn:"8 Bancos altos (170kg), Mural (30kg), Logo grande (15kg)",obs:"Segunda entrega"},
  {id:4,fecha:"2024-11-08",kgBruto:50,kgReal:0,estado:"En Stock",transformadoEn:"",obs:"Material flexible de otro plástico"},
  {id:5,fecha:"2024-11-10",kgBruto:50,kgReal:40,estado:"Transformado",transformadoEn:"Complemento entrega anterior (32kg), Bases para trofeos (18kg)",obs:"El resto se utilizó con polvo de molienda"},
  {id:6,fecha:"2025-10-02",kgBruto:50,kgReal:40,estado:"Transformado",transformadoEn:"Fabricación de contenedor (31kg), Restauración de contenedor",obs:"Tenemos plástico recuperado del sobrante"},
  {id:7,fecha:"2026-02-17",kgBruto:650,kgReal:520,estado:"Molido",transformadoEn:"",obs:"Destinado a fabricación de 700 piezas"},
  {id:8,fecha:"2026-02-23",kgBruto:1.75,kgReal:1.4,estado:"En Stock",transformadoEn:"",obs:""},
];
const PEDIDOS_INIT=[
  {id:1,nombre:"700 Artículos varios",cliente:"Novo Nordisk",kgReq:520,kgDisponible:true,fechaEst:"2026-08-30",etapa:2,cotizacion:"",oc:"",obs:"Destinado al material molido de Feb 2026"},
];
const HISTORICO_FULL=[
  {mes:"Sep 24",kg:120},{mes:"Oct 24",kg:0},{mes:"Nov 24",kg:264},{mes:"Dic 24",kg:0},
  {mes:"Ene 25",kg:0},{mes:"Feb 25",kg:0},{mes:"Mar 25",kg:0},{mes:"Abr 25",kg:0},{mes:"May 25",kg:0},{mes:"Jun 25",kg:0},{mes:"Jul 25",kg:0},{mes:"Ago 25",kg:0},{mes:"Sep 25",kg:0},{mes:"Oct 25",kg:40},{mes:"Nov 25",kg:0},{mes:"Dic 25",kg:0},
  {mes:"Ene 26",kg:0},{mes:"Feb 26",kg:521.4},{mes:"Mar 26",kg:0},{mes:"Abr 26",kg:0},{mes:"May 26",kg:0},
];
const DETALLE_INIT={
  Mobiliario:[
    {id:1,nombre:"Mesa",cantidad:2,kgPieza:14,imagen:""},
    {id:2,nombre:"Banco alto",cantidad:8,kgPieza:21.25,imagen:""},
    {id:3,nombre:"Maceta",cantidad:2,kgPieza:9,imagen:""},
    {id:4,nombre:"Banco bajo",cantidad:2,kgPieza:7,imagen:""},
  ],
  Llaveros:[],
  Portapapeles:[],
  Otros:[
    {id:1,nombre:"Logo grande",cantidad:1,kgPieza:15,imagen:""},
    {id:2,nombre:"Logotipo",cantidad:8,kgPieza:7,imagen:""},
  ],
};

const inpSm={padding:"5px 8px",borderRadius:6,border:`1.5px solid ${BLUE}`,fontSize:12,fontWeight:600,outline:"none",background:WHITE,width:"100%"};

function EstadoBadge({estado}){
  const map={Transformado:{bg:GREEN_BG,c:GREEN},Molido:{bg:BLUE_L,c:BLUE},"En Stock":{bg:"#FEF9C3",c:"#A16207"}};
  const s=map[estado]||{bg:BG,c:MUTED};
  return <span style={{background:s.bg,color:s.c,borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:700,whiteSpace:"nowrap"}}>{estado}</span>;
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

export default function App(){
  const [recs,setRecs]=useState(RECEPCIONES_INIT);
  const [pedidos,setPedidos]=useState(PEDIDOS_INIT);
  const [detalle,setDetalle]=useState(DETALLE_INIT);
  const [metaKg,setMetaKg]=useState(2000);
  const [tab,setTab]=useState("inicio");
  const [yrFilter,setYrFilter]=useState("Todo");
  const [isAdmin,setIsAdmin]=useState(false);
  const [piezaTab,setPiezaTab]=useState(null);
  const [editRecId,setEditRecId]=useState(null);
  const [editRecData,setEditRecData]=useState(null);
  const [showNewRec,setShowNewRec]=useState(false);
  const [newRecData,setNewRecData]=useState({fecha:"",kgBruto:"",kgReal:"",estado:"En Stock",transformadoEn:"",obs:""});
  const [editPedId,setEditPedId]=useState(null);
  const [editPedData,setEditPedData]=useState(null);
  const [showNewPed,setShowNewPed]=useState(false);
  const [newPedData,setNewPedData]=useState({nombre:"",cliente:"Novo Nordisk",kgReq:"",kgDisponible:false,fechaEst:"",etapa:0,cotizacion:"",oc:"",obs:""});
  const [editMeta,setEditMeta]=useState(false);
  const [editPiezaId,setEditPiezaId]=useState(null);
  const [editPiezaData,setEditPiezaData]=useState(null);
  const [showNewPieza,setShowNewPieza]=useState(false);
  const [newPiezaData,setNewPiezaData]=useState({nombre:"",cantidad:1,kgPieza:0,imagen:""});
  const [showHistoria,setShowHistoria]=useState(false);
  const [slideIdx,setSlideIdx]=useState(0);
  const [descubrimientos,setDescubrimientos]=useState(["Aquí aparecerán los descubrimientos del proyecto."]);
  const [proyecciones,setProyecciones]=useState(["Aquí aparecerán las proyecciones a futuro del proyecto."]);

  const totalBruto=recs.reduce((s,r)=>s+Number(r.kgBruto),0);
  const totalReal=recs.reduce((s,r)=>s+Number(r.kgReal),0);
  const totalPiezas=Object.values(detalle).reduce((s,arr)=>s+arr.reduce((a,p)=>a+p.cantidad,0),0);
  const pct=Math.min(100,Math.round((totalReal/metaKg)*100));

  const slices={"Todo":HISTORICO_FULL,"2024":HISTORICO_FULL.slice(0,4),"2025":HISTORICO_FULL.slice(4,16),"2026":HISTORICO_FULL.slice(16)};
  const filtered=slices[yrFilter];
  const filtNonZero=filtered.filter(d=>d.kg>0);
  const filtTot=filtered.reduce((s,d)=>s+d.kg,0);
  const filtAvg=filtNonZero.length?Math.round(filtTot/filtNonZero.length):0;
  const filtBest=filtNonZero.length?Math.max(...filtNonZero.map(d=>d.kg)):0;
  const filtBestMes=filtNonZero.find(d=>d.kg===filtBest)?.mes||"";
  const acColor=yrFilter==="2025"?BLUE2:yrFilter==="2026"?GREEN:BLUE;
  const acGrad=yrFilter==="2025"?"linear-gradient(135deg,#1A5FA8,#2176C2)":yrFilter==="2026"?G_GREEN:G_BLUE;

  const exitAdmin=()=>{setIsAdmin(false);setEditRecId(null);setEditPedId(null);setShowNewRec(false);setShowNewPed(false);setEditMeta(false);};

  const saveRec=(d)=>{
    if(d.id) setRecs(rs=>rs.map(r=>r.id===d.id?{...d,kgBruto:Number(d.kgBruto),kgReal:Number(d.kgReal)}:r));
    else{const id=Math.max(0,...recs.map(r=>r.id))+1;setRecs(rs=>[...rs,{...d,id,kgBruto:Number(d.kgBruto),kgReal:Number(d.kgReal)}]);}
    setEditRecId(null);setShowNewRec(false);setNewRecData({fecha:"",kgBruto:"",kgReal:"",estado:"En Stock",transformadoEn:"",obs:""});
  };
  const delRec=(id)=>setRecs(rs=>rs.filter(r=>r.id!==id));

  const savePed=(d)=>{
    if(d.id) setPedidos(ps=>ps.map(p=>p.id===d.id?{...d,kgReq:Number(d.kgReq),etapa:Number(d.etapa)}:p));
    else{const id=Math.max(0,...pedidos.map(p=>p.id))+1;setPedidos(ps=>[...ps,{...d,id,kgReq:Number(d.kgReq),etapa:Number(d.etapa)}]);}
    setEditPedId(null);setShowNewPed(false);setNewPedData({nombre:"",cliente:"Novo Nordisk",kgReq:"",kgDisponible:false,fechaEst:"",etapa:0,cotizacion:"",oc:"",obs:""});
  };
  const delPed=(id)=>setPedidos(ps=>ps.filter(p=>p.id!==id));
  const movePed=(id,dir)=>setPedidos(ps=>ps.map(p=>p.id===id?{...p,etapa:Math.min(ETAPAS.length-1,Math.max(0,p.etapa+dir))}:p));

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
            {["Transformado","Molido","En Stock"].map(s=><option key={s}>{s}</option>)}
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
            {ETAPAS.map((e,i)=><option key={i} value={i}>{ETAPA_ICONS[i]} {e}</option>)}
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

  const ListaEditable=({titulo,subtitulo,icon,items,setItems})=>(
    <div style={{maxWidth:680,width:"100%"}}>
      <div style={{textAlign:"center",marginBottom:28}}>
        <div style={{fontSize:13,fontWeight:700,letterSpacing:3,textTransform:"uppercase",opacity:0.55,marginBottom:8}}>{subtitulo}</div>
        <div style={{fontSize:"clamp(26px,5vw,38px)",fontWeight:900}}>{titulo}</div>
      </div>
      <div style={{maxHeight:"50vh",overflowY:"auto",paddingRight:4}}>
        {items.map((it,i)=>(
          <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",background:"rgba(255,255,255,0.08)",borderRadius:12,padding:"12px 16px",marginBottom:10}}>
            <span style={{fontSize:18,flexShrink:0}}>{icon}</span>
            {isAdmin
              ?<textarea value={it} onChange={e=>setItems(arr=>arr.map((x,j)=>j===i?e.target.value:x))} style={{flex:1,background:"transparent",border:"none",color:WHITE,fontSize:14,fontWeight:600,lineHeight:1.5,resize:"vertical",minHeight:40,outline:"none",fontFamily:"inherit"}}/>
              :<div style={{flex:1,fontSize:14,fontWeight:600,lineHeight:1.5}}>{it}</div>
            }
            {isAdmin&&<button onClick={()=>setItems(arr=>arr.filter((_,j)=>j!==i))} style={{background:"rgba(255,255,255,0.1)",border:"none",color:WHITE,borderRadius:6,width:26,height:26,cursor:"pointer",fontSize:12,flexShrink:0}}>🗑</button>}
          </div>
        ))}
      </div>
      {isAdmin&&<button onClick={()=>setItems(arr=>[...arr,""])} style={{marginTop:12,background:"rgba(255,255,255,0.15)",border:`1px solid rgba(255,255,255,0.25)`,color:WHITE,borderRadius:8,padding:"8px 16px",fontSize:12,fontWeight:700,cursor:"pointer"}}>+ Agregar punto</button>}
    </div>
  );

  const HISTORIA_SLIDES=["intro","trayecto","produccion","piezas","descubrimientos","proyecciones"];

  const HistoriaModal=()=>{
    if(!showHistoria) return null;
    const close=()=>{setShowHistoria(false);setSlideIdx(0);};
    const goTo=i=>setSlideIdx(Math.max(0,Math.min(HISTORIA_SLIDES.length-1,i)));
    const slide=HISTORIA_SLIDES[slideIdx];
    const sortedRecs=[...recs].sort((a,b)=>a.fecha.localeCompare(b.fecha));
    const navBtn=(dir)=>{
      const disabled=dir<0?slideIdx===0:slideIdx===HISTORIA_SLIDES.length-1;
      return(
        <button onClick={()=>goTo(slideIdx+dir)} disabled={disabled} style={{background:"rgba(255,255,255,0.12)",border:"1px solid rgba(255,255,255,0.25)",color:WHITE,borderRadius:"50%",width:44,height:44,fontSize:18,cursor:disabled?"default":"pointer",display:"flex",alignItems:"center",justifyContent:"center",opacity:disabled?0.3:1,flexShrink:0}}>{dir<0?"←":"→"}</button>
      );
    };
    return(
      <div style={{position:"fixed",inset:0,background:G_HERO,zIndex:200,display:"flex",flexDirection:"column",color:WHITE}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"1.25rem 2rem",flexShrink:0}}>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:2,textTransform:"uppercase",opacity:0.5}}>Waste Into Value — Nuestra Historia</div>
          <button onClick={close} style={{background:"rgba(255,255,255,0.12)",border:"none",color:WHITE,borderRadius:8,width:32,height:32,fontSize:16,cursor:"pointer"}}>✕</button>
        </div>
        <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 2rem 1rem",overflow:"hidden"}}>
          {slide==="intro"&&(
            <div style={{textAlign:"center",maxWidth:760}}>
              <div style={{fontSize:13,fontWeight:700,letterSpacing:3,textTransform:"uppercase",opacity:0.55,marginBottom:14}}>Programa de Economía Circular</div>
              <div style={{fontSize:"clamp(40px,8vw,72px)",fontWeight:900,marginBottom:18,lineHeight:1.05}}>Waste Into Value</div>
              <div style={{fontSize:16,opacity:0.7,marginBottom:40,lineHeight:1.6,maxWidth:560,marginLeft:"auto",marginRight:"auto"}}>De residuo plástico a productos con propósito: este es el recorrido del proyecto desde su primera entrega hasta hoy.</div>
              <div style={{display:"flex",justifyContent:"center",gap:"clamp(20px,5vw,56px)",flexWrap:"wrap"}}>
                {[{v:fmt(totalReal),l:"kg transformados"},{v:recs.length,l:"recepciones"},{v:fmt(totalPiezas),l:"piezas creadas"},{v:`${pct}%`,l:"de la meta"}].map(s=>(
                  <div key={s.l}>
                    <div style={{fontSize:"clamp(28px,5vw,44px)",fontWeight:900}}>{s.v}</div>
                    <div style={{fontSize:11,opacity:0.55,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginTop:4}}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {slide==="trayecto"&&(
            <div style={{maxWidth:760,width:"100%",height:"100%",display:"flex",flexDirection:"column"}}>
              <div style={{textAlign:"center",marginBottom:8,flexShrink:0}}>
                <div style={{fontSize:13,fontWeight:700,letterSpacing:3,textTransform:"uppercase",opacity:0.55,marginBottom:8}}>El Trayecto</div>
                <div style={{fontSize:"clamp(26px,5vw,38px)",fontWeight:900}}>{recs.length} recepciones desde {sortedRecs[0]?.fecha}</div>
              </div>
              <div style={{flex:1,overflowY:"auto",marginTop:24,paddingRight:8}}>
                {sortedRecs.map((r,i)=>(
                  <div key={r.id} style={{display:"flex",gap:16}}>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"center",flexShrink:0}}>
                      <div style={{width:12,height:12,borderRadius:"50%",background:WHITE,marginTop:6}}/>
                      {i<sortedRecs.length-1&&<div style={{width:2,flex:1,background:"rgba(255,255,255,0.2)"}}/>}
                    </div>
                    <div style={{paddingBottom:22}}>
                      <div style={{fontSize:12,fontWeight:800,opacity:0.5,letterSpacing:1}}>{r.fecha}</div>
                      <div style={{fontSize:19,fontWeight:900,marginTop:2}}>{fmt(r.kgReal)} kg <span style={{fontSize:12,fontWeight:700,opacity:0.5}}>· {r.estado}</span></div>
                      {r.transformadoEn&&<div style={{fontSize:13,opacity:0.65,marginTop:4,lineHeight:1.5}}>{r.transformadoEn}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {slide==="produccion"&&(
            <div style={{maxWidth:900,width:"100%",textAlign:"center"}}>
              <div style={{fontSize:13,fontWeight:700,letterSpacing:3,textTransform:"uppercase",opacity:0.55,marginBottom:8}}>Proceso de Producción</div>
              <div style={{fontSize:"clamp(26px,5vw,38px)",fontWeight:900,marginBottom:36}}>De residuo a producto terminado</div>
              <div style={{display:"flex",justifyContent:"center",gap:10,flexWrap:"wrap"}}>
                {ETAPAS.map((e,i)=>{
                  const count=pedidos.filter(p=>p.etapa===i).length;
                  return(
                    <div key={i} style={{background:"rgba(255,255,255,0.1)",borderRadius:14,padding:"1.25rem 1rem",minWidth:104,position:"relative"}}>
                      <div style={{fontSize:28,marginBottom:6}}>{ETAPA_ICONS[i]}</div>
                      <div style={{fontSize:12,fontWeight:800}}>{e}</div>
                      {count>0&&<div style={{position:"absolute",top:-8,right:-8,background:WHITE,color:BLUE,borderRadius:99,width:22,height:22,fontSize:11,fontWeight:900,display:"flex",alignItems:"center",justifyContent:"center"}}>{count}</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {slide==="piezas"&&(
            <div style={{maxWidth:800,width:"100%",textAlign:"center"}}>
              <div style={{fontSize:13,fontWeight:700,letterSpacing:3,textTransform:"uppercase",opacity:0.55,marginBottom:8}}>Lo que hemos creado</div>
              <div style={{fontSize:"clamp(26px,5vw,38px)",fontWeight:900,marginBottom:8}}>{fmt(totalPiezas)} piezas fabricadas</div>
              <div style={{fontSize:15,opacity:0.6,marginBottom:36}}>a partir de plástico reciclado</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:16}}>
                {PIEZAS_TIPOS.map((tipo,i)=>{
                  const items=detalle[tipo];
                  const totalUnd=items.reduce((s,p)=>s+p.cantidad,0);
                  const totalKg=items.reduce((s,p)=>s+p.cantidad*p.kgPieza,0);
                  return(
                    <div key={tipo} style={{background:"rgba(255,255,255,0.1)",borderRadius:16,padding:"1.5rem"}}>
                      <div style={{fontSize:32,marginBottom:8}}>{PIEZAS_ICONS[i]}</div>
                      <div style={{fontSize:30,fontWeight:900}}>{totalUnd}</div>
                      <div style={{fontSize:12,opacity:0.6,fontWeight:700,marginTop:4}}>{tipo}</div>
                      <div style={{fontSize:11,opacity:0.45,fontWeight:600,marginTop:2}}>{fmt(totalKg)} kg</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {slide==="descubrimientos"&&<ListaEditable titulo="Descubrimientos sobre la marcha" subtitulo="Aprendizajes" icon="💡" items={descubrimientos} setItems={setDescubrimientos}/>}
          {slide==="proyecciones"&&<ListaEditable titulo="Proyecciones a futuro" subtitulo="Lo que viene" icon="🚀" items={proyecciones} setItems={setProyecciones}/>}
        </div>
        <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:20,padding:"1.5rem 2rem 2rem",flexShrink:0}}>
          {navBtn(-1)}
          <div style={{display:"flex",gap:8}}>
            {HISTORIA_SLIDES.map((s,i)=>(
              <div key={s} onClick={()=>goTo(i)} style={{width:i===slideIdx?28:9,height:9,borderRadius:99,background:i===slideIdx?WHITE:"rgba(255,255,255,0.25)",cursor:"pointer",transition:"all 0.25s"}}/>
            ))}
          </div>
          {navBtn(1)}
        </div>
      </div>
    );
  };

  return(
    <>
      <style>{FONT}</style>
      <HistoriaModal/>
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
                  <div style={{fontSize:64,fontWeight:900,color:WHITE,lineHeight:1}}>{fmt(totalReal)}</div>
                  <div style={{paddingBottom:8}}>
                    <div style={{fontSize:20,fontWeight:700,color:"rgba(255,255,255,0.45)"}}>/ {fmt(metaKg)} kg</div>
                    <div style={{fontSize:13,color:"rgba(255,255,255,0.45)",fontWeight:600}}>kilogramos transformados</div>
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
                  {label:"KG brutos recibidos",val:fmt(totalBruto),unit:"kg",grad:G_BLUE},
                  {label:"KG reales netos",val:fmt(totalReal),unit:"kg",grad:"linear-gradient(135deg,#1A5FA8,#2176C2)"},
                  {label:"Recepciones",val:recs.length,unit:"lotes",grad:"linear-gradient(135deg,#4C1D95,#7C3AED)"},
                  {label:"Pedidos activos",val:pedidos.filter(p=>p.etapa<6).length,unit:"en proceso",grad:G_GREEN},
                ].map(k=>(
                  <div key={k.label} style={{background:k.grad,borderRadius:16,padding:"1.25rem",boxShadow:"0 4px 20px rgba(0,0,0,0.12)"}}>
                    <div style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.6)",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>{k.label}</div>
                    <div style={{fontSize:30,fontWeight:900,color:WHITE,lineHeight:1}}>{k.val}</div>
                    <div style={{fontSize:11,color:"rgba(255,255,255,0.6)",fontWeight:600,marginTop:4}}>{k.unit}</div>
                  </div>
                ))}
              </div>
              <div style={{background:WHITE,borderRadius:16,border:`1px solid ${BORDER}`,overflow:"hidden"}}>
                <div style={{padding:"1rem 1.5rem",borderBottom:`1px solid ${BORDER}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{fontSize:11,fontWeight:700,color:MUTED,textTransform:"uppercase",letterSpacing:1}}>Últimas recepciones</div>
                  <button style={{background:"none",border:"none",color:BLUE,fontSize:12,fontWeight:700,cursor:"pointer"}} onClick={()=>setTab("registros")}>Ver todas →</button>
                </div>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                  <thead><tr style={{background:BG}}>{["Fecha","KG Brutos","KG Reales","Estado"].map(h=><th key={h} style={{textAlign:"left",padding:"9px 14px",color:MUTED,fontWeight:700,fontSize:10,textTransform:"uppercase"}}>{h}</th>)}</tr></thead>
                  <tbody>{[...recs].sort((a,b)=>b.fecha.localeCompare(a.fecha)).slice(0,4).map((r,i)=>(
                    <tr key={r.id} style={{borderTop:`1px solid ${BORDER}`,background:i%2===0?WHITE:"#FAFBFD"}}>
                      <td style={{padding:"10px 14px",fontWeight:700}}>{r.fecha}</td>
                      <td style={{padding:"10px 14px",color:MUTED,fontWeight:600}}>{fmt(r.kgBruto)} kg</td>
                      <td style={{padding:"10px 14px",fontWeight:800,color:BLUE}}>{fmt(r.kgReal)} kg</td>
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
                    {["Fecha","KG Brutos","KG Reales","Estado","Transformado en","Observaciones",...(isAdmin?[""]:[])].map(h=>(
                      <th key={h} style={{textAlign:"left",padding:"10px 14px",color:MUTED,fontWeight:700,fontSize:10,textTransform:"uppercase",letterSpacing:0.8,whiteSpace:"nowrap"}}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>{[...recs].sort((a,b)=>a.fecha.localeCompare(b.fecha)).map((r,i)=>(
                    editRecId===r.id
                      ?<tr key={r.id}><td colSpan={isAdmin?7:6} style={{padding:"8px 14px"}}><RecInlineForm data={editRecData} onChange={setEditRecData} onSave={saveRec} onCancel={()=>setEditRecId(null)}/></td></tr>
                      :<tr key={r.id} style={{borderTop:`1px solid ${BORDER}`,background:i%2===0?WHITE:"#FAFBFD"}}>
                        <td style={{padding:"11px 14px",fontWeight:800,whiteSpace:"nowrap"}}>{r.fecha}</td>
                        <td style={{padding:"11px 14px",color:MUTED,fontWeight:600,whiteSpace:"nowrap"}}>{fmt(r.kgBruto)} kg</td>
                        <td style={{padding:"11px 14px",whiteSpace:"nowrap"}}><span style={{fontSize:15,fontWeight:900,color:BLUE}}>{fmt(r.kgReal)}</span><span style={{fontSize:11,color:MUTED,fontWeight:600}}> kg</span></td>
                        <td style={{padding:"11px 14px"}}><EstadoBadge estado={r.estado}/></td>
                        <td style={{padding:"11px 14px",fontSize:11,color:TEXT,maxWidth:200}}>{r.transformadoEn||<span style={{color:MUTED}}>—</span>}</td>
                        <td style={{padding:"11px 14px",fontSize:11,color:MUTED,maxWidth:180}}>{r.obs||"—"}</td>
                        {isAdmin&&<td style={{padding:"11px 14px"}}><div style={{display:"flex",gap:4}}><EditBtn onClick={()=>{setEditRecId(r.id);setEditRecData({...r});}}/><DelBtn onClick={()=>delRec(r.id)}/></div></td>}
                      </tr>
                  ))}</tbody>
                </table>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:12}}>
                {[
                  {label:"Total bruto",val:`${fmt(totalBruto)} kg`,grad:"linear-gradient(135deg,#475569,#6B7A99)"},
                  {label:"Total real",val:`${fmt(totalReal)} kg`,grad:G_BLUE},
                  {label:"Merma promedio",val:`${Math.round((1-totalReal/totalBruto)*100)}%`,grad:"linear-gradient(135deg,#92400E,#D97706)"},
                  {label:"Transformados",val:recs.filter(r=>r.estado==="Transformado").length,grad:G_GREEN},
                ].map(k=>(
                  <div key={k.label} style={{background:k.grad,borderRadius:12,padding:"1rem 1.25rem",boxShadow:"0 3px 12px rgba(0,0,0,0.1)"}}>
                    <div style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.6)",textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>{k.label}</div>
                    <div style={{fontSize:22,fontWeight:900,color:WHITE}}>{k.val}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {tab==="pipeline"&&(
            <>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16,flexWrap:"wrap",gap:12}}>
                <div>
                  <div style={{fontSize:24,fontWeight:900,color:TEXT,marginBottom:4}}>Pipeline de pedidos</div>
                  <div style={{fontSize:14,color:MUTED,fontWeight:500}}>{pedidos.length} pedido{pedidos.length!==1?"s":""} registrado{pedidos.length!==1?"s":""}</div>
                </div>
                {isAdmin&&<button style={{background:G_BLUE,color:WHITE,border:"none",borderRadius:10,padding:"9px 18px",fontSize:12,fontWeight:700,cursor:"pointer"}} onClick={()=>{setShowNewPed(true);setEditPedId(null);}}>+ Nuevo pedido</button>}
              </div>
              {isAdmin&&showNewPed&&<PedInlineForm data={newPedData} onChange={setNewPedData} onSave={savePed} onCancel={()=>setShowNewPed(false)}/>}
              {pedidos.length===0&&!showNewPed&&<div style={{background:WHITE,borderRadius:16,padding:"3rem",textAlign:"center",border:`1.5px dashed ${BORDER}`}}><div style={{fontSize:32,marginBottom:8}}>📋</div><div style={{fontSize:14,color:MUTED,fontWeight:600}}>No hay pedidos aún</div></div>}
              <div style={{display:"flex",gap:10,overflowX:"auto",paddingBottom:8}}>
                {ETAPAS.map((etapa,i)=>{
                  const lotes=pedidos.filter(p=>p.etapa===i);
                  const active=lotes.length>0;
                  return(
                    <div key={i} style={{minWidth:170,flex:"0 0 auto"}}>
                      <div style={{background:active?G_BLUE:BG,borderRadius:10,padding:"10px 12px",marginBottom:10,border:active?"none":`1px solid ${BORDER}`}}>
                        <div style={{fontSize:14,marginBottom:2}}>{ETAPA_ICONS[i]}</div>
                        <div style={{fontSize:11,fontWeight:800,color:active?WHITE:MUTED}}>{etapa}</div>
                        {active&&<div style={{fontSize:10,color:"rgba(255,255,255,0.6)",fontWeight:600,marginTop:1}}>{lotes.length} pedido{lotes.length>1?"s":""}</div>}
                      </div>
                      {lotes.map(p=>(
                        editPedId===p.id
                          ?<div key={p.id} style={{marginBottom:8}}><PedInlineForm data={editPedData} onChange={setEditPedData} onSave={savePed} onCancel={()=>setEditPedId(null)}/></div>
                          :<div key={p.id} style={{background:G_CARD,border:`1px solid ${BORDER}`,borderRadius:12,padding:"12px",marginBottom:8,position:"relative",boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
                            {isAdmin&&<div style={{position:"absolute",top:8,right:8,display:"flex",gap:4}}><EditBtn onClick={()=>{setEditPedId(p.id);setEditPedData({...p});}}/><DelBtn onClick={()=>delPed(p.id)}/></div>}
                            <div style={{fontSize:12,fontWeight:800,color:TEXT,marginBottom:4,paddingRight:isAdmin?60:0}}>{p.nombre}</div>
                            <div style={{fontSize:11,color:MUTED,fontWeight:600,marginBottom:4}}>{p.cliente}</div>
                            <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:6}}>
                              <span style={{fontSize:18,fontWeight:900,color:BLUE}}>{fmt(p.kgReq)}</span>
                              <span style={{fontSize:10,color:MUTED,fontWeight:600}}>kg req.</span>
                            </div>
                            <div style={{marginBottom:6}}>
                              <span style={{background:p.kgDisponible?GREEN_BG:"#FEF9C3",color:p.kgDisponible?GREEN:"#A16207",borderRadius:20,padding:"2px 8px",fontSize:10,fontWeight:700}}>{p.kgDisponible?"✓ Disponible":"⏳ Pendiente"}</span>
                            </div>
                            {p.fechaEst&&<div style={{fontSize:10,color:MUTED,fontWeight:600,marginBottom:4}}>📅 {p.fechaEst}</div>}
                            {p.obs&&<div style={{fontSize:10,color:MUTED,marginBottom:6,lineHeight:1.4}}>{p.obs}</div>}
                            <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                              {p.cotizacion&&<span style={{background:BLUE_L,color:BLUE,borderRadius:6,padding:"2px 8px",fontSize:10,fontWeight:700}}>📄 Cot.</span>}
                              {p.oc&&<span style={{background:GREEN_BG,color:GREEN,borderRadius:6,padding:"2px 8px",fontSize:10,fontWeight:700}}>📋 OC</span>}
                            </div>
                            {isAdmin&&<div style={{display:"flex",gap:4,marginTop:8,borderTop:`1px solid ${BORDER}`,paddingTop:8}}>
                              <button onClick={()=>movePed(p.id,-1)} disabled={p.etapa===0} style={{flex:1,background:p.etapa===0?"#F0F2F7":BLUE_L,color:p.etapa===0?MUTED:BLUE,border:"none",borderRadius:6,padding:"4px",fontWeight:700,cursor:p.etapa===0?"default":"pointer",fontSize:11,opacity:p.etapa===0?0.5:1}}>← Atrás</button>
                              <button onClick={()=>movePed(p.id,1)} disabled={p.etapa===ETAPAS.length-1} style={{flex:1,background:p.etapa===ETAPAS.length-1?"#F0F2F7":BLUE_L,color:p.etapa===ETAPAS.length-1?MUTED:BLUE,border:"none",borderRadius:6,padding:"4px",fontWeight:700,cursor:p.etapa===ETAPAS.length-1?"default":"pointer",fontSize:11,opacity:p.etapa===ETAPAS.length-1?0.5:1}}>Avanzar →</button>
                            </div>}
                          </div>
                      ))}
                      {lotes.length===0&&<div style={{background:WHITE,border:`1.5px dashed ${BORDER}`,borderRadius:10,padding:"14px 12px",textAlign:"center"}}><div style={{fontSize:10,color:MUTED,fontWeight:600}}>Sin pedidos</div></div>}
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
                  {icon:"🍾",label:"plumas recicladas equiv.",val:fmt(Math.round(totalReal*25)),grad:G_BLUE},
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
                  const totalPlumasCat=Math.round(totalKgCat/KG_POR_PLUMA);
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
                                    <div style={{fontSize:9,fontWeight:700,color:MUTED,textTransform:"uppercase",letterSpacing:0.5,marginBottom:2}}>KG/pieza</div>
                                    <div style={{fontSize:18,fontWeight:900,color:PIEZAS_COLORS[idx]}}>{p.kgPieza}</div>
                                  </div>
                                </div>
                                <div style={{marginTop:8,background:BLUE_L,borderRadius:8,padding:"6px 10px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                                  <span style={{fontSize:9,fontWeight:700,color:BLUE,textTransform:"uppercase",letterSpacing:0.5}}>Total KG</span>
                                  <span style={{fontSize:14,fontWeight:900,color:BLUE}}>{fmt(p.cantidad*p.kgPieza)} kg</span>
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
                          <div style={{fontSize:11,color:"rgba(255,255,255,0.65)",fontWeight:600,marginBottom:8}}>piezas · {fmt(totalKg)} kg</div>
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
