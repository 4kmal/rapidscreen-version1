"use client"

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface Node extends d3.SimulationNodeDatum {
  name: string;
  count: number;
  picture?: string;
  isUser?: boolean;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: string | Node;
  target: string | Node;
}

const ForceGraph = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/Em-Ant/fcc-course/master/front-end_cert/projects/basic/legacy-camper-news/hot_stories.json')
      .then(res => res.json())
      .then(json => {
        const graph = buildGraph(json);
        setData(graph);
      })
      .catch(err => console.error("Error fetching data:", err));
  }, []);

  const buildGraph = (data: any[]) => {
    const nodes: Node[] = [];
    const links: Link[] = [];
    const urlTest = /^https?:\/\/([\da-z\.-]+)/;

    data.forEach((el: any) => {
      const domainMatch = el.link.match(urlTest);
      if (!domainMatch) return;
      const domain = domainMatch[1];
      const user = el.author.username;

      let userNode = nodes.find(n => n.name === user);
      if (!userNode) {
        userNode = { name: user, count: 1, picture: el.author.picture, isUser: true };
        nodes.push(userNode);
      } else {
        userNode.count++;
      }

      let domainNode = nodes.find(n => n.name === domain);
      if (!domainNode) {
        domainNode = { name: domain, count: 1 };
        nodes.push(domainNode);
      } else {
        domainNode.count++;
      }

      links.push({ source: user, target: domain });
    });

    return { nodes, links };
  };

  useEffect(() => {
    if (!data || !containerRef.current) return;

    // Clear previous SVG
    d3.select(containerRef.current).selectAll("*").remove();

    const width = 800;
    const height = 600;
    const dimFactor = 9;
    const pi4 = 0.7535;

    const svg = d3.select(containerRef.current)
      .append("svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .style("background-color", "transparent")
      .style("border-radius", "8px");

    const simulation = d3.forceSimulation<Node>(data.nodes)
      .force("link", d3.forceLink<Node, Link>(data.links).id(d => d.name).distance(80))
      .force("charge", d3.forceManyBody().strength(-120))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.append("g")
      .attr("class", "links")
      .selectAll<SVGLineElement, Link>("line")
      .data(data.links)
      .enter().append("line") as d3.Selection<SVGLineElement, Link, SVGGElement, unknown>;

    link
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 1.5);

    const node = svg.append("g")
      .attr("class", "nodes")
      .selectAll<SVGGElement, Node>("g")
      .data(data.nodes)
      .enter().append("g") as d3.Selection<SVGGElement, Node, SVGGElement, unknown>;
    
    node.call(d3.drag<SVGGElement, Node>()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended) as any);

    // Domain nodes (circles)
    node.filter(d => !d.isUser)
      .append("circle")
      .attr("r", d => Math.sqrt(50 * d.count))
      .attr("fill", "#6BB9F0")
      .attr("stroke", "#666")
      .attr("stroke-width", 1.5);

    // User nodes (rects)
    node.filter(d => !!d.isUser)
      .append("rect")
      .attr("x", d => -pi4 * dimFactor * Math.sqrt(d.count))
      .attr("y", d => -pi4 * dimFactor * Math.sqrt(d.count))
      .attr("width", d => pi4 * dimFactor * 2 * Math.sqrt(d.count))
      .attr("height", d => pi4 * dimFactor * 2 * Math.sqrt(d.count))
      .attr("fill", "#E74C3C")
      .attr("stroke", "#666")
      .attr("stroke-width", 1.5);

    // Images for users
    node.filter(d => !!d.isUser)
      .append("image")
      .attr("xlink:href", d => d.picture || '')
      .attr("x", -10)
      .attr("y", -10)
      .attr("width", 20)
      .attr("height", 20);

    // Tooltip
    node.on("mouseover", (event, d) => {
      if (tooltipRef.current) {
        tooltipRef.current.style.opacity = "1";
        tooltipRef.current.innerHTML = `
          <p class="font-bold">${d.name}</p>
          <p>posts: ${d.count}</p>
        `;
      }
    })
    .on("mousemove", (event) => {
      if (tooltipRef.current) {
        tooltipRef.current.style.left = (event.pageX + 10) + "px";
        tooltipRef.current.style.top = (event.pageY - 10) + "px";
      }
    })
    .on("mouseout", () => {
      if (tooltipRef.current) {
        tooltipRef.current.style.opacity = "0";
      }
    })
    .on("dblclick", (event, d) => {
      const fccUrl = 'https://www.freecodecamp.com/';
      if (d.isUser) {
        window.open(fccUrl + d.name, '_blank');
      } else {
        window.open('https://' + d.name, '_blank');
      }
    });

    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as Node).x!)
        .attr("y1", d => (d.source as Node).y!)
        .attr("x2", d => (d.target as Node).x!)
        .attr("y2", d => (d.target as Node).y!);

      node
        .attr("transform", d => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // Legend
    const legendPos = { right: 120, bottom: 35 };
    
    const legend = svg.append("g")
      .attr("transform", `translate(${width - legendPos.right}, ${height - legendPos.bottom - 40})`);

    legend.append("circle")
      .attr("cx", 8)
      .attr("cy", 8)
      .attr("r", 8)
      .attr("fill", "#6BB9F0")
      .attr("stroke", "#666");

    legend.append("text")
      .attr("x", 25)
      .attr("y", 12)
      .text("Domain")
      .style("font-size", "14px")
      .style("fill", "#fff");

    legend.append("rect")
      .attr("x", 0)
      .attr("y", 25)
      .attr("width", 16)
      .attr("height", 16)
      .attr("fill", "#E74C3C")
      .attr("stroke", "#666");

    legend.append("text")
      .attr("x", 25)
      .attr("y", 37)
      .text("User")
      .style("font-size", "14px")
      .style("fill", "#fff");

  }, [data]);

  return (
    <div className="relative w-full h-full min-h-[400px]">
      <div id="graph" ref={containerRef} className="w-full h-full" />
      <div
        id="tooltip"
        ref={tooltipRef}
        className="absolute bg-black/80 text-white p-2 rounded pointer-events-none opacity-0 transition-opacity z-[100] text-xs"
        style={{ position: 'fixed' }}
      />
    </div>
  );
};

export default ForceGraph;

