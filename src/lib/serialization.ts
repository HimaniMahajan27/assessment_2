import type { WorkflowNode, WorkflowEdge, WorkflowJSON } from '../types/workflow';

export function serializeWorkflow(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
  name = 'Onboarding Workflow'
): WorkflowJSON {
  return {
    id: `wf_${Date.now()}`,
    name,
    nodes,
    edges,
    createdAt: new Date().toISOString(),
  };
}

export function workflowToDisplayJSON(workflow: WorkflowJSON): string {
  const compact = {
    id: workflow.id,
    name: workflow.name,
    nodes: workflow.nodes.map((n) => ({ id: n.id, type: n.type, data: n.data })),
    edges: workflow.edges.map((e) => ({ id: e.id, source: e.source, target: e.target })),
  };
  return JSON.stringify(compact, null, 2);
}
