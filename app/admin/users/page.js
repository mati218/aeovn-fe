'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { usersService } from '@/services/users';
import { queryKeys } from '@/utils/queryKeys';
import { formatDate, truncate } from '@/utils/helpers';
import Table from '@/components/ui/Table';
import Badge, { getStatusVariant } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Pagination from '@/components/ui/Pagination';
import { TableSkeleton } from '@/components/ui/Skeleton';

const PAGE_SIZE = 10;

export default function UsersPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);

  const [statusModal, setStatusModal] = useState(null);
  const [ipModal, setIpModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.users.list(),
    queryFn: usersService.getAllUsers,
  });

  const users = data?.data || [];

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        !search ||
        u.username.toLowerCase().includes(search.toLowerCase()) ||
        u.fixedIP?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || u.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [users, search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Update status mutation
  const statusMutation = useMutation({
    mutationFn: usersService.updateUserStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.list() });
      toast.success('User status updated');
      setStatusModal(null);
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to update status'),
  });

  // Update IP mutation
  const ipMutation = useMutation({
    mutationFn: usersService.updateUserIP,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.list() });
      toast.success('IP address updated');
      setIpModal(null);
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to update IP'),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: usersService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.list() });
      toast.success('User deleted');
      setDeleteModal(null);
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to delete user'),
  });

  const StatusForm = ({ user }) => {
    const { register, handleSubmit } = useForm({ defaultValues: { status: user.status } });
    return (
      <form
        onSubmit={handleSubmit(({ status }) =>
          statusMutation.mutate({ id: user._id, status })
        )}
        className="space-y-4"
      >
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1.5">Status</label>
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
          <Button variant="secondary" onClick={() => setStatusModal(null)}>Cancel</Button>
          <Button type="submit" loading={statusMutation.isPending}>Save</Button>
        </div>
      </form>
    );
  };

  const IPForm = ({ user }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
      defaultValues: { newIP: user.fixedIP },
    });
    return (
      <form
        onSubmit={handleSubmit(({ newIP }) =>
          ipMutation.mutate({ id: user._id, newIP })
        )}
        className="space-y-4"
      >
        <Input
          label="New IP Address"
          placeholder="e.g. 192.168.1.1"
          error={errors.newIP?.message}
          {...register('newIP', { required: 'IP is required' })}
        />
        <div className="flex gap-2 justify-end">
          <Button variant="secondary" onClick={() => setIpModal(null)}>Cancel</Button>
          <Button type="submit" loading={ipMutation.isPending}>Update IP</Button>
        </div>
      </form>
    );
  };

  const columns = [
    {
      key: 'index',
      label: '#',
      render: (_, _row, idx) => (page - 1) * PAGE_SIZE + idx + 1,
    },
    {
      key: 'username',
      label: 'User',
      render: (val, row) => (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold shrink-0">
            {val?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-gray-800">{val}</p>
            <p className="text-xs text-gray-400">{row.telegramID}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      render: (val) => <Badge label={val} variant={getStatusVariant(val)} />,
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <Badge label={val} variant={getStatusVariant(val)} />,
    },
    {
      key: 'fixedIP',
      label: 'Fixed IP',
      render: (val) => <span className="font-mono text-xs text-gray-600">{val}</span>,
    },
    {
      key: 'createdAt',
      label: 'Joined',
      render: (val) => <span className="text-xs text-gray-500">{formatDate(val)}</span>,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => router.push(`/admin/users/${row._id}`)}
          >
            View
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setStatusModal(row)}
          >
            Status
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setIpModal(row)}
          >
            IP
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => setDeleteModal(row)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {data?.count ?? 0} total users registered
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by username or IP..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Status</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <TableSkeleton rows={6} cols={7} />
        ) : isError ? (
          <div className="py-12 text-center text-red-500 text-sm">Failed to load users</div>
        ) : (
          <>
            <Table columns={columns} data={paginated} emptyMessage="No users found" />
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>

      {/* Status Modal */}
      <Modal
        isOpen={!!statusModal}
        onClose={() => setStatusModal(null)}
        title={`Update Status — ${statusModal?.username}`}
      >
        {statusModal && <StatusForm user={statusModal} />}
      </Modal>

      {/* IP Modal */}
      <Modal
        isOpen={!!ipModal}
        onClose={() => setIpModal(null)}
        title={`Update IP — ${ipModal?.username}`}
      >
        {ipModal && <IPForm user={ipModal} />}
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        isOpen={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        title="Delete User"
      >
        <p className="text-sm text-gray-600 mb-5">
          Are you sure you want to delete{' '}
          <span className="font-semibold text-gray-900">{deleteModal?.username}</span>? This action cannot be undone.
        </p>
        <div className="flex gap-2 justify-end">
          <Button variant="secondary" onClick={() => setDeleteModal(null)}>Cancel</Button>
          <Button
            variant="danger"
            loading={deleteMutation.isPending}
            onClick={() => deleteMutation.mutate(deleteModal._id)}
          >
            Delete User
          </Button>
        </div>
      </Modal>
    </div>
  );
}
