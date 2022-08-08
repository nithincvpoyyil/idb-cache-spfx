import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPFI } from "@pnp/sp";

export interface IHelloCacheProps {
  sp: SPFI;
  context: WebPartContext;
}
