
import { redirect } from 'next/navigation';

export default function CardDetailRedirectPage({ params }: { params: { id: string } }) {
  redirect(`/cards/${params.id}/bills`);
}
