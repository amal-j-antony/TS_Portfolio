import { createBrowserRouter } from "react-router"
import { requireSession } from "./lib/session"
import RootLayout, { RootError } from "./root"

export const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        errorElement: <RootError />,
        children: [
            {
                index: true,
                lazy: async () => ({ Component: (await import("./routes/home/route")).default }),
            },
            {
                path: "blog",
                lazy: async () => ({ Component: (await import("./routes/blog/route")).default }),
            },
            {
                path: "book-list",
                lazy: async () => ({ Component: (await import("./routes/book-list/route")).default }),
            },
            {
                path: "link-archive",
                lazy: async () => ({ Component: (await import("./routes/link-archive/route")).default }),
            },
            {
                path: "login",
                lazy: async () => ({ Component: (await import("./routes/login/route")).default }),
            },
            {
                path: "projects",
                lazy: async () => ({ Component: (await import("./routes/projects/route")).default }),
            },
            {
                path: "dashboard",
                loader: requireSession,
                lazy: async () => ({
                    Component: (await import("./routes/dashboard/route")).default,
                }),
                children: [
                    {
                        index: true,
                        lazy: async () => ({
                            Component: (await import("./routes/dashboard/dashboard")).default,
                        }),
                    },
                    {
                        path: "analytics",
                        lazy: async () => ({
                            Component: (await import("./routes/dashboard/analytics/route")).default,
                        }),
                    },
                    {
                        path: "drafts",
                        lazy: async () => ({
                            Component: (await import("./routes/dashboard/drafts/route")).default,
                        }),
                    },
                    {
                        path: "tags",
                        lazy: async () => ({
                            Component: (await import("./routes/dashboard/tags/route")).default,
                        }),
                    },
                    {
                        path: "settings",
                        lazy: async () => ({
                            Component: (await import("./routes/dashboard/settings/route")).default,
                        }),
                    },
                ],
            },
            {
                path: "*",
                lazy: async () => ({ Component: (await import("./routes/not-found/route")).default }),
            },
        ],
    },
])
