import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import Sidebar from "@/components/dashboard/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  if (!session) redirect("/login");

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userName={session.name} userEmail={session.email} />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
