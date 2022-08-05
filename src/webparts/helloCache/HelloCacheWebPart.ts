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
  private listItems: any[] = [];

  public render(): void {
    const element: React.ReactElement<IHelloCacheProps> = React.createElement(
      HelloCache,
      {
        listItems: [],
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    this.sp = spfi().using(SPFx(this.context));
    let resultP = new Promise((res, rej) => {
      this.getItems().then(
        (items) => {
          console.log("data fetch completed", items);
          res(items);
        },
        () => {
          console.log("data fetch failed");
        }
      );
    });

    return Promise.all([super.onInit(), resultP]).then(() => {
      return Promise.resolve();
    });
  }

  private async getItems() {
    // get all the items from a list
    const items: any[] = await this.sp.web.lists
      .using(IDBCaching())
      .getByTitle("ConfigurationList")
      .items();

    return items;
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
