import type { WorkflowNode, WorkflowEdge, ValidationResult } from '../types/workflow';

export function validateWorkflow(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[]
): ValidationResult {
  const errors: string[] = [];

  const startNodes = nodes.filter((n) => n.data.kind === 'start');
  const endNodes = nodes.filter((n) => n.data.kind === 'end');

  const hasStart = startNodes.length > 0;
  const hasEnd = endNodes.length > 0;
  const singleStart = startNodes.length === 1;
  const singleEnd = endNodes.length >= 1;

  if (!hasStart) errors.push('Workflow must have a Start node.');
  if (startNodes.length > 1) errors.push('Workflow must have exactly one Start node.');
  if (!hasEnd) errors.push('Workflow must have an End node.');

  const targetIds = new Set(edges.map((e) => e.target));
  const sourceIds = new Set(edges.map((e) => e.source));

  const disconnectedNodes = nodes.filter((n) => {
    const hasIn = targetIds.has(n.id);
    const hasOut = sourceIds.has(n.id);

    if (n.data.kind === 'start') return !hasOut && nodes.length > 1;
    if (n.data.kind === 'end') return !hasIn;
    return !hasIn || !hasOut;
  });

  if (disconnectedNodes.length > 0) {
    const names = disconnectedNodes
      .map((n) => {
        const d = n.data;
        if ('title' in d) return d.title || n.id;
        if ('endMessage' in d) return d.endMessage || 'End';
        return n.id;
      })
      .join(', ');

    errors.push(`Disconnected nodes detected: ${names}`);
  }

  // Required field checks
  for (const node of nodes) {
    const d = node.data;

    if (d.kind === 'start' && !d.title.trim()) {
      errors.push('Start node is missing a title.');
    }

    if (d.kind === 'task') {
      if (!d.title.trim()) errors.push('Task node is missing a title.');
      if (!d.assignee.trim()) errors.push(`Task "${d.title || node.id}" is missing an assignee.`);
    }

    if (d.kind === 'approval') {
      if (!d.title.trim()) errors.push('Approval node is missing a title.');
      if (!d.approverRole.trim()) {
        errors.push(`Approval "${d.title || node.id}" is missing an approver role.`);
      }
    }

    if (d.kind === 'automated') {
      if (!d.title.trim()) errors.push('Automated step is missing a title.');
      if (!d.actionId.trim()) {
        errors.push(`Automated step "${d.title || node.id}" is missing an action.`);
      }
    }

    if (d.kind === 'end' && !d.endMessage.trim()) {
      errors.push('End node is missing an end message.');
    }
  }

  // Branching validation for approval nodes
  for (const node of nodes) {
    const d = node.data;

    if (d.kind === 'approval' && d.decisionMode === 'approved_rejected') {
      const outgoing = edges.filter((e) => e.source === node.id);

      const hasApproved = outgoing.some((e) => e.sourceHandle === 'approved');
      const hasRejected = outgoing.some((e) => e.sourceHandle === 'rejected');

      if (!hasApproved) {
        errors.push(`Approval "${d.title || node.id}" is missing an approved branch.`);
      }

      if (!hasRejected) {
        errors.push(`Approval "${d.title || node.id}" is missing a rejected branch.`);
      }
    }
  }

  const hasCycle = detectCycle(nodes, edges);
  if (hasCycle) {
    errors.push('Workflow contains a cycle. Cycles are not allowed.');
  }

  const checks = [
    { label: 'Start node is present', passed: hasStart && singleStart },
    { label: 'End node is present', passed: hasEnd && singleEnd },
    { label: 'All nodes are connected', passed: disconnectedNodes.length === 0 },
    { label: 'No cycles detected', passed: !hasCycle },
    { label: 'Required fields are filled', passed: !errors.some((e) => e.includes('missing')) },
  ];

  const hasBranchingApproval = nodes.some(
    (n) => n.data.kind === 'approval' && n.data.decisionMode === 'approved_rejected'
  );

  if (hasBranchingApproval) {
    const branchingValid = !errors.some(
      (e) => e.includes('approved branch') || e.includes('rejected branch')
    );

    checks.push({
      label: 'Branching approval paths are configured',
      passed: branchingValid,
    });
  }

  const valid = errors.length === 0;

  if (valid) {
    checks.push({ label: 'Workflow is valid', passed: true });
  }

  return { valid, errors, checks };
}

function detectCycle(nodes: WorkflowNode[], edges: WorkflowEdge[]): boolean {
  const adj = new Map<string, string[]>();

  for (const n of nodes) adj.set(n.id, []);

  for (const e of edges) {
    const arr = adj.get(e.source) ?? [];
    arr.push(e.target);
    adj.set(e.source, arr);
  }

  const WHITE = 0;
  const GRAY = 1;
  const BLACK = 2;

  const color = new Map<string, number>();
  for (const n of nodes) color.set(n.id, WHITE);

  function dfs(id: string): boolean {
    color.set(id, GRAY);

    for (const neighbor of adj.get(id) ?? []) {
      if (color.get(neighbor) === GRAY) return true;
      if (color.get(neighbor) === WHITE && dfs(neighbor)) return true;
    }

    color.set(id, BLACK);
    return false;
  }

  for (const n of nodes) {
    if (color.get(n.id) === WHITE && dfs(n.id)) return true;
  }

  return false;
}