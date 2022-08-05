import * as React from "react";
import styles from "./HelloCache.module.scss";
import { IHelloCacheProps } from "./IHelloCacheProps";
import { escape } from "@microsoft/sp-lodash-subset";

export default class HelloCache extends React.Component<IHelloCacheProps, {}> {
  public render(): React.ReactElement<IHelloCacheProps> {
    const { listItems = [] } = this.props;

    return (
      <section className={`${styles.helloCache}`}>
        <div className={styles.welcome}>
          <h2>Cache example</h2>
          <div></div>
        </div>
        <div>
          <h3>Welcome to SharePoint Framework!</h3>
          <p>
            The SharePoint Framework (SPFx) is a extensibility model for
            Microsoft Viva, Microsoft Teams and SharePoint. It&#39;s the easiest
            way to extend Microsoft 365 with automatic Single Sign On, automatic
            hosting and industry standard tooling.
          </p>
        </div>
      </section>
    );
  }
}
