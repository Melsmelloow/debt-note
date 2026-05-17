// app/transaction/[id]/components/ActiveUsers.tsx

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Wifi } from "lucide-react";
import { useState } from "react";

import { Participant } from "@/types/transaction";

type ActiveUsersProps = {
  users: Participant[];
};

export default function ActiveUsers({ users }: ActiveUsersProps) {
  const [collapsed, setCollapsed] = useState(false);

  if (users.length === 0) return null;

  return (
    <div
      className="
        fixed z-50

        right-3 top-3
        w-[220px]

        sm:right-4 sm:top-4
        sm:w-[280px]
      "
    >
      <div
        className="
          rounded-2xl border border-border
          bg-card/95
          shadow-2xl
          backdrop-blur
        "
      >
        {/* HEADER */}
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="
            flex w-full items-center justify-between
            p-3 sm:p-4
          "
        >
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-green-500/10 p-1.5 sm:p-2">
              <Wifi className="h-3.5 w-3.5 text-green-500 sm:h-4 sm:w-4" />
            </div>

            <div className="text-left">
              <h3 className="text-xs font-semibold sm:text-sm">
                Live Participants
              </h3>

              <p className="text-[10px] text-muted-foreground sm:text-xs">
                {users.length} active now
              </p>
            </div>
          </div>

          <motion.div
            animate={{
              rotate: collapsed ? -90 : 0,
            }}
            transition={{
              duration: 0.2,
            }}
          >
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </motion.div>
        </button>

        {/* COLLAPSIBLE CONTENT */}
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              initial={{
                height: 0,
                opacity: 0,
              }}
              animate={{
                height: "auto",
                opacity: 1,
              }}
              exit={{
                height: 0,
                opacity: 0,
              }}
              transition={{
                duration: 0.2,
              }}
              className="overflow-hidden"
            >
              <div className="px-3 pb-3 sm:px-4 sm:pb-4">
                <div className="max-h-[220px] space-y-1.5 overflow-y-auto sm:space-y-2">
                  <AnimatePresence>
                    {users.map((user) => (
                      <motion.div
                        key={user.id}
                        initial={{
                          opacity: 0,
                          x: 20,
                        }}
                        animate={{
                          opacity: 1,
                          x: 0,
                        }}
                        exit={{
                          opacity: 0,
                          x: 20,
                        }}
                        transition={{
                          duration: 0.2,
                        }}
                        className="
                          flex items-center justify-between
                          rounded-xl border border-border
                          bg-muted/30
                          px-2.5 py-2

                          sm:px-3
                        "
                      >
                        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                          <div className="relative shrink-0">
                            <div
                              className="
                                flex items-center justify-center
                                rounded-full
                                bg-primary/10
                                text-xs font-semibold

                                h-8 w-8
                                sm:h-9 sm:w-9
                                sm:text-sm
                              "
                            >
                              {user.name.charAt(0).toUpperCase()}
                            </div>

                            <span
                              className="
                                absolute bottom-0 right-0
                                h-2.5 w-2.5
                                rounded-full
                                border-2 border-card
                                bg-green-500
                              "
                            />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-xs font-medium sm:text-sm">
                              {user.name}
                            </p>

                            <p
                              className="
                                text-[10px]
                                text-muted-foreground
                                sm:text-xs
                              "
                            >
                              Viewing receipt
                            </p>
                          </div>
                        </div>

                        <div
                          className="
                            hidden sm:block
                            text-[10px]
                            uppercase tracking-wider
                            text-green-500
                          "
                        >
                          LIVE
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}