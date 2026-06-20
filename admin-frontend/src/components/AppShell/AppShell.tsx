import type { AdminMenuTree, AdminUser } from "@/features/auth/types";
import { ContractOrderAlert } from "@/features/trading/orders/contract-order-alert/ContractOrderAlert";
import { AppShellHeader } from "./AppShellHeader";
import { AppShellSidebar } from "./AppShellSidebar";

type AppShellProps = {
  user: AdminUser;
  menuTree: AdminMenuTree;
  children: React.ReactNode;
};

export function AppShell({ user, menuTree, children }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <AppShellSidebar menuTree={menuTree} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppShellHeader user={user} />
        <main id="main-content" className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
      <ContractOrderAlert />
    </div>
  );
}
