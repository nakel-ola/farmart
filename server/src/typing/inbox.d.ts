export type InboxArgs = {
  input: {
    page: number;
    limit: number;
    customerId?: string;
  };
};

export type InboxType = {
  title: string;
  description: string;
  userId: string;
};

export type InboxData = {
  page: number;
  totalItems: number;
  results: InboxType[];
};

export type CreateInboxArgs = {
  input: {
    title: string;
    description: string;
    userId: string;
  };
};
export type ModifyInboxArgs = {
  input: {
    title: string;
    description: string;
    userId: string;
    id: string;
  };
};
