import type { AdminUser } from "./types";

type UserListProps = {
  users: AdminUser[];
};

function statusLabel(status: number): string {
  if (status === 1) return "Frozen";
  if (status === 2) return "Active";
  return `Status ${status}`;
}

function formatTime(ts: number): string {
  if (!ts) return "—";
  return new Date(ts * 1000).toLocaleDateString("vi-VN");
}

export function UserList({ users }: UserListProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-border bg-surface-elevated text-xs uppercase tracking-wide text-muted">
          <tr>
            <th scope="col" className="px-4 py-3 font-medium">
              ID
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Username
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Name
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Phone
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Status
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Registered
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {users.map((user) => (
            <tr key={user.id} className="bg-surface transition hover:bg-surface-elevated">
              <td className="px-4 py-3 text-muted">{user.id}</td>
              <td className="px-4 py-3 font-medium text-foreground">{user.username}</td>
              <td className="px-4 py-3 text-foreground">{user.fullname || "—"}</td>
              <td className="px-4 py-3 text-muted">{user.phonenumber || "—"}</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${
                    user.status === 2
                      ? "bg-success/15 text-success"
                      : "bg-danger/15 text-danger"
                  }`}
                >
                  {statusLabel(user.status)}
                </span>
              </td>
              <td className="px-4 py-3 text-muted">{formatTime(user.addtime)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
