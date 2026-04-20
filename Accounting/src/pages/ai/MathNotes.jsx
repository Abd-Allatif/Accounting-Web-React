import { useRef, useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { TopBar, Drawer, BackGround } from "../../components";
import { useNavigate } from 'react-router-dom';

function MathNotes() {
  const { t } = useTranslation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const canvasref = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [reset, setReset] = useState(false);
  const [color, setColor] = useState("#FFFFFF");
  const [bgcolor, setBgColor] = useState("#000000");
  const [result, setResult] = useState({});
  const [dictOfVars, setVarDic] = useState({});
  const [textValue, setTextValue] = useState("");
  const [range, setRange] = useState(5);
  const navigate = useNavigate();

  function resetCanvas() {
    const canvas = canvasref.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  const sendData = async () => {
    const canvas = canvasref.current;
    if (canvas) {
      setTextValue("Please Wait...");
      try {
        const response = await axios({
          method: "post",
          url: `${import.meta.env.VITE_API_URL_AI}`,
          data: { image: canvas.toDataURL("image/png"), dict_of_vars: dictOfVars },
        });
        const respon = await response.data;
        respon.data.forEach((data) => {
          if (data.assign === true) setVarDic({ ...dictOfVars, [data.expr]: data.result });
        });
        respon.data.forEach((data) => {
          setTimeout(() => { setResult({ expression: data.expr, answer: data.result }); }, 200);
        });
      } catch (e) { setTextValue(`An Error Happend Please Try Again Later`); }
    }
  };

  useEffect(() => {
    if (result && result.expression) setTextValue(`${result.expression} = ${result.answer}`);
  }, [result]);

  useEffect(() => {
    const canvas = canvasref.current;
    setTextValue("");
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - 100; // Account for topbar
        ctx.lineCap = "round";
        ctx.lineWidth = range;
      }
      canvas.addEventListener("mousemove", draw);
      canvas.addEventListener("touchmove", draw);
      return () => { canvas.removeEventListener("mousemove", draw); canvas.removeEventListener("touchmove", draw); };
    }
  }, []);

  useEffect(() => {
    const canvas = canvasref.current;
    if (canvas) canvas.style.background = bgcolor;
    setTextValue("");
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.lineWidth = range;
    }
  }, [range, bgcolor, color]);

  useEffect(() => {
    if (reset) { resetCanvas(); setReset(false); setTextValue(""); }
  }, [reset]);

  const startDrawing = (e) => {
    e.preventDefault();
    const canvas = canvasref.current;
    const { clientX, clientY } = e.touches ? e.touches[0] : e;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    if (canvas) {
      canvas.style.background = bgcolor;
      const ctx = canvas.getContext("2d");
      if (ctx) { ctx.beginPath(); ctx.moveTo(x, y); setIsDrawing(true); }
    }
    document.body.classList.add("no-scroll");
  };

  const stopDrawing = () => { setIsDrawing(false); document.body.classList.remove("no-scroll"); };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasref.current;
    const { clientX, clientY } = e.touches ? e.touches[0] : e;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) { ctx.strokeStyle = color; ctx.lineTo(x, y); ctx.stroke(); }
    }
  };

  return (
    <StyledWrapper>
      <div className="MainBg">
        <TopBar drawerButton_Onclick={() => setIsDrawerOpen(true)} backButton_Onclick={() => navigate("/main")} Text="AI Math Notes" />
        <Drawer isOpen={isDrawerOpen} toggleDrawer={(open) => () => setIsDrawerOpen(open)} />
        
        <div className="Toolbar">
          <button className="GlassBtn" onClick={() => setReset(true)}>{t("reset")}</button>
          
          <div className="ToolsGroup">
            <div className="ToolItem">
              <span className="ToolLabel">Brush</span>
              <input type="color" className="ColorInput" onChange={(e) => setColor(e.target.value)} value={color} />
              <input type="range" className="RangeInput" min="2" max="20" onChange={(e) => setRange(e.target.value)} value={range} />
            </div>
            
            <div className="ToolItem">
              <span className="ToolLabel">Canvas</span>
              <input type="color" className="ColorInput" onChange={(e) => setBgColor(e.target.value)} value={bgcolor} />
            </div>
          </div>
          
          <button className="GlassBtn accent" onClick={sendData}>{t("calculate")}</button>
        </div>
        
        <div className="ResultBar">
          <input type="text" className="ResultInput" value={textValue} readOnly placeholder="Draw a math expression..." />
        </div>
        
        <div className="CanvasContainer">
          <canvas
            ref={canvasref}
            className="MathCanvas"
            onMouseDown={startDrawing}
            onMouseOut={stopDrawing}
            onMouseUp={stopDrawing}
            onMouseMove={draw}
            onTouchMove={draw}
            onTouchStart={startDrawing}
            onTouchEnd={stopDrawing}
          />
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .MainBg { width: 100vw; height: 100vh; background: var(--bg-main); display: flex; flex-direction: column; overflow: hidden; }
  .Toolbar { display: flex; justify-content: space-between; align-items: center; padding: 1em 2em; background: rgba(23,23,23,0.8); backdrop-filter: blur(10px); border-bottom: 1px solid var(--border); gap: 1em; flex-wrap: wrap; z-index: 10; margin-top: 60px; }
  .ToolsGroup { display: flex; gap: 2em; align-items: center; background: rgba(0,0,0,0.2); padding: 0.5em 1.5em; border-radius: var(--radius-lg); border: 1px solid rgba(255,255,255,0.05); flex-wrap: wrap; }
  .ToolItem { display: flex; align-items: center; gap: 0.8em; }
  .ToolLabel { color: var(--text-secondary); font-size: 0.85rem; font-weight: 500; text-transform: uppercase; letter-spacing: 1px; }
  .ColorInput { width: 32px; height: 32px; border: none; border-radius: 8px; cursor: pointer; background: none; &::-webkit-color-swatch-wrapper { padding: 0; } &::-webkit-color-swatch { border: 2px solid var(--border); border-radius: 6px; } }
  .RangeInput { accent-color: var(--accent); cursor: pointer; }
  .GlassBtn { padding: 0.8em 2em; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: var(--radius-md); color: var(--text-primary); font-weight: 600; cursor: pointer; transition: all 0.2s ease; &:hover { background: rgba(255,255,255,0.1); transform: translateY(-1px); } }
  .GlassBtn.accent { background: var(--accent); color: white; border: none; box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4); &:hover { background: var(--accent-hover); box-shadow: 0 6px 20px rgba(99, 102, 241, 0.6); } }
  .ResultBar { padding: 0; background: var(--bg-main); width: 100%; border-bottom: 1px solid var(--border); z-index: 10; }
  .ResultInput { width: 100%; padding: 1em; background: rgba(0,0,0,0.3); border: none; color: var(--accent-light); font-size: 1.2rem; font-family: monospace; text-align: center; outline: none; }
  .CanvasContainer { flex-grow: 1; position: relative; width: 100%; overflow: hidden; }
  .MathCanvas { position: absolute; top: 0; left: 0; width: 100%; height: 100%; cursor: crosshair; touch-action: none; }
  @media(max-width: 768px) { .Toolbar { padding: 0.5em; justify-content: center; margin-top: 50px; } .ToolsGroup { gap: 1em; padding: 0.5em; } .GlassBtn { padding: 0.6em 1.2em; font-size: 0.9rem; } }
`;

export default MathNotes;
