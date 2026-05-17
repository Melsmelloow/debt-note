// app/transaction/create/components/ParticipantsInput.tsx

"use client";

import { Plus, Trash2, User2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type ParticipantInput = {
  _id: string;
  name: string;
};

type ParticipantsInputProps = {
  participants: ParticipantInput[];

  setParticipants: React.Dispatch<React.SetStateAction<ParticipantInput[]>>;
};

export default function ParticipantsInput({
  participants,
  setParticipants,
}: ParticipantsInputProps) {
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

  return (
    <section>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl tracking-wide">Participants</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Add everyone involved in the transaction.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={addParticipant}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Participant
        </Button>
      </div>

      <div className="mt-6 space-y-4">
        {participants.map((participant, index) => (
          <div
            key={participant._id}
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
            <div className="flex items-start justify-between gap-4">
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
                  <User2 className="h-4 w-4 text-muted-foreground" />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                    Participant #{index + 1}
                  </p>

                  <p className="mt-1 font-medium">
                    {participant.name || "Unnamed Participant"}
                  </p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeParticipant(participant._id)}
                className="
                  text-red-400
                  hover:bg-red-500/10
                  hover:text-red-300
                "
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-5">
              <Label>Participant Name</Label>

              <Input
                required
                className="mt-2"
                placeholder="Mel"
                value={participant.name}
                onChange={(e) =>
                  updateParticipant(participant._id, e.target.value)
                }
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
