import { useState, useEffect, useCallback } from 'react';
import './index.css';
import './styles.css';

const App = () => {
  const [rgb, setRgb] = useState({ r: 141, g: 182, b: 226 });
  const [hex, setHex] = useState('#8db6e2');
  const [copied, setCopied] = useState(false);
  const [pendingRgb, setPendingRgb] = useState(rgb);

  function debounce(func, delay) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  }

  const handleRgbNumChange = (e) => {
    const { name, value } = e.target;
    let num = Math.max(0, Math.min(255, Number(value)));
    setRgb((prev) => ({ ...prev, [name]: String(num) })); // remove ascending zeros
    setPendingRgb((prev) => ({ ...prev, [name]: num }));
  };

  const handleRangeImmediate = (e) => {
    const { name, value } = e.target;
    const num = Math.max(0, Math.min(255, Number(value)));
    setPendingRgb((prev) => ({ ...prev, [name]: num }));
  };

  const handleRangeDebounced = useCallback(
    debounce((newRgb) => {
      setRgb(newRgb);
    }, 20),
    []
  );

  const handleHexChange = (e) => {
    let value = e.target.value.toUpperCase();

    if (!value.startsWith('#')) {
      value = '#' + value.replace(/[^0-9A-F]/gi, '');
    } else {
      value = '#' + value.slice(1).replace(/[^0-9A-F]/gi, '');
    }

    if (value.length > 7) {
      value = value.slice(0, 7);
    }
    setHex(value);
  };

  const rgbToHex = (r, g, b) => {
    const red = Number(r).toString(16).toUpperCase().padStart(2, '0');
    const green = Number(g).toString(16).toUpperCase().padStart(2, '0');
    const blue = Number(b).toString(16).toUpperCase().padStart(2, '0');

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
    handleRangeDebounced(pendingRgb);
  }, [pendingRgb, handleRangeDebounced]);

  useEffect(() => {
    const newHex = rgbToHex(rgb.r, rgb.g, rgb.b);
    if (newHex !== hex) {
      setHex(newHex);
    }
  }, [rgb]);

  useEffect(() => {
    if (/^#[0-9A-Fa-f]{6}$/i.test(hex)) {
      const newRgb = hexToRgb(hex);

      if (newRgb.r !== rgb.r || newRgb.g !== rgb.g || newRgb.b !== rgb.b) {
        setRgb(newRgb);
        setPendingRgb(newRgb);
      }
    }
  }, [hex]);

  return (
    <div className="app w-full h-screen grid place-items-center text-gray-200 relative">
      <div className="converter w-3/4 max-w-2xl lg:max-w-3xl h-2/3 lg:h-3/5 bg-gray-800 flex flex-col justify-center items-center gap-y-10 rounded-4xl shadow-xl/20">
        <h1 className="exo px-5 text-3xl text-wrap text-center sm:text-5xl md:text-6xl lg:text-7xl text-shadow-lg text-shadow-gray-100 lg:mb-4">
          Color Converter
        </h1>
        <div className="rgb-section flex flex-col items-center">
          <h2 className="font-bold text-center text-2xl sm:text-3xl text-neutral-300 text-shadow-sm/30 text-shadow-neutral-100 mb-3">
            RGB
          </h2>
          <div className="input-groups flex flex-col lg:flex-row">
            <div className="input-group flex items-center gap-x-4">
              <label className="text-lg sm:text-xl text-red-400">R:</label>
              <div className="inputs flex flex-col justify-center mb-4 lg:mr-6">
                <input
                  className="w-30 h-8 bg-transparent border-none outline-none text-center text-xl lg:text-2xl font-light -ml-2"
                  type="number"
                  name="r"
                  min="0"
                  max="255"
                  value={rgb.r}
                  onChange={handleRgbNumChange}
                  onWheel={(e) => e.currentTarget.blur()}
                />
                <input
                  className="w-30 h-1"
                  type="range"
                  name="r"
                  min="0"
                  max="255"
                  value={pendingRgb.r}
                  onChange={handleRangeImmediate}
                />
              </div>
            </div>
            <div className="input-group flex items-center gap-x-4">
              <label className="text-lg sm:text-xl text-green-400">G:</label>
              <div className="inputs flex flex-col justify-center mb-4 lg:mr-6">
                <input
                  className="w-30 h-8 bg-transparent border-none outline-none text-center text-xl lg:text-2xl font-light -ml-2"
                  type="number"
                  name="g"
                  min="0"
                  max="255"
                  value={rgb.g}
                  onChange={handleRgbNumChange}
                  onWheel={(e) => e.currentTarget.blur()}
                />
                <input
                  className="w-30 h-1"
                  type="range"
                  name="g"
                  min="0"
                  max="255"
                  value={pendingRgb.g}
                  onChange={handleRangeImmediate}
                />
              </div>
            </div>
            <div className="input-group flex items-center gap-x-4">
              <label className="text-lg sm:text-xl text-blue-400">B:</label>
              <div className="inputs flex flex-col justify-center mb-4">
                <input
                  className="w-30 h-8 bg-transparent border-none outline-none text-center text-xl lg:text-2xl font-light -ml-2"
                  type="number"
                  name="b"
                  min="0"
                  max="255"
                  value={rgb.b}
                  onChange={handleRgbNumChange}
                  onWheel={(e) => e.currentTarget.blur()}
                />
                <input
                  className="w-30 h-1"
                  type="range"
                  name="b"
                  min="0"
                  max="255"
                  value={pendingRgb.b}
                  onChange={handleRangeImmediate}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="hex-section">
          <h2 className="text-center font-bold text-2xl sm:text-3xl text-neutral-300 text-shadow-sm/30 text-shadow-neutral-100 mb-3">
            HEX
          </h2>
          <div className="hex-input flex justify-center relative">
            <input
              className="w-30 lg:w-36 h-10 pl-4 font-light text-2xl lg:text-3xl border-b-gray-500 border-b-3 outline-none"
              type="text"
              maxLength="7"
              value={hex}
              onChange={handleHexChange}
            />
            <button
              className="copy-btn absolute right-0 top-1 bg-transparent cursor-pointer"
              onClick={handleCopy}
            >
              {copied ? (
                <span className="text-sm text-gray-400 absolute -right-8">
                  Copied!
                </span>
              ) : (
                <i className="bx bx-copy text-md text-gray-400"></i>
              )}
            </button>
          </div>
        </div>
      </div>
      <div
        className="color-preview w-full h-full absolute inset-0 -z-1 transition-colors duration-300 ease"
        style={{ backgroundColor: hex }}
      ></div>
    </div>
  );
};

export default App;
