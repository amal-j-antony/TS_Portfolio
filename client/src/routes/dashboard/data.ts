import {
    BarChart3,
    BookMarked,
    FileStack,
    FileText,
    Inbox,
    MessageCircle,
    Settings,
    Tag,
    Wrench,
    type LucideIcon,
} from "lucide-react"
import type { ResourceStatus, ResourceType } from "@/lib/api"

export interface NavItem {
    to: string
    label: string
    icon: LucideIcon
    end?: boolean
}

export const navItems: NavItem[] = [
    { to: "/dashboard", label: "Bookmarks & Content", icon: BookMarked, end: true },
    { to: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
    { to: "/dashboard/drafts", label: "Drafts / Inbox", icon: Inbox },
    { to: "/dashboard/tags", label: "Categories & Tags", icon: Tag },
    { to: "/dashboard/settings", label: "Settings", icon: Settings },
]

export const resourceTypeMeta: Record<ResourceType, { label: string; icon: LucideIcon }> = {
    article: { label: "Article", icon: FileText },
    tweet: { label: "Tweet / Thread", icon: MessageCircle },
    tool: { label: "Dev Tool", icon: Wrench },
    paper: { label: "Whitepaper", icon: FileStack },
}

export const resourceStatusMeta: Record<ResourceStatus, { label: string; className: string }> = {
    draft: {
        label: "Needs Tag Review",
        className: "bg-surface-container-highest text-on-surface-variant",
    },
    published: { label: "Published", className: "bg-primary/15 text-primary" },
}

export const resourceTypeOptions = [
    { value: "article", label: "Article" },
    { value: "tweet", label: "Tweet" },
    { value: "tool", label: "Tool" },
    { value: "paper", label: "Paper" },
]

export const statusFilters = [
    { value: "all", label: "All" },
    { value: "published", label: "Published" },
    { value: "draft", label: "Drafts" },
] as const
