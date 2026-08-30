document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Setup Event Listeners for Sliders AND Dropdowns
    const inputs = document.querySelectorAll("input[type=range], select");

    inputs.forEach(input => {
        input.addEventListener("input", (e) => {
            // If it's a slider, update its visual number label
            if (e.target.type === "range") {
                const targetId = e.target.id;
                const suffix = e.target.getAttribute("data-suffix");
                const valueSpan = document.getElementById(`val-${targetId}`);
                valueSpan.innerHTML = `${e.target.value}${suffix}`;
            }
            
            // Trigger the design generator update whenever ANYTHING changes
            generateDesigns();
        });
    });

    // 2. Advanced Poster Generator Logic
    function generateDesigns() {
        // Grab current values from the UI
        const posterCount = parseInt(document.getElementById("poster-count").value);
        const designMode = document.getElementById("design-mode").value;
        
        const density = parseInt(document.getElementById("density").value);
        const amplitude = parseInt(document.getElementById("amplitude").value);
        const chaos = parseInt(document.getElementById("chaos").value);
        const thickness = parseInt(document.getElementById("thickness").value);

        // Manage visibility of posters and accordions based on selected number
        const posterDivs = document.querySelectorAll(".poster");
        const accordions = document.querySelectorAll(".accordion");
        
        posterDivs.forEach((poster, index) => {
            if (index < posterCount) {
                poster.style.display = "block";
                accordions[index].style.display = "flex";
            } else {
                poster.style.display = "none";
                accordions[index].style.display = "none";
            }
        });

        // Vibrant background gradients and matching contrasting stroke colors
        const palettes = [
            { bg1: "#2b0055", bg2: "#8e1957", strokeHue: 45 },  // Poster 1: Purple/Magenta -> Gold
            { bg1: "#000c24", bg2: "#004882", strokeHue: 190 }, // Poster 2: Navy/Blue -> Cyan
            { bg1: "#00301c", bg2: "#197645", strokeHue: 340 }, // Poster 3: Emerald -> Pink
            { bg1: "#4a0000", bg2: "#a83200", strokeHue: 60 }   // Poster 4: Crimson -> Pale Yellow
        ];

        const canvases = document.querySelectorAll(".poster canvas");

        canvases.forEach((canvas, index) => {
            // Skip drawing if this poster is currently hidden
            if (index >= posterCount) return;

            const ctx = canvas.getContext("2d");
            const width = canvas.width;
            const height = canvas.height;
            
            // Draw Gradient Background
            ctx.clearRect(0, 0, width, height);
            const gradient = ctx.createLinearGradient(0, 0, 0, height);
            gradient.addColorStop(0, palettes[index].bg1);
            gradient.addColorStop(1, palettes[index].bg2);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            const centerX = width / 2;
            const centerY = height / 2;

            // ==========================================
            // MODE 1: WATERCOLOR BUBBLES
            // ==========================================
            if (designMode === "watercolor") {
                const numBubbles = density * 2; // Density controls amount of bubbles
                
                for (let i = 0; i < numBubbles; i++) {
                    let x, y;
                    
                    // 4 Different Layouts for the 4 Canvases
                    if (index === 0) {
                        // Layout 1: Centered Cluster
                        x = centerX + (Math.random() - 0.5) * chaos * 3;
                        y = centerY + (Math.random() - 0.5) * chaos * 3;
                    } else if (index === 1) {
                        // Layout 2: Floating Upwards
                        x = centerX + (Math.random() - 0.5) * width;
                        y = height - (Math.random() * (chaos * 4)) - (i * (400/numBubbles));
                    } else if (index === 2) {
                        // Layout 3: Diagonal Flow
                        const diag = (Math.random() * width) + 50;
                        x = diag + (Math.random() - 0.5) * chaos * 1.5;
                        y = (height - diag) + (Math.random() - 0.5) * chaos * 1.5;
                    } else {
                        // Layout 4: Total Random Scatter
                        x = Math.random() * width;
                        y = Math.random() * height;
                    }

                    // Amplitude controls bubble size
                    const r = (amplitude / 4) + (Math.random() * amplitude / 2);
                    
                    // Slight color variation per bubble
                    const hue = (palettes[index].strokeHue + (Math.random() * 50) - 25) % 360;
                    
                    // Draw semi-transparent watercolor fill
                    ctx.globalAlpha = 0.4;
                    ctx.fillStyle = `hsl(${hue}, 90%, 65%)`;
                    ctx.beginPath();
                    ctx.arc(x, y, r, 0, Math.PI * 2);
                    ctx.fill();

                    // Draw crisp bubble edge outline
                    ctx.globalAlpha = 0.8;
                    ctx.lineWidth = thickness / 8;
                    ctx.strokeStyle = `hsl(${hue}, 100%, 85%)`;
                    ctx.stroke();
                }
                
                // Reset alpha for the next render loop
                ctx.globalAlpha = 1.0; 
            } 
            
            // ==========================================
            // MODE 2: MIXED GEOMETRIC (Default)
            // ==========================================
            else {
                ctx.lineWidth = thickness / 5;
                
                for (let i = 1; i <= density; i++) {
                    ctx.beginPath();
                    const hue = (palettes[index].strokeHue + (i * 3)) % 360;
                    ctx.strokeStyle = `hsl(${hue}, 100%, 85%)`;
                    const radius = 10 + (i * (amplitude / 5));
                    
                    if (index === 0) { // Wavy Mandala
                        for (let angle = 0; angle <= Math.PI * 2 + 0.1; angle += 0.1) {
                            const distortion = Math.sin(angle * (chaos / 10)) * (chaos / 3);
                            const x = centerX + Math.cos(angle) * (radius + distortion);
                            const y = centerY + Math.sin(angle) * (radius + distortion);
                            if (angle === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                        }
                    } else if (index === 1) { // Rotating Polygons
                        const sides = 3 + Math.floor(chaos / 15); 
                        for (let angle = 0; angle <= Math.PI * 2 + 0.1; angle += (Math.PI * 2 / sides)) {
                            const rotAngle = angle + (i * 0.15); 
                            const x = centerX + Math.cos(rotAngle) * radius;
                            const y = centerY + Math.sin(rotAngle) * radius;
                            if (angle === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                        }
                    } else if (index === 2) { // Off-center Spirals
                        for (let angle = 0; angle <= Math.PI * 2 + 0.1; angle += 0.1) {
                            const cx = centerX + Math.cos(i * 0.5) * (amplitude / 4);
                            const cy = centerY + Math.sin(i * 0.5) * (amplitude / 4);
                            const distortion = Math.cos(angle * 6) * (chaos / 5);
                            const x = cx + Math.cos(angle) * (radius + distortion);
                            const y = cy + Math.sin(angle) * (radius + distortion);
                            if (angle === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                        }
                    } else { // Dynamic Starburst
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
        });
    }

    // Run once on load
    generateDesigns();
});
