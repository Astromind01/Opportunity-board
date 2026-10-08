import React from 'react';
import { 
  Bell, 
  X, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Award, 
  FileText, 
  MailCheck 
} from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  onSelectAction: (notif: NotificationItem) => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onSelectAction,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <Bell className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
              Agent Intelligence Notifications
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onMarkAllRead}
              className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
            >
              Mark all as read
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto divide-y divide-slate-100 p-2">
          {notifications.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                onSelectAction(item);
                onClose();
              }}
              className={`p-3.5 rounded-xl cursor-pointer transition-colors space-y-1 ${
                !item.read ? 'bg-indigo-50/50 hover:bg-indigo-50' : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${!item.read ? 'bg-indigo-600' : 'bg-transparent'}`} />
                  <span className="font-bold text-xs text-slate-900">{item.title}</span>
                </div>
                <span className="text-[10px] text-slate-400">{item.timestamp}</span>
              </div>
              <p className="text-xs text-slate-600 pl-4">{item.message}</p>
              <div className="pl-4 pt-1 flex items-center text-[10px] text-indigo-600 font-semibold">
                <span>View Details & Take Action →</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
