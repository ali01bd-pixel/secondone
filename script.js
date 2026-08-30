document.addEventListener("DOMContentLoaded", () => {
    
    let masterSeed = Math.random() * 10000;
    let currentSeed;
    
    function seededRandom() {
        let x = Math.sin(currentSeed++) * 10000;
        return x - Math.floor(x);
    }

    const inputs = document.querySelectorAll("input[type=range], select");

    inputs.forEach(input => {
        input.addEventListener("input", (e) => {
            if (e.target.type === "range") {
                const targetId = e.target.id;
                const suffix = e.target.getAttribute("data-suffix");
                document.getElementById(`val-${targetId}`).innerHTML = `${e.target.value}${suffix}`;
            }
            if (e.target.id === "design-mode") masterSeed = Math.random() * 10000;
            generateDesigns();
        });
    });

    function createBlobPath(ctx, cx, cy, r, c) {
        ctx.beginPath();
        const points = 12;
        for (let i = 0; i <= points; i++) {
            const angle = (i / points) * Math.PI * 2;
            const dist = r + (seededRandom() - 0.5) * c;
            const x = cx + Math.cos(angle) * dist;
            const y = cy + Math.sin(angle) * dist;
            if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.closePath();
    }

    function generateDesigns() {
        const posterCount = parseInt(document.getElementById("poster-count").value);
        const designMode = document.getElementById("design-mode").value;
        const density = parseInt(document.getElementById("density").value);
        const frequency = parseInt(document.getElementById("frequency").value);
        const amplitude = parseInt(document.getElementById("amplitude").value);
        const chaos = parseInt(document.getElementById("chaos").value);
        const thickness = parseInt(document.getElementById("thickness").value);

        document.querySelectorAll(".poster").forEach((el, i) => el.style.display = i < posterCount ? "block" : "none");

        const palettes = [
            { bg1: "#2b0055", bg2: "#8e1957", strokeHue: 45 },
            { bg1: "#000c24", bg2: "#004882", strokeHue: 190 },
            { bg1: "#00301c", bg2: "#197645", strokeHue: 340 },
            { bg1: "#4a0000", bg2: "#a83200", strokeHue: 60 }
        ];

        document.querySelectorAll(".poster canvas").forEach((canvas, index) => {
            if (index >= posterCount) return;

            currentSeed = masterSeed + (index * 9999);
            const uniqueOffset = seededRandom() * 1000;

            const ctx = canvas.getContext("2d");
            const width = canvas.width;
            const height = canvas.height;
            const centerX = width / 2;
            const centerY = height / 2;
            
            ctx.restore();
            ctx.save();
            ctx.clearRect(0, 0, width, height);

            const gradient = ctx.createLinearGradient(0, 0, 0, height);
            gradient.addColorStop(0, palettes[index].bg1);
            gradient.addColorStop(1, palettes[index].bg2);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            ctx.lineWidth = thickness / 5;
            ctx.lineJoin = "round";
            ctx.lineCap = "round";

            // ==========================================
            // NEW COMBO AESTHETICS
            // ==========================================

            if (designMode === "retro-bubble") {
                for (let i = 0; i < density * 1.5; i++) {
                    const x = seededRandom() * width;
                    const y = seededRandom() * height;
                    const r = (amplitude / 3) + (seededRandom() * amplitude);
                    const hue = (palettes[index].strokeHue + seededRandom() * 60) % 360;
                    
                    // Retro misregistered print shadow
                    const offset = chaos / 4;
                    ctx.fillStyle = `hsla(${hue}, 80%, 50%, 0.8)`;
                    ctx.beginPath(); ctx.arc(x - offset, y + offset, r, 0, Math.PI * 2); ctx.fill();
                    
                    // Crisp outline Bubble
                    ctx.strokeStyle = '#fff';
                    ctx.lineWidth = thickness / 3;
                    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke();
                }
            }
            
            else if (designMode === "mandala-sacred") {
                const layers = Math.max(3, Math.floor(density / 2));
                for (let i = 1; i <= layers; i++) {
                    const r = (width * 0.8) * (i / layers) * (amplitude / 100);
                    ctx.strokeStyle = `hsl(${(palettes[index].strokeHue + i * 15) % 360}, 100%, 75%)`;
                    
                    // Symmetrical circle
                    ctx.beginPath(); ctx.arc(centerX, centerY, r, 0, Math.PI * 2); ctx.stroke();
                    
                    // Intersecting sacred geometry polygons
                    const sides = 3 + Math.floor(chaos / 15);
                    if (i % 2 === 0 || chaos > 50) {
                        ctx.beginPath();
                        for (let s = 0; s <= sides; s++) {
                            // Rotate differently per canvas and layer
                            const angle = (s * (Math.PI * 2) / sides) + (uniqueOffset / 10) + (i * 0.2);
                            const px = centerX + r * Math.cos(angle);
                            const py = centerY + r * Math.sin(angle);
                            if (s === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
                        }
                        ctx.stroke();
                    }
                }
            }

            else if (designMode === "y2k-chrome") {
                // 1. Wireframe Globe background
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
                const rings = Math.floor(density / 3) + 3;
                for (let w = 0; w < rings; w++) {
                    ctx.beginPath();
                    ctx.ellipse(centerX, centerY, amplitude + (w * 15), (amplitude / 2) + (chaos * w) + 10, uniqueOffset, 0, Math.PI * 2);
                    ctx.stroke();
                }

                // 2. Chrome Starbursts
                for (let i = 0; i < density; i++) {
                    const x = seededRandom() * width;
                    const y = seededRandom() * height;
                    const size = (amplitude / 3) + seededRandom() * amplitude;
                    
                    // Metallic gradient fill
                    const starGrad = ctx.createRadialGradient(x, y, 0, x, y, size);
                    starGrad.addColorStop(0, '#ffffff');
                    starGrad.addColorStop(0.5, `hsl(${palettes[index].strokeHue}, 20%, 70%)`);
                    starGrad.addColorStop(1, `hsl(${palettes[index].strokeHue}, 50%, 20%)`);
                    
                    ctx.fillStyle = starGrad;
                    ctx.strokeStyle = '#fff';
                    ctx.lineWidth = thickness / 5;
                    
                    ctx.beginPath();
                    for (let s = 0; s < 8; s++) {
                        const angle = s * Math.PI / 4 + uniqueOffset;
                        const dist = (s % 2 === 0) ? size : size / 4;
                        const px = x + Math.cos(angle) * dist;
                        const py = y + Math.sin(angle) * dist;
                        if (s === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
                    }
                    ctx.fill(); ctx.stroke();
                }
            }

            else if (designMode === "floral-mandala") {
                const petals = 6 + Math.floor(chaos / 10);
                for (let i = density; i > 0; i--) {
                    const r = i * (amplitude / 4) + 10;
                    ctx.fillStyle = `hsla(${(palettes[index].strokeHue + i * 20) % 360}, 80%, 60%, 0.6)`;
                    ctx.strokeStyle = `hsl(${(palettes[index].strokeHue + 180) % 360}, 100%, 85%)`; // Complementary outline
                    
                    for (let p = 0; p < petals; p++) {
                        const angle = (p * Math.PI * 2 / petals) + (i * 0.15) + uniqueOffset;
                        const px = centerX + (r * 0.7) * Math.cos(angle);
                        const py = centerY + (r * 0.7) * Math.sin(angle);
                        
                        ctx.beginPath();
                        ctx.ellipse(px, py, r / 1.5, r / 4, angle, 0, Math.PI * 2);
                        ctx.fill(); ctx.stroke();
                    }
                }
            }

            else if (designMode === "memphis-geo") {
                for (let i = 0; i < density * 1.5; i++) {
                    const shapeType = Math.floor(seededRandom() * 4);
                    const x = seededRandom() * width;
                    const y = seededRandom() * height;
                    const size = (amplitude / 4) + seededRandom() * (amplitude / 1.5);
                    
                    ctx.fillStyle = `hsl(${(palettes[index].strokeHue + seededRandom() * 120) % 360}, 90%, 60%)`;
                    ctx.strokeStyle = '#111'; // Heavy dark borders characteristic of Memphis
                    ctx.lineWidth = thickness / 2.5;

                    ctx.save();
                    ctx.translate(x, y);
                    ctx.rotate(seededRandom() * Math.PI * 2); // Random rotation

                    if (shapeType === 0) {
                        // Pill / Capsule
                        ctx.beginPath(); ctx.roundRect(-size, -size/2, size*2, size, size/2); ctx.fill(); ctx.stroke();
                    } else if (shapeType === 1) {
                        // Squiggle
                        ctx.beginPath();
                        for(let sq = 0; sq < 5; sq++){
                            const sx = (sq - 2) * (size / 1.5);
                            const sy = (sq % 2 === 0) ? size/2 : -size/2;
                            if(sq === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
                        }
                        ctx.stroke();
                    } else if (shapeType === 2) {
                        // Sharp Triangle
                        ctx.beginPath();
                        ctx.moveTo(0, -size); ctx.lineTo(size, size); ctx.lineTo(-size, size); ctx.closePath();
                        ctx.fill(); ctx.stroke();
                    } else {
                        // Floating dots
                        ctx.fillStyle = '#111';
                        ctx.beginPath(); ctx.arc(0, 0, thickness, 0, Math.PI*2); ctx.fill();
                    }
                    ctx.restore();
                }
            }

            else if (designMode === "psychedelic") {
                // Saturated lava-lamp blobs
                for (let i = density; i > 0; i--) {
                    // Intense rainbow cycle
                    ctx.fillStyle = `hsl(${(palettes[index].strokeHue + i * (360 / density) + (uniqueOffset * 10)) % 360}, 90%, 55%)`; 
                    const r = i * (amplitude / 3) + 20;
                    
                    ctx.beginPath();
                    const points = 20;
                    for (let p = 0; p <= points; p++) {
                        const angle = p * (Math.PI * 2) / points;
                        // Extreme warping
                        const warp = Math.sin(angle * (chaos / 6) + uniqueOffset) * (chaos * 1.5);
                        const px = centerX + (r + warp) * Math.cos(angle);
                        const py = centerY + (r + warp) * Math.sin(angle);
                        if (p === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
                    }
                    ctx.closePath();
                    ctx.fill();
                    ctx.strokeStyle = 'rgba(0,0,0,0.3)'; // Soft inner shadow border
                    ctx.stroke();
                }
            }
            
            // ==========================================
            // ORIGINAL AESTHETICS (Kept a few classics)
            // ==========================================
            
            else if (designMode === "watercolor") {
                for (let i = 0; i < density * 2; i++) {
                    const x = seededRandom() * width;
                    const y = seededRandom() * height;
                    const r = (amplitude / 4) + (seededRandom() * amplitude / 2);
                    const hue = (palettes[index].strokeHue + (seededRandom() * 50) - 25) % 360;
                    
                    ctx.globalAlpha = 0.4;
                    ctx.fillStyle = `hsl(${hue}, 90%, 65%)`;
                    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
                    ctx.globalAlpha = 0.8;
                    ctx.lineWidth = thickness / 8;
                    ctx.strokeStyle = `hsl(${hue}, 100%, 85%)`;
                    ctx.stroke();
                }
            }
            else if (designMode === "fluid") {
                for (let i = 0; i < density / 2; i++) {
                    const r = (amplitude) + (seededRandom() * 50);
                    const x = centerX + (seededRandom() - 0.5) * chaos * 2;
                    const y = centerY + (seededRandom() - 0.5) * chaos * 2;
                    createBlobPath(ctx, x, y, r, chaos);
                    ctx.fillStyle = `hsla(${(palettes[index].strokeHue + i * 20)%360}, 80%, 60%, 0.5)`;
                    ctx.fill();
                }
            } 
            else if (designMode === "papercut") {
                ctx.shadowColor = 'rgba(0,0,0,0.6)';
                ctx.shadowBlur = 20;
                const layers = Math.max(3, Math.floor(density / 3));
                for (let i = 0; i < layers; i++) {
                    const r = (width * 0.8) - (i * (width * 0.8 / layers));
                    ctx.fillStyle = `hsl(${palettes[index].strokeHue + (i * 15)}, 80%, ${30 + (i * 10)}%)`;
                    createBlobPath(ctx, centerX, centerY, r, chaos + (amplitude / 2));
                    ctx.fill();
                }
                ctx.shadowBlur = 0;
            }
            else {
                // Mixed fallback
                for (let i = 1; i <= density; i++) {
                    ctx.beginPath();
                    const hue = (palettes[index].strokeHue + (i * 3)) % 360;
                    ctx.strokeStyle = `hsl(${hue}, 100%, 85%)`;
                    const radius = 10 + (i * (amplitude / 5));
                    
                    for (let angle = 0; angle <= Math.PI * 2 + 0.1; angle += 0.1) {
                        const distortion = Math.sin(angle * (chaos / 10)) * (chaos / 3);
                        const x = centerX + Math.cos(angle) * (radius + distortion);
                        const y = centerY + Math.sin(angle) * (radius + distortion);
                        if (angle === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                    }
                    ctx.closePath();
                    ctx.stroke();
                }
            }
            
            ctx.restore();
        });
    }

    generateDesigns();
});
