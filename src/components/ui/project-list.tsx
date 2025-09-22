"use client";

import * as React from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Download, FileDown, FileCog, MoreHorizontal } from "lucide-react";

type Project = {
  id: string;
  name: string;
  file_path: string;
  file_size: number | null;
  project_type: string | null;
  project_status: string | null;
  created_at: string;
  pdf_url: string | null;
};

function formatBytes(bytes: number | null) {
  if (!bytes && bytes !== 0) return "—";
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), sizes.length - 1);
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}

function getFileExtension(fileName: string) {
  return fileName.split('.').pop()?.toLowerCase() || '';
}

function extIcon(fileName: string) {
  const ext = getFileExtension(fileName);
  if (ext === "pdf") return <FileDown className="h-4 w-4" />;
  if (ext === "dwg") return <FileCog className="h-4 w-4" />;
  return <MoreHorizontal className="h-4 w-4" />;
}

export default function ProjectList() {
  const [loading, setLoading] = React.useState(true);
  const [items, setItems] = React.useState<Project[]>([]);
  const [cursor, setCursor] = React.useState<number>(0);
  const PAGE = 20;

  const fetchPage = React.useCallback(async (reset = false) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setItems([]);
        return;
      }
      const from = reset ? 0 : cursor;
      const to = from + PAGE - 1;

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;
      setItems(reset ? (data as Project[]) : [...items, ...(data as Project[])]);
      setCursor(to + 1);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [cursor, items]);

  React.useEffect(() => {
    fetchPage(true);
  }, []);

  // Realtime updates
  React.useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const channel = supabase
        .channel("projects_changes")
        .on("postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "projects",
            filter: `user_id=eq.${user.id}`
          },
          () => fetchPage(true)
        )
        .subscribe();
      return () => { supabase.removeChannel(channel); };
    })();
  }, [fetchPage]);

  async function getUrl(p: Project) {
    if (p.pdf_url) return p.pdf_url;
    
    // Try to generate signed URL from storage
    try {
      const { data, error } = await supabase
        .storage.from("projects")
        .createSignedUrl(p.file_path, 60 * 5);
      if (error) throw error;
      return data.signedUrl;
    } catch (error) {
      console.error("Error creating signed URL:", error);
      // If signed URL fails, return the direct file path
      return p.file_path;
    }
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold tracking-tight">Seus Projetos</h2>

      {/* Desktop table */}
      <div className="hidden md:block rounded-2xl border bg-card text-card-foreground">
        <div className="grid grid-cols-12 px-4 py-3 text-sm text-muted-foreground">
          <div className="col-span-5">Arquivo</div>
          <div className="col-span-2">Tipo</div>
          <div className="col-span-2">Tamanho</div>
          <div className="col-span-2">Enviado em</div>
          <div className="col-span-1 text-right">Ações</div>
        </div>
        <div className="divide-y">
          {loading && Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="grid grid-cols-12 items-center gap-4 px-4 py-4 animate-pulse">
              <div className="col-span-5 h-4 rounded bg-muted" />
              <div className="col-span-2 h-4 rounded bg-muted" />
              <div className="col-span-2 h-4 rounded bg-muted" />
              <div className="col-span-2 h-4 rounded bg-muted" />
              <div className="col-span-1 h-8 rounded bg-muted" />
            </div>
          ))}

          {!loading && items.length === 0 && (
            <div className="px-4 py-8 text-sm text-muted-foreground">
              Nenhum projeto ainda — envie um PDF ou DWG para começar.
            </div>
          )}

          {!loading && items.map(p => (
            <div key={p.id} className="grid grid-cols-12 items-center gap-4 px-4 py-4">
              <div className="col-span-5 flex items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                  {extIcon(p.name)}
                </span>
                <div className="truncate">
                  <div className="truncate font-medium">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.project_status || 'Processando'}</div>
                </div>
              </div>
              <div className="col-span-2 uppercase text-xs">{getFileExtension(p.name)}</div>
              <div className="col-span-2">{formatBytes(p.file_size)}</div>
              <div className="col-span-2 text-sm">
                {new Date(p.created_at).toLocaleDateString()}
              </div>
              <div className="col-span-1 flex justify-end">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Baixar"
                  onClick={async () => {
                    try {
                      const url = await getUrl(p);
                      window.open(url, "_blank");
                    } catch (error) {
                      console.error("Error opening file:", error);
                    }
                  }}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden grid grid-cols-1 gap-3">
        {loading && Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <CardTitle className="h-5 w-2/3 rounded bg-muted" />
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="h-4 w-24 rounded bg-muted" />
              <div className="h-4 w-32 rounded bg-muted" />
              <div className="h-9 w-20 rounded bg-muted" />
            </CardContent>
          </Card>
        ))}

        {!loading && items.length === 0 && (
          <Card>
            <CardContent className="py-6 text-sm text-muted-foreground">
              Nenhum projeto ainda — envie um PDF ou DWG para começar.
            </CardContent>
          </Card>
        )}

        {!loading && items.map(p => (
          <Card key={p.id}>
            <CardHeader className="flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                  {extIcon(p.name)}
                </span>
                <div className="truncate">
                  <div className="truncate font-medium">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.project_status || 'Processando'}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex items-center justify-between gap-3">
              <div className="text-xs text-muted-foreground">
                {getFileExtension(p.name).toUpperCase()} • {formatBytes(p.file_size)} • {new Date(p.created_at).toLocaleDateString()}
              </div>
              <Button
                size="sm"
                onClick={async () => {
                  try {
                    const url = await getUrl(p);
                    window.open(url, "_blank");
                  } catch (error) {
                    console.error("Error opening file:", error);
                  }
                }}
              >
                <Download className="mr-2 h-4 w-4" /> Baixar
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Ver mais */}
      {!loading && items.length >= PAGE && (
        <div className="flex justify-center pt-2">
          <Button variant="outline" onClick={() => fetchPage(false)}>
            Ver mais
          </Button>
        </div>
      )}
    </section>
  );
}