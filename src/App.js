import React from "react";
// import { queue } from "d3-queue";
// import { geo } from "d3-geo";
// import { scale } from "d3-scale";
import * as d3 from "d3";
// import * as topojson from "topojson";
import states from "./us-states.json";
import "./App.css";

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
    console.log(this.state.selectedState);

    return (
      <div className="map">
        <svg width="960" height="600">
          <USMap
            width={960}
            height={600}
            setSelectedState={this.setSelectedState}
          />
        </svg>
      </div>
    );
  }
}

export default App;
