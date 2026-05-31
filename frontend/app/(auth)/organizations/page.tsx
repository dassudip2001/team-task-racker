"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Building2Icon,
  PlusIcon,
  Trash2Icon,
  CalendarIcon,
  SearchIcon,
} from "lucide-react";
import Loading from "@/components/common/loading";
import Error from "@/components/common/error";
import { Organization } from "@/schema/organization";

export default function OrganizationsPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const {
    data: organizations,
    isLoading,
    isError,
  } = useQuery<Organization[]>({
    queryKey: ["organizations"],
    queryFn: async () => {
      const res = await api.get("/organizations/");
      return res.data;
    },
  });

  const filteredOrgs = (organizations || []).filter(
    (org) =>
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.slug.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between pb-4 border-b border-border/40">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/75 bg-clip-text text-transparent">
            Organizations
          </h2>
          <p className="text-muted-foreground mt-1.5 text-sm">
            View and manage tenant organizations across your tenant workspace.
          </p>
        </div>

        <Button
          size="lg"
          className="shadow-xs hover:shadow-md transition-all gap-2 cursor-pointer bg-primary text-primary-foreground font-medium rounded-lg"
        >
          <PlusIcon className="w-4 h-4" />
          New Organization
        </Button>
      </div>

      <div className="flex gap-4 items-center bg-card/25 p-4 rounded-xl border border-border/50 backdrop-blur-xs">
        <div className="relative w-full md:w-80">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/80" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search organizations..."
            className="pl-9 w-full rounded-lg"
          />
        </div>
      </div>

      <div className="rounded-xl border border-border/60 bg-card/45 backdrop-blur-xs shadow-xs overflow-hidden">
        {isLoading ? (
          <Loading />
        ) : isError ? (
          <Error message={"Failed to load organizations."} />
        ) : filteredOrgs.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center select-none">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/5 text-primary mb-4 border border-primary/10">
              <Building2Icon className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-semibold">No organizations found</h3>
            <p className="text-muted-foreground max-w-sm mt-2 text-sm leading-relaxed">
              {searchTerm
                ? "No organizations match your current search query."
                : "You don't have any organizations configured. Create one to begin setting up your team workspaces."}
            </p>
            {!searchTerm && (
              <Button className="mt-5 rounded-lg cursor-pointer shadow-xs hover:shadow-md transition-all gap-1.5">
                <PlusIcon className="w-4 h-4" />
                Create Organization
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/80 bg-muted/20 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Slug</th>
                  <th className="py-4 px-6">Created Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredOrgs.map((org) => (
                  <tr
                    key={org.id}
                    className="hover:bg-muted/15 transition-colors group/row"
                  >
                    <td className="py-4 px-6 font-medium text-foreground">
                      <div className="flex items-center gap-2">
                        <Building2Icon className="w-4 h-4 text-muted-foreground/80 group-hover/row:text-primary transition-colors" />
                        <span>{org.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-muted-foreground text-sm">
                      <code className="text-xs px-2 py-0.5 rounded bg-muted/75 font-mono text-muted-foreground border border-border/50">
                        {org.slug}
                      </code>
                    </td>
                    <td className="py-4 px-6 text-muted-foreground text-sm whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <CalendarIcon className="w-3.5 h-3.5" />
                        {new Date(org.created_at).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <Button
                        variant="destructive"
                        size="icon-sm"
                        onClick={() => {
                          console.log("delete");
                        }}
                        title="Delete organization"
                        className=" rounded-md cursor-pointer"
                      >
                        <Trash2Icon className="w-3.5 h-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
