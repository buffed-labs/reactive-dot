import { AccountSelect } from "./account-select";
import { SignerProvider } from "@reactive-dot/react";
import { type PropsWithChildren } from "react";

export function AccountGuard({ children }: PropsWithChildren) {
  return (
    <AccountSelect>
      {(selectedAccount) => (
        <SignerProvider signer={selectedAccount.polkadotSigner}>
          {children}
        </SignerProvider>
      )}
    </AccountSelect>
  );
}
