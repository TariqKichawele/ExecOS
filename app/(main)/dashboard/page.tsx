import RunAgentButton from "@/components/agents/run-agent-button";
import React from "react";

const Dashboard = () => {
  return (
    <div className="page-wrapper">
      <div>
        <h1 className="page-title">Dashboard</h1>
        <p className="page-description">
          Welcome back! Here is what is happening with your AI Agents.
        </p>
        <RunAgentButton />
      </div>
    </div>
  );
};

export default Dashboard;
