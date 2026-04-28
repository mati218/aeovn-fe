export const queryKeys = {
  users: {
    all: ['users'],
    list: () => [...queryKeys.users.all, 'list'],
    detail: (id) => [...queryKeys.users.all, 'detail', id],
  },
  invites: {
    all: ['invites'],
    list: () => [...queryKeys.invites.all, 'list'],
  },
  auth: {
    status: ['auth', 'status'],
  },
};
