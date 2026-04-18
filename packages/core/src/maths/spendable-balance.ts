import { BigIntMath } from "@reactive-dot/utils";

interface SpendableBalanceParam {
  free: bigint;
  reserved: bigint;
  frozen: bigint;
  existentialDeposit: bigint;
  includesExistentialDeposit?: boolean;
}

export function spendableBalance({
  free,
  reserved,
  frozen,
  existentialDeposit,
  includesExistentialDeposit = false,
}: SpendableBalanceParam) {
  return BigIntMath.max(
    0n,
    free - BigIntMath.max(frozen - reserved, includesExistentialDeposit ? 0n : existentialDeposit),
  );
}
