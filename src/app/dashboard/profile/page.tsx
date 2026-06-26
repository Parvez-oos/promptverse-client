'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiFileText, FiAward, FiShield, FiZap, FiEdit2, FiSave, FiX } from 'react-icons/fi';
import { useAuth } from '@/providers/AuthProvider';
import { userService } from '@/services/userService';
import { ProfileSkeleton } from '@/components/ui/Skeleton';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['userProfile', user?._id],
    queryFn: () => userService.getProfile(),
    enabled: !!user,
  });

  const profile = data?.data || user;

  const updateMutation = useMutation({
    mutationFn: (body: { name?: string; photoURL?: string }) => userService.updateProfile(body),
    onSuccess: (res) => {
      const updated = res.data;
      if (user) {
        updateUser({ ...user, name: updated.name, photoURL: updated.photoURL });
      }
      queryClient.setQueryData(['userProfile', user?._id], { data: updated });
      queryClient.invalidateQueries({ queryKey: ['userProfile', user?._id] });
      toast.success('Profile updated.');
      setEditing(false);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to update profile.');
    },
  });

  const startEditing = () => {
    setEditName(profile?.name || '');
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
  };

  const saveProfile = () => {
    if (!editName.trim()) {
      toast.error('Name cannot be empty.');
      return;
    }
    updateMutation.mutate({ name: editName.trim() });
  };

  if (isLoading) return <ProfileSkeleton />;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="text-sm text-base-content/50">Manage your account settings</p>
        </div>
        {editing ? (
          <div className="flex gap-2">
            <button onClick={saveProfile} disabled={updateMutation.isPending} className="btn btn-primary btn-sm rounded-lg gap-1.5">
              <FiSave className="w-4 h-4" /> {updateMutation.isPending ? <span className="loading loading-spinner loading-xs" /> : 'Save'}
            </button>
            <button onClick={cancelEditing} className="btn btn-ghost btn-sm rounded-lg gap-1.5">
              <FiX className="w-4 h-4" /> Cancel
            </button>
          </div>
        ) : (
          <button onClick={startEditing} className="btn btn-ghost btn-sm rounded-lg gap-1.5">
            <FiEdit2 className="w-4 h-4" /> Edit
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card bg-base-100 border border-base-300 p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-2xl overflow-hidden">
                {profile?.photoURL ? (
                  <img src={profile.photoURL} alt="" className="w-full h-full object-cover" />
                ) : (
                  profile?.name?.charAt(0)?.toUpperCase() || 'U'
                )}
              </div>
              <div>
                {editing ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="input input-bordered input-sm w-full mb-1"
                    placeholder="Your name"
                    autoFocus
                  />
                ) : (
                  <h2 className="text-xl font-bold">{profile?.name}</h2>
                )}
                <p className="text-sm text-base-content/50">{profile?.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="badge badge-sm capitalize">{profile?.role}</span>
                  {profile?.isPremium ? (
                    <span className="badge badge-sm badge-accent gap-1">
                      <FiZap className="w-3 h-3" /> Premium
                    </span>
                  ) : (
                    <Link href="/payment" className="badge badge-sm badge-outline hover:badge-primary cursor-pointer">
                      Upgrade to Premium
                    </Link>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-base-200/50 rounded-xl">
                <p className="text-xs text-base-content/40 mb-1">Member Since</p>
                <p className="text-sm font-medium">{formatDate(profile?.createdAt || new Date().toISOString())}</p>
              </div>
              <div className="p-4 bg-base-200/50 rounded-xl">
                <p className="text-xs text-base-content/40 mb-1">Account Type</p>
                <p className="text-sm font-medium capitalize">{profile?.role}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card bg-base-100 border border-base-300 p-6">
            <h3 className="font-semibold text-sm mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FiFileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{profile?.totalPrompts || 0}</p>
                  <p className="text-xs text-base-content/50">Total Prompts</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <FiAward className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{profile?.isPremium ? 'Premium' : 'Free'}</p>
                  <p className="text-xs text-base-content/50">Subscription</p>
                </div>
              </div>
            </div>
            {!profile?.isPremium && (
              <Link href="/payment" className="btn btn-primary w-full rounded-xl mt-4 gap-2">
                <FiShield className="w-4 h-4" /> Upgrade to Premium
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
