"use client";

import { Plus } from "lucide-react";
import { Separator } from "../ui/separator";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import CreateServerDialog from "./create-server-dialog";
import { api } from "@/convex/_generated/api";
import { Preloaded, usePreloadedQuery } from "convex/react";

export default function ServerSidebar({
  preloadedUserData,
  preloadedServers,
}: {
  preloadedUserData: Preloaded<typeof api.user.getUserData>;
  preloadedServers: Preloaded<typeof api.server.getServersForUser>;
}) {
  const userData = usePreloadedQuery(preloadedUserData);
  const servers = usePreloadedQuery(preloadedServers);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isOnHome = pathname === "/channels/@me";
  const currentServerId = pathname.split("/")[2];

  return (
    <div className="w-[72px] bg-[#1E1F22] flex flex-col items-center py-3 gap-2">
      <div className="relative flex items-center justify-center w-full group">
        <ActiveIndicator isActive={isOnHome} />
        <Link href="/channels/@me">
          <button
            className={`w-12 h-12 hover:bg-[#5865F2] ${
              isOnHome
                ? "rounded-[16px] bg-[#5865F2]"
                : "rounded-full bg-[#313338]"
            } hover:rounded-[16px] flex items-center justify-center transition-colors`}
          >
            <Image src="/logo-white.svg" alt="Logo" width={28} height={28} />
          </button>
        </Link>
      </div>
      <Separator className="w-8 h-[2px] bg-[#36393F]" />
      {servers.length > 0 && (
        <div className="flex flex-col gap-2 w-full">
          {servers.map((server) => {
            const isActive = currentServerId === server?.serverId;

            if (!server) return null;

            if (server.serverImageUrl) {
              return (
                <div
                  key={server._id}
                  className="relative flex items-center justify-center group"
                >
                  <ActiveIndicator isActive={isActive} />
                  <button
                    className={`w-12 h-12 hover:rounded-[16px] flex items-center justify-center transition-colors overflow-hidden ${
                      isActive ? "rounded-[16px]" : "rounded-full"
                    }`}
                    onClick={() =>
                      router.push(
                        `/channels/${server.serverId}/${server.defaultChannelId}`
                      )
                    }
                  >
                    <Image
                      src={server.serverImageUrl}
                      alt="Server Image"
                      width={48}
                      height={48}
                      className="w-12 h-12 object-cover"
                    />
                  </button>
                </div>
              );
            }

            return (
              <div
                key={server._id}
                className="relative flex items-center justify-center group"
              >
                <ActiveIndicator isActive={isActive} />
                <button
                  className={`w-12 h-12 hover:rounded-[16px] flex items-center justify-center hover:bg-[#5765F2] hover:text-white transition-colors ${
                    isActive
                      ? "rounded-[16px] bg-[#5765F2] text-white"
                      : "rounded-full bg-[#36393F] text-[#DCDEE1]"
                  }`}
                  onClick={() =>
                    router.push(
                      `/channels/${server.serverId}/${server.defaultChannelId}`
                    )
                  }
                >
                  <div className="w-6 h-6 flex items-center justify-center">
                    <span className="text-white font-medium">
                      {server.name
                        .split(" ")
                        .map((word) => word.charAt(0))
                        .join("")}
                    </span>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      )}
      <button
        className={`w-12 h-12 hover:rounded-[16px] flex items-center justify-center hover:bg-[#22A559] hover:text-white transition-colors ${
          open
            ? "rounded-[16px] bg-[#22A559] text-white"
            : "rounded-full bg-[#36393F] text-[#22A559]"
        }`}
        onClick={() => setOpen(true)}
      >
        <Plus className="w-6 h-6" />
      </button>
      <CreateServerDialog
        open={open}
        onOpenChange={setOpen}
        userData={userData}
      />
    </div>
  );
}

const ActiveIndicator = ({ isActive }: { isActive: boolean }) => {
  return (
    <div
      className={`absolute left-0 w-[4px] bg-white rounded-r-full transition-all duration-300 ease-out ${
        isActive ? "h-10 opacity-100" : "h-0 opacity-0"
      } group-hover:opacity-100 ${!isActive && "group-hover:h-5"}`}
    />
  );
};
