document.addEventListener("DOMContentLoaded", () => {
    // 1. Handle Slider Value Updates
    const sliders = document.querySelectorAll("input[type=range]");

    sliders.forEach(slider => {
        slider.addEventListener("input", (e) => {
            const targetId = e.target.id;
            const suffix = e.target.getAttribute("data-suffix");
            const valueSpan = document.getElementById(`val-${targetId}`);
            
            // Update the text label visually
            valueSpan.innerHTML = `${e.target.value}${suffix}`;

            // Trigger the design generator update
            generateDesigns();
        });
    });

    // 2. Dummy Poster Generator Logic
    // This is where you will add your actual logic to draw shapes, SVGs, or Canvas graphics.
    function generateDesigns() {
        // Grab current values from the sliders
        const density = parseInt(document.getElementById("density").value);
        const amplitude = parseInt(document.getElementById("amplitude").value);
        const chaos = parseInt(document.getElementById("chaos").value);
        const thickness = parseInt(document.getElementById("thickness").value);

        const posters = document.querySelectorAll(".poster canvas");

        posters.forEach((canvas, index) => {
            const ctx = canvas.getContext("2d");
            const width = canvas.width;
            const height = canvas.height;
            
            // Clear previous drawing
            ctx.clearRect(0, 0, width, height);

            // Fill background based on poster index to give them variety
            ctx.fillStyle = index % 2 === 0 ? "#1a1a1a" : "#222222";
            ctx.fillRect(0, 0, width, height);

            // Center of canvas
            const centerX = width / 2;
            const centerY = height / 2;

            // Simple drawing algorithm simulating "Mandala/Abstract" art
            ctx.lineWidth = thickness / 5;
            
            for (let i = 0; i < density; i++) {
                ctx.beginPath();
                
                // Color variation based on sliders and loop
                const hue = (amplitude + (i * chaos/5)) % 360;
                ctx.strokeStyle = `hsl(${hue}, 80%, 50%)`;

                const radius = 20 + (i * (amplitude / 10));
                
                // Draw distorted circles
                for (let angle = 0; angle < Math.PI * 2; angle += 0.2) {
                    const distortion = (Math.random() * (chaos / 10)) - (chaos / 20);
                    const x = centerX + Math.cos(angle) * (radius + distortion);
                    const y = centerY + Math.sin(angle) * (radius + distortion);
                    
                    if (angle === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                ctx.closePath();
                ctx.stroke();
            }
        });
    }

    // Run once on load to draw initial states
    generateDesigns();
});
