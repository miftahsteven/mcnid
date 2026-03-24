"use client";

import React, { useEffect } from "react";
import { SigmaContainer, useLoadGraph, useSigma } from "@react-sigma/core";
import { useWorkerLayoutForceAtlas2 } from "@react-sigma/layout-forceatlas2";
import { DirectedGraph } from "graphology";
import "@react-sigma/core/lib/style.css";

interface GraphViewProps {
  graph: DirectedGraph;
}

const GraphEvents: React.FC = () => {
  const sigma = useSigma();

  useEffect(() => {
    sigma.on("clickNode", (event) => {
      console.log("Clicked node:", event.node);
    });
  }, [sigma]);

  return null;
};

const LayoutManager: React.FC = () => {
  const { start, stop, kill } = useWorkerLayoutForceAtlas2({
    settings: { 
      gravity: 2, 
      scalingRatio: 200, // Massive scaling for wide clusters
      outboundAttractionDistribution: true,
      adjustSizes: true 
    },
  });

  useEffect(() => {
    start();
    // Keep it running longer for stability
    const timer = setTimeout(() => stop(), 15000);
    return () => {
      clearTimeout(timer);
      kill();
    };
  }, [start, stop, kill]);

  return null;
};

const GraphLoader: React.FC<{ graph: DirectedGraph }> = ({ graph }) => {
  const loadGraph = useLoadGraph();

  useEffect(() => {
    loadGraph(graph);
  }, [graph, loadGraph]);

  return null;
};

export const GraphView: React.FC<GraphViewProps> = ({ graph }) => {
  return (
    <div className="w-full h-full bg-[#020617] relative overflow-hidden rounded-[2.5rem] border border-slate-800 shadow-[0_0_80px_rgba(30,58,138,0.25)]">
      <SigmaContainer
        style={{ height: "100%", width: "100%", background: "#020617" }}
        settings={{
          renderLabels: true,
          labelColor: { color: "#ffffff" },
          labelFont: "Inter, sans-serif",
          labelWeight: "900",
          labelSize: 13,
          labelRenderedSizeThreshold: 5, // Show labels for significant nodes
          defaultNodeColor: "#3b82f6",
          defaultEdgeColor: "#334155",
          edgeProgramClasses: {},
          hideEdgesOnMove: false,
          allowInvalidContainer: true,
          labelDensity: 0.05,
          labelGridCellSize: 128,
        }}
      >
        <GraphLoader graph={graph} />
        <GraphEvents />
        <LayoutManager />
      </SigmaContainer>
      
      {/* Legend / Overlay */}
      <div className="absolute bottom-6 left-6 p-6 bg-[#0f172a]/60 backdrop-blur-xl border border-slate-700/50 rounded-[2rem] text-xs text-slate-300 space-y-3 pointer-events-none shadow-2xl">
        <div className="font-black text-slate-100 uppercase tracking-[0.2em] mb-3 text-[10px]">Network Legend</div>
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff0055] shadow-[0_0_8px_rgba(255,0,85,0.5)]" />
          <span className="font-bold tracking-tight">Main Cluster</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#00ccff] shadow-[0_0_8px_rgba(0,204,255,0.5)]" />
          <span className="font-bold tracking-tight">Intermediary</span>
        </div>
        <div className="pt-2 mt-2 border-t border-slate-800 text-[10px] font-medium text-slate-500 italic">
          Scroll to zoom • Drag to move
        </div>
      </div>
    </div>
  );
};
