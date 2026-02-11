import PlaceholderPage from "@/components/PlaceholderPage";
import RequireAuth from "@/components/auth/RequireAuth";

export default function AccountPage() {
  return (
    <RequireAuth>
      <PlaceholderPage title="Account" />
    </RequireAuth>
  );
}
