import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/lib/cart";
import { SiteHeader } from "@/components/shop/SiteHeader";
import { SiteFooter } from "@/components/shop/SiteFooter";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { useRouterState } from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-4xl font-medium">Page introuvable</h1>
        <p className="mt-3 text-muted-foreground">Cette page n'existe pas ou a été déplacée.</p>
        <Link to="/" className="btn-soft mt-6">Retour à l'accueil</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-semibold">Cette page n'a pas pu s'afficher</h1>
        <button onClick={() => { router.invalidate(); reset(); }} className="btn-soft mt-6">Réessayer</button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Grenouille Rouge — Paniers en jute cousus main en Normandie" },
      { name: "description", content: "Sacs et paniers en toile de jute cousus main à Grémonville, Normandie." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Libre+Bodoni:wght@700&family=Bodoni+Moda:opsz,wght@6..96,400;6..96,500;6..96,600&family=Jost:wght@400;500;600&family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=Stardos+Stencil:wght@400;700&display=swap" },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  // /tri et /style : pages privées de l'atelier, sans menu ni pied de page
  const path = useRouterState({ select: (s) => s.location.pathname });
  const bare = path.startsWith("/tri") || path.startsWith("/style") || path.startsWith("/questions") || path.startsWith("/backoffice-questions") || path.startsWith("/textes") || path.startsWith("/apprendre") || path.startsWith("/marie");
  const legacy = bare && !path.startsWith("/apprendre") || path.startsWith("/marie");
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        {!bare && <SiteHeader />}
        <main className={legacy ? "legacy-style" : ""}>
          <Outlet />
        </main>
        {!bare && <SiteFooter />}
        <CartDrawer />
        <Toaster position="top-center" />
      </CartProvider>
    </QueryClientProvider>
  );
}
