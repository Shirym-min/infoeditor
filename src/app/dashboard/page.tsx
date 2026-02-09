import { getCurrentUser } from "@/lib/auth";
import ConfigEditor from "./ConfigEditor";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    return <p>Not logged in</p>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>{user.email}</p>
      <ConfigEditor />
    </div>
  );
}
