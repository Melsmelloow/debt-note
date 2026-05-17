"use client";
import { Transaction } from "@/types/transaction";
import { CalendarDays, MapPin, NotebookPen } from "lucide-react";

type ReceiptHeaderProps = {
  transaction: Transaction;
};

export default function ReceiptHeader({ transaction }: ReceiptHeaderProps) {
  return (
    <div className="border-b border-border pb-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <NotebookPen className="h-4 w-4" />

            <span className="text-xs uppercase tracking-[0.3em]">
              Debt Note
            </span>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            Transaction ID: {transaction._id}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />

          <span>{transaction.place}</span>
        </div>

        <div className="flex items-center gap-2 sm:justify-end">
          <CalendarDays className="h-4 w-4" />

          <span>{transaction.date}</span>
        </div>
      </div>
    </div>
  );
}
