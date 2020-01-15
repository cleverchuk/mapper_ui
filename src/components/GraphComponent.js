import React, { useEffect } from 'react'
import * as d3 from "d3";
import {createTooltip} from './GlobalVars'

let margin = {
    top: 20,
    bottom: 50,
    right: 30,
    left: 50
};

let width = 960 - margin.left - margin.right;
let height = 450 - margin.top - margin.bottom;

let layout ={
    forcelyaout:"force_directed",
    hierarchy:"hierarchy"
}


export default function GraphComponent(props){
    const getColorScale = (nodes)=>{
        // find maximum property value
        let max = d3.max(nodes.filter(d => d.type === "comment"), n => {
            return +n[props.lens]
          });
          // find minimum property value
          let min = d3.min(nodes.filter(d => d.type === "comment"), n => {
            return +n[props.lens]
          });
          // Create a color scale with minimum and maximum values
          return d3.scaleLinear().domain([min, max]);            
    }

    const getColorScaleMapper = (nodes)=>{
      // find maximum property value
      let max = d3.max(nodes.filter(d => d.type === "mapper"), n => {
          return +n.value
        });
        // find minimum property value
        let min = d3.min(nodes.filter(d => d.type === "mapper"), n => {
          return +n.value
        });
        // Create a color scale with minimum and maximum values
        return d3.scaleLinear().domain([min, max]);            
  }
    const update_edges = (canvas, links) =>{
        let layer = canvas.select('.edge-layer')
        let edges = layer.selectAll(".link").data(links)
    
        // Exit
        edges.exit().transition().duration(1000)
            .attr("stroke-opacity", 0)
            .attrTween("x1", function (d) {
                return function () {
                    return d.source.x;
                };
            })
            .attrTween("x2", function (d) {
                return function () {
                    return d.target.x;
                };
            })
            .attrTween("y1", function (d) {
                return function () {
                    return d.source.y;
                };
            })
            .attrTween("y2", function (d) {
                return function () {
                    return d.target.y;
                };
            })
            .remove();
    
        // Enter
        edges = edges.enter().append("path")
            .attr("class", "link")
            .merge(edges)
    
        // Update
        edges
            .style("stroke", "#ccc")
            .attr('marker-end', d => "url(#arrow)")
            .style("stroke-width", 5)
    
        return edges
    }
    
    const update_nodes = (canvas, nodes, simulation)=> {
        var sentiment_color = {
            "positive": "#3AE71E",
            "negative": "red",
            "neutral": "skyblue"
        }
        nodes.forEach(n => {
            n.radius = +n.radius
        });
    
        function radiusFunc(node) {
            return Math.PI * Math.pow(node.radius, 2)
        }
        //Drag functions 
        var drag = simulation => {
    
            function dragstarted(d) {
                if (!d3.event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            }
    
            function dragged(d) {
                d.fx = d3.event.x;
                d.fy = d3.event.y;
            }
    
            function dragended(d) {
                if (!d3.event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            }
    
            return d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended);
        }
    
    
        //Add circles to each node
        let layer = canvas.select('.node-layer')
        // Add a class and a unique id for proper update
        let circles = layer.selectAll('.node').data(nodes, d => d.id)
    
        // Exit
        circles.exit()
            .transition().duration(1000)
            .attr('r', 0)
            .remove()
        // Enter
        circles = circles.enter().append('circle')
            .attr('class', 'node')
            .merge(circles)
            .call(drag(simulation))
    
        // Update
        circles
            .attr("r", radiusFunc)
            .attr("id", d => d.id)
            .attr("fill", d => {
              if(d.type === "comment"){
                if(props.isColor) return props.color;

                let scheme = props.colorScheme.scheme;
                return scheme(getColorScale(nodes)(d[props.lens]));

              }else if(d.type === "sentiment"){
                  return sentiment_color[d.name];

              }else if(d.type === "article"){
                  return "black";

              }else if(d.type === "author"){
                  return "orange";
                  
              }else{
                  return "gray";
              }
            });
    

        // Set the title attribute
      
        // circles
        //     .append("title")
        //     .text(d => {
        //         if (d.type === "comment") return d.body
        //         else if (d.type === "article") return d.title
        //         else return d.name
        //     })
        // // Set the text attribute
        // circles
        //     .append('text')
        //     .attr("text-anchor", "middle")
        //     .attr("pointer-events", "none")
        //     .text(d => get_node_text(d))

        return circles
    }
    
    const get_node_text = (node) =>{
        if (node.type === "author") return node["name"]
        else if (node.type === "sentiment") return node["name"]
        else return node.type
    }
    
    const renderGraph = (nodes, links, canvas)=> {
        var tooltip = d3.select("body")
        .append("div")
        .style("border-radius","5px")
        .style("padding","5px")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("background","#000")
        .style("color","#fff")
        .style("visibility", "hidden");
        canvas.select('.y-axis').remove()
        canvas.select('.x-axis').remove()
        
        //set up the simulation and add forces  
        const body_force = d3.forceManyBody()
            .strength(-500)
        
        const link_force = d3.forceLink(links);
        link_force.distance(250)
        
        const simulation = d3.forceSimulation(nodes)
            .force("link", link_force)
            .force("charge", body_force)
            .force("center", d3.forceCenter(width / 2, height / 2));
        //add tick instructions: 
        simulation.on("tick", tick);
        
        //render edges
        links = update_edges(canvas, links)
        
        // render nodes
        nodes = update_nodes(canvas, nodes, simulation)
        
        nodes.selectAll("circle")
        .on("mouseover", function(d){tooltip.html(createTooltip(d)); return tooltip.style("visibility", "visible");})
        .on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
        .on("mouseout", function(){return tooltip.style("visibility", "hidden");});
        
        function tick() {
            links.attr("d", linkArc);
            nodes.attr("transform", transform);
        }
        
        function linkArc(d) {
        
            var diffX = d.target.x - d.source.x;
            var diffY = d.target.y - d.source.y;
        
            // Length of path from center of source node to center of target node
            var pathLength = Math.sqrt((diffX * diffX) + (diffY * diffY));
        
            // x and y distances from center to outside edge of target node
            var offsetX = (diffX * d.target.radius) / pathLength;
            var offsetY = (diffY * d.target.radius) / pathLength;
        
            return "M" + d.source.x + "," + d.source.y + "L" + (d.target.x - offsetX) + "," + (d.target.y - offsetY)
        
        }
        
        function transform(d) { 
            return "translate(" + d.x + "," + d.y + ")";
        }
    }
      
    const renderScatterPlot = (nodes, canvas, lens) =>{
        canvas.select('.y-axis').remove()
        canvas.select('.x-axis').remove()
        nodes = nodes.filter(n => n.type === "comment")
        // find maximum property value
        let max = d3.max(nodes.filter(d => d.type === "comment"), n => {
          return +n[lens]
        })
        // find minimum property value
        let min = d3.min(nodes.filter(d => d.type === "comment"), n => {
          return +n[lens]
        })
      
        // Convert timestamp to date objects
        nodes.forEach(element => {
          let d = new Date(1970, 0, 1)
          d.setSeconds(+element['timestamp'])
          element['timestamp'] = d
        });
      
      
        // Create a color scale with minimum and maximum values
        let color_scale = d3.scaleLinear()
          .range([0, 1])
          .domain([min, max])
      
        // Create X scale
        let xscale = d3.scaleTime()
          .domain(d3.extent(nodes, d => d.timestamp))
          .range([0, width]);
      
        // Add scales to x axis
        var x_axis = d3.axisBottom()
          .scale(xscale);
      
        //Append x axis
        canvas.append("g")
          .attr('class', 'x-axis')
          .attr('transform', 'translate(0,' + (height + 10) + ')')
          .call(x_axis)
        canvas
          .append("text")
          .attr("class", "label")
          .attr("x", width / 2)
          .attr("y", height)
          .attr("dy", "5em")
          .style("text-anchor", "end")
          .text("Time");
      
        // Create Y scale
        var yscale = d3.scaleLinear()
          .domain([min, max])
          .range([height, min * 0.5]);
      
        // Add scales to axis
        var y_axis = d3.axisLeft()
          .scale(yscale);
      
        //Append group and insert axis
        canvas.append("g")
          .attr('class', 'y-axis')
          .call(y_axis)
        canvas
          .append("text")
          .attr("class", "label")
          .attr("transform", "rotate(-90)")
          .attr("y", height / 2)
          .attr("dx", "-10em")
          .attr("dy", "-18em")
          .style("text-anchor", "end")
          .text(lens);
      
        // Update selection
        const update = canvas.selectAll("rect")
          .data(nodes)
        update
          .attr("x", d => xscale(+d.timestamp))
          .attr("y", d => yscale(+d[lens]))
      
        // Enter selection
        const enter = update.enter()
        enter.append("rect")
          .attr("x", d => xscale(+d.timestamp))
          .attr("y", d => yscale(+d[lens]))
          .attr("height", 20)
          .attr("width", d => d.radius)
          .attr("fill", d => "orange")
          .on("mouseover", handle_mouse_over)
          .on("mouseout", handle_mouse_out);
      
        // Exit selection
        update.exit()
          .remove()
      
    }
      
    const renderTree = (root, canvas, lens) =>{
        let get_tree = function (data) {
          const root = d3.hierarchy(data).sort((a, b) => (a.height - b.height) || a.data.type.localeCompare(b.data.type));
          root.dx = 10;
          root.dy = width / (root.height + 1);
          return d3.cluster().nodeSize([root.dx, root.dy])(root);
        }
      
        // Create hierarchy
        root = get_tree(root)
        // find maximum property value
        let maximum = -Infinity
        // find minimum property value
        let minimum = Infinity
        // Calculate bounding box dimensions
        let x0 = Infinity;
        let x1 = -x0;
            
        root.each(d => {
          if (d.x > x1) x1 = d.x;
          if (d.x < x0) x0 = d.x;
          if (typeof (d.data.value) !== "string") {
            if (maximum < d.data.value) maximum = d.data.value
            if (minimum > d.data.value) minimum = d.data.value
          } else {
            if (maximum < d.data[lens]) maximum = d.data[lens]
            if (minimum > d.data[lens]) minimum = d.data[lens]
          }
        });
        // Create a color scale with minimum and maximum values
        let color_scale = d3.scaleLinear()
          .range([0, 1])
          .domain([minimum, maximum])
      
        canvas.attr("viewBox", [0, 0, width, x1 - x0 + root.dx * 2]);
        canvas.attr("transform", `translate(${root.dy / 3},${root.dx - x0})`);
      
        // Bind data to the UI
        let nodeLayer = canvas.select(".node-layer")
        let node = nodeLayer.attr("stroke-linejoin", "round")
          .attr("stroke-width", 3)
          .selectAll("g")
          .data(root.descendants().reverse())
          .join("g")
          .attr("transform", d => `translate(${d.y},${d.x})`);
          
        var tooltip = d3.select("body")
          .append("div")
          .style("border-radius","5px")
          .style("padding","5px")
          .style("position", "absolute")
          .style("z-index", "10")
          .style("background","#000")
          .style("color","#fff")
          .style("visibility", "hidden");

        node.append("circle")
          .attr("fill", d => {
            let scheme = props.colorScheme.scheme;
            const nodes = [];
            root.each(node => nodes.push(node.data));

            if(d.data.type === "comment"){
              if(props.isColor) return props.color;
              return scheme(getColorScale(nodes)(d.data[props.lens]));

            }else if(d.data.type === "mapper"){
              if(props.isColor) return props.color;
              return scheme(getColorScaleMapper(nodes)(d.data.value))
            }
            
            else{
                return "gray";
            }
          })
          .attr("r", d => 1.5*d.data.radius)
          .on("mouseover", function(d){tooltip.html(createTooltip(d.data)); return tooltip.style("visibility", "visible");})
          .on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
          .on("mouseout", function(){return tooltip.style("visibility", "hidden");});
      
        // node.append("title")
        //   .attr("dy", "0.31em")
        //   .attr("x", d => d.children ? -6 : 6)
        //   .text(d => {
        //     if (d.data.body) return d.data.body
        //     return d.data.type
        //   })
        //   .filter(d => d.children)
        //   .attr("text-anchor", "end")
        //   .clone(true).lower()
        //   .attr("stroke", "white");
      
        let edgeLayer = canvas.select(".edge-layer")
        edgeLayer.attr("fill", "none")
          .attr("stroke", "#555")
          .attr("stroke-opacity", 0.4)
          .attr("stroke-width", 1.5)
          .selectAll("path")
          .data(root.links())
          .join("path")
          .attr("d", d => `
            M${d.target.y},${d.target.x}
            C${d.source.y + root.dy / 2},${d.target.x}
             ${d.source.y + root.dy / 2},${d.source.x}
             ${d.source.y},${d.source.x}
          `);
    }
      
    const handle_mouse_over = (d, i)=> {
        let composition = d.composition
        let nodes = d3.select(".graph")
          .select("svg")
          .select(".node-layer")
          .selectAll(".node")
      
        d3.select(".graph")
          .select("svg")
          .select(".edge-layer")
          .attr('opacity', 0)
      
        nodes.attr("opacity", function (data) {
          if (typeof (composition[data.id]) === "undefined")
            return 0
        })
    }
      
    const handle_mouse_out = (d, i) => {
        let composition = d.composition
        let nodes = d3.select(".graph")
          .select("svg")
          .select(".node-layer")
          .selectAll(".node")
      
        d3.select(".graph")
          .select("svg")
          .select(".edge-layer")
          .attr('opacity', 1)
      
        nodes.attr("opacity", function (data) {
          if (typeof (composition[data.id]) === "undefined")
            return 1
        })
    }

    useEffect(()=>{
        let grapharea = d3.select(`.${props.name}`)
                .classed("svg-content-responsive", true)
                .attr("preserveAspectRatio", "xMinYMin meet")
                .attr("viewBox", "0 0 " + (height + margin.top + margin.bottom) + " " + (width + margin.left + margin.right))



        let main_canvas = grapharea.select('.canvas')
        // Zoom functions 
        const zoomed =() =>{
            main_canvas.attr("transform", d3.event.transform)
        }
        grapharea.call(d3.zoom().on("zoom", zoomed))

        // main_canvas.append("defs").append("marker")
        //     .attr("id", "arrow")
        //     .attr("viewBox", "0 -5 10 10")
        //     .attr('refX', 8)
        //     .attr('refY', 0)
        //     .attr("markerWidth", 6)
        //     .attr("markerHeight", 6)
        //     .attr("orient", "auto")
        //     .append("path")
        //     .attr("d", "M0,-5L10,0L0,5");
        if(props.layout === layout.forcelyaout){
            let nodes  = props.data.nodes, links = props.data.links;
            if(nodes && links){                
                console.log("Calling renderGraph")
                main_canvas.select('.edge-layer').selectAll('path').remove();
                main_canvas.select('.node-layer').selectAll('circle').remove();
                renderGraph(nodes, links, main_canvas)
            }
        }else if(props.layout === layout.hierarchy){
            let root = props.data;
            if(root){              
                console.log("Calling renderTree")                
                main_canvas.select('.edge-layer').selectAll('.link').remove();
                main_canvas.select('.node-layer').selectAll('circle').remove();
                renderTree(root, main_canvas, props.lens);
            }
        }

    });

    const style = {
        width:"100%",
        height:"100%",
        border:'2px solid black',
        marginRight:'2px',
    }
    return(
        <svg style={style} className={props.name} >
            <g className={"canvas"}>
                <g className={'edge-layer'}></g>
                <g className={'node-layer'}></g>
            </g>
        </svg>
    );
    
}

