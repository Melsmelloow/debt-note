"use client";

import { Check, User2 } from "lucide-react";

import { Participant } from "@/types/transaction";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { cn } from "@/lib/utils";

type ParticipantSelectorProps = {
  open: boolean;

  participants: Participant[];

  currentParticipant?: Participant | null;

  onSelect: (participant: Participant) => void;

  onOpenChange: (open: boolean) => void;
};

export default function ParticipantSelector({
  open,
  participants,
  currentParticipant,
  onSelect,
  onOpenChange,
}: ParticipantSelectorProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Participant</DialogTitle>

          <DialogDescription>
            Choose who is currently viewing this receipt.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-2">
          {participants.map((participant) => {
            const isSelected =
              currentParticipant?._id === participant._id;

            return (
              <button
                key={participant._id}
                type="button"
                onClick={() => onSelect(participant)}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl border p-4 text-left transition-all",
                  isSelected
                    ? "border-emerald-500 bg-emerald-500/10"
                    : "border-border hover:bg-muted/40",
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full border bg-background"
                  >
                    <User2 className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="font-medium">{participant.name}</p>

                    <p className="text-sm text-muted-foreground">
                      Transaction participant
                    </p>
                  </div>
                </div>

                {isSelected && (
                  <div className="rounded-full bg-emerald-500 p-1 text-white">
                    <Check className="h-4 w-4" />
                  </div>
                )}
              </button>
}