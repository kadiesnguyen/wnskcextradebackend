import { marketStatusClass } from "../lib/format";
import type { TradingMarket } from "./types";

type ContractMarketsListProps = {
  markets: TradingMarket[];
  editingId: number | null;
  onEdit: (market: TradingMarket) => void;
};

export function ContractMarketsList({ markets, editingId, onEdit }: ContractMarketsListProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-border bg-surface-elevated text-xs uppercase tracking-wide text-muted">
          <tr>
            <th scope="col" className="px-4 py-3 font-medium">
              ID
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Name
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Round
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Price
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Trade
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Status
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {markets.map((market) => (
            <tr
              key={market.id}
              className={`bg-surface transition hover:bg-surface-elevated ${editingId === market.id ? "ring-1 ring-primary/40" : ""}`}
            >
              <td className="px-4 py-3 text-muted">{market.id}</td>
              <td className="px-4 py-3 font-medium uppercase text-foreground">{market.name}</td>
              <td className="px-4 py-3 text-muted">{market.round}</td>
              <td className="px-4 py-3 text-foreground">{market.new_price ?? "—"}</td>
              <td className="px-4 py-3 text-muted">{Number(market.trade) === 1 ? "On" : "Off"}</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${marketStatusClass(market.status)}`}
                >
                  {Number(market.status) === 1 ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-4 py-3">
                <button
                  type="button"
                  onClick={() => onEdit(market)}
                  className="rounded border border-border px-2.5 py-1 text-xs font-medium text-foreground transition hover:bg-surface-elevated"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
