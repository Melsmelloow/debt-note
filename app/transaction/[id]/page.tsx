// app/transaction/[id]/page.tsx

import { notFound } from "next/navigation";

import Receipt from "./components/Receipt";

import { connectDB } from "@/lib/mongodb";
import { Transaction as TransactionModel } from "@/models/Transactions";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  await connectDB();

  const transaction = await TransactionModel.findById(id).lean();

  if (!transaction) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto w-full max-w-3xl">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-2xl">
          <Receipt transaction={JSON.parse(JSON.stringify(transaction))} />
        </div>
      </div>
    </div>
  );
}
