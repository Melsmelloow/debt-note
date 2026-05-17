// app/transaction/[id]/components/ActiveUsers.tsx

import { motion, AnimatePresence } from "framer-motion";
import { Wifi } from "lucide-react";

import { Participant } from "@/types/transaction";

type ActiveUsersProps = {
  users: Participant[];
};

export default function ActiveUsers({ users }: ActiveUsersProps) {
  console.log(users);
  if (users.length === 0) return null;

  return (
    <div className="fixed right-4 top-4 z-50 w-[280px]">
      <div className="rounded-2xl border border-border bg-card/95 p-4 shadow-2xl backdrop-blur">
        <div className="mb-3 flex items-center gap-2">
          <div className="rounded-full bg-green-500/10 p-2">
            <Wifi className="h-4 w-4 text-green-500" />
          </div>

          <div>
            <h3 className="text-sm font-semibold">Live Participants</h3>

            <p className="text-xs text-muted-foreground">
              {users.length} active now
            </p>
          </div>
        </div>

        <div className="space-y-2">
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
                className="flex items-center justify-between rounded-xl border border-border bg-muted/30 px-3 py-2"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>

                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card bg-green-500" />
                  </div>

                  <div>
                    <p className="text-sm font-medium">{user.name}</p>

                    <p className="text-xs text-muted-foreground">
                      Viewing receipt
                    </p>
                  </div>
                </div>

                <div className="text-[10px] uppercase tracking-wider text-green-500">
                  LIVE
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
