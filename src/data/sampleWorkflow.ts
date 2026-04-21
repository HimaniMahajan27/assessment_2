import type { WorkflowNode, WorkflowEdge } from '../types/workflow';

export const sampleNodes: WorkflowNode[] = [
  {
    id: 'n1',
    type: 'start',
    position: { x: 60, y: 180 },
    data: {
      kind: 'start',
      title: 'New Employee Onboarding',
      metadata: [{ id: 'm1', key: 'department', value: 'Engineering' }],
    },
  },
  {
    id: 'n2',
    type: 'task',
    position: { x: 280, y: 160 },
    data: {
      kind: 'task',
      title: 'Collect Documents',
      description: 'Collect personal, bank and employment details',
      assignee: 'HR Executive',
      dueDate: '2025-02-06',
      customFields: [
        { id: 'cf1', key: 'Employee ID', value: '' },
        { id: 'cf2', key: 'Department', value: '' },
      ],
    },
  },
  {
    id: 'n3',
    type: 'approval',
    position: { x: 520, y: 160 },
    data: {
      kind: 'approval',
      title: 'Manager Approval',
      approverRole: 'Manager',
      autoApproveThreshold: 24,
    },
  },
  {
    id: 'n4',
    type: 'automated',
    position: { x: 760, y: 160 },
    data: {
      kind: 'automated',
      title: 'Send Welcome Email',
      actionId: 'send_email',
      actionParams: { to: 'new.employee@company.com', subject: 'Welcome to the team!' },
    },
  },
  {
    id: 'n5',
    type: 'end',
    position: { x: 1000, y: 180 },
    data: {
      kind: 'end',
      endMessage: 'Onboarding Complete',
      summaryFlag: true,
    },
  },
];

export const sampleEdges: WorkflowEdge[] = [
  { id: 'e1-2', source: 'n1', target: 'n2', type: 'smoothstep' },
  { id: 'e2-3', source: 'n2', target: 'n3', type: 'smoothstep' },
  { id: 'e3-4', source: 'n3', target: 'n4', type: 'smoothstep' },
  { id: 'e4-5', source: 'n4', target: 'n5', type: 'smoothstep' },
];
