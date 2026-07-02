"use client";

import { Bell, CheckCheck, Trash2, Info, AlertCircle, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useNotificationStore } from "@/lib/stores/notification-store";
import { cn } from "@/lib/utils";

const typeConfig = {
  info: { icon: Info, color: "text-blue-500" },
  success: { icon: CheckCircle, color: "text-green-500" },
  error: { icon: AlertCircle, color: "text-red-500" },
  warning: { icon: AlertTriangle, color: "text-amber-500" },
};

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function NotificationCenter() {
  const { notifications, unreadCount, markRead, markAllRead, clearAll } = useNotificationStore();

  const iconBtnClass =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-6 w-6";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-medium text-destructive-foreground">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          <div className="flex gap-1">
            <button
              className={iconBtnClass}
              type="button"
              onClick={markAllRead}
              title="Mark all as read"
            >
              <CheckCheck className="h-3.5 w-3.5" />
            </button>
            <button
              className={iconBtnClass}
              type="button"
              onClick={clearAll}
              title="Clear all"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <Bell className="h-8 w-8 text-muted-foreground/50" />
            <p className="text-xs text-muted-foreground">No notifications</p>
          </div>
        ) : (
          <ScrollArea className="max-h-80">
            <div className="divide-y">
              {notifications.map((n) => {
                const { icon: Icon, color } = typeConfig[n.type];
                return (
                  <button
                    key={n.id}
                    className={cn(
                      "flex w-full items-start gap-3 px-3 py-2.5 text-left text-sm transition-colors hover:bg-accent",
                      !n.read && "bg-accent/40"
                    )}
                    type="button"
                    onClick={() => markRead(n.id)}
                  >
                    <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", color)} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-1">
                        <span className={cn("truncate text-xs font-medium", !n.read && "font-semibold")}>
                          {n.title}
                        </span>
                        {!n.read && (
                          <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                        )}
                      </div>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">{n.message}</p>
                      <p className="mt-0.5 text-[10px] text-muted-foreground/60">{timeAgo(n.timestamp)}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
