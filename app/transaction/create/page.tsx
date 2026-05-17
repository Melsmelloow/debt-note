// app/transaction/create/page.tsx

"use client";

import { useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import ItemsInput, { ItemInput } from "./components/ItemsInput";

import ParticipantsInput, {
  ParticipantInput,
} from "./components/ParticipantsInput";

import PaymentSection from "./components/PaymentSection";

export default function CreateTransactionPage() {
  const router = useRouter();

  const [place, setPlace] = useState("");
  const [date, setDate] = useState("");

  const [participants, setParticipants] = useState<ParticipantInput[]>([
    {
      _id: crypto.randomUUID(),
      name: "",
    },
  ]);

  const [items, setItems] = useState<ItemInput[]>([
    {
      _id: crypto.randomUUID(),

      name: "",

      qty: 1,
      amount: 0,
    },
  ]);

  const [payToParticipantId, setPayToParticipantId] = useState("");

  const [paymentDetails, setPaymentDetails] = useState("");

  const [serviceCharge, setServiceCharge] = useState(0);

  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => {
      return acc + item.qty * item.amount;
    }, 0);
  }, [items]);

  const total = subtotal + Number(serviceCharge || 0);

  const handleCreateTransaction = async () => {
    const payload = {
      place,
      date,

      participants: participants.map((participant) => ({
        ...participant,

        hasPaid: false,
      })),

      items: items.map((item) => ({
        ...item,

        subtotal: item.qty * item.amount,

        assignedTo: [],
      })),

      serviceCharge,

      subtotal,
      total,

      payToParticipantId,

      paymentDetails,
    };

    try {
      const response = await fetch("/api/transaction", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),
      });

      console.log(response);
      if (!response.ok) {
        throw new Error("Failed to create transaction");
      }

      const data = await response.json();

      router.push(`/transaction/${data._id}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto w-full max-w-5xl">
        <div
          className="
            rounded-2xl
            border
            border-border
            bg-card
            p-8
            shadow-2xl
          "
        >
          {/* Header */}

          <div className="border-b border-border pb-6">
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
              Debt Note
            </p>

            <h1 className="mt-3 font-serif text-5xl tracking-wide">
              Create Case File
            </h1>

            <p className="mt-2 max-w-2xl text-muted-foreground">
              Record expenses, assign participants, and settle shared debts
              collaboratively.
            </p>
          </div>

          {/* Transaction Info */}

          <section className="mt-8">
            <h2 className="font-serif text-2xl tracking-wide">
              Transaction Details
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm text-muted-foreground">Place</label>

                <input
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
                  placeholder="Wolfgang Steakhouse"
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground">Date</label>

                <input
                  type="date"
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
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* Participants */}

          <div className="mt-10">
            <ParticipantsInput
              participants={participants}
              setParticipants={setParticipants}
            />
          </div>

          {/* Items */}

          <div className="mt-10">
            <ItemsInput items={items} setItems={setItems} />
          </div>

          {/* Payment */}

          <div className="mt-10">
            <PaymentSection
              participants={participants}
              payToParticipantId={payToParticipantId}
              setPayToParticipantId={setPayToParticipantId}
              paymentDetails={paymentDetails}
              setPaymentDetails={setPaymentDetails}
              serviceCharge={serviceCharge}
              setServiceCharge={setServiceCharge}
            />
          </div>

          {/* Totals */}

          <section
            className="
              mt-10
              rounded-2xl
              border
              border-border
              bg-background/40
              p-6
            "
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Subtotal</span>

                <span>₱{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between text-muted-foreground">
                <span>Service Charge</span>

                <span>₱{serviceCharge.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between border-t border-border pt-4">
                <span className="font-serif text-3xl tracking-wide">Total</span>

                <span className="text-4xl font-black text-red-100">
                  ₱{total.toFixed(2)}
                </span>
              </div>
            </div>
          </section>

          {/* Submit */}

          <div className="mt-10">
            <Button
              size="lg"
              className="h-12 w-full text-base"
              onClick={handleCreateTransaction}
            >
              Create Case File
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
