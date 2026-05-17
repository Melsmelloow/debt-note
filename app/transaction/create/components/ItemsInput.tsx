// app/transaction/create/components/ItemsInput.tsx

"use client";

import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type ItemInput = {
  id: string;

  name: string;

  qty: number;
  amount: number;
};

type ItemsInputProps = {
  items: ItemInput[];

  setItems: React.Dispatch<React.SetStateAction<ItemInput[]>>;
};

export default function ItemsInput({ items, setItems }: ItemsInputProps) {
  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),

        name: "",

        qty: 1,
        amount: 0,
      },
    ]);
  };

  const updateItem = (
    _id: string,
    field: keyof ItemInput,
    value: string | number,
  ) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === _id
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );
  };

  const removeItem = (_id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== _id));
  };

  return (
    <section>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl tracking-wide">Debt Ledger</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Add all receipt items involved in the case file.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={addItem} className="gap-2" type="button">
          <Plus className="h-4 w-4" />
          Add Item
        </Button>
      </div>

      <div className="mt-6 space-y-4">
        {items.map((item, index) => {
          const subtotal = item.qty * item.amount;

          return (
            <div
              key={item.id}
              className="
                rounded-2xl
                border
                border-border
                bg-background/40
                p-5
                transition-all
                duration-200
                hover:border-zinc-700
              "
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                    Item #{index + 1}
                  </p>

                  <h3 className="mt-1 font-medium">
                    {item.name || "Unnamed Item"}
                  </h3>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  disabled={items.length === 1}
                  onClick={() => removeItem(item.id)}
                  className="
                    text-red-400
                    hover:bg-red-500/10
                    hover:text-red-300
                  "
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-4">
                <div className="sm:col-span-2">
                  <Label>Item Name</Label>

                  <Input
                    required
                    className="mt-2"
                    placeholder="Kebab Platter"
                    value={item.name}
                    onChange={(e) =>
                      updateItem(item.id, "name", e.target.value)
                    }
                  />
                </div>

                <div>
                  <Label>Quantity</Label>

                  <Input
                    required
                    className="mt-2"
                    type="number"
                    min={1}
                    value={item.qty}
                    onChange={(e) =>
                      updateItem(item.id, "qty", Number(e.target.value))
                    }
                  />
                </div>

                <div>
                  <Label>Amount</Label>

                  <Input
                    required
                    className="mt-2"
                    type="number"
                    min={0}
                    value={item.amount}
                    onChange={(e) =>
                      updateItem(item.id, "amount", Number(e.target.value))
                    }
                  />
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                    Calculated Subtotal
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    qty × amount
                  </p>
                </div>

                <p className="text-xl font-bold text-red-100">
                  ₱{subtotal.toFixed(2)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
