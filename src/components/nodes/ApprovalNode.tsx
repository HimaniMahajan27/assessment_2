import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { UserCheck } from 'lucide-react';
import type { ApprovalNodeData } from '../../types/workflow';

interface Props {
  data: ApprovalNodeData;
  selected: boolean;
}

function ApprovalNode({ data, selected }: Props) {
  return (
    <div
      className={`bg-white rounded-xl border-2 min-w-[180px] shadow-md transition-all ${
        selected ? 'border-amber-500 shadow-amber-200 shadow-lg' : 'border-amber-400'
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-amber-400 !border-2 !border-white"
      />
      <div className="flex items-center gap-2 px-3 py-2 border-b border-amber-100">
        <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
          <UserCheck size={11} className="text-white" />
        </div>
        <span className="text-xs font-semibold text-amber-600 uppercase tracking-wide">Approval</span>
      </div>
      <div className="px-3 py-2 space-y-1">
        <p className="text-sm font-medium text-gray-800 leading-tight">{data.title || 'Approval Step'}</p>
        {data.approverRole && (
          <p className="text-xs text-gray-500">Approver Role: {data.approverRole}</p>
        )}
        {data.autoApproveThreshold > 0 && (
          <p className="text-xs text-gray-400">Auto-approve if &lt; {data.autoApproveThreshold}h</p>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-amber-400 !border-2 !border-white"
      />
    </div>
  );
}

export default memo(ApprovalNode);
