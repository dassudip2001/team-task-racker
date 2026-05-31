"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";

import {
  FolderPlusIcon,
  Trash2Icon,
  CalendarIcon,
  FolderIcon,
  LayersIcon,
} from "lucide-react";
import Loading from "@/components/common/loading";
import Error from "@/components/common/error";
import { Project } from "@/schema/project";

export default function ProjectsPage() {
  const {
    data: projects,
    isLoading,
    isError,
  } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await api.get("/projects/");
      return res.data;
    },
  });

  return (
    <>
      <div className="flex-1 space-y-6 p-8 pt-6">
        <div className="flex items-center justify-between pb-4 border-b border-border/40">
          <div>
            <h2 className="text-3xl font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/75 bg-clip-text text-transparent">
              Projects
            </h2>
            <p className="text-muted-foreground mt-1.5 text-sm">
              Manage your organization's projects, modules, and work streams.
            </p>
          </div>

          <Button
            size="lg"
            className="shadow-xs hover:shadow-md transition-all gap-2 cursor-pointer bg-primary text-primary-foreground font-medium rounded-lg"
          >
            <FolderPlusIcon className="w-4 h-4" />
            New Project
          </Button>
        </div>

        <div className="rounded-xl border border-border/60 bg-card/45 backdrop-blur-xs shadow-xs overflow-hidden">
          {isLoading ? (
            <Loading />
          ) : isError ? (
            <Error message={"Failed to load projects."} />
          ) : !projects || projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center select-none">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/5 text-primary mb-4 border border-primary/10">
                <LayersIcon className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-semibold">No projects yet</h3>
              <p className="text-muted-foreground max-w-sm mt-2 text-sm leading-relaxed">
                Projects help you organize task groups. Create your first
                project to get started.
              </p>
              <Button className="mt-5 rounded-lg cursor-pointer shadow-xs hover:shadow-md transition-all gap-1.5">
                <FolderPlusIcon className="w-4 h-4" />
                Create Project
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/80 bg-muted/20 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <th className="py-4 px-6">Name</th>
                    <th className="py-4 px-6 w-1/2">Description</th>
                    <th className="py-4 px-6">Created</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {projects.map((project) => (
                    <tr
                      key={project.id}
                      className="hover:bg-muted/15 transition-colors group/row"
                    >
                      <td className="py-4 px-6 font-medium text-foreground">
                        <div className="flex items-center gap-2">
                          <FolderIcon className="w-4 h-4 text-muted-foreground/80 group-hover/row:text-primary transition-colors" />
                          <span>{project.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-muted-foreground text-sm max-w-md truncate">
                        {project.description || (
                          <span className="text-muted-foreground/40 italic">
                            No description provided
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-muted-foreground text-sm whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <CalendarIcon className="w-3.5 h-3.5" />
                          {new Date(project.created_at).toLocaleDateString(
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
                            console.log("");
                          }}
                          title="Delete project"
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
    </>
  );
}
