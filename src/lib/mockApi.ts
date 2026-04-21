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
];

export async function getAutomations(): Promise<AutomationAction[]> {
  await delay(100);
  return AUTOMATIONS;
}

export async function simulate(workflow: WorkflowJSON): Promise<SimulationResult> {
  await delay(600);

  const steps: SimulationStep[] = [];
  const now = new Date();

  const nodeMap = new Map(workflow.nodes.map((n) => [n.id, n]));

  const outgoingMap = new Map<string, typeof workflow.edges>();
  for (const edge of workflow.edges) {
    const arr = outgoingMap.get(edge.source) ?? [];
    arr.push(edge);
    outgoingMap.set(edge.source, arr);
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
    const kind = data.kind as NodeKind;

    const ts = new Date(now.getTime() + offsetSec * 1000);
    const timestamp = ts.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    offsetSec += 20;

    switch (kind) {
      case 'start': {
        const sd = data as import('../types/workflow').StartNodeData;
        steps.push({
          nodeId: id,
          nodeKind: kind,
          label: `Start: ${sd.title || 'Workflow Start'}`,
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
          label: `Task: ${td.title || 'Task Step'}`,
          status: 'completed',
          timestamp,
          detail: td.assignee ? `Assigned to ${td.assignee}` : undefined,
        });
        break;
      }

      case 'approval': {
        const ad = data as import('../types/workflow').ApprovalNodeData;

        const isBranching = ad.decisionMode === 'approved_rejected';
        const outgoing = outgoingMap.get(id) ?? [];

        if (isBranching) {
          const decision = Math.random() > 0.5 ? 'approved' : 'rejected';

          steps.push({
            nodeId: id,
            nodeKind: kind,
            label: `Approval: ${ad.title || 'Approval Step'}`,
            status: decision === 'approved' ? 'approved' : 'error',
            timestamp,
            detail:
              decision === 'approved'
                ? `Approved by ${ad.approverRole || 'Approver'}`
                : `Rejected by ${ad.approverRole || 'Approver'}`,
          });

          const chosenEdges = outgoing.filter((e) => e.sourceHandle === decision);
          for (const edge of chosenEdges) {
            if (!visited.has(edge.target)) queue.push(edge.target);
          }

          continue;
        }

        steps.push({
          nodeId: id,
          nodeKind: kind,
          label: `Approval: ${ad.title || 'Approval Step'}`,
          status: 'approved',
          timestamp,
          detail: ad.approverRole ? `Approved by ${ad.approverRole}` : undefined,
        });

        break;
      }

      case 'automated': {
        const aud = data as import('../types/workflow').AutomatedNodeData;
        const action = AUTOMATIONS.find((a) => a.id === aud.actionId);

        steps.push({
          nodeId: id,
          nodeKind: kind,
          label: `Automated: ${aud.title || action?.label || 'Automated Step'}`,
          status: 'success',
          timestamp,
          detail: action ? `Executed action: ${action.label}` : undefined,
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

    const nexts = outgoingMap.get(id) ?? [];
    for (const edge of nexts) {
      if (!visited.has(edge.target)) queue.push(edge.target);
    }
  }

  return { success: true, steps };
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}