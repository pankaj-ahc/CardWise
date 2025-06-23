
// This function is required for static export with dynamic routes.
// It tells Next.js not to pre-render any pages at build time, as they are dynamic.
export async function generateStaticParams() {
  return [];
}

export default function CardDetailRedirectPage() {
  // The redirect logic has been moved to the layout.
  // This page just needs to exist to satisfy the route.
  return null;
}
