document.addEventListener("DOMContentLoaded", () => {
    const width = 900,
        height = 600,
        maxRadius = (Math.min(width, height) / 2) - 5;
        
    d3.json('../public/check.json').then(function(data) {
        console.log(data);
     })
     .catch(function(error) {
        console.log("error", error);
     });
})
