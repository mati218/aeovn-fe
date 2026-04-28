'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { usersService } from '@/services/users';
import { queryKeys } from '@/utils/queryKeys';
import { formatDate } from '@/utils/helpers';
import Card from '@/components/ui/Card';
import Badge, { getStatusVariant } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';

function InfoRow({ label, value, mono }) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-500 w-36 shrink-0">{label}</span>
      <span className={`text-sm text-gray-800 font-medium text-right ${mono ? 'font-mono' : ''}`}>
        {value ?? '—'}
      </span>
    </div>
  );
}

export default function UserDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [statusModal, setStatusModal] = useState(false);
  const [ipModal, setIpModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => usersService.getUserById(id),
    enabled: !!id,
  });

  const user = data?.data;

  const statusMutation = useMutation({
    mutationFn: usersService.updateUserStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      toast.success('Status updated');
      setStatusModal(false);
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed'),
  });

  const ipMutation = useMutation({
    mutationFn: usersService.updateUserIP,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      toast.success('IP updated');
      setIpModal(false);
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed'),
  });

  const deleteMutation = useMutation({
    mutationFn: usersService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.list() });
      toast.success('User deleted');
      router.push('/admin/users');
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed'),
  });

  const StatusForm = () => {
    const { register, handleSubmit } = useForm({ defaultValues: { status: user?.status } });
    return (
      <form
        onSubmit={handleSubmit(({ status }) => statusMutation.mutate({ id, status }))}
        className="space-y-4"
      >
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1.5">New Status</label>
          <select
            {...register('status')}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="secondary" onClick={() => setStatusModal(false)}>Cancel</Button>
          <Button type="submit" loading={statusMutation.isPending}>Save</Button>
        </div>
      </form>
    );
  };

  const IPForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
      defaultValues: { newIP: user?.fixedIP },
    });
    return (
      <form
        onSubmit={handleSubmit(({ newIP }) => ipMutation.mutate({ id, newIP }))}
        className="space-y-4"
      >
        <Input
          label="New IP Address"
          placeholder="e.g. 192.168.1.1"
          error={errors.newIP?.message}
          {...register('newIP', { required: 'IP is required' })}
        />
        <div className="flex gap-2 justify-end">
          <Button variant="secondary" onClick={() => setIpModal(false)}>Cancel</Button>
          <Button type="submit" loading={ipMutation.isPending}>Update</Button>
        </div>
      </form>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-8 w-48" />
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-5" />)}
        </div>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400 text-sm mb-3">User not found</p>
        <Button onClick={() => router.push('/admin/users')} variant="secondary">← Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/admin/users')}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{user.username}</h1>
          <p className="text-sm text-gray-400 font-mono">{user._id}</p>
        </div>
      </div>

      {/* Profile card */}
      <Card padding={false}>
        <div className="p-6 flex items-center gap-5 border-b border-gray-100">
          <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-700 text-2xl font-bold">
            {user.username?.[0]?.toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{user.username}</h2>
            <div className="flex items-center gap-2 mt-1.5">
              <Badge label={user.role} variant={getStatusVariant(user.role)} />
              <Badge label={user.status} variant={getStatusVariant(user.status)} />
            </div>
          </div>
        </div>
        <div className="px-6 py-2">
          <InfoRow label="User ID" value={user._id} mono />
          <InfoRow label="Fixed IP" value={user.fixedIP} mono />
          <InfoRow label="Telegram ID" value={user.telegramID} mono />
          <InfoRow label="Role" value={user.role} />
          <InfoRow label="Status" value={user.status} />
          <InfoRow label="Created At" value={formatDate(user.createdAt)} />
          <InfoRow label="Updated At" value={formatDate(user.updatedAt)} />
        </div>
      </Card>

      {/* Actions */}
      <Card title="Actions" subtitle="Manage this user account">
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setStatusModal(true)}>
            Update Status
          </Button>
          <Button variant="secondary" onClick={() => setIpModal(true)}>
            Update IP
          </Button>
          <Button variant="danger" onClick={() => setDeleteModal(true)}>
            Delete User
          </Button>
        </div>
      </Card>

      {/* Modals */}
      <Modal isOpen={statusModal} onClose={() => setStatusModal(false)} title="Update Status">
        <StatusForm />
      </Modal>

      <Modal isOpen={ipModal} onClose={() => setIpModal(false)} title="Update IP Address">
        <IPForm />
      </Modal>

      <Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)} title="Delete User">
        <p className="text-sm text-gray-600 mb-5">
          Are you sure you want to permanently delete{' '}
          <span className="font-semibold text-gray-900">{user.username}</span>?
        </p>
        <div className="flex gap-2 justify-end">
          <Button variant="secondary" onClick={() => setDeleteModal(false)}>Cancel</Button>
          <Button
            variant="danger"
            loading={deleteMutation.isPending}
            onClick={() => deleteMutation.mutate(id)}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
