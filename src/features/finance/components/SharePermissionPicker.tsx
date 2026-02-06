/**
 * SharePermissionPicker - Lets account owners set read/transact/manage permission for shared users.
 * Updates Firestore sharedWith[uid].permission directly (owner-gated by Firestore rules).
 */

import React, { useState } from 'react';
import { Shield, Eye, ArrowRightLeft, Settings } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db, APP_ID } from '../../../config/firebase';
import { useNotifications } from '../../../context/NotificationContext';

type Permission = 'read' | 'transact' | 'manage';

const PERMISSIONS: { value: Permission; label: string; desc: string; Icon: React.FC<{ className?: string }> }[] = [
  { value: 'read', label: 'View Only', desc: 'Can see balance and transactions', Icon: Eye },
  { value: 'transact', label: 'Transact', desc: 'Can add and delete transactions', Icon: ArrowRightLeft },
  { value: 'manage', label: 'Full Access', desc: 'Can edit account and transactions', Icon: Settings },
];

interface Props {
  accountId: string;
  ownerUid: string;
  sharedUid: string;
  sharedUserName?: string;
  currentPermission: Permission;
}

export const SharePermissionPicker: React.FC<Props> = ({ accountId, ownerUid, sharedUid, sharedUserName, currentPermission }) => {
  const { showToast } = useNotifications();
  const [permission, setPermission] = useState<Permission>(currentPermission);
  const [saving, setSaving] = useState(false);

  const handleChange = async (newPerm: Permission) => {
    if (newPerm === permission) return;
    setSaving(true);
    try {
      const accountRef = doc(db, 'artifacts', APP_ID, 'users', ownerUid, 'accounts', accountId);
      await updateDoc(accountRef, { [`sharedWith.${sharedUid}.permission`]: newPerm });
      setPermission(newPerm);
      showToast(`Permission updated to ${PERMISSIONS.find(p => p.value === newPerm)?.label}.`, 'success');
    } catch (e) {
      showToast('Failed to update permission: ' + (e as Error).message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-2">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
        <Shield className="w-3 h-3" />
        {sharedUserName ? `${sharedUserName}'s access` : 'Shared access'}
      </p>
      <div className="flex bg-slate-100 dark:bg-slate-900 rounded-xl p-1 border border-slate-200 dark:border-slate-800">
        {PERMISSIONS.map(({ value, label, Icon }) => (
          <button key={value} onClick={() => handleChange(value)} disabled={saving}
            className={`flex-1 py-2 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${permission === value ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-white' : 'text-slate-400 hover:text-slate-600'} ${saving ? 'opacity-50 cursor-wait' : ''}`}>
            <Icon className="w-3.5 h-3.5" />{label}
          </button>
        ))}
      </div>
    </div>
  );
};
