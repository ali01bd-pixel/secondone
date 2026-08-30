document.addEventListener("DOMContentLoaded", () => {
    
    // Custom Seeded Random Number Generator
    // This ensures layouts change on load/mode-switch, but stay stable when sliding!
    let masterSeed = Math.random() * 10000;
    let currentSeed = masterSeed;
    
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
            
            // If the user changes the Design Mode, generate a completely new random layout seed!
            if (e.target.id === "design-mode") {
                masterSeed = Math.random() * 10000;
            }
            
            generateDesigns();
        });
    });

    // Helper: Draws an organic wavy blob path
    function createBlobPath(ctx, cx, cy, r, c) {
        ctx.beginPath();
        const points = 12;
        for (let i = 0; i <= points; i++) {
            const angle = (i / points) * Math.PI * 2;
            const dist = r + (seededRandom() - 0.5) * c;
            const x = cx + Math.cos(angle) * dist;
            const y = cy + Math.sin(angle) * dist;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
    }

    // Helper: Draws a perfect hexagon
    function drawHexagon(ctx, x, y, r) {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const hx = x + r * Math.cos(angle);
            const hy = y + r * Math.sin(angle);
            if (i === 0) ctx.moveTo(hx, hy);
            else ctx.lineTo(hx, hy);
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

        // Manage visibility
        document.querySelectorAll(".poster").forEach((el, i) => el.style.display = i < posterCount ? "block" : "none");
        document.querySelectorAll(".accordion").forEach((el, i) => el.style.display = i < posterCount ? "flex" : "none");

        // Vibrant background gradients
        const palettes = [
            { bg1: "#2b0055", bg2: "#8e1957", strokeHue: 45 },
            { bg1: "#000c24", bg2: "#004882", strokeHue: 190 },
            { bg1: "#00301c", bg2: "#197645", strokeHue: 340 },
            { bg1: "#4a0000", bg2: "#a83200", strokeHue: 60 }
        ];

        // Reset the seed at the start of drawing so sliders don't cause chaotic flickering
        currentSeed = masterSeed;

        document.querySelectorAll(".poster canvas").forEach((canvas, index) => {
            if (index >= posterCount) return;

            const ctx = canvas.getContext("2d");
            const width = canvas.width;
            const height = canvas.height;
            const centerX = width / 2;
            const centerY = height / 2;
            
            // Clean slate for every draw
            ctx.restore();
            ctx.save();
            ctx.clearRect(0, 0, width, height);

            // Draw Gradient Background
            const gradient = ctx.createLinearGradient(0, 0, 0, height);
            gradient.addColorStop(0, palettes[index].bg1);
            gradient.addColorStop(1, palettes[index].bg2);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            ctx.lineWidth = thickness / 5;
            ctx.lineJoin = "round";

            // --- DESIGN MODES ---
            
            if (designMode === "watercolor") {
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
            
            else if (designMode === "fluid" || designMode === "blob") {
                for (let i = 0; i < density / 2; i++) {
                    const r = (amplitude) + (seededRandom() * 50);
                    const x = centerX + (seededRandom() - 0.5) * chaos * 2;
                    const y = centerY + (seededRandom() - 0.5) * chaos * 2;
                    createBlobPath(ctx, x, y, r, chaos);
                    
                    if (designMode === "fluid") {
                        ctx.fillStyle = `hsla(${(palettes[index].strokeHue + i * 20)%360}, 80%, 60%, 0.5)`;
                        ctx.fill();
                    } else {
                        ctx.strokeStyle = `hsl(${(palettes[index].strokeHue + i * 15)%360}, 100%, 75%)`;
                        ctx.stroke();
                    }
                }
            } 
            
            else if (designMode === "liquid" || designMode === "mesh") {
                ctx.filter = designMode === "mesh" ? 'blur(40px)' : 'blur(20px)';
                for (let i = 0; i < 5 + (density / 10); i++) {
                    ctx.fillStyle = `hsl(${(palettes[index].strokeHue + seededRandom() * 100) % 360}, 100%, 60%)`;
                    ctx.beginPath();
                    ctx.arc(seededRandom() * width, seededRandom() * height, 50 + seededRandom() * amplitude, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.filter = 'none'; // reset filter
            } 
            
            else if (designMode === "wave") {
                ctx.strokeStyle = `hsl(${palettes[index].strokeHue}, 100%, 80%)`;
                const spacing = Math.max(10, 60 - density);
                for (let y = spacing; y < height; y += spacing) {
                    ctx.beginPath();
                    for (let x = 0; x <= width; x += 10) {
                        const dy = Math.sin((x * (frequency / 200)) + (y / 50) + currentSeed) * (amplitude / 4);
                        if (x === 0) ctx.moveTo(x, y + dy); else ctx.lineTo(x, y + dy);
                    }
                    ctx.stroke();
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
            
            else if (designMode === "bauhaus" || designMode === "geometric") {
                const bauhausColors = ['#E03C31', '#005096', '#FBB034', '#111111', '#EEEEEE'];
                for (let i = 0; i < density; i++) {
                    if (designMode === "bauhaus") {
                        ctx.fillStyle = bauhausColors[Math.floor(seededRandom() * bauhausColors.length)];
                    } else {
                        ctx.fillStyle = `hsla(${(palettes[index].strokeHue + seededRandom()*60)%360}, 80%, 60%, 0.7)`;
                    }
                    const shapeType = Math.floor(seededRandom() * 3);
                    const size = 10 + seededRandom() * amplitude;
                    const bx = seededRandom() * width;
                    const by = seededRandom() * height;
                    
                    ctx.beginPath();
                    if (shapeType === 0) { ctx.arc(bx, by, size, 0, Math.PI * 2); } 
                    else if (shapeType === 1) { ctx.rect(bx, by, size * 1.5, size * 1.5); } 
                    else { ctx.moveTo(bx, by - size); ctx.lineTo(bx + size, by + size); ctx.lineTo(bx - size, by + size); }
                    ctx.fill();
                }
            } 
            
            else if (designMode === "dot" || designMode === "polka" || designMode === "halftone") {
                const spacing = designMode === "polka" ? Math.max(20, 80 - density) : Math.max(10, 50 - density);
                ctx.fillStyle = `hsl(${palettes[index].strokeHue}, 100%, 80%)`;
                
                for (let y = spacing/2; y < height; y += spacing) {
                    for (let x = spacing/2; x < width; x += spacing) {
                        let r = thickness / 4;
                        if (designMode === "polka") r = (amplitude / 10);
                        if (designMode === "halftone") {
                            const dist = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
                            r = Math.max(1, (amplitude / 10) - (dist / (chaos || 1)));
                        }
                        if(r > 0) {
                            ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
                        }
                    }
                }
            } 
            
            else if (designMode === "hexagon") {
                const hexSize = Math.max(10, (amplitude / 5));
                ctx.strokeStyle = `hsl(${palettes[index].strokeHue}, 100%, 70%)`;
                for (let y = 0; y < height + hexSize; y += hexSize * 1.5) {
                    for (let x = 0; x < width + hexSize; x += hexSize * Math.sqrt(3)) {
                        const offset = (Math.round(y / (hexSize * 1.5)) % 2 === 0) ? 0 : (hexSize * Math.sqrt(3)) / 2;
                        drawHexagon(ctx, x + offset, y, hexSize - (density / 10));
                        ctx.stroke();
                    }
                }
            } 
            
            else if (designMode === "spiral") {
                ctx.strokeStyle = `hsl(${palettes[index].strokeHue}, 100%, 75%)`;
                ctx.beginPath();
                for (let i = 0; i < density * 15; i++) {
                    const angle = 0.2 * i;
                    const r = (amplitude / 20) * angle;
                    const x = centerX + r * Math.cos(angle + (chaos / 10));
                    const y = centerY + r * Math.sin(angle + (chaos / 10));
                    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                }
                ctx.stroke();
            }
            
            // Default Fallback (The original Mixed Geometric)
            else {
                for (let i = 1; i <= density; i++) {
                    ctx.beginPath();
                    const hue = (palettes[index].strokeHue + (i * 3)) % 360;
                    ctx.strokeStyle = `hsl(${hue}, 100%, 85%)`;
                    const radius = 10 + (i * (amplitude / 5));
                    
                    if (index === 0) { 
                        for (let angle = 0; angle <= Math.PI * 2 + 0.1; angle += 0.1) {
                            const distortion = Math.sin(angle * (chaos / 10)) * (chaos / 3);
                            const x = centerX + Math.cos(angle) * (radius + distortion);
                            const y = centerY + Math.sin(angle) * (radius + distortion);
                            if (angle === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                        }
                    } else if (index === 1) { 
                        const sides = 3 + Math.floor(chaos / 15); 
                        for (let angle = 0; angle <= Math.PI * 2 + 0.1; angle += (Math.PI * 2 / sides)) {
                            const rotAngle = angle + (i * 0.15); 
                            const x = centerX + Math.cos(rotAngle) * radius;
                            const y = centerY + Math.sin(rotAngle) * radius;
                            if (angle === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                        }
                    } else if (index === 2) { 
                        for (let angle = 0; angle <= Math.PI * 2 + 0.1; angle += 0.1) {
                            const cx = centerX + Math.cos(i * 0.5) * (amplitude / 4);
                            const cy = centerY + Math.sin(i * 0.5) * (amplitude / 4);
                            const distortion = Math.cos(angle * 6) * (chaos / 5);
                            const x = cx + Math.cos(angle) * (radius + distortion);
                            const y = cy + Math.sin(angle) * (radius + distortion);
                            if (angle === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                        }
                    } else { 
                        const spikes = 8 + Math.floor(chaos / 10);
                        for (let angle = 0; angle <= Math.PI * 2 + 0.1; angle += (Math.PI * 2 / spikes)) {
                            const outerX = centerX + Math.cos(angle) * (radius + (amplitude / 2));
                            const outerY = centerY + Math.sin(angle) * (radius + (amplitude / 2));
                            if (angle === 0) ctx.moveTo(outerX, outerY); else ctx.lineTo(outerX, outerY);
                            
                            const innerAngle = angle + (Math.PI / spikes);
                            const innerX = centerX + Math.cos(innerAngle) * (radius * 0.4);
                            const innerY = centerY + Math.sin(innerAngle) * (radius * 0.4);
                            ctx.lineTo(innerX, innerY);
                        }
                    }
                    ctx.closePath();
                    ctx.stroke();
                }
            }
            
            ctx.restore();
        });
    }

    // Run once on initial load
    generateDesigns();
});
