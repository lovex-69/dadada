import React from 'react';
import { Issue } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { getWardName, getContractorName, isOverdue } from '@/lib/responsibility';

interface IssueCardProps {
  issue: Issue;
  onClick?: () => void;
}

const statusColors = {
  open: 'bg-blue-100 text-blue-800',
  acknowledged: 'bg-yellow-100 text-yellow-800',
  resolved: 'bg-green-100 text-green-800',
  overdue: 'bg-red-100 text-red-800',
};

const severityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-amber-100 text-amber-800',
  critical: 'bg-red-100 text-red-800',
};

const IssueCard: React.FC<IssueCardProps> = ({ issue, onClick }) => {
  const overdue = isOverdue(issue);
  const status = overdue ? 'overdue' : issue.status;

  const timeSince = formatDistanceToNow(issue.timestamp, { addSuffix: true });
  const slaRemaining = issue.slaDeadline ? formatDistanceToNow(issue.slaDeadline, { addSuffix: true }) : null;

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-primary"
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={issue.imageUrl}
          alt={issue.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${statusColors[status]}`}>
            {status}
          </span>
          <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${severityColors[issue.severity]}`}>
            {issue.severity}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1 truncate">{issue.title}</h3>
        <p className="text-gray-500 text-xs mb-3 flex items-center">
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {issue.address}
        </p>
        
        <div className="bg-gray-50 p-2 rounded mb-3 text-xs">
          <div className="flex justify-between mb-1">
            <span className="text-gray-500">Ward:</span>
            <span className="font-medium">{issue.ward ? getWardName(issue.ward) : 'Unassigned'}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span className="text-gray-500">Dept:</span>
            <span className="font-medium">{issue.department || 'Processing...'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Contractor:</span>
            <span className="font-medium text-right">{issue.contractorId ? getContractorName(issue.contractorId) : 'Identifying...'}</span>
          </div>
        </div>

        <div className="flex justify-between items-end">
          <div className="text-[10px] text-gray-400">
            <p>Reported {timeSince}</p>
            {issue.status !== 'resolved' && (
              <p className={overdue ? 'text-red-500 font-bold' : ''}>
                SLA: {overdue ? 'Expired ' : 'Due '}{slaRemaining}
              </p>
            )}
          </div>
          <button className="text-primary text-xs font-bold hover:underline">
            View Details →
          </button>
        </div>
      </div>
    </div>
  );
};

export default IssueCard;
