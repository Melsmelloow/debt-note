// app/transaction/[id]/components/ReceiptTotals.tsx

import { Transaction } from "@/types/transaction";

type ReceiptTotalsProps = {
  transaction: Transaction;
};

export default function ReceiptTotals({
  transaction: { subtotal, serviceCharge, total },
}: ReceiptTotalsProps) {
  return (
    <div className="mt-8 border-t border-border pt-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Subtotal</span>

          <span>₱{subtotal.toFixed(2)}</span>
        </div>

        {serviceCharge && (
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Service Charge</span>

            <span>₱{serviceCharge.toFixed(2)}</span>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-border pt-4">
          <span className="font-serif text-2xl tracking-wide">Total</span>

          <span className="text-2xl font-bold">₱{total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
