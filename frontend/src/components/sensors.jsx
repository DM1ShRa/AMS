import React, { useState } from "react";
import { AiOutlineFire, AiOutlineWarning } from "react-icons/ai";
import { Line } from "react-chartjs-2";
import ReactFlow from "reactflow";
import { HoverEffect } from "./ui/cardhover";
import "reactflow/dist/style.css";
import { cn } from "../../lib/util";

import {
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Temperature Data for Chart.js Visualization
const tempData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  datasets: [
    {
      label: "Temperature Readings",
      data: [20, 22, 25, 27, 30, 28, 26],
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      borderColor: "rgba(75, 192, 192, 1)",
      borderWidth: 2,
    },
  ],
};

// Nodes and Edges for Fire Detection Scenario
const fireNodes = [
  {
    id: "1",
    position: { x: 150, y: 0 },
    data: { label: "Fire Detected by Sensor" },
    type: "input",
  },
  {
    id: "2",
    position: { x: 150, y: 100 },
    data: { label: "Alert Sent to Authority" },
  },
  {
    id: "3",
    position: { x: 150, y: 200 },
    data: { label: "Authority Dispatches Response Team" },
  },
  {
    id: "4",
    position: { x: 150, y: 300 },
    data: { label: "Estimated Time: 15 minutes" },
    type: "output",
  },
];

// Nodes and Edges for Gas Leak Detection Scenario
const gasNodes = [
  {
    id: "1",
    position: { x: 150, y: 0 },
    data: { label: "Gas Leak Detected by Sensor" },
    type: "input",
  },
  {
    id: "2",
    position: { x: 150, y: 100 },
    data: { label: "Alert Sent to Authority" },
  },
  {
    id: "3",
    position: { x: 150, y: 200 },
    data: { label: "Authority Dispatches Response Team" },
  },
  {
    id: "4",
    position: { x: 150, y: 300 },
    data: { label: "Estimated Time: 10 minutes" },
    type: "output",
  },
];

// Common edges for both scenarios
const edges = [
  { id: "e1-2", source: "1", target: "2" },
  { id: "e2-3", source: "2", target: "3" },
  { id: "e3-4", source: "3", target: "4" },
];

// Main Component
const Sensors = () => {
  const [selectedScenario, setSelectedScenario] = useState("fire");
  const [selectedNode, setSelectedNode] = useState(null);

  // Handle scenario selection
  const handleScenarioChange = (scenario) => {
    setSelectedScenario(scenario);
    setSelectedNode(null); // Reset node selection on scenario change
  };

  // Handle node click event
  const handleNodeClick = (event, node) => {
    setSelectedNode(node);
  };

  // Function to close the card
  const closeCard = () => {
    setSelectedNode(null);
  };

  // Determine the nodes to display based on the selected scenario
  const nodes = selectedScenario === "fire" ? fireNodes : gasNodes;

  return (
    <>
      <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white py-12 px-6">
        {/* Scenario Selector */}
        <section className="mb-12">
          <h3 className="text-2xl font-semibold mb-4">Test Scenarios</h3>
          <div className="flex space-x-4 mb-6">
            <button
              className={cn(
                "p-4 bg-white rounded-lg shadow-md dark:bg-gray-800",
                { "ring-2 ring-red-500": selectedScenario === "fire" }
              )}
              onClick={() => handleScenarioChange("fire")}
            >
              <AiOutlineFire size={30} className="mx-auto mb-2 text-red-600" />
              Fire Detection
            </button>
            <button
              className={cn(
                "p-4 bg-white rounded-lg shadow-md dark:bg-gray-800",
                { "ring-2 ring-yellow-500": selectedScenario === "gas" }
              )}
              onClick={() => handleScenarioChange("gas")}
            >
              <AiOutlineWarning
                size={30}
                className="mx-auto mb-2 text-yellow-600"
              />
              Gas Leak Detection
            </button>
          </div>

          {/* React Flow Diagram */}
          <h3 className="text-2xl font-semibold mb-4">System Workflow</h3>
          <div className="h-96 bg-white rounded-lg shadow-lg p-4 dark:bg-gray-800">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              fitView
              onNodeClick={handleNodeClick}
            />
          </div>
          <p className="text-sm text-gray-500 mt-4 text-center">
            * Workflow: The selected scenario is processed by sensors, alerts
            are sent, and authorities respond accordingly.
          </p>

          {/* Card to show node information when a node is clicked */}
          {selectedNode && (
            <div className="absolute top-16 right-16 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-[300px]">
              <div className="flex justify-between">
                <h4 className="text-xl font-semibold">
                  {selectedNode.data.label}
                </h4>
                <button onClick={closeCard} className="text-red-500">
                  X
                </button>
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                Information about {selectedNode.data.label}. This node shows the
                details of the current workflow step.
              </p>
            </div>
          )}
        </section>

        {/* Features Section */}
        <section className="mb-12">
          <div className="max-w-5xl mx-auto px-8">
            <HoverEffect items={projects} />
          </div>
        </section>

        {/* Data Visualization */}
        <section className="mt-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-[500px] h-[300px]">
            <h4 className="text-xl font-medium mb-4">Temperature Readings</h4>
            <Line data={tempData} />
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6">
        <div className="container mx-auto text-center">
          <p className="text-sm">
            © 2024 Flowbite. All rights reserved. |
            <a href="#" className="text-primary-400 hover:text-primary-300">
              Privacy Policy
            </a>{" "}
            |
            <a href="#" className="text-primary-400 hover:text-primary-300">
              Terms of Service
            </a>
          </p>
        </div>
      </footer>
    </>
  );
};

// Updated features for HoverEffect component
export const projects = [
  {
    title: "Anomaly Detection",
    description:
      "Detect anomalies in data streams to identify unusual patterns that may indicate critical incidents.",
    link: "#anomaly-detection",
    icon: "maintain",
  },
  {
    title: "Predictive Maintenance",
    description:
      "Utilize sensor data to predict equipment failures and schedule timely maintenance.",
    link: "#predictive-maintenance",
    icon: "maintenance",
  },
  {
    title: "Machine Learning",
    description:
      "Implement machine learning algorithms to improve system performance over time.",
    link: "#machine-learning",
    icon: "ai",
  },
  {
    title: "Sensor Integration",
    description:
      "Integrate various sensors to collect real-time data for comprehensive analysis.",
    link: "#sensor-integration",
    icon: "sensor",
  },
  {
    title: "Data Visualization",
    description:
      "Visualize data using interactive charts and graphs for better insights.",
    link: "#data-visualization",
    icon: "graph",
  },
  {
    title: "Real-time Monitoring",
    description:
      "Monitor systems in real-time to detect and respond to events promptly.",
    link: "#real-time-monitoring",
    icon: "monitoring",
  },
];

export default Sensors;
