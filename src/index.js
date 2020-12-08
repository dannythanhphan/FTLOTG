require("babel-polyfill");
import data from '../public/check.json';

document.addEventListener("DOMContentLoaded", () => {
    let margin = { top: 10, right: 30, bottom: 50, left: 60 },
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    function getHighestEarning(data) {
        let max = 0;
        let copy = [...data];
        console.log(copy)
        for (let i = 0; i < copy.length; i++) {
            if (copy[i].earnings > max) max = copy[i].earnings;
        }

        return max;
    }

    let svg = d3.select("#dataset")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    
})
