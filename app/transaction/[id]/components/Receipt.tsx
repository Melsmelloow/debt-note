"use client";

import debounce from "lodash/debounce";
import { domToPng } from "modern-screenshot";
import { useEffect, useMemo, useRef, useState } from "react";

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
  const screenshotRef = useRef<HTMLDivElement>(null);

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
        setShowUserSelector(false);

        return;
      }
    }

    // no valid stored user
    setShowUserSelector(true);
  }, [transaction]);

  const handleShareScreenshot = async () => {
    if (!screenshotRef.current) return;

    try {
      const dataUrl = await domToPng(screenshotRef.current, {
        quality: 1,
        scale: 2,
        backgroundColor: "#ffffff",
      });

      // mobile share
      if (navigator.share) {
        const response = await fetch(dataUrl);

        const blob = await response.blob();

        const file = new File([blob], "receipt.png", {
          type: "image/png",
        });

        await navigator.share({
          files: [file],
          title: "Receipt",
        });

        return;
      }

      // fallback download
      const link = document.createElement("a");

      link.href = dataUrl;

      link.download = "receipt.png";

      link.click();
    } catch (error) {
      console.error(error);
    }
  };

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
        <ActiveUsers
          users={[
            ...new Map(activeUsers.map((user) => [user.id, user])).values(),
          ]}
        />

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
        {/* SCREENSHOT WIDGET */}
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <div
            ref={screenshotRef}
            className="bg-white text-black rounded-xl p-5 hidden"
            style={{
              backgroundColor: "#ffffff",
              color: "#000000",
            }}
          >
            {/* HEADER */}
            <div className="border-b pb-3">
              <h2 className="text-xl font-bold">{transaction.place}</h2>

              <p className="text-sm text-gray-500">
                {new Date(transaction.date).toLocaleDateString()}
              </p>
            </div>

            {/* ITEMS */}
            <div className="mt-4">
              <h3 className="mb-3 font-semibold">List of Items</h3>

              <div className="space-y-3 text-sm">
                {receiptItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-3"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>

                      <p className="text-gray-500">
                        {item.qty} × ₱{item.amount.toFixed(2)}
                      </p>
                    </div>

                    <p className="font-semibold">₱{item.subtotal.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* TOTALS */}
            <div className="mt-5 border-t pt-4 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>

                <span>₱{transaction.subtotal.toFixed(2)}</span>
              </div>

              <div className="mt-2 flex justify-between">
                <span>Service Charge</span>

                <span>₱{(transaction.serviceCharge || 0).toFixed(2)}</span>
              </div>

              <div className="mt-3 flex justify-between text-base font-bold">
                <span>Total</span>

                <span>₱{transaction.total.toFixed(2)}</span>
              </div>
            </div>

            {/* PARTICIPANTS */}
            <div className="mt-5 border-t pt-4">
              <h3 className="mb-3 font-semibold">List of Participants</h3>

              <div className="space-y-4">
                {participants.map((participant) => {
                  const participantItems = receiptItems.filter((item) =>
                    item.assignedTo.includes(participant.id),
                  );

                  const itemTotal = participantItems.reduce((sum, item) => {
                    const splitCount = item.assignedTo.length || 1;

                    return sum + item.subtotal / splitCount;
                  }, 0);

                  const serviceChargeShare =
                    ((transaction.serviceCharge || 0) * itemTotal) /
                    transaction.subtotal;

                  const totalToPay = itemTotal + serviceChargeShare;

                  return (
                    <div key={participant.id}>
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{participant.name}</p>

                        <p className="font-bold">₱{totalToPay.toFixed(2)}</p>
                      </div>

                      <div className="mt-2 ml-3 space-y-1 text-sm text-gray-500">
                        {participantItems.map((item) => (
                          <p key={item.id}>• {item.name}</p>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* SHARE BUTTON */}
          <button
            onClick={handleShareScreenshot}
            className="
      mt-4
      w-full
      rounded-xl
      bg-black
      px-4
      py-3
      text-sm
      font-medium
      text-white
      transition
      hover:opacity-90
    "
          >
            Share as Screenshot
          </button>
        </div>
      </div>
    </>
  );
}
