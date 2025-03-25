import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to the dashboard path
  redirect('/dashboard');
}