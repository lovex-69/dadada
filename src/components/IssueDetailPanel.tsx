import React, { useState } from 'react';
import { Issue, IssueStatus } from '@/types';
import { formatDistanceToNow, format } from 'date-fns';
import { getWardName, getContractorName, isOverdue } from '@/lib/responsibility';
import { updateIssueStatus } from '@/lib/firestore';

interface IssueDetailPanelProps {
  issue: Issue;
  onUpdate?: () => void;
}

const statusColors = {
  open: 'bg-blue-100 text-blue-800',
  acknowledged: 'bg-yellow-100 text-yellow-800',
  resolved: 'bg-green-100 text-green-800',
  overdue: 'bg-red-100 text-red-800',
};

const IssueDetailPanel: React.FC<IssueDetailPanelProps> = ({ issue, onUpdate }) => {
  const [updating, setUpdating] = useState(false);
  const [showEscalation, setShowEscalation] = useState(false);

  const overdue = isOverdue(issue);
  const status = overdue ? 'overdue' : issue.status;

  const handleStatusUpdate = async (newStatus: IssueStatus) => {
    setUpdating(true);
    try {
      await updateIssueStatus(
        issue.id,
        newStatus,
        `Status updated to ${newStatus}`,
        'Authorized User'
      );
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const generateRTIDraft = () => {
    return `To: Public Information Officer, ${issue.department}
Subject: Request for Information under RTI Act 2005 regarding issue ID ${issue.id}

Sir/Madam,
With reference to the civic issue reported at ${issue.address} regarding ${issue.category} (Reported on ${format(issue.timestamp, 'PPP')}), I would like to request the following information:
1. What actions have been taken to address this issue to date?
2. If no action has been taken, please provide the reasons for the delay.
3. Please provide the names and designations of the officials responsible for monitoring this work.
4. What is the expected date of completion?

Yours faithfully,
[Citizen Name]`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      {/* Header with Image and Status */}
      <div className="relative h-64 md:h-80">
        <img
          src={issue.imageUrl}
          alt={issue.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
          <div className="text-white">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase mb-2 inline-block ${statusColors[status]}`}>
              {status}
            </span>
            <h2 className="text-2xl md:text-3xl font-bold">{issue.title}</h2>
          </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Description</h3>
            <p className="text-gray-700 leading-relaxed">{issue.description}</p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Responsibility Matrix</h3>
            <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase">Ward</p>
                <p className="font-semibold">{issue.ward ? getWardName(issue.ward) : 'Unknown'}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase">Department</p>
                <p className="font-semibold">{issue.department || 'Processing'}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase">Contractor</p>
                <p className="font-semibold">{issue.contractorId ? getContractorName(issue.contractorId) : 'Identifying'}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase">SLA Deadline</p>
                <p className={`font-semibold ${overdue ? 'text-red-600' : ''}`}>
                  {issue.slaDeadline ? format(issue.slaDeadline, 'PPP') : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Accountability Timeline</h3>
            <div className="relative border-l-2 border-gray-100 ml-2 space-y-6 pb-2">
              {issue.timeline?.map((event, idx) => (
                <div key={event.id} className="relative pl-6">
                  <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white ${idx === 0 ? 'bg-primary' : 'bg-gray-300'}`}></div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-bold">{event.description}</p>
                      <p className="text-xs text-gray-500">By {event.updatedBy}</p>
                    </div>
                    <p className="text-xs text-gray-400">{formatDistanceToNow(event.timestamp, { addSuffix: true })}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
            <h4 className="font-bold text-primary mb-3">Action Center</h4>
            <div className="space-y-2">
              {issue.status === 'open' && (
                <button
                  onClick={() => handleStatusUpdate('acknowledged')}
                  disabled={updating}
                  className="w-full bg-white border border-primary text-primary py-2 rounded font-bold text-sm hover:bg-primary hover:text-white transition-colors disabled:opacity-50"
                >
                  Acknowledge Issue
                </button>
              )}
              {issue.status !== 'resolved' && (
                <button
                  onClick={() => handleStatusUpdate('resolved')}
                  disabled={updating}
                  className="w-full bg-green-600 text-white py-2 rounded font-bold text-sm hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  Mark as Resolved
                </button>
              )}
              <button
                onClick={() => setShowEscalation(!showEscalation)}
                className="w-full bg-gray-800 text-white py-2 rounded font-bold text-sm hover:bg-black transition-colors"
              >
                Escalate (RTI/Ombudsman)
              </button>
            </div>
          </div>

          {showEscalation && (
            <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 animate-in fade-in slide-in-from-top-2">
              <h4 className="font-bold text-amber-800 mb-2">Procedural Escalation</h4>
              <p className="text-[10px] text-amber-700 mb-4">
                The SLA for this issue has been exceeded or the response is inadequate. Generate legal documentation below.
              </p>
              <div className="space-y-3">
                <button 
                  onClick={() => {
                    const blob = new Blob([generateRTIDraft()], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `RTI_Draft_${issue.id}.txt`;
                    a.click();
                  }}
                  className="w-full text-xs bg-white border border-amber-200 text-amber-800 py-2 rounded hover:bg-amber-100"
                >
                  Download RTI Request Draft
                </button>
                <button className="w-full text-xs bg-white border border-amber-200 text-amber-800 py-2 rounded hover:bg-amber-100">
                  Ombudsman Complaint Template
                </button>
                <button className="w-full text-xs bg-white border border-amber-200 text-amber-800 py-2 rounded hover:bg-amber-100">
                  Collective Petition Template
                </button>
              </div>
            </div>
          )}

          <div className="p-4 border border-gray-200 rounded-xl">
            <h4 className="font-bold text-sm mb-2">Location Information</h4>
            <p className="text-xs text-gray-500 mb-4">{issue.address}</p>
            <div className="h-40 bg-gray-100 rounded-lg overflow-hidden grayscale">
               {/* Simplified static map or mini MapView could go here */}
               <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400 italic">
                 GPS: {issue.latitude.toFixed(4)}, {issue.longitude.toFixed(4)}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueDetailPanel;
