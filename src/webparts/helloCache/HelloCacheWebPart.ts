import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";

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
        sp: this.sp,
        context: this.context,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    this.sp = spfi().using(SPFx(this.context));
    return super.onInit();
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
