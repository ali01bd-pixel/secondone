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

    // 2. Advanced Poster Generator Logic
    function generateDesigns() {
        // Grab current values from the sliders
        const density = parseInt(document.getElementById("density").value);
        const amplitude = parseInt(document.getElementById("amplitude").value);
        const chaos = parseInt(document.getElementById("chaos").value);
        const thickness = parseInt(document.getElementById("thickness").value);

        const posters = document.querySelectorAll(".poster canvas");

        // Define 4 vibrant background gradients and matching contrasting stroke colors
        const palettes = [
            // Poster 1: Deep Purple/Magenta BG with Bright Gold/Yellow lines
            { bg1: "#2b0055", bg2: "#8e1957", strokeHue: 45 }, 
            // Poster 2: Deep Navy/Blue BG with Bright Cyan/Teal lines
            { bg1: "#000c24", bg2: "#004882", strokeHue: 190 }, 
            // Poster 3: Dark Emerald/Green BG with Bright Pink/Coral lines
            { bg1: "#00301c", bg2: "#197645", strokeHue: 340 }, 
            // Poster 4: Dark Crimson/Orange BG with Bright Pale Yellow lines
            { bg1: "#4a0000", bg2: "#a83200", strokeHue: 60 }   
        ];

        posters.forEach((canvas, index) => {
            const ctx = canvas.getContext("2d");
            const width = canvas.width;
            const height = canvas.height;
            
            // Clear previous drawing
            ctx.clearRect(0, 0, width, height);

            // Create and fill the Vibrant Gradient Background
            const gradient = ctx.createLinearGradient(0, 0, 0, height);
            gradient.addColorStop(0, palettes[index].bg1);
            gradient.addColorStop(1, palettes[index].bg2);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            const centerX = width / 2;
            const centerY = height / 2;

            // Set line thickness
            ctx.lineWidth = thickness / 5;
            
            // Draw the shapes
            for (let i = 1; i <= density; i++) {
                ctx.beginPath();
                
                // Set line color: High Lightness (85%) ensures it contrasts well with the dark background
                const hue = (palettes[index].strokeHue + (i * 3)) % 360;
                ctx.strokeStyle = `hsl(${hue}, 100%, 85%)
