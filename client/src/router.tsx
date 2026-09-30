import { createBrowserRouter } from "react-router"
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
                path: "*",
                lazy: async () => ({ Component: (await import("./routes/not-found/route")).default }),
            },
        ],
    },
])
