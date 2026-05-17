// app/create/components/CreateTransactionForm.tsx

"use client";

import { useMemo, useState } from "react";

import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Participant = {
  _id: string;
  name: string;
};

type Item = {
  _id: string;

  name: string;

  qty: number;
  amount: number;
};

export default function CreateTransactionForm() {
  const [place, setPlace] = useState("");
  const [date, setDate] = useState("");

  const [paymentDetails, setPaymentDetails] = useState("");

  const [payToParticipantId, setPayToParticipantId] = useState("");

  const [serviceCharge, setServiceCharge] = useState(0);

  const [participants, setParticipants] = useState<Participant[]>([
    {
      _id: crypto.randomUUID(),
      name: "",
    },
  ]);

  const [items, setItems] = useState<Item[]>([
    {
      _id: crypto.randomUUID(),
      name: "",
      qty: 1,
      amount: 0,
    },
  ]);

  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => {
      return acc + item.qty * item.amount;
    }, 0);
  }, [items]);

  const total = subtotal + Number(serviceCharge || 0);

  const addParticipant = () => {
    setParticipants((prev) => [
      ...prev,
      {
        _id: crypto.randomUUID(),
        name: "",
      },
    ]);
  };

  const updateParticipant = (_id: string, value: string) => {
    setParticipants((prev) =>
      prev.map((participant) =>
        participant._id === _id
          ? {
              ...participant,
              name: value,
            }
          : participant,
      ),
    );
  };

  const removeParticipant = (_id: string) => {
    setParticipants((prev) =>
      prev.filter((participant) => participant._id !== _id),
    );
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        _id: crypto.randomUUID(),
        name: "",
        qty: 1,
        amount: 0,
      },
    ]);
  };

  const updateItem = (
    _id: string,
    field: keyof Item,
    value: string | number,
  ) => {
    setItems((prev) =>
      prev.map((item) =>
        item._id === _id
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );
  };

  const removeItem = (_id: string) => {
    setItems((prev) => prev.filter((item) => item._id !== _id));
  };

  const handleSubmit = async () => {
    const payload = {
      place,
      date,

      participants: participants.map((participant) => ({
        ...participant,
        hasPaid: false,
      })),

      items: items.map((item) => ({
        ...item,
        subtotal: Number(item.qty) * Number(item.amount),

        assignedTo: [],
      })),

      serviceCharge: Number(serviceCharge),

      subtotal,

      total,

      payToParticipantId,

      paymentDetails,
    };

    console.log(payload);

    // TODO:
    // POST /api/transaction
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-8 shadow-2xl">
      <div className="border-b border-border pb-6">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
          Debt Note
        </p>

        <h1 className="mt-3 font-serif text-4xl tracking-wide">
          Create Case File
        </h1>

        <p className="mt-2 text-muted-foreground">
          Record shared expenses and settle debts collaboratively.
        </p>
      </div>

      <div className="mt-8 space-y-8">
        {/* Transaction Details */}

        <section>
          <h2 className="font-serif text-2xl">Transaction Details</h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Place</Label>

              <Input
                required
                placeholder="Wolfgang Steakhouse"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Date</Label>

              <Input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Participants */}

        <section>
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl">Participants</h2>

            <Button variant="outline" size="sm" onClick={addParticipant}>
              <Plus className="mr-2 h-4 w-4" />
              Add
            </Button>
          </div>

          <div className="mt-4 space-y-3">
            {participants.map((participant) => (
              <div key={participant._id} className="flex gap-2">
                <Input
                  required
                  placeholder="Participant name"
                  value={participant.name}
                  onChange={(e) =>
                    updateParticipant(participant._id, e.target.value)
                  }
                />

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => removeParticipant(participant._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* Items */}

        <section>
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl">Debt Ledger</h2>

            <Button variant="outline" size="sm" onClick={addItem}>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </div>

          <div className="mt-4 space-y-4">
            {items.map((item) => {
              const subtotal = item.qty * item.amount;

              return (
                <div
                  key={item._id}
                  className="rounded-xl border border-border p-4"
                >
                  <div className="grid gap-4 sm:grid-cols-4">
                    <div className="sm:col-span-2">
                      <Label>Item Name</Label>

                      <Input
                        className="mt-2"
                        placeholder="Kebab Platter"
                        value={item.name}
                        onChange={(e) =>
                          updateItem(item._id, "name", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <Label>Qty</Label>

                      <Input
                        className="mt-2"
                        type="number"
                        value={item.qty}
                        onChange={(e) =>
                          updateItem(item._id, "qty", Number(e.target.value))
                        }
                      />
                    </div>

                    <div>
                      <Label>Amount</Label>

                      <Input
                        className="mt-2"
                        type="number"
                        value={item.amount}
                        onChange={(e) =>
                          updateItem(item._id, "amount", Number(e.target.value))
                        }
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Subtotal</p>

                    <p className="font-semibold">₱{subtotal.toFixed(2)}</p>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-4 text-red-400 hover:text-red-300"
                    onClick={() => removeItem(item._id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove Item
                  </Button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Payment */}

        <section>
          <h2 className="font-serif text-2xl">Settlement Details</h2>

          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label>Who Receives Payment</Label>

              <select
                value={payToParticipantId}
                onChange={(e) => setPayToParticipantId(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select participant</option>

                {participants.map((participant) => (
                  <option key={participant._id} value={participant._id}>
                    {participant.name || "Unnamed"}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label>Payment Details</Label>

              <Textarea
                placeholder="GCash: 09171234567"
                value={paymentDetails}
                onChange={(e) => setPaymentDetails(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Service Charge</Label>

              <Input
                type="number"
                value={serviceCharge}
                onChange={(e) => setServiceCharge(Number(e.target.value))}
              />
            </div>
          </div>
        </section>

        {/* Totals */}

        <section className="rounded-xl border border-border bg-background/40 p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-muted-foreground">
              <span>Subtotal</span>

              <span>₱{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between text-muted-foreground">
              <span>Service Charge</span>

              <span>₱{Number(serviceCharge).toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between border-t border-border pt-4">
              <span className="font-serif text-2xl">Total</span>

              <span className="text-3xl font-black text-red-100">
                ₱{total.toFixed(2)}
              </span>
            </div>
          </div>
        </section>

        <Button onClick={handleSubmit} className="w-full" size="lg">
          Create Case File
        </Button>
      </div>
    </div>
  );
}
