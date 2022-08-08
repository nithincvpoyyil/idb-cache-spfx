import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";

import { IDBCaching } from "@simpletech/pnp-idb-cache";

import { SPFI, spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

import * as strings from "HelloCacheWebPartStrings";
import HelloCache from "./components/HelloCache";
import { IHelloCacheProps } from "./components/IHelloCacheProps";

export interface IHelloCacheWebPartProps {
  description: string;   
}

export default class HelloCacheWebPart extends BaseClientSideWebPart<IHelloCacheWebPartProps> {
  private sp: SPFI;

  public render(): void {
    const element: React.ReactElement<IHelloCacheProps> = React.createElement(
      HelloCache,
      {
        getItems: () => {
          this.getItems();
        },
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    this.sp = spfi().using(SPFx(this.context));
    return super.onInit();
  }

  private getItems(): void {
    // get all the items from a list
    this.sp.web.lists
      .using(
        IDBCaching({
          keyFactory: () => "data-key-1",
          expireFunc: () => {
            const time = new Date();
            time.setSeconds(time.getSeconds() + 10);
            return time;
          },
        })
      )
      .getByTitle("ConfigurationList")
      .items()
      .then(
        (items) => {
          console.log("data fetch completed-1", items);
        },
        () => {
          console.log("data fetch failed");
        }
      );

    this.sp.web.lists
      .using(
        IDBCaching({
          keyFactory: () => "data-key-2",
          expireFunc: () => {
            const time = new Date();
            time.setSeconds(time.getSeconds() + 20);
            return time;
          },
        })
      )
      .getByTitle("ConfigurationList")
      .items()
      .then(
        (items) => {
          console.log("data fetch complete-2", items);
        },
        () => {
          console.log("data fetch failed");
        }
      );
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription,
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField("description", {
                  label: strings.DescriptionFieldLabel,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
