/**
 * COLOR POSTER LAB
 * Professional, deterministic layout generator.
 */

/* --- 1. CORE DATA & PROFESSIONAL PALETTES --- */
// Base resolutions multiplied by 3 for massive 3x output
const RESOLUTIONS = {
    "1:1": { w: 3240, h: 3240 },
    "4:5": { w: 3240, h: 4050 },
    "9:16": { w: 3240, h: 5760 },
    "16:9": { w: 5760, h: 3240 },
    "2:3": { w: 3600, h: 5400 },
    "A4": { w: 7440, h: 10524 }
};

const PALETTES = {
    random: { name: "Random Professional", colors: [] },
    swiss: { name: "Swiss Editorial", colors: ["#D92525", "#F2F2F2", "#0D0D0D", "#4B4B4B", "#1C355E"] },
    minimal: { name: "Minimalist Sand", colors: ["#EBE8E3", "#D2C5B6", "#1C1C1C", "#9A8C78"] },
    luxury: { name: "Luxury Obsidian", colors: ["#121212", "#D4AF37", "#2C2C2C", "#F8F5EE", "#8A7334"] },
    corporate: { name: "Corporate Trust", colors: ["#0F4C81", "#F5F7FA", "#2D3748", "#EDF2F7", "#3182CE"] },
    neon: { name: "Cyber Neon", colors: ["#0B0C10", "#1F2833", "#66FCF1", "#45A29E", "#C5C6C7", "#F048C6"] },
    earth: { name: "Earth & Flora", colors: ["#3D5A80", "#98C1D9", "#E0FBFC", "#EE6C4D", "#293241"] },
    pastel: { name: "Soft Dream", colors: ["#FFD1DC", "#B39EB5", "#AEC6CF", "#FDFD96", "#FFB347"] },
    ocean: { name: "Deep Ocean", colors: ["#001B2E", "#1D3F58", "#537692", "#B3CDE0", "#E1EDF4"] },
    warm: { name: "Sunset Blaze", colors: ["#2C0703", "#890620", "#B6465F", "#DA9F93", "#EBD4CB"] },
    monochrome: { name: "Graphite Grayscale", colors: ["#000000", "#333333", "#666666", "#999999", "#CCCCCC", "#F2F2F2"] }
};

const ADJECTIVES = ["Midnight", "Azure", "Crimson", "Emerald", "Golden", "Indigo", "Oceanic", "Terra", "Soft", "Bold", "Abstract", "Luminous"];
const NOUNS = ["Geometry", "Editorial", "Structure", "Balance", "Horizon", "Blocks", "Form", "Grid", "Composition", "Vibe"];

/* --- 2. STATE MANAGEMENT --- */
let state = {
    seed: "",
    currentDesign: null,
    history: JSON.parse(localStorage.getItem("cpl_history")) || [],
    favorites: JSON.parse(localStorage.getItem("cpl_favorites")) || []
};

// UI Elements
const canvas = document.getElementById("poster-canvas");
const ctx = canvas.getContext("2d");
const els = {
    aspect: document.getElementById("aspect-ratio"),
    mode: document.getElementById("design-mode"),
    style: document.getElementById("design-style"),
    palette: document.getElementById("color-palette"),
    customColors: document.getElementById("custom-colors"),
    complexity: document.getElementById("complexity"),
    seedInput: document.getElementById("seed-input"),
    metaName: document.getElementById("meta-name"),
    metaDetails: document.getElementById("meta-details"),
    btnFav: document.getElementById("btn-favorite"),
    gridHistory: document.getElementById("history-grid"),
    gridFavorites: document.getElementById("favorites-grid")
};

/* --- 3. PRNG (Deterministic Random Engine) --- */
let seededRandom = Math.random;

function xmur3(str) {
    for(var i = 0, h = 1779033703 ^ str.length; i < str.length; i++) {
        h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
        h = h << 13 | h >>> 19;
    } return function() {
        h = Math.imul(h ^ (h >>> 16), 2246822507);
        h = Math.imul(h ^ (h >>> 13), 3266489909);
        return (h ^= h >>> 16) >>> 0;
    }
}

