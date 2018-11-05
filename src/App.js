import React from "react";
import * as d3 from "d3";
import * as topojson from "topojson";
import us from "./json/us.json";
import { data as dataJson } from "./data.js";

import "./App.css";

class USMap extends React.Component {
  componentDidMount() {
    const { width, height } = this.props;
    let active = d3.select(null);
    let data = new Map(dataJson.map(d => [d.id, d.rate]));

    var color_domain = [
      500,
      1000,
      1500,
      2000,
      2500,
      3000,
      3500,
      4000,
      4500,
      5000,
      5500,
      6000
    ];
    var ext_color_domain = [
      0,
      500,
      1000,
      1500,
      2000,
      2500,
      3000,
      3500,
      4000,
      4500,
      5000,
      5500,
      6000
    ];
    var legend_labels = [
      "< 500",
      "500+",
      "1000+",
      "1500+",
      "2000+",
      "2500+",
      "3000+",
      "3500+",
      "4000+",
      "4500+",
      "5000+",
      "5500+",
      "6000+"
    ];
    var color = d3
      .scaleThreshold()
      .domain(color_domain)
      .range([
        "#dcdcdc",
        "#d0d6cd",
        "#bdc9be",
        "#aabdaf",
        "#97b0a0",
        "#84a491",
        "#719782",
        "#5e8b73",
        "#4b7e64",
        "#387255",
        "#256546",
        "#125937",
        "#004d28"
      ]);

    const projection = d3
      .geoAlbersUsa()
      .scale(1000)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath(projection).projection(projection);

    const svg = d3
      .select(this.anchor)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    svg
      .append("rect")
      .attr("class", "background")
      .attr("width", width)
      .attr("height", height)
      .on("click", reset);

    const g = svg.append("g").style("stroke-width", "1.5px");

    g.append("g")
      .attr("id", "counties")
      .selectAll("path")
      .data(topojson.feature(us, us.objects.counties).features)
      .enter()
      .append("path")
      .attr("fill", d => color(data.get(d.id)))
      .attr("d", path)
      .attr("class", "county-boundary")
      .on("click", d => {
        const selectedCounty = dataJson.filter(data => data.id === d.id);
        console.log(selectedCounty[0]);
      });

    g.append("g")
      .attr("id", "states")
      .selectAll("path")
      .data(topojson.feature(us, us.objects.states).features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("class", "state")
      .on("click", clicked);

    g.append("path")
      .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
      .attr("class", "state-borders")
      .attr("d", path);

    function clicked(d) {
      if (active.node() === this) return reset();

      active.classed("active", false);
      active = d3.select(this).classed("active", true);

      var bounds = path.bounds(d),
        dx = bounds[1][0] - bounds[0][0],
        dy = bounds[1][1] - bounds[0][1],
        x = (bounds[0][0] + bounds[1][0]) / 2,
        y = (bounds[0][1] + bounds[1][1]) / 2,
        scale = 0.9 / Math.max(dx / width, dy / height),
        translate = [width / 2 - scale * x, height / 2 - scale * y];

      g.transition()
        .duration(750)
        .style("stroke-width", 1.5 / scale + "px")
        .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
    }

    function reset() {
      active.classed("active", false);
      active = d3.select(null);

      g.transition()
        .duration(750)
        .style("stroke-width", "1.5px")
        .attr("transform", "");
    }

    var legend = svg
      .selectAll("g.legend")
      .data(ext_color_domain)
      .enter()
      .append("g")
      .attr("class", "legend");

    var ls_w = 73,
      ls_h = 10;

    legend
      .append("rect")
      .attr("x", (d, i) => width - i * ls_w - ls_w)
      .attr("y", 570)
      .attr("width", ls_w)
      .attr("height", ls_h)
      .style("fill", (d, i) => color(d))
      .style("opacity", 0.8);

    legend
      .append("text")
      .attr("x", (d, i) => width - i * ls_w - ls_w)
      .attr("y", 600)
      .text((d, i) => legend_labels[i]);

    const legend_title = "Number of stuffs";

    svg
      .append("text")
      .attr("x", 10)
      .attr("y", 560)
      .attr("class", "legend_title")
      .text(() => legend_title);
  }

  render() {
    return <g ref={anchor => (this.anchor = anchor)} />;
  }
}

class App extends React.Component {
  render() {
    return (
      <div className="map">
        <svg width="960" height="600">
          <USMap width={960} height={600} />
        </svg>
      </div>
    );
  }
}

export default App;
