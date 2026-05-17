import {
  CheckCircle2,
  Clock3,
  CreditCard,
  ReceiptText,
  Wallet,
} from "lucide-react";

import { Participant, Transaction, TransactionItem } from "@/types/transaction";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type ParticipantBreakdownProps = {
  transaction: Transaction;

  items: TransactionItem[];

  participants: Participant[];

  setParticipants: React.Dispatch<React.SetStateAction<Participant[]>>;
};

export default function ParticipantBreakdown({
  transaction: { serviceCharge, payToParticipantId, paymentDetails },
  items,
  participants,
  setParticipants,
}: ParticipantBreakdownProps) {
  const calculateParticipantTotal = (participantId: string) => {
    let total = 0;

    items.forEach((item) => {
      if (item.assignedTo.includes(participantId)) {
        total += item.subtotal / item.assignedTo.length;
      }
    });

    let sharedServiceCharge = 0;
    if (serviceCharge) {
      sharedServiceCharge = serviceCharge / participants.length;
    }

    return total + sharedServiceCharge;
  };

  const payToParticipant = participants.find(
    (participant) => participant._id === payToParticipantId,
  );

  const togglePaidStatus = (participantId: string) => {
    setParticipants((prev) =>
      prev.map((participant) =>
        participant._id === participantId
          ? {
              ...participant,
              hasPaid: !participant.hasPaid,
            }
          : participant,
      ),
    );
  };
  return (
    <div className="mt-8 border-t border-border pt-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl tracking-wide">Final Judgment</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Outstanding Balances
          </p>
        </div>

        <ReceiptText className="h-5 w-5 text-muted-foreground" />
      </div>

      <div className="space-y-3">
        {participants.map((participant) => {
          const total = calculateParticipantTotal(participant._id);

          return (
            <div
              key={participant._id + participant.name}
              className="flex items-center justify-between rounded-xl border border-border bg-background/40 px-4 py-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{participant.name}</p>

                  {participant.hasPaid ? (
                    <Badge
                      className="
    border-emerald-500/20
    bg-emerald-500/10
    text-emerald-400
    hover:bg-emerald-500/20 gap-1
  "
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      Paid
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="gap-1">
                      <Clock3 className="h-3 w-3" />
                      Pending
                    </Badge>
                  )}
                </div>

                <p className="mt-1 text-sm text-muted-foreground">
                  Pending Settlement
                </p>
              </div>

              <div className="flex items-center gap-3">
                <p className="text-lg font-semibold">₱{total.toFixed(2)}</p>

                {!participant.hasPaid && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => togglePaidStatus(participant._id)}
                  >
                    Mark Paid
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-xl border border-border bg-card/60 p-4">
        <div className="flex items-start gap-3">
          <div className="rounded-md border border-border p-2">
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </div>

          <div className="flex-1">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
              Settlement Instructions
            </p>

            <p className="mt-2 font-medium text-lg">
              Send payment to {payToParticipant?.name}
            </p>

            <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <CreditCard className="h-4 w-4" />

              <span>{paymentDetails}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
