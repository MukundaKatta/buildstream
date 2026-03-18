"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { useAppStore } from "@/store/app-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { formatNumber } from "@/lib/utils";
import { MarketplaceItem, AppType } from "@/types";
import {
  Search,
  Star,
  Download,
  Bot,
  FileText,
  Cpu,
  Workflow,
  Filter,
  User,
  ArrowRight,
  Store,
} from "lucide-react";

const appTypeIcons: Record<string, React.ElementType> = {
  chatbot: Bot,
  text_generator: FileText,
  agent: Cpu,
  workflow: Workflow,
};

const categories = [
  "All",
  "Customer Support",
  "Content",
  "Development",
  "Data Processing",
  "Productivity",
];

export default function MarketplacePage() {
  const { marketplaceItems } = useAppStore();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [filterType, setFilterType] = useState("all");
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);

  const filtered = marketplaceItems.filter((item) => {
    if (search && !item.name.toLowerCase().includes(search.toLowerCase()) &&
        !item.description.toLowerCase().includes(search.toLowerCase())) return false;
    if (category !== "All" && item.category !== category) return false;
    if (filterType !== "all" && item.app_type !== filterType) return false;
    return true;
  });

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Marketplace</h1>
          <p className="text-sm text-surface-500 mt-0.5">
            Discover and use community-built AI workflows
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              type="text"
              placeholder="Search marketplace..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            options={[
              { value: "all", label: "All Types" },
              { value: "chatbot", label: "Chatbot" },
              { value: "text_generator", label: "Text Generator" },
              { value: "agent", label: "Agent" },
              { value: "workflow", label: "Workflow" },
            ]}
          />
        </div>

        {/* Category tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                category === cat
                  ? "bg-brand-600 text-white"
                  : "bg-surface-100 text-surface-600 hover:bg-surface-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Items grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => {
            const Icon = appTypeIcons[item.app_type] || Workflow;
            return (
              <Card key={item.id} hover onClick={() => setSelectedItem(item)}>
                <CardContent>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-brand-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-surface-900">{item.name}</h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <User className="w-3 h-3 text-surface-400" />
                        <span className="text-xs text-surface-500">{item.author.name}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-surface-500 line-clamp-2 mb-3">{item.description}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {item.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] bg-surface-100 text-surface-600 px-1.5 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-surface-500">
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      {item.rating}
                    </span>
                    <span>({item.review_count})</span>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-surface-500">
                    <Download className="w-3.5 h-3.5" />
                    {formatNumber(item.downloads)}
                  </span>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-surface-400">
            <Store className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-lg font-medium">No items found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Detail Modal */}
        <Modal
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          title={selectedItem?.name || ""}
          size="lg"
        >
          {selectedItem && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-100 to-purple-100 flex items-center justify-center">
                  {(() => {
                    const Icon = appTypeIcons[selectedItem.app_type] || Workflow;
                    return <Icon className="w-7 h-7 text-brand-600" />;
                  })()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-surface-900">{selectedItem.name}</h3>
                    <Badge variant="purple">{selectedItem.app_type.replace("_", " ")}</Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-sm text-surface-500">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      {selectedItem.author.name}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      {selectedItem.rating} ({selectedItem.review_count} reviews)
                    </span>
                    <span className="flex items-center gap-1">
                      <Download className="w-3.5 h-3.5" />
                      {formatNumber(selectedItem.downloads)} downloads
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-surface-600 leading-relaxed">
                {selectedItem.long_description}
              </p>

              <div className="flex items-center gap-2 flex-wrap">
                {selectedItem.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-surface-100 text-surface-600 px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-surface-200">
                <Button variant="secondary" onClick={() => setSelectedItem(null)}>
                  Close
                </Button>
                <Button>
                  <Download className="w-4 h-4" />
                  Use This Workflow
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </AppLayout>
  );
}
