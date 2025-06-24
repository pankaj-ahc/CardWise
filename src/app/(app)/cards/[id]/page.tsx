
// The 'generateStaticParams' function is required for Next.js to be able to
// statically generate all the dynamic routes for this page at build time.
//
// NOTE: This function cannot be fully implemented because your card data is
// stored in Firestore and fetched on the client after a user authenticates.
// For a true static export, this data would need to be available at build time.
//
// By returning an empty array, we are telling Next.js that there are no pages
// to generate at build time. They will be generated on-demand when first visited.
export async function generateStaticParams() {
    return [];
}

export default function CardDetailRedirectPage() {
  // The redirect logic has been moved to the layout.
  // This page just needs to exist to satisfy the route.
  return null;
}
