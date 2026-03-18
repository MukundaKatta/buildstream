"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { useAppStore } from "@/store/app-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { Tabs, TabPanels } from "@/components/ui/tabs";
import {
  User,
  Users,
  Key,
  Bell,
  Shield,
  Trash2,
  Plus,
  Mail,
  Crown,
  Settings,
} from "lucide-react";

export default function SettingsPage() {
  const { user, team, inviteTeamMember, removeTeamMember, updateMemberRole } = useAppStore();
  const [activeTab, setActiveTab] = useState("profile");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "editor" | "viewer">("editor");

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    inviteTeamMember(inviteEmail.trim(), inviteRole);
    setShowInviteModal(false);
    setInviteEmail("");
  };

  const roleColors: Record<string, "purple" | "info" | "success" | "default"> = {
    owner: "purple",
    admin: "info",
    editor: "success",
    viewer: "default",
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Settings</h1>
          <p className="text-sm text-surface-500 mt-0.5">
            Manage your account, team, and preferences
          </p>
        </div>

        <Tabs
          tabs={[
            { id: "profile", label: "Profile", icon: <User className="w-3.5 h-3.5" /> },
            { id: "team", label: "Team", icon: <Users className="w-3.5 h-3.5" /> },
            { id: "api_keys", label: "API Keys", icon: <Key className="w-3.5 h-3.5" /> },
            { id: "notifications", label: "Notifications", icon: <Bell className="w-3.5 h-3.5" /> },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        <TabPanels activeTab={activeTab}>
          {{
            profile: (
              <Card>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center">
                      <User className="w-8 h-8 text-brand-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-surface-900">{user?.name || "User"}</h3>
                      <p className="text-sm text-surface-500">{user?.email || ""}</p>
                    </div>
                  </div>
                  <Input label="Full Name" defaultValue={user?.name} />
                  <Input label="Email" defaultValue={user?.email} type="email" />
                  <Input label="Company" defaultValue="BuildStream Inc." />
                  <div className="flex justify-end pt-2">
                    <Button>Save Changes</Button>
                  </div>
                </CardContent>
              </Card>
            ),
            team: (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-surface-900">Team Members</h3>
                    <p className="text-xs text-surface-500">
                      {team?.members.length || 0} members in {team?.name || "your team"}
                    </p>
                  </div>
                  <Button onClick={() => setShowInviteModal(true)}>
                    <Plus className="w-4 h-4" />
                    Invite Member
                  </Button>
                </div>

                <Card>
                  <div className="divide-y divide-surface-100">
                    {team?.members.map((member) => (
                      <div key={member.user_id} className="px-6 py-4 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-surface-100 flex items-center justify-center flex-shrink-0">
                          {member.role === "owner" ? (
                            <Crown className="w-5 h-5 text-amber-500" />
                          ) : (
                            <User className="w-5 h-5 text-surface-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-surface-900">{member.name}</p>
                          <p className="text-xs text-surface-500">{member.email}</p>
                        </div>
                        <Badge variant={roleColors[member.role] || "default"}>{member.role}</Badge>
                        {member.role !== "owner" && (
                          <div className="flex items-center gap-1">
                            <Select
                              value={member.role}
                              onChange={(e) =>
                                updateMemberRole(
                                  member.user_id,
                                  e.target.value as "admin" | "editor" | "viewer"
                                )
                              }
                              options={[
                                { value: "admin", label: "Admin" },
                                { value: "editor", label: "Editor" },
                                { value: "viewer", label: "Viewer" },
                              ]}
                            />
                            <button
                              onClick={() => removeTeamMember(member.user_id)}
                              className="p-1.5 text-surface-400 hover:text-red-600 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>

                <Modal isOpen={showInviteModal} onClose={() => setShowInviteModal(false)} title="Invite Team Member">
                  <div className="space-y-4">
                    <Input
                      label="Email Address"
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="colleague@company.com"
                    />
                    <Select
                      label="Role"
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value as typeof inviteRole)}
                      options={[
                        { value: "admin", label: "Admin - Full access" },
                        { value: "editor", label: "Editor - Create and edit workflows" },
                        { value: "viewer", label: "Viewer - View only" },
                      ]}
                    />
                    <div className="bg-surface-50 rounded-lg p-3">
                      <h4 className="text-xs font-medium text-surface-700 mb-2">Role Permissions</h4>
                      <div className="space-y-1 text-xs text-surface-500">
                        <p><strong>Admin:</strong> Full access to all features, team management</p>
                        <p><strong>Editor:</strong> Create, edit, and deploy workflows</p>
                        <p><strong>Viewer:</strong> View workflows and monitoring data</p>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <Button variant="secondary" onClick={() => setShowInviteModal(false)}>Cancel</Button>
                      <Button onClick={handleInvite} disabled={!inviteEmail.trim()}>
                        <Mail className="w-4 h-4" />
                        Send Invite
                      </Button>
                    </div>
                  </div>
                </Modal>
              </div>
            ),
            api_keys: (
              <div className="space-y-4">
                <Card>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-surface-900">API Keys</h3>
                        <p className="text-xs text-surface-500">
                          Manage API keys for your integrations
                        </p>
                      </div>
                      <Button>
                        <Plus className="w-4 h-4" />
                        Generate Key
                      </Button>
                    </div>

                    <div className="border border-surface-200 rounded-lg divide-y divide-surface-100">
                      <div className="px-4 py-3 flex items-center gap-4">
                        <Key className="w-4 h-4 text-surface-400 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-surface-900">Production Key</p>
                          <p className="text-xs text-surface-500 font-mono">bs_live_***...abc123</p>
                        </div>
                        <Badge variant="success">Active</Badge>
                        <Button size="sm" variant="ghost" className="text-red-600">
                          Revoke
                        </Button>
                      </div>
                      <div className="px-4 py-3 flex items-center gap-4">
                        <Key className="w-4 h-4 text-surface-400 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-surface-900">Development Key</p>
                          <p className="text-xs text-surface-500 font-mono">bs_test_***...xyz789</p>
                        </div>
                        <Badge variant="success">Active</Badge>
                        <Button size="sm" variant="ghost" className="text-red-600">
                          Revoke
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-surface-700 mb-2">Connected Services</h4>
                      <div className="border border-surface-200 rounded-lg divide-y divide-surface-100">
                        <div className="px-4 py-3 flex items-center gap-4">
                          <div className="w-8 h-8 rounded bg-surface-100 flex items-center justify-center">
                            <Shield className="w-4 h-4 text-surface-500" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-surface-900">OpenAI</p>
                            <p className="text-xs text-surface-500">GPT-4, GPT-3.5 Turbo</p>
                          </div>
                          <Badge variant="success">Connected</Badge>
                        </div>
                        <div className="px-4 py-3 flex items-center gap-4">
                          <div className="w-8 h-8 rounded bg-surface-100 flex items-center justify-center">
                            <Shield className="w-4 h-4 text-surface-500" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-surface-900">Anthropic</p>
                            <p className="text-xs text-surface-500">Claude 3 Opus, Sonnet</p>
                          </div>
                          <Badge variant="success">Connected</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ),
            notifications: (
              <Card>
                <CardContent className="space-y-6">
                  <h3 className="text-sm font-semibold text-surface-900">Notification Preferences</h3>

                  {[
                    { label: "Workflow run failures", description: "Get notified when a workflow run fails", defaultChecked: true },
                    { label: "Deployment status changes", description: "Alerts when deployments go up or down", defaultChecked: true },
                    { label: "Team activity", description: "Notifications about team member changes", defaultChecked: false },
                    { label: "Usage alerts", description: "Notify when approaching token usage limits", defaultChecked: true },
                    { label: "Weekly digest", description: "Weekly summary of workflow performance", defaultChecked: true },
                    { label: "Marketplace updates", description: "New workflows and updates in marketplace", defaultChecked: false },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm font-medium text-surface-900">{item.label}</p>
                        <p className="text-xs text-surface-500">{item.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          defaultChecked={item.defaultChecked}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-surface-200 peer-focus:ring-2 peer-focus:ring-brand-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600" />
                      </label>
                    </div>
                  ))}

                  <div className="flex justify-end pt-2">
                    <Button>Save Preferences</Button>
                  </div>
                </CardContent>
              </Card>
            ),
          }}
        </TabPanels>
      </div>
    </AppLayout>
  );
}
