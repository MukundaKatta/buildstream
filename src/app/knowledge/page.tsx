"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { useAppStore } from "@/store/app-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatDate, formatNumber, formatFileSize } from "@/lib/utils";
import {
  Plus,
  Database,
  Upload,
  FileText,
  Trash2,
  Search,
  HardDrive,
  Hash,
  Loader2,
} from "lucide-react";

export default function KnowledgePage() {
  const { knowledgeBases, createKnowledgeBase, deleteKnowledgeBase, uploadDocument } = useAppStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [search, setSearch] = useState("");

  const filtered = knowledgeBases.filter(
    (kb) => !search || kb.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = () => {
    if (!newName.trim()) return;
    createKnowledgeBase(newName.trim(), newDescription.trim());
    setShowCreateModal(false);
    setNewName("");
    setNewDescription("");
  };

  const handleUpload = (kbId: string) => {
    uploadDocument(kbId, "document.pdf", 125000);
    setShowUploadModal(null);
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-surface-900">Knowledge Base</h1>
            <p className="text-sm text-surface-500 mt-0.5">
              Manage your document stores for RAG workflows
            </p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4" />
            New Knowledge Base
          </Button>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input
            type="text"
            placeholder="Search knowledge bases..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((kb) => (
            <Card key={kb.id} hover>
              <CardContent>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Database className="w-5 h-5 text-blue-600" />
                  </div>
                  <Badge
                    variant={
                      kb.status === "ready"
                        ? "success"
                        : kb.status === "processing"
                        ? "info"
                        : "danger"
                    }
                  >
                    {kb.status === "processing" && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
                    {kb.status}
                  </Badge>
                </div>
                <h3 className="text-sm font-semibold text-surface-900 mb-1">{kb.name}</h3>
                <p className="text-xs text-surface-500 line-clamp-2 mb-4">{kb.description}</p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-surface-400 mb-0.5">
                      <FileText className="w-3 h-3" />
                    </div>
                    <p className="text-sm font-bold text-surface-900">{kb.document_count}</p>
                    <p className="text-[10px] text-surface-500">Documents</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-surface-400 mb-0.5">
                      <Hash className="w-3 h-3" />
                    </div>
                    <p className="text-sm font-bold text-surface-900">{formatNumber(kb.total_chunks)}</p>
                    <p className="text-[10px] text-surface-500">Chunks</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-surface-400 mb-0.5">
                      <HardDrive className="w-3 h-3" />
                    </div>
                    <p className="text-sm font-bold text-surface-900 truncate">{kb.embedding_model.split("-").pop()}</p>
                    <p className="text-[10px] text-surface-500">Model</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between">
                <span className="text-xs text-surface-500">{formatDate(kb.updated_at)}</span>
                <div className="flex items-center gap-1">
                  <Button size="sm" variant="ghost" onClick={() => setShowUploadModal(kb.id)}>
                    <Upload className="w-3.5 h-3.5" />
                    Upload
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-600 hover:bg-red-50"
                    onClick={() => deleteKnowledgeBase(kb.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-surface-400">
            <Database className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-lg font-medium">No knowledge bases found</p>
            <p className="text-sm mt-1">Create a knowledge base to start uploading documents</p>
          </div>
        )}

        {/* Create Modal */}
        <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create Knowledge Base">
          <div className="space-y-4">
            <Input
              label="Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g., Support Documentation"
            />
            <Textarea
              label="Description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="What documents will this store contain?"
              rows={3}
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={!newName.trim()}>
                Create
              </Button>
            </div>
          </div>
        </Modal>

        {/* Upload Modal */}
        <Modal
          isOpen={!!showUploadModal}
          onClose={() => setShowUploadModal(null)}
          title="Upload Documents"
        >
          <div className="space-y-4">
            <div className="border-2 border-dashed border-surface-300 rounded-xl p-8 text-center hover:border-brand-400 hover:bg-brand-50/30 transition-colors cursor-pointer">
              <Upload className="w-10 h-10 text-surface-400 mx-auto mb-3" />
              <p className="text-sm font-medium text-surface-700">
                Drop files here or click to upload
              </p>
              <p className="text-xs text-surface-500 mt-1">
                Supports PDF, TXT, DOCX, MD, CSV (max 50MB each)
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" onClick={() => setShowUploadModal(null)}>
                Cancel
              </Button>
              <Button onClick={() => showUploadModal && handleUpload(showUploadModal)}>
                Upload Files
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </AppLayout>
  );
}
