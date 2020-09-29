import { Config } from '../config';
import { Connection } from '../connection/connection';
import { Model } from '../model/model';
import { NetworkCode } from './networkCode';
import { NetworkView } from './networkView';
import { Node } from '../node/node';
import { Project } from '../project/project';


export class Network extends Config {
  private _project: Project;                     // parent
  private _view: NetworkView;                    // view
  private _code: NetworkCode;                    // code

  private _nodes: Node[] = [];                   // for nest.Create
  private _connections: Connection[] = [];       // for nest.Connect

  constructor(project: Project, network: any = {}) {
    super('Network');
    this._project = project;
    this._code = new NetworkCode(this);
    this._view = new NetworkView(this);

    this.update(network);
    this.clean();
  }

  get code(): NetworkCode {
    return this._code;
  }

  get connections(): Connection[] {
    return this._connections;
  }

  get neurons(): Node[] {
    return this._nodes.filter((node: Node) => node.model.elementType === 'neuron');
  }

  get nodes(): Node[] {
    return this._nodes;
  }

  get project(): Project {
    return this._project;
  }

  get recorders(): Node[] {
    return this._nodes.filter((node: Node) => node.model.isRecorder());
  }

  get stimulators(): Node[] {
    return this._nodes.filter((node: Node) => node.model.elementType === 'stimulator');
  }

  get view(): NetworkView {
    return this._view;
  }

  networkChanges(): void {
    this._project.commitNetwork(this);
    // this._project.activityGraph.init();
  }

  oldest(): void {
    this._project.networkOldest();
  }

  older(): void {
    this._project.networkOlder();
  }

  newer(): void {
    this._project.networkNewer();
  }

  newest(): void {
    this._project.networkNewest();
  }

  addNode(node: any): void {
    this._nodes.push(new Node(this, node));
  }

  addConnection(connection: any): void {
    this._connections.push(new Connection(this, connection));
    if (connection.elementType === 'recorder') {
      this._project.initActivityGraph();
    }
  }

  deleteNode(node: Node): void {
    this._view.resetFocus();
    this._view.resetSelection();
    this._connections = this._connections.filter((c: Connection) => (c.source !== node && c.target !== node));
    // this.nodes = this.nodes.filter((n: Node) => n.idx !== node.idx);
    const idx: number = node.idx;
    this._nodes = this._nodes.slice(0, idx).concat(this.nodes.slice(idx + 1));
    this.clean();
    this.networkChanges();
  }

  deleteConnection(connection: Connection): void {
    this._view.resetFocus();
    this._view.resetSelection();
    // this.connections = this.connections.filter((c: Connection) => c.idx !== connection.idx);
    const idx: number = connection.idx;
    this._connections = this._connections.slice(0, idx).concat(this.connections.slice(idx + 1));
    this.clean();
    this.networkChanges();
  }

  clean(): void {
    this._nodes.forEach((node: Node) => node.clean());
    this._connections.forEach((connection: Connection) => connection.clean());
  }

  copy(item: any): any {
    return JSON.parse(JSON.stringify(item));
  }

  clone(): Network {
    return new Network(this._project, this);
  }

  update(network: any): void {
    this._nodes = [];
    this._connections = [];

    if (network.nodes) {
      network.nodes.forEach((node: any) => this.addNode(node));
    }
    if (network.connections) {
      network.connections.forEach((connection: any) => this.addConnection(connection));
    }
  }


  /**
   * Clears the network by deleting every node and every connection.
   */
  empty(): void {
    this._view.resetFocus();
    this._view.resetSelection();
    this._connections = [];
    this._nodes = [];
    // this.connections.forEach((connection: Connection) => this.deleteConnection(connection));
    // this.nodes.forEach((node: Node) => this.deleteNode(node));
    this.clean();
    this.networkChanges();
  }

  isEmpty(): boolean {
    return this._nodes.length === 0 && this._connections.length === 0;
  }

  toJSON(target: string = 'db'): any {
    const network: any = {
      nodes: this._nodes.map((node: Node) => node.toJSON(target)),
      connections: this._connections.map((connection: Connection) => connection.toJSON(target)),
    };
    return network;
  }

}
