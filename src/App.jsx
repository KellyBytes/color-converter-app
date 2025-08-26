import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [rgb, setRgb] = useState({ r: 141, g: 182, b: 150 });
  const [hex, setHex] = useState('#8db696');
  const [copied, setCopied] = useState(false);

  const handleRgbChange = (e) => {
    const { name, value } = e.target;

    if (value === '') {
      setRgb({ ...rgb, [name]: 0 });
      return;
    }

    let num = Math.max(0, Math.min(255, Number(value)));

    setRgb({ ...rgb, [name]: num.toString() });
  };

  const handleHexChange = (e) => {
    setHex(e.target.value);
  };

  const rgbToHex = (r, g, b) => {
    const red = Number(r).toString(16).padStart(2, 0);
    const green = Number(g).toString(16).padStart(2, 0);
    const blue = Number(b).toString(16).padStart(2, 0);

    return `#${red}${green}${blue}`;
  };

  const hexToRgb = (hex) => {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return { r, g, b };
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(true);

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  useEffect(() => {
    setHex(rgbToHex(rgb.r, rgb.g, rgb.b));
  }, [rgb]);

  useEffect(() => {
    if (/^#[0-9A-Fa-f]{6}$/i.test(hex)) {
      setRgb(hexToRgb(hex));
    }
  }, [hex]);

  return (
    <div className="app">
      <div className="converter">
        <h1>Color Converter</h1>
        <div className="rgb-section">
          <h2>RGB</h2>
          <div className="input-groups">
            <div className="input-group">
              <label>R:</label>
              <input
                type="number"
                name="r"
                min="0"
                max="255"
                value={rgb.r}
                onChange={handleRgbChange}
              />
            </div>
            <div className="input-group">
              <label>G:</label>
              <input
                type="number"
                name="g"
                min="0"
                max="255"
                value={rgb.g}
                onChange={handleRgbChange}
              />
            </div>
            <div className="input-group">
              <label>B:</label>
              <input
                type="number"
                name="b"
                min="0"
                max="255"
                value={rgb.b}
                onChange={handleRgbChange}
              />
            </div>
          </div>
        </div>
        <div className="hex-section">
          <h2>HEX</h2>
          <div className="hex-input">
            <input type="text" maxLength="7" value={hex} onChange={handleHexChange} />
            <button className="copy-btn" onClick={handleCopy}>
              {copied ? (
                <>
                  <i className="bx bx-copy"></i> Copied!
                </>
              ) : (
                <>
                  <i className="bx bx-copy"></i> Copy
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      <div className="color-preview" style={{ backgroundColor: hex }}></div>
    </div>
  );
};

export default App;
