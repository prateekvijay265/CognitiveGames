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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-7xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            User Accounts & Security Roles
          </h1>
          <p className="text-stone-500 text-sm mt-0.5">
            Manage authenticated platform users, grant access roles, and toggle account states.
          </p>
        </div>

        <button
          onClick={() => toast.success('New user registration dialog coming soon.')}
          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" /> Add User
        </button>
      </div>

      {/* Search & Role Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-stone-50 border border-stone-200 rounded-xl text-stone-700 focus:outline-hidden"
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
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-stone-600">
            <thead className="bg-stone-50/80 text-xs font-bold uppercase tracking-wider text-stone-500 border-b border-stone-200">
              <tr>
                <th className="py-3.5 px-6">User</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Created Date</th>
                <th className="py-3.5 px-4">Account Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredUsers.map((u) => {
                const roleColors: Record<UserRole, string> = {
                  patient: 'bg-teal-50 text-teal-800 border-teal-200',
                  caregiver: 'bg-blue-50 text-blue-800 border-blue-200',
                  doctor: 'bg-purple-50 text-purple-800 border-purple-200',
                  admin: 'bg-amber-50 text-amber-800 border-amber-200',
                };

                return (
                  <tr key={u.id} className="hover:bg-stone-50/70">
                    <td className="py-4 px-6 font-bold text-stone-900">
                      <div>{u.name}</div>
                      <div className="text-xs text-stone-400 font-normal">{u.email}</div>
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize ${
                          roleColors[u.role]
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-xs text-stone-500">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-4 px-4">
                      <button
                        onClick={() => toggleUserStatus(u.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border cursor-pointer ${
                          u.status === 'active'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-stone-100 text-stone-500 border-stone-200'
                        }`}
                        title="Click to toggle status"
                      >
                        {u.status === 'active' ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Active
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5 text-stone-400" /> Inactive
                          </>
                        )}
                      </button>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => {
                          setEditingUser(u);
                          setNewRole(u.role);
                        }}
                        className="px-3 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors inline-flex items-center gap-1"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Edit Role
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
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveRole}
            className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-stone-900 text-base">Edit User Role</h3>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-500">
              Assign role for <strong>{editingUser.name}</strong> ({editingUser.email}):
            </p>

            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as UserRole)}
              className="w-full p-2.5 text-sm font-semibold rounded-xl border border-stone-200 bg-stone-50 focus:outline-hidden"
            >
              <option value="patient">Patient (Cognitive interface only)</option>
              <option value="caregiver">Caregiver (Care coordination & reminders)</option>
              <option value="doctor">Doctor (Clinical observational portal)</option>
              <option value="admin">Administrator (Full platform permissions)</option>
            </select>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-xs"
              >
                Save Role
              </button>
            </div>
          </form>
        </div>
      )}
    </motion.div>
  );
}

export default AdminUsers;
