import type { PoolDetailsRouteParams } from "~/screens/PoolDetails";

export declare global {
  namespace ReactNavigation {
    interface RootParamList {
      "new-pool": undefined;
      pools: undefined;
      "find-pool": undefined;
      "pool-details": PoolDetailsRouteParams;
    }
  }
}
