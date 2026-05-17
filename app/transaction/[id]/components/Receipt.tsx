// app/transaction/[id]/components/Receipt.tsx

"use client";

import debounce from "lodash/debounce";
import { useEffect, useMemo, useState } from "react";

import { socket } from "@/lib/socket";
import { Participant, Transaction, TransactionItem } from "@/types/transaction";

import ParticipantBreakdown from "./ParticipantBreakdown";
import ReceiptHeader from "./ReceiptHeader";
import ReceiptItems from "./ReceiptItems";
import ReceiptTotals from "./ReceiptTotals";
import ActiveUsers from "./ActiveUsers";

type ReceiptProps = {
  transaction: Transaction;
};

export default function Receipt({ transaction }: ReceiptProps) {
  const [receiptItems, setReceiptItems] = useState(transaction.items);

  const [participants, setParticipants] = useState(transaction.participants);

  // connected users
  const [activeUsers, setActiveUsers] = useState<Participant[]>([]);

  // current user
  const [currentUser, setCurrentUser] = useState<Participant | null>(null);

  // ask/select participant on first visit
  useEffect(() => {
    const storedUserId = localStorage.getItem(
      `transaction-user-${transaction._id}`,
    );

    if (storedUserId) {
      const existingUser = transaction.participants.find(
        (participant) => participant._id === storedUserId,
      );

      if (existingUser) {
        setCurrentUser(existingUser);

        return;
      }
    }

    const participantNames = transaction.participants
      .map((participant, index) => {
        return `${index + 1}. ${participant.name}`;
      })
      .join("\n");

    const selected = window.prompt(
      `Who are you?\n\n${participantNames}\n\nEnter participant name exactly:`,
    );

    if (!selected) return;

    const matchedParticipant = transaction.participants.find(
      (participant) =>
        participant.name.toLowerCase() === selected.toLowerCase(),
    );

    if (matchedParticipant) {
      localStorage.setItem(
        `transaction-user-${transaction._id}`,
        matchedParticipant._id,
      );

      setCurrentUser(matchedParticipant);
    }
  }, [transaction]);

  // listen realtime updates
  useEffect(() => {
    if (!currentUser) return;

    socket.emit("join-transaction", {
      transactionId: transaction._id,

      participant: currentUser,
    });

    socket.on("transaction-updated", (updatedData) => {
      setReceiptItems(updatedData.items);

      setParticipants(updatedData.participants);
    });

    socket.on("active-users", (users: Participant[]) => {
      setActiveUsers(users);
    });

    return () => {
      socket.off("transaction-updated");

      socket.off("active-users");
    };
  }, [transaction._id, currentUser]);

  console.log(activeUsers);

  // persist to database
  const persistTransaction = async (
    updatedItems: TransactionItem[],
    updatedParticipants: Participant[],
  ) => {
    try {
      await fetch(`/api/transaction/${transaction._id}`, {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          items: updatedItems,
          participants: updatedParticipants,
        }),
      });
    } catch (error) {
      console.error("Failed to persist transaction", error);
    }
  };

  // debounce db updates
  const debouncedPersist = useMemo(
    () =>
      debounce(
        (
          updatedItems: TransactionItem[],
          updatedParticipants: Participant[],
        ) => {
          persistTransaction(updatedItems, updatedParticipants);
        },
        500,
      ),
    [transaction._id],
  );

  // cleanup debounce
  useEffect(() => {
    return () => {
      debouncedPersist.cancel();
    };
  }, [debouncedPersist]);

  // realtime updater
  const updateTransaction = (
    updatedItems: TransactionItem[],
    updatedParticipants: Participant[],
  ) => {
    socket.emit("update-transaction", {
      transactionId: transaction._id,

      items: updatedItems,

      participants: updatedParticipants,
    });

    debouncedPersist(updatedItems, updatedParticipants);
  };

  return (
    <div className="space-y-6">
      {/* ACTIVE USERS */}
      <ActiveUsers users={activeUsers} />

      <ReceiptHeader transaction={transaction} />

      <ReceiptItems
        items={receiptItems}
        participants={participants}
        setItems={(items) => {
          setReceiptItems((prev) => {
            const updatedItems =
              typeof items === "function" ? items(prev) : items;

            updateTransaction(updatedItems, participants);

            return updatedItems;
          });
        }}
      />

      <ReceiptTotals transaction={transaction} />

      <ParticipantBreakdown
        transaction={transaction}
        items={receiptItems}
        participants={participants}
        setParticipants={(value) => {
          setParticipants((prev) => {
            const updatedParticipants =
              typeof value === "function" ? value(prev) : value;

            updateTransaction(receiptItems, updatedParticipants);

            return updatedParticipants;
          });
        }}
      />
    </div>
  );
}
