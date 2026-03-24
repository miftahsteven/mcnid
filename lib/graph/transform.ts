import { DirectedGraph } from "graphology";

export interface SnaNode {
  id: string;
  label: string;
  size: number;
  cluster?: number;
}

export interface SnaEdge {
  source: string;
  target: string;
  weight?: number;
}

export interface SnaResponseData {
  nodes: SnaNode[];
  edges: SnaEdge[];
}

const COLORS = [
  "#fbbf24", // Amber (Influencer)
  "#f87171", // Red (Core)
  "#38bdf8", // Sky (Interaction)
  "#818cf8", // Indigo
  "#c084fc", // Purple
  "#4ade80", // Green
  "#f472b6", // Pink
  "#2dd4bf", // Teal
];

export function transformSnaToGraph(data: SnaResponseData): DirectedGraph {
  const graph = new DirectedGraph();

  if (!data?.nodes) return graph;

  // Find max size for normalization
  const maxNodeSize = Math.max(...data.nodes.map(n => n.size || 1), 1);

  data.nodes.forEach((node) => {
    const cluster = node.cluster ?? 0;
    const color = COLORS[cluster % COLORS.length];
    
    // Dramatic reduction in node size to emphasize network structure (Drone Emprit style)
    const normalizedSize = (node.size / maxNodeSize);
    const finalSize = 2 + (normalizedSize * 10); 

    graph.addNode(node.id, {
      label: node.label || node.id,
      size: finalSize,
      color: color,
      labelSize: 10 + (normalizedSize * 12),
      labelColor: "#ffffff",
      forceLabel: normalizedSize > 0.1,
      // Random initial position
      x: Math.random() * 100,
      y: Math.random() * 100,
    });
  });

  data.edges.forEach((edge) => {
    if (graph.hasNode(edge.source) && graph.hasNode(edge.target)) {
      const sourceColor = graph.getNodeAttribute(edge.source, "color");
      const weight = edge.weight || 1;
      
      // Logarithmic scaling for edge thickness
      const edgeSize = 1 + Math.log10(weight) * 3;
      // Opacity increases slightly with weight
      const opacity = Math.min(0.2 + (weight * 0.05), 0.8) * 255;
      const opacityHex = Math.round(opacity).toString(16).padStart(2, '0');

      graph.addEdge(edge.source, edge.target, {
        size: edgeSize,
        color: `${sourceColor}${opacityHex}`, 
        type: "line",
      });
    }
  });

  return graph;
}
