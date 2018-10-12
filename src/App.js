import React from "react";
// import { queue } from "d3-queue";
// import { geo } from "d3-geo";
// import { scale } from "d3-scale";
import * as d3 from "d3";
import * as topojson from "topojson";
import states from "./json/us-states.json";
import california from "./json/states/ca.json";
import test from "./json/test.json";
import test2 from "./json/test2.json";
import "./App.css";

console.log(states);
console.log(california);

class USCounty extends React.Component {
  componentDidMount() {
    const svg = d3.select(this.anchor);
    const { width, height, selectedState } = this.props;
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
      .on("click", d => console.log(d));
  }

  render() {
    return <g ref={anchor => (this.anchor = anchor)} />;
  }
}

class USMap extends React.Component {
  componentDidMount() {
    const svg = d3.select(this.anchor);
    const { width, height, setSelectedState } = this.props;
    const projection = d3
      .geoAlbersUsa()
      .scale(1280)
      .translate([width / 2, height / 2]);
    const path = d3.geoPath(projection);

    svg
      .selectAll("path")
      .data(states.features)
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

class App extends React.Component {
  state = {
    selectedState: null
  };

  setSelectedState = state => {
    this.setState({ selectedState: state });
  };

  render() {
    const { selectedState } = this.state;
    console.log(selectedState);

    return (
      <div className="map">
        <svg width="960" height="600">
          {selectedState ? (
            <USCounty width={960} height={600} selectedState={selectedState} />
          ) : (
            <USMap
              width={960}
              height={600}
              setSelectedState={this.setSelectedState}
            />
          )}
        </svg>

        <button onClick={() => this.setSelectedState(null)}>Back</button>
      </div>
    );
  }
}

export default App;
