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

  const [activeUsers, setActiveUsers] = useState<Participant[]>([]);

  const [currentUser, setCurrentUser] = useState<Participant | null>(null);

  const [showUserSelector, setShowUserSelector] = useState(false);

  console.log(participants);
  // load current user
  useEffect(() => {
    const storedUserId = localStorage.getItem(
      `transaction-user-${transaction._id}`,
    );

    if (storedUserId) {
      const existingUser = transaction.participants.find(
        (participant) => participant.id === storedUserId,
      );

      if (existingUser) {
        setCurrentUser(existingUser);

        return;
      }
    }

    setShowUserSelector(true);
  }, [transaction]);

  const handleSelectUser = (participant: Participant) => {
    console.log(participant);
    localStorage.setItem(`transaction-user-${transaction._id}`, participant.id);

    setCurrentUser(participant);

    setShowUserSelector(false);
  };

  // realtime listeners
 useEffect(() => {
  if (!currentUser) return;

  socket.emit("join-transaction", {
    transactionId: transaction._id,
    participant: currentUser,
  });

  socket.off("transaction-updated");

  socket.on("transaction-updated", (updatedData) => {
    setReceiptItems(updatedData.items);
    setParticipants(updatedData.participants);
  });

  socket.off("active-users");

  socket.on("active-users", (users: Participant[]) => {
    setActiveUsers(users);
  });

  return () => {
    socket.off("transaction-updated");
    socket.off("active-users");
  };
}, [transaction._id, currentUser]);

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

  useEffect(() => {
    return () => {
      debouncedPersist.cancel();
    };
  }, [debouncedPersist]);

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
    <>
      {/* USER SELECTOR MODAL */}
      {showUserSelector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3">
          <div className="w-full max-w-sm rounded-2xl bg-white p-4 shadow-xl">
            <h2 className="text-lg font-bold">Select Your Name</h2>

            <p className="mt-1 text-sm text-gray-500">
              Choose your participant identity
            </p>

            {/* SCROLLABLE LIST */}
            <div className="mt-4 max-h-[60vh] space-y-2 overflow-y-auto pr-1">
              {participants.map((participant) => (
                <button
                  key={participant.id}
                  onClick={() => handleSelectUser(participant)}
                  className="
              w-full rounded-xl border
              px-4 py-3
              text-left text-sm font-medium
              transition
              hover:bg-gray-100
              active:scale-[0.98]
            "
                >
                  {participant.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
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
    </>
  );
}
