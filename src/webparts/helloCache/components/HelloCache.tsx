import * as React from "react";
import styles from "./HelloCache.module.scss";
import { IHelloCacheProps } from "./IHelloCacheProps";

import { IDBCaching } from "@simpletech/pnp-idb-cache";

import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

export default class HelloCache extends React.Component<
  IHelloCacheProps,
  { properties: unknown; data1: unknown; data2: unknown }
> {
  readonly state: { properties: unknown; data1: unknown; data2: unknown } = {
    properties: null,
    data1: null,
    data2: null,
  };

  private getItems(): void {
    // get all the items from a list
    this.props.sp.web.lists
      .using(
        IDBCaching({
          keyFactory: () => "data-key-1",
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
          console.log("data fetch completed-1", items);
          this.setState({ data1: items });
        },
        () => {
          console.log("data fetch failed");
        }
      );

    this.props.sp.web.lists
      .using(
        IDBCaching({
          keyFactory: () => "data-key-2",
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
          console.log("data fetch complete-2", items);
          this.setState({ data2: items });
        },
        () => {
          console.log("data fetch failed");
        }
      );
  }

  private getPageProperties(): void {
    this.props.sp.web.lists
      .using(
        IDBCaching({
          expireFunc: () => {
            const time = new Date();
            time.setSeconds(time.getSeconds() + 30);
            return time;
          },
          keyFactory: () => "data-key-3",
          idbParams: { dbName: "newDB", storeName: "newStore" },
        })
      )
      .getById(this.props.context.pageContext.list.id.toString())
      .items.getById(this.props.context.pageContext.listItem.id)()
      .then((data) => {
        this.setState({ properties: data });
      }, console.log);
  }
  public render(): React.ReactElement<IHelloCacheProps> {
    const { data1, data2, properties } = this.state;
    return (
      <section className={`${styles.helloCache}`}>
        <div>
          <h2>Cache example</h2>
          <button
            className={styles.button}
            onClick={() => {
              this.getItems();
            }}
          >
            Get items
          </button>
          <button
            className={styles.button}
            onClick={() => {
              this.getPageProperties();
            }}
          >
            Get page properties
          </button>
        </div>

        <div className={styles.wrapper}>
          <h3>Page properties</h3>
          {properties
            ? JSON.stringify(this.state.properties, null, 1)
            : "Not loaded"}
        </div>
        <div className={styles.wrapper}>
          <h3>Data-1</h3>
          {data1 ? JSON.stringify(this.state.data1, null, 1) : "Not loaded"}
        </div>
        <div className={styles.wrapper}>
          <h3>Data-2</h3>
          {data2 ? JSON.stringify(this.state.data2, null, 1) : "Not loaded"}
        </div>
      </section>
    );
  }
}
