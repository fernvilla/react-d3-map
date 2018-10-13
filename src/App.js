import React from "react";
// import { queue } from "d3-queue";
// import { geo } from "d3-geo";
// import { scale } from "d3-scale";
import * as d3 from "d3";
import * as topojson from "topojson";
import us from "./json/us.json";

import "./App.css";

console.log(us);

class USMap extends React.Component {
  componentDidMount() {
    const { width, height } = this.props;
    let active = d3.select(null);

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
      .attr("d", path)
      .attr("class", "county-boundary")
      .on("click", d => console.log(d));

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
