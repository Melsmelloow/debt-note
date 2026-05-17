// app/transaction/create/components/PaymentSection.tsx

"use client";

import { CreditCard, Landmark, Wallet } from "lucide-react";

import { ParticipantInput } from "./ParticipantsInput";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type PaymentSectionProps = {
  participants: ParticipantInput[];

  payToParticipantId: string;
  setPayToParticipantId: (value: string) => void;

  paymentDetails: string;
  setPaymentDetails: (value: string) => void;

  serviceCharge: number;
  setServiceCharge: (value: number) => void;
};

export default function PaymentSection({
  participants,

  payToParticipantId,
  setPayToParticipantId,

  paymentDetails,
  setPaymentDetails,

  serviceCharge,
  setServiceCharge,
}: PaymentSectionProps) {
  const selectedParticipant = participants.find(
    (participant) => participant._id === payToParticipantId,
  );

  return (
    <section>
      <div>
        <h2 className="font-serif text-2xl tracking-wide">
          Settlement Details
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Configure where payments should be sent once balances are settled.
        </p>
      </div>

      <div className="mt-6 space-y-6">
        {/* Recipient */}

        <div
          className="
            rounded-2xl
            border
            border-border
            bg-background/40
            p-5
          "
        >
          <div className="flex items-start gap-4">
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                border
                border-border
                bg-zinc-900
              "
            >
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </div>

            <div className="flex-1">
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                Payment Recipient
              </p>

              <h3 className="mt-1 font-medium">
                {selectedParticipant?.name || "No recipient selected"}
              </h3>

              <div className="mt-5">
                <Label>Who Receives Payment</Label>

                <select
                  value={payToParticipantId}
                  onChange={(e) => setPayToParticipantId(e.target.value)}
                  className="
                    mt-2
                    flex
                    h-10
                    w-full
                    rounded-md
                    border
                    border-input
                    bg-background
                    px-3
                    py-2
                    text-sm
                  "
                >
                  <option value="">Select participant</option>

                  {participants.map((participant) => (
                    <option key={participant._id} value={participant._id}>
                      {participant.name || "Unnamed"}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Details */}

        <div
          className="
            rounded-2xl
            border
            border-border
            bg-background/40
            p-5
          "
        >
          <div className="flex items-start gap-4">
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                border
                border-border
                bg-zinc-900
              "
            >
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </div>

            <div className="flex-1">
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                Payment Information
              </p>

              <h3 className="mt-1 font-medium">Settlement Instructions</h3>

              <div className="mt-5">
                <Label>Payment Details</Label>

                <Textarea
                  className="mt-2"
                  placeholder="
GCash: 09171234567
Maya: @melcarlo
BPI: 091918291
                  "
                  value={paymentDetails}
                  onChange={(e) => setPaymentDetails(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Service Charge */}

        <div
          className="
            rounded-2xl
            border
            border-border
            bg-background/40
            p-5
          "
        >
          <div className="flex items-start gap-4">
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                border
                border-border
                bg-zinc-900
              "
            >
              <Landmark className="h-4 w-4 text-muted-foreground" />
            </div>

            <div className="flex-1">
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                Additional Charges
              </p>

              <h3 className="mt-1 font-medium">Service Charge</h3>

              <div className="mt-5">
                <Label>Service Charge Amount</Label>

                <Input
                  required
                  className="mt-2"
                  type="number"
                  min={0}
                  value={serviceCharge}
                  onChange={(e) => setServiceCharge(Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
