import type {
  AutomationAction,
  SimulationResult,
  WorkflowJSON,
  SimulationStep,
  NodeKind,
} from '../types/workflow';

const AUTOMATIONS: AutomationAction[] = [
  { id: 'send_email', label: 'Send Email', params: ['to', 'subject'] },
  { id: 'generate_doc', label: 'Generate Document', params: ['template', 'recipient'] },
  { id: 'create_account', label: 'Create System Account', params: ['username', 'role'] },
  { id: 'notify_slack', label: 'Send Slack Notification', params: ['channel', 'message'] },
];

export async function getAutomations(): Promise<AutomationAction[]> {
  await delay(100);
  return AUTOMATIONS;
}

export async function simulate(workflow: WorkflowJSON): Promise<SimulationResult> {
  await delay(600);

  const steps: SimulationStep[] = [];
  const now = new Date();

  // topological-order walk
  const nodeMap = new Map(workflow.nodes.map((n) => [n.id, n]));
  const edgeMap = new Map<string, string[]>();
  for (const e of workflow.edges) {
    const arr = edgeMap.get(e.source) ?? [];
    arr.push(e.target);
    edgeMap.set(e.source, arr);
  }

  const startNode = workflow.nodes.find((n) => n.data.kind === 'start');
  if (!startNode) {
    return { success: false, steps: [], error: 'No start node found.' };
  }

  const visited = new Set<string>();
  const queue = [startNode.id];
  let offsetSec = 0;

  while (queue.length > 0) {
    const id = queue.shift()!;
    if (visited.has(id)) continue;
    visited.add(id);

    const node = nodeMap.get(id);
    if (!node) continue;
    const { data } = node;

    const ts = new Date(now.getTime() + offsetSec * 1000);
    const timestamp = ts.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    offsetSec += Math.floor(Math.random() * 45) + 15;

    const kind = data.kind as NodeKind;

    switch (kind) {
      case 'start': {
        const sd = data as import('../types/workflow').StartNodeData;
        steps.push({
          nodeId: id,
          nodeKind: kind,
          label: `Start: ${sd.title}`,
          status: 'completed',
          timestamp,
        });
        break;
      }
      case 'task': {
        const td = data as import('../types/workflow').TaskNodeData;
        steps.push({
          nodeId: id,
          nodeKind: kind,
          label: `Task: ${td.title}`,
          status: 'completed',
          timestamp,
          detail: td.assignee ? `Assigned to ${td.assignee}` : undefined,
        });
        break;
      }
      case 'approval': {
        const ad = data as import('../types/workflow').ApprovalNodeData;
        steps.push({
          nodeId: id,
          nodeKind: kind,
          label: `Approval: ${ad.title}`,
          status: 'approved',
          timestamp,
          detail: `Approved by ${ad.approverRole}`,
        });
        break;
      }
      case 'automated': {
        const aud = data as import('../types/workflow').AutomatedNodeData;
        const action = AUTOMATIONS.find((a) => a.id === aud.actionId);
        steps.push({
          nodeId: id,
          nodeKind: kind,
          label: `Automated: ${aud.title || action?.label || aud.actionId}`,
          status: 'success',
          timestamp,
        });
        break;
      }
      case 'end': {
        const ed = data as import('../types/workflow').EndNodeData;
        steps.push({
          nodeId: id,
          nodeKind: kind,
          label: `End: ${ed.endMessage || 'Workflow Complete'}`,
          status: 'completed',
          timestamp,
        });
        break;
      }
    }

    const nexts = edgeMap.get(id) ?? [];
    for (const nxt of nexts) {
      if (!visited.has(nxt)) queue.push(nxt);
    }
  }

  return { success: true, steps };
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
