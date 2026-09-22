import { useAppDataStore } from '@/store/appDataStore';
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  UserPlus,
  Shield,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  X,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';
import type { User, UserRole } from '../../types';


interface ExtendedUser extends User {
  status: 'active' | 'inactive';
}

export function AdminUsers() {
  const { patients: DEMO_PATIENTS, gameSessions: DEMO_GAME_SESSIONS, reminders: DEMO_REMINDERS, alerts: DEMO_ALERTS, routines: DEMO_ROUTINE, memoryBook: DEMO_MEMORY_BOOK, users: DEMO_USERS, notes: DEMO_NOTES, metrics: DEMO_COGNITIVE_METRICS } = useAppDataStore();

  const [users, setUsers] = useState<ExtendedUser[]>(() =>
    DEMO_USERS.map((u) => ({ ...u, status: 'active' }))
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [editingUser, setEditingUser] = useState<ExtendedUser | null>(null);
  const [newRole, setNewRole] = useState<UserRole>('caregiver');

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchRole = roleFilter === 'all' || u.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [users, searchTerm, roleFilter]);

  const toggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' }
          : u
      )
    );
  };

  const handleSaveRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setUsers((prev) =>
      prev.map((u) => (u.id === editingUser.id ? { ...u, role: newRole } : u))
    );
    setEditingUser(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 lg:p-6 max-w-7xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
        <div>
          <div className="smallcaps text-sand mb-1">Administrator • Users</div>
          <h1 className="font-display font-bold text-kraft text-2xl lg:text-3xl uppercase tracking-widest">
            User Accounts
          </h1>
          <p className="font-mono text-sand/70 text-sm mt-1">
            Manage authenticated platform users and access roles.
          </p>
        </div>

        <button
          onClick={() => toast.success('New user registration dialog coming soon.')}
          className="btn btn-primary btn-sm self-start flex items-center gap-6"
        >
          <UserPlus className="w-4 h-4" /> Add User
        </button>
      </div>

      {/* Search & Role Filter Bar */}
      <div className="arcade-card p-6 flex flex-col md:flex-row gap-6 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-ink absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="arcade-input w-full pl-10"
          />
        </div>

        <div className="flex items-center gap-6">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="arcade-select"
          >
            <option value="all">All Roles</option>
            <option value="patient">Patients</option>
            <option value="caregiver">Caregivers</option>
            <option value="doctor">Doctors</option>
            <option value="admin">Administrators</option>
          </select>
        </div>
      </div>

      {/* User Table */}
      <div className="arcade-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="arcade-table w-full">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Created Date</th>
                <th>Account Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => {
                const getRoleBadge = (role: UserRole) => {
                  switch (role) {
                    case 'admin': return 'badge-ochre';
                    case 'doctor': return 'badge-vermilion';
                    case 'caregiver': return 'badge-sand';
                    default: return 'badge-green';
                  }
                };

                return (
                  <tr key={u.id}>
                    <td className="font-bold text-ink">
                      <div>{u.name}</div>
                      <div className="font-mono text-xs text-sand font-normal mt-0.5">{u.email}</div>
                    </td>

                    <td>
                      <span className={`badge ${getRoleBadge(u.role)}`}>
                        {u.role}
                      </span>
                    </td>

                    <td className="font-mono text-xs text-sand">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>

                    <td>
                      <button
                        onClick={() => toggleUserStatus(u.id)}
                        className={`badge cursor-pointer ${
                          u.status === 'active'
                            ? 'badge-green'
                            : 'bg-kraft3 text-sand border-ink'
                        }`}
                        title="Click to toggle status"
                      >
                        {u.status === 'active' ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 inline mr-1" /> ACTIVE
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 inline mr-1" /> INACTIVE
                          </>
                        )}
                      </button>
                    </td>

                    <td className="text-right">
                      <button
                        onClick={() => {
                          setEditingUser(u);
                          setNewRole(u.role);
                        }}
                        className="btn btn-sm btn-ghost inline-flex items-center gap-1"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Role Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm flex items-center justify-center p-6">
          <form
            onSubmit={handleSaveRole}
            className="arcade-card p-6 max-w-sm w-full space-y-8 paper grain"
          >
            <div className="flex items-center justify-between border-b-2 border-ink pb-2">
              <h3 className="font-display font-bold text-ink text-xl uppercase tracking-widest">Edit Role</h3>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="text-ink hover:text-vermilion transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <p className="font-mono text-sm text-ink">
              Assign role for <strong>{editingUser.name}</strong>:
            </p>

            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as UserRole)}
              className="arcade-select w-full"
            >
              <option value="patient">Patient (Cognitive interface only)</option>
              <option value="caregiver">Caregiver (Care coordination & reminders)</option>
              <option value="doctor">Doctor (Clinical portal)</option>
              <option value="admin">Administrator (Full permissions)</option>
            </select>

            <div className="flex justify-end gap-6 pt-4">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </motion.div>
  );
}

export default AdminUsers;
