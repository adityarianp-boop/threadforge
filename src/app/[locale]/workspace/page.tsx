"use client";

import { useState } from "react";
import { Copy, Pin, Trash2 } from "lucide-react";
import { Button } from "@/components/shared/button";
import { Card } from "@/components/shared/card";
import { useWorkspaceStore } from "@/store/workspace-store";

export default function WorkspacePage() {
  const [tab, setTab] = useState<"drafts" | "hooks">("drafts");
  const { drafts, savedHooks, deleteDraft, pinDraft, deleteHook } = useWorkspaceStore();

  const sortedDrafts = [...drafts].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-medium">Workspace</h1>
        <p className="text-sm text-textSecondary">Draft dan hook tersimpan kamu.</p>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setTab("drafts")}
          className={`rounded-full px-4 py-1.5 text-sm transition-colors ${tab === "drafts" ? "bg-accent text-white" : "border border-borderSoft text-textSecondary"}`}
        >
          Draft ({drafts.length})
        </button>
        <button
          type="button"
          onClick={() => setTab("hooks")}
          className={`rounded-full px-4 py-1.5 text-sm transition-colors ${tab === "hooks" ? "bg-accent text-white" : "border border-borderSoft text-textSecondary"}`}
        >
          Saved Hooks ({savedHooks.length})
        </button>
      </div>

      {tab === "drafts" && (
        <div className="space-y-3">
          {sortedDrafts.length === 0 && (
            <Card>
              <p className="text-sm text-textSecondary">Belum ada draft. Generate konten lalu simpan sebagai draft.</p>
            </Card>
          )}
          {sortedDrafts.map((draft) => (
            <Card key={draft.id} className="space-y-2">
              {draft.pinned && <span className="text-xs text-accent">📌 Pinned</span>}
              <p className="text-sm font-medium">{draft.topic}</p>
              <pre className="line-clamp-3 whitespace-pre-wrap text-sm leading-6 text-textSecondary">{draft.content}</pre>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" type="button" onClick={() => navigator.clipboard.writeText(draft.content)}>
                  <Copy size={12} className="mr-1" />
                  Salin
                </Button>
                <Button size="sm" variant="outline" type="button" onClick={() => pinDraft(draft.id)}>
                  <Pin size={12} className="mr-1" />
                  {draft.pinned ? "Unpin" : "Pin"}
                </Button>
                <Button size="sm" variant="outline" type="button" onClick={() => deleteDraft(draft.id)}>
                  <Trash2 size={12} className="mr-1" />
                  Hapus
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === "hooks" && (
        <div className="space-y-3">
          {savedHooks.length === 0 && (
            <Card>
              <p className="text-sm text-textSecondary">Belum ada hook tersimpan.</p>
            </Card>
          )}
          {savedHooks.map((hook) => (
            <Card key={hook.id} className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm leading-6">&quot;{hook.text}&quot;</p>
                {hook.source ? <p className="mt-1 text-xs text-textSecondary">dari: {hook.source}</p> : null}
              </div>
              <div className="flex flex-shrink-0 gap-2">
                <Button size="sm" variant="outline" type="button" onClick={() => navigator.clipboard.writeText(hook.text)}>
                  <Copy size={12} />
                </Button>
                <Button size="sm" variant="outline" type="button" onClick={() => deleteHook(hook.id)}>
                  <Trash2 size={12} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
