import * as React from "react";
import styles from "./HelloCache.module.scss";
import { IHelloCacheProps } from "./IHelloCacheProps";

export default class HelloCache extends React.Component<IHelloCacheProps, {}> {
  public render(): React.ReactElement<IHelloCacheProps> {
    const fn = this.props.getItems;
    return (
      <section className={`${styles.helloCache}`}>
        <div className={styles.welcome}>
          <h2>Cache example</h2>
        </div>
        <div>
          <h3>Welcome to SharePoint Framework!</h3>
          <button
            onClick={() => {
              fn();
            }}
          >
            Get items
          </button>
        </div>
      </section>
    );
  }
}
