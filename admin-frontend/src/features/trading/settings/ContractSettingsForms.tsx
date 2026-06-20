"use client";

import type { ContractSetting, MarketFormMeta, TradingMarket, UpsertMarketPayload } from "./types";

const inputClass =
  "mt-1 w-full rounded border border-border bg-surface-elevated px-3 py-2 text-sm text-foreground";

type ContractSettingsFormProps = {
  setting: ContractSetting | null;
  isSaving: boolean;
  saveError: string | null;
  saveSuccess: string | null;
  onSave: (payload: Record<string, string>) => void;
};

export function ContractSettingsForm({
  setting,
  isSaving,
  saveError,
  saveSuccess,
  onSave,
}: ContractSettingsFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload: Record<string, string> = {};
    Array.from(form.entries()).forEach(([key, value]) => {
      payload[key] = String(value);
    });
    if (setting?.id) {
      payload.hy_id = String(setting.id);
    }
    onSave(payload);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-border bg-surface p-4"
      aria-label="Contract settings form"
    >
      <h2 className="text-sm font-medium text-foreground">Contract settings</h2>
      <p className="mt-1 text-xs text-muted">Fee rates, time frames, and trading limits.</p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="hy_sxf" className="block text-sm font-medium text-foreground">
            Fee rate (hy_sxf)
          </label>
          <input
            id="hy_sxf"
            name="hy_sxf"
            type="text"
            required
            defaultValue={setting?.hy_sxf ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="hy_time" className="block text-sm font-medium text-foreground">
            Time frames (hy_time)
          </label>
          <input
            id="hy_time"
            name="hy_time"
            type="text"
            required
            defaultValue={setting?.hy_time ?? ""}
            placeholder="e.g. 60,120,300"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="hy_ykbl" className="block text-sm font-medium text-foreground">
            Profit ratio (hy_ykbl)
          </label>
          <input
            id="hy_ykbl"
            name="hy_ykbl"
            type="text"
            required
            defaultValue={setting?.hy_ykbl ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="hy_tzed" className="block text-sm font-medium text-foreground">
            Investment tiers (hy_tzed)
          </label>
          <input
            id="hy_tzed"
            name="hy_tzed"
            type="text"
            required
            defaultValue={setting?.hy_tzed ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="hy_min" className="block text-sm font-medium text-foreground">
            Minimum amount (hy_min)
          </label>
          <input
            id="hy_min"
            name="hy_min"
            type="text"
            required
            defaultValue={setting?.hy_min ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="hy_kstime" className="block text-sm font-medium text-foreground">
            Start time (hy_kstime)
          </label>
          <input
            id="hy_kstime"
            name="hy_kstime"
            type="text"
            required
            defaultValue={setting?.hy_kstime ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="hy_min_per_frame" className="block text-sm font-medium text-foreground">
            Min per frame
          </label>
          <input
            id="hy_min_per_frame"
            name="hy_min_per_frame"
            type="text"
            defaultValue={setting?.hy_min_per_frame ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="hy_max_per_frame" className="block text-sm font-medium text-foreground">
            Max per frame
          </label>
          <input
            id="hy_max_per_frame"
            name="hy_max_per_frame"
            type="text"
            defaultValue={setting?.hy_max_per_frame ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="hy_fkgl" className="block text-sm font-medium text-foreground">
            Risk control (hy_fkgl)
          </label>
          <input
            id="hy_fkgl"
            name="hy_fkgl"
            type="text"
            defaultValue={setting?.hy_fkgl ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      {saveError ? (
        <p role="alert" className="mt-4 text-sm text-danger">
          {saveError}
        </p>
      ) : null}
      {saveSuccess ? (
        <p role="status" className="mt-4 text-sm text-success">
          {saveSuccess}
        </p>
      ) : null}

      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="rounded bg-primary px-4 py-2 text-sm font-medium text-background transition hover:opacity-90 disabled:opacity-40"
        >
          {isSaving ? "Saving…" : "Save settings"}
        </button>
      </div>
    </form>
  );
}

type ContractMarketFormProps = {
  market: TradingMarket | null;
  formMeta: MarketFormMeta | undefined;
  isCreating: boolean;
  isSaving: boolean;
  saveError: string | null;
  onSave: (payload: UpsertMarketPayload) => void;
  onCancel: () => void;
};

export function ContractMarketForm({
  market,
  formMeta,
  isCreating,
  isSaving,
  saveError,
  onSave,
  onCancel,
}: ContractMarketFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    const payload: UpsertMarketPayload = {
      round: String(form.get("round") ?? "0"),
      fee_buy: String(form.get("fee_buy") ?? ""),
      fee_sell: String(form.get("fee_sell") ?? ""),
      buy_min: String(form.get("buy_min") ?? ""),
      buy_max: String(form.get("buy_max") ?? ""),
      sell_min: String(form.get("sell_min") ?? ""),
      sell_max: String(form.get("sell_max") ?? ""),
      trade_min: String(form.get("trade_min") ?? ""),
      trade_max: String(form.get("trade_max") ?? ""),
      trade: String(form.get("trade") ?? "1"),
      status: String(form.get("status") ?? "1"),
      shuadan: String(form.get("shuadan") ?? "0"),
      zhang: String(form.get("zhang") ?? ""),
      die: String(form.get("die") ?? ""),
    };

    if (isCreating) {
      payload.buyname = String(form.get("buyname") ?? "");
      payload.sellname = String(form.get("sellname") ?? "");
      payload.jiaoyiqu = String(form.get("jiaoyiqu") ?? "0");
    }

    onSave(payload);
  };

  const [base, quote] = market?.name.split("_") ?? ["", ""];

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-border bg-surface p-4"
      aria-label={isCreating ? "Create market form" : "Edit market form"}
    >
      <h2 className="text-sm font-medium text-foreground">
        {isCreating ? "Create market" : `Edit market: ${market?.name}`}
      </h2>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {isCreating ? (
          <>
            <div>
              <label htmlFor="sellname" className="block text-sm font-medium text-foreground">
                Base coin (sellname)
              </label>
              <select
                id="sellname"
                name="sellname"
                required
                defaultValue=""
                className={inputClass}
              >
                <option value="" disabled>
                  Select coin
                </option>
                {formMeta?.coins.map((coin) => (
                  <option key={coin.name} value={coin.name}>
                    {coin.title} ({coin.name})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="buyname" className="block text-sm font-medium text-foreground">
                Quote coin (buyname)
              </label>
              <select
                id="buyname"
                name="buyname"
                required
                defaultValue=""
                className={inputClass}
              >
                <option value="" disabled>
                  Select coin
                </option>
                {formMeta?.coins.map((coin) => (
                  <option key={coin.name} value={coin.name}>
                    {coin.title} ({coin.name})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="jiaoyiqu" className="block text-sm font-medium text-foreground">
                Trading area
              </label>
              <select
                id="jiaoyiqu"
                name="jiaoyiqu"
                defaultValue="0"
                className={inputClass}
              >
                {formMeta?.trading_areas.map((area) => (
                  <option key={area.value} value={area.value}>
                    {area.label}
                  </option>
                ))}
              </select>
            </div>
          </>
        ) : (
          <div className="sm:col-span-2 text-sm text-muted">
            Pair: {base.toUpperCase()} / {quote.toUpperCase()}
          </div>
        )}

        <div>
          <label htmlFor="round" className="block text-sm font-medium text-foreground">
            Round
          </label>
          <select
            id="round"
            name="round"
            required
            defaultValue={String(market?.round ?? "0")}
            className={inputClass}
          >
            {[0, 1, 2, 3, 4, 5, 6].map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-foreground">
            Status
          </label>
          <select id="status" name="status" defaultValue={String(market?.status ?? "1")} className={inputClass}>
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>
        </div>
        <div>
          <label htmlFor="fee_buy" className="block text-sm font-medium text-foreground">
            Buy fee
          </label>
          <input id="fee_buy" name="fee_buy" type="text" defaultValue={market?.fee_buy ?? ""} className={inputClass} />
        </div>
        <div>
          <label htmlFor="fee_sell" className="block text-sm font-medium text-foreground">
            Sell fee
          </label>
          <input id="fee_sell" name="fee_sell" type="text" defaultValue={market?.fee_sell ?? ""} className={inputClass} />
        </div>
        <div>
          <label htmlFor="buy_min" className="block text-sm font-medium text-foreground">
            Buy min
          </label>
          <input id="buy_min" name="buy_min" type="text" defaultValue={market?.buy_min ?? ""} className={inputClass} />
        </div>
        <div>
          <label htmlFor="buy_max" className="block text-sm font-medium text-foreground">
            Buy max
          </label>
          <input id="buy_max" name="buy_max" type="text" defaultValue={market?.buy_max ?? ""} className={inputClass} />
        </div>
        <div>
          <label htmlFor="trade" className="block text-sm font-medium text-foreground">
            Trading enabled
          </label>
          <select id="trade" name="trade" defaultValue={String(market?.trade ?? "1")} className={inputClass}>
            <option value="1">On</option>
            <option value="0">Off</option>
          </select>
        </div>
        <div>
          <label htmlFor="shuadan" className="block text-sm font-medium text-foreground">
            Spoof orders
          </label>
          <select id="shuadan" name="shuadan" defaultValue={String(market?.shuadan ?? "0")} className={inputClass}>
            <option value="1">On</option>
            <option value="0">Off</option>
          </select>
        </div>
      </div>

      {saveError ? (
        <p role="alert" className="mt-4 text-sm text-danger">
          {saveError}
        </p>
      ) : null}

      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className="rounded border border-border px-4 py-2 text-sm text-foreground transition hover:bg-surface-elevated disabled:opacity-40"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="rounded bg-primary px-4 py-2 text-sm font-medium text-background transition hover:opacity-90 disabled:opacity-40"
        >
          {isSaving ? "Saving…" : isCreating ? "Create market" : "Save market"}
        </button>
      </div>
    </form>
  );
}
