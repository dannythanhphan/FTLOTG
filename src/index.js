require("babel-polyfill");
import games from '../public/check.json';

document.addEventListener("DOMContentLoaded", () => {
    let margin = { top: 10, right: 30, bottom: 50, left: 60 },
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    const getHighestEarning = (data) => {
        let max = 0;
        for (let i = 0; i < data.length; i++) {
            if (data[i].earnings > max) max = data[i].earnings;
        }
        return max;
    }

    let svg = d3.select("#dataset")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



    const updateChart = (data) => {
        let dataGames = d3
            .nest()
            .key(function (d) {
                console.log(d)
                return d["Year"];
            })
            .entries(data.fighting);

        let filteredData = dataGames[0]["values"];

        let xMax = filteredData.length;
        let x = d3.scaleLinear().domain([0, xMax]).range([0, width]);
        svg
            .append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));
        
        //Add x-axis label:
        svg
            .append("text")
            .attr(
            "transform",
            "translate(" + width / 2 + " ," + (height + margin.top + 30) + ")"
            )
            .style("text-anchor", "middle")
            .text("Adult Literacy");

        
        let yMax = getHighestEarning(filteredData);

        let y = d3.scaleLinear().domain([0, yMax]).range([height, 0]);
        svg.append("g").call(d3.axisLeft(y));
        
        //Add y-axis label:
        svg
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -40)
            .attr("x", 0 - height / 2)
            .style("text-anchor", "middle")
            .text("Poverty Rate");
        
        // Color scale: input a province name, output a color
        let color = d3
            .scaleOrdinal()
            .domain([
            "Balochistan",
            "Federal Capital Territory",
            "Khyber Pakhtunkhwa",
            "Punjab",
            "Sindh",
            ])
            .range(["#440154ff", "#21908dff", "#fde725ff", "#129490", "#CE1483"]);
        
        // JOIN data to elements.
        let circles = svg.selectAll("circle").data(filteredData, function (d) {
            return d["name"];
        });
        
        let xAxis = 0;
        // ENTER new elements present in new data.
        circles
            .enter()
            .append("circle")
            .attr("fill", function (d) {
                return color(d["name"]);
            })
            .attr("cy", function (d) {
                return y(d["earnings"]);
            })
            .attr("cx", function (d) {
                xAxis++
                return x(xAxis);
            })
            .attr("r", 5);
    }
    updateChart(games);
})
