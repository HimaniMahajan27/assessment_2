import { useState, useCallback, useEffect } from 'react';
import { ReactFlowProvider, useNodesState, useEdgesState } from 'reactflow';

import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import WorkflowCanvas from './components/canvas/WorkflowCanvas';
import NodeDetailsPanel from './components/panels/NodeDetailsPanel';
import SandboxPanel from './components/panels/SandboxPanel';

import { sampleNodes, sampleEdges } from './data/sampleWorkflow';
import { getAutomations, simulate } from './lib/mockApi';
import { validateWorkflow } from './lib/validation';
import { serializeWorkflow, workflowToDisplayJSON } from './lib/serialization';

import type {
  WorkflowNode,
  WorkflowNodeData,
  AutomationAction,
  ValidationResult,
  SimulationResult,
} from './types/workflow';

function WorkflowApp() {
  const [nodes, setNodes, onNodesChange] = useNodesState<WorkflowNodeData>(sampleNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(sampleEdges);

  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [automations, setAutomations] = useState<AutomationAction[]>([]);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [sandboxTab, setSandboxTab] = useState<'log' | 'validation'>('log');
  const [sandboxCollapsed, setSandboxCollapsed] = useState(false);

  useEffect(() => {
    getAutomations().then(setAutomations);
  }, []);

  // Keep selected node in sync when nodes state changes
  useEffect(() => {
    if (!selectedNode) return;
    const updated = nodes.find((n) => n.id === selectedNode.id);
    if (updated) setSelectedNode(updated as WorkflowNode);
    else setSelectedNode(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes]);

  const handleNodeClick = useCallback((node: WorkflowNode) => {
    setSelectedNode(node);
  }, []);

  const handlePaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const handleUpdateNode = useCallback(
    (id: string, data: WorkflowNodeData) => {
      setNodes((nds) => nds.map((n) => (n.id === id ? { ...n, data } : n)));
    },
    [setNodes]
  );

  const handleDeleteNode = useCallback(
    (id: string) => {
      setNodes((nds) => nds.filter((n) => n.id !== id));
      setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
      setSelectedNode(null);
    },
    [setNodes, setEdges]
  );

  const handleValidate = useCallback(() => {
    const result = validateWorkflow(nodes as WorkflowNode[], edges);
    setValidationResult(result);
    setSandboxTab('validation');
    setSandboxCollapsed(false);
  }, [nodes, edges]);

  const handleTest = useCallback(async () => {
    const valResult = validateWorkflow(nodes as WorkflowNode[], edges);
    setValidationResult(valResult);

    if (!valResult.valid) {
      setSandboxTab('validation');
      setSandboxCollapsed(false);
      return;
    }

    setIsSimulating(true);
    setSandboxTab('log');
    setSandboxCollapsed(false);

    const workflow = serializeWorkflow(nodes as WorkflowNode[], edges);
    const result = await simulate(workflow);
    setSimulationResult(result);
    setIsSimulating(false);
  }, [nodes, edges]);

  const handleExport = useCallback(() => {
    const workflow = serializeWorkflow(nodes as WorkflowNode[], edges);
    const json = JSON.stringify(workflow, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hr-workflow.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [nodes, edges]);

  const workflowDisplayJSON = workflowToDisplayJSON(
    serializeWorkflow(nodes as WorkflowNode[], edges)
  );

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      <Header
        onValidate={handleValidate}
        onTest={handleTest}
        onExport={handleExport}
        isTesting={isSimulating}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 flex overflow-hidden">
            <WorkflowCanvas
              nodes={nodes as WorkflowNode[]}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={handleNodeClick}
              onPaneClick={handlePaneClick}
              setNodes={setNodes as React.Dispatch<React.SetStateAction<WorkflowNode[]>>}
              setEdges={setEdges}
            />
            <NodeDetailsPanel
              node={selectedNode}
              automations={automations}
              onUpdate={handleUpdateNode}
              onDelete={handleDeleteNode}
              onClose={() => setSelectedNode(null)}
            />
          </div>

          <SandboxPanel
            workflowJSON={workflowDisplayJSON}
            validationResult={validationResult}
            simulationResult={simulationResult}
            isSimulating={isSimulating}
            activeTab={sandboxTab}
            onTabChange={setSandboxTab}
            collapsed={sandboxCollapsed}
            onToggleCollapse={() => setSandboxCollapsed((c) => !c)}
          />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <WorkflowApp />
    </ReactFlowProvider>
  );
}
