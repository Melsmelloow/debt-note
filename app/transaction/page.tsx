// app/transaction/page.tsx

import { Transaction } from "@/types/transaction";
import Link from "next/link";

async function getTransactions(): Promise<Transaction[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/transaction`,
    {
      cache: "no-store", // SSR fresh data
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch transactions");
  }

  return res.json();
}

export default async function TransactionPage() {
  const transactions = await getTransactions();

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto w-full max-w-3xl">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-2xl">
          <h1 className="mb-4 text-2xl font-bold">Transactions</h1>

          <div className="space-y-4">
            {transactions.map((transaction) => (
              <Link
                href={`/transaction/${transaction._id}`}
                key={transaction._id}
                className="block rounded-xl border p-4 shadow-sm transition hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">{transaction.place}</h2>

                  <span className="text-sm text-gray-500">
                    {new Date(transaction.date).toLocaleDateString()}
                  </span>
                </div>

                <p className="mt-2 text-sm">
                  Participants: {transaction.participants.length}
                </p>

                <p className="text-sm">Items: {transaction.items.length}</p>

                <p className="mt-2 font-medium">
                  Total: ₱{transaction.total.toFixed(2)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
