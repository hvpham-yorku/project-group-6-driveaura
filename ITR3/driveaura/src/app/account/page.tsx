import RequireAuth from "@/components/auth/RequireAuth";
import AccountClient from "./AccountClient";

export default function AccountPage() {
  return (
    <RequireAuth>
      <AccountClient />
    </RequireAuth>
  );
}
