import { Play, ClipboardList, UserCheck, Zap, StopCircle, Users, LayoutDashboard, FileText, Settings } from 'lucide-react';
import type { NodeKind } from '../../types/workflow';

interface NodeTypeItem {
  kind: NodeKind;
  label: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  border: string;
}

const NODE_TYPES: NodeTypeItem[] = [
  {
    kind: 'start',
    label: 'Start Node',
    icon: <Play size={13} className="fill-white text-white" />,
    color: 'text-green-600',
    bg: 'bg-green-500',
    border: 'border-green-200 hover:border-green-400',
  },
  {
    kind: 'task',
    label: 'Task Node',
    icon: <ClipboardList size={13} className="text-white" />,
    color: 'text-blue-600',
    bg: 'bg-blue-500',
    border: 'border-blue-200 hover:border-blue-400',
  },
  {
    kind: 'approval',
    label: 'Approval Node',
    icon: <UserCheck size={13} className="text-white" />,
    color: 'text-amber-600',
    bg: 'bg-amber-500',
    border: 'border-amber-200 hover:border-amber-400',
  },
  {
    kind: 'automated',
    label: 'Automated Step',
    icon: <Zap size={13} className="fill-white text-white" />,
    color: 'text-teal-600',
    bg: 'bg-teal-500',
    border: 'border-teal-200 hover:border-teal-400',
  },
  {
    kind: 'end',
    label: 'End Node',
    icon: <StopCircle size={13} className="text-white" />,
    color: 'text-red-600',
    bg: 'bg-red-500',
    border: 'border-red-200 hover:border-red-400',
  },
];

const NAV_ITEMS = [
  { label: 'Dashboard', icon: <LayoutDashboard size={15} /> },
  { label: 'Employees', icon: <Users size={15} /> },
  { label: 'Workflows', icon: <FileText size={15} />, active: true },
  { label: 'Templates', icon: <FileText size={15} /> },
  { label: 'Settings', icon: <Settings size={15} /> },
];

export default function Sidebar() {
  function onDragStart(e: React.DragEvent, kind: NodeKind) {
    e.dataTransfer.setData('application/reactflow-node-type', kind);
    e.dataTransfer.effectAllowed = 'move';
  }

  return (
    <aside className="w-48 bg-gray-900 flex flex-col flex-shrink-0 h-full">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-4 py-4 border-b border-gray-700">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
          <Users size={16} className="text-white" />
        </div>
        <span className="text-sm font-semibold text-white">HR Admin</span>
      </div>

      {/* Nav */}
      <nav className="px-2 pt-3 pb-2 space-y-0.5">
        {NAV_ITEMS.map((item) => (
          <div
            key={item.label}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-default transition-colors ${
              item.active
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
            }`}
          >
            {item.icon}
            <span className="text-sm">{item.label}</span>
          </div>
        ))}
      </nav>

      <div className="border-t border-gray-700 mx-3 my-1" />

      {/* Node Library */}
      <div className="flex-1 px-3 pt-3 overflow-y-auto">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 px-1">
          Node Library
        </p>
        <p className="text-xs text-gray-500 px-1 mb-3">Drag nodes to the canvas</p>

        <div className="space-y-1.5">
          {NODE_TYPES.map((nt) => (
            <div
              key={nt.kind}
              draggable
              onDragStart={(e) => onDragStart(e, nt.kind)}
              className={`flex items-center gap-2.5 px-3 py-2.5 bg-gray-800 border rounded-lg cursor-grab active:cursor-grabbing hover:bg-gray-700 transition-colors ${nt.border}`}
              title={`Drag to add ${nt.label}`}
            >
              <div className={`w-6 h-6 rounded-md ${nt.bg} flex items-center justify-center flex-shrink-0`}>
                {nt.icon}
              </div>
              <span className={`text-xs font-medium ${nt.color.replace('600', '400')}`}>
                {nt.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 py-3 border-t border-gray-700">
        <span className="text-xs text-gray-500">v1.0.0</span>
      </div>
    </aside>
  );
}
