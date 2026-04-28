'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { invitesService } from '@/services/invites';
import { queryKeys } from '@/utils/queryKeys';
import { formatDate, truncate, copyToClipboard } from '@/utils/helpers';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Table from '@/components/ui/Table';
import Pagination from '@/components/ui/Pagination';
import { TableSkeleton } from '@/components/ui/Skeleton';

const PAGE_SIZE = 10;

function getInviteStatus(invite) {
  if (invite.isValid) return { label: 'Valid', variant: 'valid' };
  if (invite.isUsed) return { label: 'Used', variant: 'used' };
  if (invite.isExpired) return { label: 'Expired', variant: 'expired' };
  return { label: 'Invalid', variant: 'expired' };
}

export default function InvitesPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [generated, setGenerated] = useState(null);
  const [copied, setCopied] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.invites.list(),
    queryFn: invitesService.listInvites,
  });

  const invites = data?.data || [];
  const totalPages = Math.ceil(invites.length / PAGE_SIZE);
  const paginated = invites.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const { mutate, isPending } = useMutation({
    mutationFn: invitesService.generateInvite,
    onSuccess: (res) => {
      if (res.success) {
        setGenerated(res.data);
        queryClient.invalidateQueries({ queryKey: queryKeys.invites.list() });
        toast.success('Invite link generated!');
        reset();
      }
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to generate invite'),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { expiresInMinutes: 30, note: '' } });

  const handleCopy = (text, key) => {
    copyToClipboard(text);
    setCopied(key);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(''), 2000);
  };

  const columns = [
    {
      key: 'index',
      label: '#',
      render: (_, _row, idx) => (page - 1) * PAGE_SIZE + idx + 1,
    },
    {
      key: 'code',
      label: 'Code',
      render: (val) => (
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-lg">
            {truncate(val, 16)}
          </span>
          <button
            onClick={() => handleCopy(val, val)}
            className="text-gray-400 hover:text-indigo-600 transition-colors"
            title="Copy code"
          >
            {copied === val ? (
              <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>
        </div>
      ),
    },
    {
      key: 'note',
      label: 'Note',
      render: (val) => (
        <span className="text-sm text-gray-500">{val || <span className="text-gray-300 italic">—</span>}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (_, row) => {
        const { label, variant } = getInviteStatus(row);
        return <Badge label={label} variant={variant} />;
      },
    },
    {
      key: 'createdBy',
      label: 'Created By',
      render: (val) => <span className="text-sm font-medium text-gray-700">{val}</span>,
    },
    {
      key: 'expiresAt',
      label: 'Expires At',
      render: (val) => <span className="text-xs text-gray-400">{formatDate(val)}</span>,
    },
    {
      key: 'createdAt',
      label: 'Created At',
      render: (val) => <span className="text-xs text-gray-400">{formatDate(val)}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Invite Links</h1>
        <p className="text-sm text-gray-500 mt-0.5">Generate and manage registration invite links</p>
      </div>

      {/* Generate form */}
      <Card title="Generate New Invite" subtitle="Create a time-limited invite link for a new user">
        <form onSubmit={handleSubmit((d) => mutate(d))} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Expires In (minutes)"
              type="number"
              min="5"
              max="10080"
              error={errors.expiresInMinutes?.message}
              {...register('expiresInMinutes', {
                required: 'Required',
                min: { value: 5, message: 'Minimum 5 minutes' },
                valueAsNumber: true,
              })}
            />
            <Input
              label="Note (optional)"
              placeholder="e.g. For John - onboarding"
              {...register('note')}
            />
          </div>
          <Button type="submit" loading={isPending}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Generate Invite
          </Button>
        </form>

        {/* Generated result */}
        {generated && (
          <div className="mt-5 p-4 bg-indigo-50 rounded-xl border border-indigo-200">
            <p className="text-sm font-semibold text-indigo-800 mb-3">Invite Generated Successfully</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-indigo-600 font-medium">Registration Link:</span>
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-xs font-mono text-indigo-700 bg-white px-2 py-1.5 rounded-lg border border-indigo-200 flex-1 truncate">
                    {generated.registrationLink}
                  </span>
                  <button
                    onClick={() => handleCopy(generated.registrationLink, 'link')}
                    className="text-indigo-600 hover:text-indigo-800 shrink-0"
                  >
                    {copied === 'link' ? (
                      <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-indigo-600">Expires:</span>
                <span className="text-indigo-700 font-medium">{formatDate(generated.expiresAt)}</span>
              </div>
              {generated.note && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-indigo-600">Note:</span>
                  <span className="text-indigo-700">{generated.note}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </Card>

      {/* Invites table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-900">All Invites</h3>
          <p className="text-xs text-gray-400 mt-0.5">{data?.count ?? 0} total invites generated</p>
        </div>
        {isLoading ? (
          <TableSkeleton rows={5} cols={7} />
        ) : isError ? (
          <div className="py-10 text-center text-red-400 text-sm">Failed to load invites</div>
        ) : (
          <>
            <Table columns={columns} data={paginated} emptyMessage="No invites generated yet" />
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}
