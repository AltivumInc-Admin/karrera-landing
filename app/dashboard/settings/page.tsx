import { getServerSession } from "@/lib/session";
import { getUserProfile } from "@/lib/dynamo";
import SettingsForm from "@/components/dashboard/SettingsForm";

export default async function SettingsPage() {
  const session = await getServerSession();
  if (!session) return null;

  const profile = await getUserProfile(session.email);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Settings</h1>
      <SettingsForm
        initialData={{
          name: profile?.name ?? session.name ?? "",
          email: session.email,
          phone: profile?.phone ?? "",
        }}
      />
    </div>
  );
}
