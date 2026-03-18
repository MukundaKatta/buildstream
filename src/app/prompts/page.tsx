"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { useAppStore } from "@/store/app-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabPanels } from "@/components/ui/tabs";
import { formatDate, extractVariables } from "@/lib/utils";
import { Prompt } from "@/types";
import {
  Plus,
  MessageSquare,
  History,
  FlaskConical,
  Save,
  Trash2,
  ArrowLeft,
  Variable,
  Search,
} from "lucide-react";

export default function PromptsPage() {
  const { prompts, createPrompt, updatePrompt, deletePrompt, createPromptVersion, createABTest } =
    useAppStore();
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showABTestModal, setShowABTestModal] = useState(false);
  const [activeTab, setActiveTab] = useState("editor");
  const [search, setSearch] = useState("");

  // Create form
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newContent, setNewContent] = useState("");

  // Edit state
  const [editContent, setEditContent] = useState("");
  const [versionNotes, setVersionNotes] = useState("");

  // AB Test form
  const [abName, setAbName] = useState("");
  const [abVariantA, setAbVariantA] = useState("");
  const [abVariantB, setAbVariantB] = useState("");

  const filtered = prompts.filter(
    (p) => !search || p.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectPrompt = (p: Prompt) => {
    setSelectedPrompt(p);
    setEditContent(p.content);
    setActiveTab("editor");
  };

  const handleCreate = () => {
    if (!newName.trim() || !newContent.trim()) return;
    const p = createPrompt(newName.trim(), newDescription.trim(), newContent.trim());
    setShowCreateModal(false);
    setNewName("");
    setNewDescription("");
    setNewContent("");
    selectPrompt(p);
  };

  const handleSaveVersion = () => {
    if (!selectedPrompt || !editContent.trim()) return;
    createPromptVersion(selectedPrompt.id, editContent.trim(), versionNotes.trim() || "Updated prompt");
    const updated = prompts.find((p) => p.id === selectedPrompt.id);
    if (updated) setSelectedPrompt({ ...updated, content: editContent });
    setVersionNotes("");
  };

  const handleCreateABTest = () => {
    if (!selectedPrompt || !abName.trim() || !abVariantA.trim() || !abVariantB.trim()) return;
    createABTest(selectedPrompt.id, abName.trim(), abVariantA.trim(), abVariantB.trim());
    setShowABTestModal(false);
    setAbName("");
    setAbVariantA("");
    setAbVariantB("");
  };

  const detectedVars = extractVariables(editContent);

  if (selectedPrompt) {
    return (
      <AppLayout>
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedPrompt(null)}
              className="p-2 text-surface-400 hover:text-surface-600 hover:bg-surface-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-surface-900">{selectedPrompt.name}</h1>
              <p className="text-sm text-surface-500">{selectedPrompt.description}</p>
            </div>
            <Button variant="ghost" className="text-red-600" onClick={() => {
              deletePrompt(selectedPrompt.id);
              setSelectedPrompt(null);
            }}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <Tabs
            tabs={[
              { id: "editor", label: "Editor", icon: <MessageSquare className="w-3.5 h-3.5" /> },
              { id: "versions", label: "Version History", icon: <History className="w-3.5 h-3.5" /> },
              { id: "ab_tests", label: "A/B Tests", icon: <FlaskConical className="w-3.5 h-3.5" /> },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />

          <TabPanels activeTab={activeTab}>
            {{
              editor: (
                <div className="space-y-4">
                  <div className="bg-white rounded-xl border border-surface-200 p-4">
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Prompt Content
                    </label>
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={12}
                      className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-500 resize-y"
                      placeholder="Write your prompt here. Use {{variable}} syntax for variable injection."
                    />
                    {detectedVars.length > 0 && (
                      <div className="mt-3 flex items-center gap-2 flex-wrap">
                        <Variable className="w-3.5 h-3.5 text-surface-400" />
                        <span className="text-xs text-surface-500">Variables:</span>
                        {detectedVars.map((v) => (
                          <span key={v} className="text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full font-mono">
                            {v}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-end gap-3">
                    <div className="flex-1">
                      <Input
                        label="Version Notes"
                        value={versionNotes}
                        onChange={(e) => setVersionNotes(e.target.value)}
                        placeholder="Describe your changes..."
                      />
                    </div>
                    <Button onClick={handleSaveVersion}>
                      <Save className="w-4 h-4" />
                      Save New Version
                    </Button>
                  </div>
                </div>
              ),
              versions: (
                <div className="space-y-3">
                  {selectedPrompt.versions
                    .slice()
                    .reverse()
                    .map((v) => (
                      <Card key={v.id}>
                        <CardContent>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="purple">v{v.version}</Badge>
                              <span className="text-xs text-surface-500">{formatDate(v.created_at)}</span>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setEditContent(v.content);
                                setActiveTab("editor");
                              }}
                            >
                              Restore
                            </Button>
                          </div>
                          <p className="text-sm text-surface-600 mb-2">{v.notes}</p>
                          <pre className="text-xs text-surface-500 bg-surface-50 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap font-mono max-h-40">
                            {v.content}
                          </pre>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              ),
              ab_tests: (
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <Button onClick={() => setShowABTestModal(true)}>
                      <Plus className="w-4 h-4" />
                      New A/B Test
                    </Button>
                  </div>
                  {selectedPrompt.ab_tests.length === 0 ? (
                    <div className="text-center py-12 text-surface-400">
                      <FlaskConical className="w-10 h-10 mx-auto mb-3 opacity-30" />
                      <p className="text-sm font-medium">No A/B tests yet</p>
                      <p className="text-xs mt-1">Create a test to compare prompt variants</p>
                    </div>
                  ) : (
                    selectedPrompt.ab_tests.map((test) => (
                      <Card key={test.id}>
                        <CardContent>
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-semibold text-surface-900">{test.name}</h4>
                            <Badge
                              variant={
                                test.status === "running"
                                  ? "info"
                                  : test.status === "completed"
                                  ? "success"
                                  : "default"
                              }
                            >
                              {test.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-blue-50 rounded-lg">
                              <p className="text-xs font-medium text-blue-700 mb-1">Variant A</p>
                              <p className="text-xs text-blue-600 line-clamp-3">{test.variant_a}</p>
                              <div className="mt-2 pt-2 border-t border-blue-200 flex justify-between">
                                <span className="text-xs text-blue-600">{test.results.variant_a_runs} runs</span>
                                <span className="text-xs font-bold text-blue-700">
                                  Score: {test.results.variant_a_avg_score.toFixed(1)}
                                </span>
                              </div>
                            </div>
                            <div className="p-3 bg-green-50 rounded-lg">
                              <p className="text-xs font-medium text-green-700 mb-1">Variant B</p>
                              <p className="text-xs text-green-600 line-clamp-3">{test.variant_b}</p>
                              <div className="mt-2 pt-2 border-t border-green-200 flex justify-between">
                                <span className="text-xs text-green-600">{test.results.variant_b_runs} runs</span>
                                <span className="text-xs font-bold text-green-700">
                                  Score: {test.results.variant_b_avg_score.toFixed(1)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-surface-500 mt-2">
                            Traffic split: {test.traffic_split}% / {100 - test.traffic_split}%
                          </p>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              ),
            }}
          </TabPanels>

          <Modal isOpen={showABTestModal} onClose={() => setShowABTestModal(false)} title="Create A/B Test" size="lg">
            <div className="space-y-4">
              <Input label="Test Name" value={abName} onChange={(e) => setAbName(e.target.value)} placeholder="e.g., Friendly vs Formal tone" />
              <Textarea label="Variant A" value={abVariantA} onChange={(e) => setAbVariantA(e.target.value)} rows={4} placeholder="First prompt variant..." />
              <Textarea label="Variant B" value={abVariantB} onChange={(e) => setAbVariantB(e.target.value)} rows={4} placeholder="Second prompt variant..." />
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="secondary" onClick={() => setShowABTestModal(false)}>Cancel</Button>
                <Button onClick={handleCreateABTest} disabled={!abName.trim() || !abVariantA.trim() || !abVariantB.trim()}>Create Test</Button>
              </div>
            </div>
          </Modal>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-surface-900">Prompt Studio</h1>
            <p className="text-sm text-surface-500 mt-0.5">
              Engineer, version, and A/B test your prompts
            </p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4" />
            New Prompt
          </Button>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input
            type="text"
            placeholder="Search prompts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((prompt) => (
            <Card key={prompt.id} hover onClick={() => selectPrompt(prompt)}>
              <CardContent>
                <div className="flex items-start justify-between mb-2">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-purple-600" />
                  </div>
                  <Badge variant="purple">v{prompt.version}</Badge>
                </div>
                <h3 className="text-sm font-semibold text-surface-900 mb-1">{prompt.name}</h3>
                <p className="text-xs text-surface-500 line-clamp-2 mb-3">{prompt.description}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  {prompt.variables.map((v) => (
                    <span key={v} className="text-[10px] bg-surface-100 text-surface-600 px-1.5 py-0.5 rounded font-mono">
                      {v}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-3 mt-3 text-xs text-surface-500">
                  <span>{prompt.versions.length} versions</span>
                  <span>{prompt.ab_tests.length} tests</span>
                  <span>{formatDate(prompt.updated_at)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create Prompt" size="lg">
          <div className="space-y-4">
            <Input label="Name" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g., Customer Support System Prompt" />
            <Input label="Description" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} placeholder="Brief description..." />
            <Textarea label="Content" value={newContent} onChange={(e) => setNewContent(e.target.value)} rows={8} placeholder="Write your prompt here. Use {{variable}} for variable injection." className="font-mono" />
            {extractVariables(newContent).length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-surface-500">Detected variables:</span>
                {extractVariables(newContent).map((v) => (
                  <span key={v} className="text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full">{v}</span>
                ))}
              </div>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={!newName.trim() || !newContent.trim()}>Create Prompt</Button>
            </div>
          </div>
        </Modal>
      </div>
    </AppLayout>
  );
}
