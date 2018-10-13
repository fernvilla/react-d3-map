import React from "react";
// import { queue } from "d3-queue";
import { geo } from "d3-geo";
// import { scale } from "d3-scale";
import * as d3 from "d3";
import * as topojson from "topojson";
import states from "./json/us-states.json";
import california from "./json/states/ca.json";
import test from "./json/test.json";
import test2 from "./json/test2.json";
import "./App.css";

console.log(states);
console.log(test2);

class USCounty extends React.Component {
  componentDidMount() {
    const svg = d3.select(this.anchor);
    const { width, height, selectedState, setSelectedState } = this.props;
    const projection = d3
      .geoAlbersUsa()
      .scale(1280)
      .translate([width / 2, height / 2]);
    // const projection = d3
    //   .geoMercator()
    //   .center([-120, 37])
    //   .translate([width / 2, height / 2])
    //   .scale([width * 3.3]);
    const path = d3.geoPath(projection);

    const state = states.features.filter(
      s => s.properties.name === selectedState
    );

    // var states = topojson.feature(test2, test2.objects.states),
    //   state = states.features.filter(function(d) {
    //     return d.id === 6;
    //   })[0];

    console.log(states, state);

    svg
      .selectAll("path")
      .data(state)
      .enter()
      .append("path")
      .attr("d", path)
      .style("stroke", "#fff")
      .style("stroke-width", "1")
      .style("fill", "#00b9ad")
      .on("click", d => setSelectedState(d.properties.name));
  }

  render() {
    return <g ref={anchor => (this.anchor = anchor)} />;
  }
}

// class USMap extends React.Component {
//   componentDidMount() {
//     const svg = d3.select(this.anchor);
//     const { width, height, setSelectedState } = this.props;
//     const projection = d3
//       .geoAlbersUsa()
//       .scale(1280)
//       .translate([width / 2, height / 2]);
//     const path = d3.geoPath(projection);

//     svg
//       .selectAll("path")
//       .data(states.features)
//       .enter()
//       .append("path")
//       .attr("d", path)
//       .style("stroke", "#fff")
//       .style("stroke-width", "1")
//       .style("fill", "#00b9ad")
//       .on("click", d => setSelectedState(d.properties.name));
//   }

//   render() {
//     return <g ref={anchor => (this.anchor = anchor)} />;
//   }
// }

class USMap extends React.Component {
  componentDidMount() {
    var width = 960,
      height = 500,
      active = d3.select(null);

    var projection = d3
      .geoAlbersUsa()
      .scale(1000)
      .translate([width / 2, height / 2]);

    var path = d3.geoPath(projection).projection(projection);

    var svg = d3
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

    var g = svg.append("g").style("stroke-width", "1.5px");

    g.selectAll("path")
      .data(topojson.feature(test2, test2.objects.states).features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("class", "feature")
      .on("click", clicked);

    g.append("path")
      .datum(
        topojson.mesh(test2, test2.objects.states, function(a, b) {
          return a !== b;
        })
      )
      .attr("class", "mesh")
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
  state = {
    selectedState: null
  };

  setSelectedState = state => {
    console.log(state);

    this.setState(prevState => ({
      selectedState: prevState.selectedState === state ? null : state
    }));
  };

  render() {
    const { selectedState } = this.state;

    return (
      <div className="map">
        <svg width="960" height="600">
          {selectedState ? (
            <USCounty
              width={960}
              height={600}
              selectedState={selectedState}
              setSelectedState={this.setSelectedState}
            />
          ) : (
            <USMap
              width={960}
              height={600}
              setSelectedState={this.setSelectedState}
            />
          )}
        </svg>

        {/*{selectedState && (
          <button onClick={() => this.setSelectedState(null)}>Back</button>
        )}*/}
      </div>
    );
  }
}

export default App;