function mulberry32(a) {
    return function() {
        var t = a += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

function initPRNG(seedStr) {
    const seed = xmur3(seedStr)();
    seededRandom = mulberry32(seed);
}

// Random utilities using the deterministic PRNG
function rand(min, max) { return seededRandom() * (max - min) + min; }
function randInt(min, max) { return Math.floor(rand(min, max + 1)); }
function randArr(arr) { return arr[randInt(0, arr.length - 1)]; }
function generateSeedStr() { return "CP-" + Math.random().toString(36).substring(2, 10).toUpperCase(); }

/* --- 4. DRAWING ENGINE & TEMPLATES --- */

class PosterGenerator {
    constructor(ctx, config) {
        this.ctx = ctx;
        this.w = config.w;
        this.h = config.h;
        this.palette = config.colors;
        this.mode = config.mode;
        this.density = config.density;
        
        this.complexity = this.density === 'low' ? 3 : this.density === 'medium' ? 6 : 12;
    }

    getColor() { return randArr(this.palette); }

    getFillStyle(w, h, x, y) {
        if (this.mode === 'solid' || (this.mode === 'mixed' && seededRandom() > 0.5)) {
            return this.getColor();
        } else {
            let x2 = x + (seededRandom() > 0.5 ? w : 0);
            let y2 = y + (seededRandom() > 0.5 ? h : 0);
            let grad = this.ctx.createLinearGradient(x, y, x2, y2);
            grad.addColorStop(0, this.getColor());
            grad.addColorStop(1, this.getColor());
            if (seededRandom() > 0.7) grad.addColorStop(0.5, this.getColor());
            return grad;
        }
    }

    clear() {
        this.ctx.fillStyle = this.getColor();
        this.ctx.fillRect(0, 0, this.w, this.h);
    }

    // Template 1: Minimalist Grid / Mondrian Style
    drawMinimalist() {
        this.clear();
        const split = (x, y, w, h, depth) => {
            if (depth <= 0 || (depth < this.complexity && seededRandom() > 0.7)) {
                this.ctx.fillStyle = this.getFillStyle(w, h, x, y);
                this.ctx.fillRect(x, y, w, h);
                this.ctx.strokeStyle = this.getColor();
                this.ctx.lineWidth = rand(3, 15); // Scaled up for 3x resolution
                this.ctx.strokeRect(x, y, w, h);
                return;
            }
            if (w > h) {
                let splitPoint = w * rand(0.3, 0.7);
                split(x, y, splitPoint, h, depth - 1);
                split(x + splitPoint, y, w - splitPoint, h, depth - 1);
            } else {
                let splitPoint = h * rand(0.3, 0.7);
                split(x, y, w, splitPoint, depth - 1);
                split(x, y + splitPoint, w, h - splitPoint, depth - 1);
            }
        };
        split(0, 0, this.w, this.h, Math.min(this.complexity, 6));
    }

    // Template 2: Geometric Blocks
    drawGeometric() {
        this.clear();
        for (let i = 0; i < this.complexity * 2; i++) {
            this.ctx.fillStyle = this.getFillStyle(this.w, this.h, 0, 0);
            this.ctx.beginPath();
            let shapeType = randInt(1, 3);
            let cx = rand(0, this.w);
            let cy = rand(0, this.h);
            let size = rand(this.w * 0.1, this.w * 0.8);

            if (shapeType === 1) {
                this.ctx.arc(cx, cy, size / 2, 0, Math.PI * 2);
            } else if (shapeType === 2) {
                this.ctx.rect(cx - size/2, cy - size/2, size, size * rand(0.5, 2));
            } else {
                this.ctx.moveTo(cx, cy - size/2);
                this.ctx.lineTo(cx + size/2, cy + size/2);
                this.ctx.lineTo(cx - size/2, cy + size/2);
            }
            this.ctx.fill();
        }
    }

    // Template 3: Diagonal Split
    drawDiagonal() {
        this.clear();
        const slices = this.complexity + 2;
        for(let i=0; i<slices; i++) {
            this.ctx.fillStyle = this.getFillStyle(this.w, this.h, 0, 0);
            this.ctx.beginPath();
            if (seededRandom() > 0.5) {
                this.ctx.moveTo(0, rand(0, this.h));
                this.ctx.lineTo(this.w, rand(0, this.h));
                this.ctx.lineTo(this.w, this.h);
                this.ctx.lineTo(0, this.h);
            } else {
                this.ctx.moveTo(rand(0, this.w), 0);
                this.ctx.lineTo(rand(0, this.w), this.h);
                this.ctx.lineTo(this.w, this.h);
                this.ctx.lineTo(this.w, 0);
            }
            this.ctx.fill();
        }
    }

    // Template 4: Abstract Organic / Soft 
    drawAbstract() {
        this.clear();
        for (let i = 0; i < this.complexity * 3; i++) {
            let cx = rand(-0.2*this.w, 1.2*this.w);
            let cy = rand(-0.2*this.h, 1.2*this.h);
            let r = rand(this.w * 0.2, this.w * 0.9);
            
            let grad = this.ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
            grad.addColorStop(0, this.getColor());
            
            let c = this.getColor();
            let rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(c);
            let rgbaStr = rgb ? `rgba(${parseInt(rgb[1], 16)}, ${parseInt(rgb[2], 16)}, ${parseInt(rgb[3], 16)}, 0)` : 'transparent';
            
            grad.addColorStop(1, rgbaStr);
            this.ctx.fillStyle = grad;
            this.ctx.beginPath();
            this.ctx.arc(cx, cy, r, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    // Template 5: Modern Editorial
    drawEditorial() {
        this.clear();
        this.ctx.fillStyle = this.getColor();
        let blockW = this.w * rand(0.5, 0.9);
        let blockH = this.h * rand(0.4, 0.8);
        this.ctx.fillRect(this.w/2 - blockW/2, this.h/2 - blockH/2, blockW, blockH);
        
        this.ctx.strokeStyle = this.getColor();
        this.ctx.lineWidth = rand(6, 30); // Scaled up for 3x resolution
        this.ctx.beginPath();
        this.ctx.moveTo(this.w * 0.1, this.h * 0.1);
        this.ctx.lineTo(this.w * 0.9, this.h * 0.1);
        this.ctx.stroke();

        for(let i=0; i<3; i++) {
            this.ctx.fillStyle = this.getFillStyle(this.w, this.h, 0, 0);
            this.ctx.beginPath();
            this.ctx.arc(rand(0, this.w), rand(0, this.h), rand(30, 300), 0, Math.PI*2); // Scaled
            this.ctx.fill();
        }
    }
}

/* --- 5. MAIN GENERATION LOGIC --- */

function generateDesign(specificSeed = null, skipHistory = false) {
    const seed = specificSeed || generateSeedStr();
    initPRNG(seed);

    const ratioStr = els.aspect.value;
    const res = RESOLUTIONS[ratioStr];
    canvas.width = res.w;
    canvas.height = res.h;

    let palKey = els.palette.value;
    let colors = [];
    let palName = "";

    let customStr = els.customColors.value.trim();
    if (customStr) {
        colors = customStr.split(",").map(c => c.trim()).filter(c => /^#[0-9A-F]{6}$/i.test(c));
        if(colors.length > 0) {
            palName = "Custom Colors";
        } else {
            customStr = "";
        }
    }
    
    if (!customStr || colors.length === 0) {
        if (palKey === "random") {
            const keys = Object.keys(PALETTES).filter(k => k !== "random");
            palKey = randArr(keys);
        }
        colors = PALETTES[palKey].colors;
        palName = PALETTES[palKey].name;
    }

    let styleKey = els.style.value;
    if (styleKey === "random") {
        const styles = ["minimalist", "geometric", "diagonal", "abstract", "editorial"];
        styleKey = randArr(styles);
    }

    const designName = `${randArr(ADJECTIVES)} ${randArr(NOUNS)}`;
    
    const generator = new PosterGenerator(ctx, {
        w: res.w, h: res.h,
        colors: colors,
        mode: els.mode.value,
        density: els.complexity.value
    });

    switch(styleKey) {
        case 'minimalist': generator.drawMinimalist(); break;
        case 'geometric': generator.drawGeometric(); break;
        case 'diagonal': generator.drawDiagonal(); break;
        case 'abstract': generator.drawAbstract(); break;
        case 'editorial': generator.drawEditorial(); break;
    }

    // Creating thumbnail at 10% size so LocalStorage doesn't explode from 3x huge images
    const thumbCanvas = document.createElement("canvas");
    thumbCanvas.width = res.w / 10;
    thumbCanvas.height = res.h / 10;
    thumbCanvas.getContext("2d").drawImage(canvas, 0, 0, thumbCanvas.width, thumbCanvas.height);

    state.currentDesign = {
        id: seed, name: designName, style: styleKey, palette: palName,
        dataUrl: thumbCanvas.toDataURL("image/jpeg", 0.7)
    };

    els.seedInput.value = seed;
    els.metaName.innerText = designName;
    els.metaDetails.innerText = `Style: ${styleKey.toUpperCase()} | Palette: ${palName}`;
    checkFavoriteStatus();

    if (!skipHistory) {
        addToHistory(state.currentDesign);
    }
}

/* --- 6. HISTORY & FAVORITES MANAGEMENT --- */

function addToHistory(design) {
    if (state.history.length > 0 && state.history[0].id === design.id) return;
    state.history.unshift(design);
    if (state.history.length > 50) state.history.pop();
    
    try {
        localStorage.setItem("cpl_history", JSON.stringify(state.history));
    } catch(e) {
        console.warn("Storage full, clearing oldest items.");
        state.history.length = 20; 
        localStorage.setItem("cpl_history", JSON.stringify(state.history));
    }
    
    renderGrids();
}

function toggleFavorite() {
    if(!state.currentDesign) return;
    const exists = state.favorites.findIndex(f => f.id === state.currentDesign.id);
    if (exists > -1) {
        state.favorites.splice(exists, 1);
    } else {
        state.favorites.unshift(state.currentDesign);
    }
    localStorage.setItem("cpl_favorites", JSON.stringify(state.favorites));
    checkFavoriteStatus();
    renderGrids();
}

function checkFavoriteStatus() {
    if(!state.currentDesign) return;
    const exists = state.favorites.some(f => f.id === state.currentDesign.id);
    els.btnFav.classList.toggle("favorited", exists);
    els.btnFav.innerText = exists ? "♥" : "♡";
}

function renderGrids() {
    const createCard = (item, isFav) => {
        const div = document.createElement("div");
        div.className = "gallery-item";
        div.innerHTML = `
            <img src="${item.dataUrl}" alt="${item.name}" loading="lazy">
            <div class="gallery-item-info">
                <h4>${item.name}</h4>
                <p>${item.palette}</p>
            </div>
        `;
        div.onclick = () => {
            els.seedInput.value = item.id;
            generateDesign(item.id, true);
            document.querySelector('[data-tab="generator"]').click();
        };
        return div;
    };

    els.gridHistory.innerHTML = "";
    state.history.forEach(item => els.gridHistory.appendChild(createCard(item, false)));

    els.gridFavorites.innerHTML = "";
    state.favorites.forEach(item => els.gridFavorites.appendChild(createCard(item, true)));
}

/* --- 7. EXPORT / DOWNLOAD LOGIC --- */

function downloadCanvas(filename) {
    const link = document.createElement("a");
    link.download = filename + ".png";
    link.href = canvas.toDataURL("image/png", 1.0);
    link.click();
}

async function downloadAll() {
    if (state.history.length === 0) return alert("No designs in history!");
    if (typeof JSZip !== 'undefined') {
        const zip = new JSZip();
        // Limiting to 5 for massive 3x resolution to prevent browser crash
        const itemsToExport = state.history.slice(0, 5); 
        const currentSeed = state.currentDesign.id;
        
        for (let i = 0; i < itemsToExport.length; i++) {
            const item = itemsToExport[i];
            generateDesign(item.id, true);
            const data = canvas.toDataURL("image/png", 1.0).split(',')[1];
            zip.file(`${item.name.replace(/ /g, "_")}_${item.id}.png`, data, {base64: true});
        }
        
        generateDesign(currentSeed, true);

        const content = await zip.generateAsync({type:"blob"});
        const link = document.createElement("a");
        link.href = URL.createObjectURL(content);
        link.download = "Poster_Designs.zip";
        link.click();
    } else {
        alert("JSZip library not loaded.");
    }
}

/* --- 8. SVG EXPORT SYSTEM --- */
class SVGContext {
    constructor(w, h) {
        this.w = w; this.h = h;
        this.defs = ""; this.body = "";
        this.gradCount = 0; this.gradients = [];
        this.currentPath = "";
        this.fillStyle = "#000000";
        this.strokeStyle = "#000000";
        this.lineWidth = 1;
    }
    
    _formatColor(c) {
        return typeof c === 'object' && c.id ? `url(#${c.id})` : c;
    }

    createLinearGradient(x0, y0, x1, y1) {
        let id = "grad" + (++this.gradCount);
        let grad = { id, type: 'linear', x0, y0, x1, y1, stops: [], addColorStop: function(off, col) { this.stops.push({off, col}); } };
        this.gradients.push(grad);
        return grad;
    }

    createRadialGradient(x0, y0, r0, x1, y1, r1) {
        let id = "grad" + (++this.gradCount);
        let grad = { id, type: 'radial', cx: x1, cy: y1, r: r1, stops: [], addColorStop: function(off, col) { this.stops.push({off, col}); } };
        this.gradients.push(grad);
        return grad;
    }

    fillRect(x, y, w, h) {
        this.body += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${this._formatColor(this.fillStyle)}" />\n`;
    }

    strokeRect(x, y, w, h) {
        this.body += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${this._formatColor(this.strokeStyle)}" stroke-width="${this.lineWidth}" />\n`;
    }

    beginPath() { this.currentPath = ""; }
    moveTo(x, y) { this.currentPath += `M ${x} ${y} `; }
    lineTo(x, y) { this.currentPath += `L ${x} ${y} `; }
    
    arc(x, y, r, start, end) {
        this.currentPath += `M ${x-r}, ${y} a ${r},${r} 0 1,0 ${r*2},0 a ${r},${r} 0 1,0 -${r*2},0 `;
    }
    
    rect(x, y, w, h) {
        this.currentPath += `M ${x} ${y} h ${w} v ${h} h ${-w} Z `;
    }

    fill() {
        this.body += `<path d="${this.currentPath}" fill="${this._formatColor(this.fillStyle)}" />\n`;
    }

    stroke() {
        this.body += `<path d="${this.currentPath}" fill="none" stroke="${this._formatColor(this.strokeStyle)}" stroke-width="${this.lineWidth}" />\n`;
    }

    getSVG() {
        this.gradients.forEach(g => {
            if (g.type === 'linear') {
                this.defs += `<linearGradient id="${g.id}" x1="${g.x0}" y1="${g.y0}" x2="${g.x1}" y2="${g.y1}" gradientUnits="userSpaceOnUse">\n`;
            } else {
                this.defs += `<radialGradient id="${g.id}" cx="${g.cx}" cy="${g.cy}" r="${g.r}" gradientUnits="userSpaceOnUse">\n`;
            }
            g.stops.forEach(s => {
                let c = s.col;
                if (c.includes('rgba') && c.includes(', 0)')) {
                    c = c.replace(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*0\)/, 'rgb($1, $2, $3)" stop-opacity="0');
                }
                this.defs += `<stop offset="${Math.round(s.off*100)}%" stop-color="${c}" />\n`;
            });
            if (g.type === 'linear') this.defs += `</linearGradient>\n`;
            else this.defs += `</radialGradient>\n`;
        });

        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${this.w} ${this.h}" width="${this.w}" height="${this.h}">
            <defs>${this.defs}</defs>
            ${this.body}
        </svg>`;
    }
}

function downloadSVG() {
    if (!state.currentDesign) return;
    
    const seed = state.currentDesign.id;
    initPRNG(seed);
    
    const ratioStr = els.aspect.value;
    const res = RESOLUTIONS[ratioStr];
    
    let palKey = els.palette.value;
    let colors = [];
    let customStr = els.customColors.value.trim();
    if (customStr) {
        colors = customStr.split(",").map(c => c.trim()).filter(c => /^#[0-9A-F]{6}$/i.test(c));
    }
    if (colors.length === 0) {
        if (palKey === "random") {
            const keys = Object.keys(PALETTES).filter(k => k !== "random");
            palKey = randArr(keys);
        }
        colors = PALETTES[palKey].colors;
    }

    const svgCtx = new SVGContext(res.w, res.h);
    const generator = new PosterGenerator(svgCtx, {
        w: res.w, h: res.h,
        colors: colors,
        mode: els.mode.value,
        density: els.complexity.value
    });

    switch(state.currentDesign.style) {
        case 'minimalist': generator.drawMinimalist(); break;
        case 'geometric': generator.drawGeometric(); break;
        case 'diagonal': generator.drawDiagonal(); break;
        case 'abstract': generator.drawAbstract(); break;
        case 'editorial': generator.drawEditorial(); break;
    }

    const blob = new Blob([svgCtx.getSVG()], {type: "image/svg+xml;charset=utf-8"});
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${state.currentDesign.name.replace(/ /g, "_")}_${seed}.svg`;
    link.click();
}


/* --- 9. INITIALIZATION & EVENTS --- */

function initApp() {
    for (let key in PALETTES) {
        let opt = document.createElement("option");
        opt.value = key;
        opt.innerText = PALETTES[key].name;
        els.palette.appendChild(opt);
    }

    document.getElementById("btn-generate").addEventListener("click", () => generateDesign());
    
    document.getElementById("btn-generate-10").addEventListener("click", () => {
        for(let i=0; i<10; i++) generateDesign(); 
    });
    
    document.getElementById("btn-similar").addEventListener("click", () => {
        generateDesign(); 
    });

    document.getElementById("btn-randomize").addEventListener("click", () => {
        els.aspect.selectedIndex = randInt(0, els.aspect.options.length - 1);
        els.mode.selectedIndex = randInt(0, els.mode.options.length - 1);
        els.style.selectedIndex = randInt(0, els.style.options.length - 1);
        els.palette.selectedIndex = randInt(0, els.palette.options.length - 1);
        els.customColors.value = "";
        els.complexity.selectedIndex = randInt(0, els.complexity.options.length - 1);
        generateDesign();
    });

    els.btnFav.addEventListener("click", toggleFavorite);
    
    document.getElementById("btn-download").addEventListener("click", () => {
        if(state.currentDesign) downloadCanvas(`${state.currentDesign.name}_${state.currentDesign.id}`);
    });

    document.getElementById("btn-download-svg").addEventListener("click", downloadSVG);

    document.getElementById("btn-download-all").addEventListener("click", downloadAll);
    
    document.getElementById("btn-clear-favorites").addEventListener("click", () => {
        if(confirm("Clear all favorites?")) {
            state.favorites = [];
            localStorage.setItem("cpl_favorites", JSON.stringify([]));
            renderGrids();
            checkFavoriteStatus();
        }
    });

    document.getElementById("btn-copy-seed").addEventListener("click", () => {
        navigator.clipboard.writeText(els.seedInput.value);
        alert("Seed copied to clipboard!");
    });

    document.querySelectorAll(".nav-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
            e.target.classList.add("active");
            
            document.getElementById("tab-generator").classList.add("hidden");
            document.getElementById("tab-gallery").classList.add("hidden");
            document.getElementById("tab-favorites").classList.add("hidden");
            
            document.getElementById("tab-" + e.target.dataset.tab).classList.remove("hidden");
            
            if(e.target.dataset.tab !== "generator") renderGrids();
        });
    });

    renderGrids();
    generateDesign();
}

initApp();
