"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { AnalyticsResponse } from "@/schema/analytics";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ClockIcon,
  AlertTriangleIcon,
  ZapIcon,
  TrophyIcon,
  UsersIcon,
  CheckCircle2Icon,
  TimerIcon,
  ShieldAlertIcon,
} from "lucide-react";
import { toast } from "sonner";
import DashboardLoading from "@/components/dashboard/dashboard-loading";
import EmptyDashboard from "@/components/dashboard/empty";
import {
  formatDuration,
  getAvatarFallback,
  getEfficiencyTier,
} from "@/components/dashboard/utils";
import DashboardError from "@/components/dashboard/error-dashboard";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import DashboardCard from "@/components/dashboard/dashboard-card";
import { useMemo } from "react";

export default function DashboardPage() {
  const [hoveredBar, setHoveredBar] = React.useState<string | null>(null);

  const {
    data: liveData,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery<AnalyticsResponse>({
    queryKey: ["analytics"],
    queryFn: async () => {
      const res = await api.get("/tasks/analytics");
      return res.data;
    },
    retry: 1,
    staleTime: 30000,
  });

  const data = liveData || { overdue_per_user: [], avg_completion_time: [] };

  const overdueList = data.overdue_per_user || [];
  const completionList = data.avg_completion_time || [];

  const totalOverdueTasks = overdueList.reduce(
    (acc, curr) => acc + curr.overdue_count,
    0,
  );

  const mostOverdueUser =
    overdueList.length > 0
      ? [...overdueList].sort((a, b) => b.overdue_count - a.overdue_count)[0]
      : null;

  const fastestUser =
    completionList.length > 0
      ? [...completionList]
          .filter((u) => u.avg_completion_seconds > 0)
          .sort(
            (a, b) => a.avg_completion_seconds - b.avg_completion_seconds,
          )[0]
      : null;

  const validCompletionSpeeds = completionList.filter(
    (u) => u.avg_completion_seconds > 0,
  );
  const teamAvgCompletionSeconds =
    validCompletionSpeeds.length > 0
      ? validCompletionSpeeds.reduce(
          (acc, curr) => acc + curr.avg_completion_seconds,
          0,
        ) / validCompletionSpeeds.length
      : 0;

  const userStatsMap = React.useMemo(() => {
    const map: Record<
      string,
      {
        assignee_id: string;
        username: string;
        email: string;
        overdue_count: number;
        avg_completion_seconds: number;
      }
    > = {};

    overdueList.forEach((item) => {
      map[item.assignee_id] = {
        assignee_id: item.assignee_id,
        username: item.username,
        email: item.email || "—",
        overdue_count: item.overdue_count,
        avg_completion_seconds: 0,
      };
    });

    completionList.forEach((item) => {
      if (map[item.assignee_id]) {
        map[item.assignee_id].avg_completion_seconds =
          item.avg_completion_seconds;
      } else {
        map[item.assignee_id] = {
          assignee_id: item.assignee_id,
          username: item.username,
          email: "—",
          overdue_count: 0,
          avg_completion_seconds: item.avg_completion_seconds,
        };
      }
    });

    return Object.values(map).sort((a, b) => {
      if (b.overdue_count !== a.overdue_count) {
        return b.overdue_count - a.overdue_count;
      }
      return (
        (a.avg_completion_seconds || Infinity) -
        (b.avg_completion_seconds || Infinity)
      );
    });
  }, [overdueList, completionList]);

  const handleRefresh = async () => {
    try {
      await refetch();
      toast.success("Analytics refreshed successfully.");
    } catch {
      toast.error("Failed to refresh analytics.");
    }
  };

  const maxOverdue = useMemo(
    () => Math.max(...overdueList.map((u) => u.overdue_count), 1),
    [overdueList],
  );

  const maxCompletionSeconds = useMemo(
    () =>
      Math.max(...completionList.map((u) => u.avg_completion_seconds), 3600),
    [completionList],
  );

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 select-none bg-background/50 min-h-screen">
      <DashboardHeader
        handleRefresh={handleRefresh}
        isLoading={isLoading}
        isFetching={isFetching}
      />

      {isLoading ? (
        <DashboardLoading />
      ) : isError ? (
        <DashboardError handleRefresh={handleRefresh} />
      ) : overdueList.length === 0 && completionList.length === 0 ? (
        <EmptyDashboard />
      ) : (
        <div className="space-y-6 animate-fade-in-up duration-300">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <DashboardCard
              cardheaderText="Total Overdue Tasks"
              value={totalOverdueTasks}
              status={totalOverdueTasks > 0 ? "danger" : "success"}
              icon={<AlertTriangleIcon className="w-4 h-4" />}
            >
              <p className="text-[11px] text-muted-foreground mt-1.5 flex items-center gap-1">
                {totalOverdueTasks > 0 ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                    <span className="text-rose-500 font-medium">
                      Requires attention from team
                    </span>
                  </>
                ) : (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-emerald-500 font-medium">
                      All tasks are currently on track
                    </span>
                  </>
                )}
              </p>
            </DashboardCard>

            <DashboardCard
              cardheaderText="Average Resolution Cycle"
              value={
                teamAvgCompletionSeconds > 0
                  ? formatDuration(teamAvgCompletionSeconds)
                  : "N/A"
              }
              status={teamAvgCompletionSeconds > 0 ? "success" : "neutral"}
              icon={<ClockIcon className="w-4 h-4" />}
            >
              <p className="text-[11px] text-muted-foreground mt-1.5">
                Time from "Start Work" to "Complete"
              </p>
            </DashboardCard>

            <DashboardCard
              cardheaderText="Highest Backlog Load"
              value={
                mostOverdueUser?.overdue_count
                  ? mostOverdueUser.username
                  : "None"
              }
              status={mostOverdueUser?.overdue_count ? "warning" : "neutral"}
              icon={<AlertTriangleIcon className="w-4 h-4" />}
            >
              <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                {mostOverdueUser?.overdue_count ? (
                  <>
                    <span className="text-destructive font-semibold">
                      {mostOverdueUser.overdue_count} overdue
                    </span>
                    <span>
                      task
                      {mostOverdueUser.overdue_count > 1 ? "s" : ""} currently
                      assigned
                    </span>
                  </>
                ) : (
                  <span>No members have overdue backlogs</span>
                )}
              </p>
            </DashboardCard>

            <DashboardCard
              cardheaderText="Fastest Resolution Member"
              value={fastestUser?.username ?? "None"}
              status={fastestUser ? "success" : "neutral"}
              icon={<TrophyIcon className="w-4 h-4" />}
            >
              <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                {fastestUser ? (
                  <>
                    <ZapIcon className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span className="text-emerald-500 font-semibold">
                      {formatDuration(fastestUser.avg_completion_seconds)}
                    </span>
                    <span>average turn-around</span>
                  </>
                ) : (
                  <span>No completed tasks on file</span>
                )}
              </p>
            </DashboardCard>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-border/40 bg-card/45 backdrop-blur-xs shadow-xs hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-1.5">
                  <ShieldAlertIcon className="w-4 h-4 text-rose-500" />
                  <CardTitle className="text-lg font-bold">
                    Overdue Tasks by Assignee
                  </CardTitle>
                </div>
                <CardDescription className="text-xs">
                  A comparison showing which team members have tasks past their
                  due date.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                {overdueList.length === 0 ? (
                  <div className="h-64 flex flex-col items-center justify-center text-center">
                    <CheckCircle2Icon className="w-10 h-10 text-emerald-500 mb-2 opacity-80" />
                    <p className="text-sm font-semibold">Perfect Score!</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      No overdue tasks assigned to any team member.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 h-64 overflow-y-auto pr-1">
                    {overdueList.map((user) => {
                      const maxOverdue = Math.max(
                        ...overdueList.map((u) => u.overdue_count),
                        1,
                      );
                      const percent = (user.overdue_count / maxOverdue) * 100;

                      return (
                        <div
                          key={user.assignee_id}
                          className="group/row flex items-center justify-between gap-4 p-2 rounded-lg hover:bg-muted/10 transition-colors"
                          onMouseEnter={() =>
                            setHoveredBar(`overdue-${user.assignee_id}`)
                          }
                          onMouseLeave={() => setHoveredBar(null)}
                        >
                          {/* Name & Avatar */}
                          <div className="flex items-center gap-3 w-40 shrink-0">
                            <Avatar className="w-7 h-7 border border-border/80">
                              <AvatarFallback className="text-[10px] font-bold bg-muted">
                                {getAvatarFallback(user.username)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs font-semibold text-foreground truncate block">
                              {user.username}
                            </span>
                          </div>

                          {/* Graphical Bar */}
                          <div className="flex-1 h-3 rounded-full bg-muted/40 overflow-hidden relative border border-border/20">
                            <div
                              style={{ width: `${percent}%` }}
                              className={`h-full rounded-full bg-linear-to-r transition-all duration-500 ${
                                user.overdue_count >= 4
                                  ? "from-rose-500 to-rose-600 shadow-[0_0_8px_rgba(244,63,94,0.3)]"
                                  : user.overdue_count >= 2
                                    ? "from-amber-400 to-amber-500"
                                    : "from-blue-400 to-blue-500"
                              }`}
                            />
                            {hoveredBar === `overdue-${user.assignee_id}` && (
                              <div className="absolute inset-0 bg-white/10 animate-pulse pointer-events-none" />
                            )}
                          </div>

                          <div className="w-16 text-right shrink-0">
                            <span
                              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                user.overdue_count >= 4
                                  ? "bg-rose-500/10 text-rose-500"
                                  : user.overdue_count >= 1
                                    ? "bg-amber-500/10 text-amber-500"
                                    : "bg-emerald-500/10 text-emerald-500"
                              }`}
                            >
                              {user.overdue_count} task
                              {user.overdue_count !== 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-card/45 backdrop-blur-xs shadow-xs hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <TimerIcon className="w-4 h-4 text-blue-500" />
                    <CardTitle className="text-lg font-bold">
                      Average Completion Time
                    </CardTitle>
                  </div>
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest bg-muted/40 px-2 py-0.5 rounded border border-border/40">
                    Lower is Faster
                  </span>
                </div>
                <CardDescription className="text-xs">
                  The standard lifecycle speed per member to mark an active task
                  complete.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2 flex items-end justify-center h-64">
                {completionList.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center w-full h-full pb-4">
                    <ClockIcon className="w-10 h-10 text-muted-foreground/40 mb-2" />
                    <p className="text-sm font-semibold">No completion logs</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Complete a task to map performance rates.
                    </p>
                  </div>
                ) : (
                  <div className="flex items-end justify-around w-full h-full px-2 pb-2">
                    {completionList.map((user) => {
                      const maxSeconds = Math.max(
                        ...completionList.map((u) => u.avg_completion_seconds),
                        3600,
                      );
                      const heightPercent = Math.max(
                        (user.avg_completion_seconds / maxSeconds) * 80,
                        8,
                      );
                      const isHovered =
                        hoveredBar === `completion-${user.assignee_id}`;

                      return (
                        <div
                          key={user.assignee_id}
                          className="flex flex-col items-center group w-14 max-w-14 relative"
                          onMouseEnter={() =>
                            setHoveredBar(`completion-${user.assignee_id}`)
                          }
                          onMouseLeave={() => setHoveredBar(null)}
                        >
                          <div
                            className={`absolute -top-12 z-10 bg-popover text-popover-foreground border border-border/80 text-[10px] font-semibold py-1 px-2.5 rounded-lg shadow-md whitespace-nowrap transition-all duration-200 ${
                              isHovered
                                ? "opacity-100 translate-y-0 pointer-events-auto scale-100"
                                : "opacity-0 translate-y-2 pointer-events-none scale-95"
                            }`}
                          >
                            <div className="text-center font-bold">
                              {formatDuration(user.avg_completion_seconds)}
                            </div>
                            <div className="text-[8px] text-muted-foreground font-normal">
                              avg completion
                            </div>
                          </div>

                          <div className="w-7 rounded-t-lg bg-muted/30 border-x border-t border-border/20 h-40 flex items-end overflow-hidden mb-2 relative">
                            <div
                              style={{ height: `${heightPercent}%` }}
                              className={`w-full rounded-t-md bg-linear-to-t transition-all duration-500 ${
                                user.avg_completion_seconds <= 43200
                                  ? "from-emerald-500 to-teal-400"
                                  : user.avg_completion_seconds <= 86400
                                    ? "from-blue-500 to-cyan-400"
                                    : "from-indigo-600 to-violet-500"
                              }`}
                            />
                            {isHovered && (
                              <div className="absolute inset-0 bg-white/10 pointer-events-none" />
                            )}
                          </div>

                          <span className="text-[10px] font-semibold text-muted-foreground truncate w-full text-center">
                            {user.username.split(" ")[0]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="border-border/40 bg-card/45 backdrop-blur-xs shadow-xs">
            <CardHeader className="pb-3 border-b border-border/20 flex flex-row items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <UsersIcon className="w-4.5 h-4.5 text-primary" />
                  <CardTitle className="text-lg font-bold">
                    Teammate Performance Ledger
                  </CardTitle>
                </div>
                <CardDescription className="text-xs">
                  Efficiency breakdown and live workload levels across all
                  current team assignees.
                </CardDescription>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                {userStatsMap.length} Member
                {userStatsMap.length !== 1 ? "s" : ""} Cataloged
              </span>
            </CardHeader>
            <CardContent className="p-0">
              {userStatsMap.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground text-sm">
                  No teammates cataloged in stats log.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border/30 bg-muted/15 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                        <th className="py-3 px-6">Teammate</th>
                        <th className="py-3 px-6">Workload State</th>
                        <th className="py-3 px-6">Avg Speed</th>
                        <th className="py-3 px-6">Efficiency Tier</th>
                        <th className="py-3 px-6 text-right">Backlog Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20">
                      {userStatsMap.map((user, idx) => {
                        const tier = getEfficiencyTier(
                          user.avg_completion_seconds,
                        );
                        const isOverload = user.overdue_count >= 4;
                        const hasNoLogs = user.avg_completion_seconds === 0;

                        return (
                          <tr
                            key={user.assignee_id}
                            className="hover:bg-muted/10 transition-colors group/row text-sm"
                          >
                            <td className="py-3.5 px-6">
                              <div className="flex items-center gap-3">
                                <div className="relative">
                                  <Avatar className="w-8 h-8 border border-border/80">
                                    <AvatarFallback className="text-xs font-extrabold bg-muted">
                                      {getAvatarFallback(user.username)}
                                    </AvatarFallback>
                                  </Avatar>
                                  {idx === 0 &&
                                    user.avg_completion_seconds > 0 &&
                                    !isOverload && (
                                      <span
                                        className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[8px] font-bold text-white ring-1 ring-background shadow-xs"
                                        title="Efficiency Champ"
                                      >
                                        🏆
                                      </span>
                                    )}
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-semibold text-foreground group-hover/row:text-primary transition-colors">
                                    {user.username}
                                  </span>
                                  <span className="text-[10px] text-muted-foreground/80">
                                    {user.email}
                                  </span>
                                </div>
                              </div>
                            </td>

                            <td className="py-3.5 px-6">
                              {user.overdue_count > 0 ? (
                                <div className="inline-flex items-center gap-1.5">
                                  <span
                                    className={`h-2 w-2 rounded-full ${
                                      isOverload
                                        ? "bg-rose-500 animate-ping"
                                        : "bg-amber-400"
                                    }`}
                                  />
                                  <span
                                    className={`text-xs font-semibold ${
                                      isOverload
                                        ? "text-rose-500 font-bold"
                                        : "text-amber-500"
                                    }`}
                                  >
                                    {isOverload
                                      ? "Overloaded Backlog"
                                      : "Moderate Workload"}
                                  </span>
                                </div>
                              ) : (
                                <div className="inline-flex items-center gap-1.5 text-xs text-emerald-500 font-semibold">
                                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                  <span>Clear Backlog</span>
                                </div>
                              )}
                            </td>

                            <td className="py-3.5 px-6 font-mono text-xs font-semibold text-foreground">
                              {hasNoLogs
                                ? "—"
                                : formatDuration(user.avg_completion_seconds)}
                            </td>

                            <td className="py-3.5 px-6">
                              <span
                                className={`text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-md border ${
                                  hasNoLogs
                                    ? "bg-muted text-muted-foreground border-border/40"
                                    : tier.color
                                }`}
                              >
                                {hasNoLogs ? "No Data" : tier.label}
                              </span>
                            </td>

                            <td className="py-3.5 px-6 text-right">
                              <div className="inline-flex items-center gap-1">
                                <span className="text-xs font-bold text-foreground">
                                  {user.overdue_count}
                                </span>
                                <span className="text-[10px] text-muted-foreground">
                                  overdue
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
