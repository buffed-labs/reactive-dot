import type { WhitelistEntry } from "./descriptors";

export const whitelist: WhitelistEntry[] = [
  "query.System.Account",
  "query.Revive.PristineCode",
  "query.Revive.OriginalAccount",
  "query.Revive.AccountInfoOf",
  "tx.Revive.call",
  "tx.Revive.instantiate",
  "tx.Revive.instantiate_with_code",
  "api.ReviveApi.call",
  "api.ReviveApi.instantiate",
  "api.ReviveApi.get_storage",
  "api.ReviveApi.get_storage_var_key",
  "api.ReviveApi.trace_call",
  "api.ReviveApi.balance",
  "const.Revive.NativeToEthRatio",
];
