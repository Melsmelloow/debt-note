export type Transaction = {
  _id: string;

  place: string;
  date: string;

  participants: Participant[];

  items: TransactionItem[];

  serviceCharge?: number;

  subtotal: number;
  total: number;

  payToParticipantId: string;

  paymentDetails: string;
};

export type Participant = {
  id: string;
  name: string;
  hasPaid?: boolean;
};
export type TransactionItem = {
  id: string;

  name: string;

  qty: number;
  amount: number;

  subtotal: number;

  assignedTo: string[];
};
