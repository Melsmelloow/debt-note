"use client";

import { useState } from "react";

import { Check, ChevronDown, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Participant, TransactionItem } from "@/types/transaction";

type ReceiptItemsProps = {
  items: TransactionItem[];
  participants: Participant[];

  setItems: React.Dispatch<React.SetStateAction<TransactionItem[]>>;
};

export default function ReceiptItems({
  items,
  participants,
  setItems,
}: ReceiptItemsProps) {
  const toggleParticipant = (itemId: string, participantId: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;

        const alreadyAssigned = item.assignedTo.includes(participantId);

        return {
          ...item,
          assignedTo: alreadyAssigned
            ? item.assignedTo.filter((id) => id !== participantId)
            : [...item.assignedTo, participantId],
        };
      }),
    );
  };
  console.log(participants);
  console.log(items);

  const getParticipantName = (id: string) => {
    return participants.find((p) => p.id === id)?.name;
  };

  return (
    <div className="mt-8">
      <div className="mb-4 flex items-center justify-between border-b border-border pb-2">
        <h2 className="font-serif text-2xl tracking-wide">Debt Ledger</h2>

        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {items.length} Recorded Items
        </span>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id + item.name}
            className="rounded-xl border border-border bg-background/40 p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-medium text-foreground">{item.name}</h3>

                <div className="mt-3 flex flex-wrap gap-2">
                  {item.assignedTo.map((participantId) => (
                    <Badge
                      key={`${item.id}-${participantId}`}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {getParticipantName(participantId)}

                      <button
                        onClick={() =>
                          toggleParticipant(item.id, participantId)
                        }
                        className="ml-1 rounded-full hover:bg-black/10"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        Assign Participant
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-64 p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search participant..." />

                        <CommandList>
                          <CommandEmpty>No participant found.</CommandEmpty>

                          <CommandGroup>
                            {participants.map((participant) => {
                              const selected = item.assignedTo.includes(
                                participant.id,
                              );

                              return (
                                <CommandItem
                                  key={participant.id + participant.name}
                                  onSelect={() =>
                                    toggleParticipant(item.id, participant.id)
                                  }
                                  className="flex items-center justify-between"
                                >
                                  <span>{participant.name}</span>

                                  {selected && <Check className="h-4 w-4" />}
                                </CommandItem>
                              );
                            })}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="text-right">
                <p className="font-semibold">₱{item.subtotal.toFixed(2)}</p>

                <p className="text-sm text-muted-foreground">
                  {item.qty} × ₱{item.amount.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
