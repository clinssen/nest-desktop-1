import { Activity } from '../activity/activity';
import { SpikeActivity } from '../activity/spikeActivity';
import { AnalogSignalActivity } from '../activity/analogSignalActivity';
import { Config } from '../config';
import { Connection } from '../connection/connection';
import { Model } from '../model/model';
import { Network } from '../network/network';
import { NodeCode } from './nodeCode';
import { NodeSpatial } from './nodeSpatial';
import { NodeView } from './nodeView';
import { Parameter } from '../parameter';


export class Node extends Config {
  private _network: Network;                 // parent
  private _idx: number;                      // generative
  private _code: NodeCode;                   // code service for node
  private _view: NodeView;
  private _name = 'Node';

  // Arguments for nest.Create
  private _modelId: string;
  private _size: number;
  private _params: Parameter[] = [];
  private _spatial: NodeSpatial;
  private _positions: number[][] = [];

  // Only recorder node
  private _recordFrom: string[];             // only for multimeter
  private _activity: SpikeActivity | AnalogSignalActivity | Activity;

  constructor(network: any, node: any) {
    super('Node');
    this._network = network;
    this._idx = network.nodes.length;
    this._code = new NodeCode(this);
    this._view = new NodeView(this, node.view);

    this._modelId = node.model;
    this._size = node.size || 1;
    this.initParameters(node);
    this.initSpatial(node.spatial);
    this.initActivity();
  }

  get activity(): SpikeActivity | AnalogSignalActivity | Activity {
    return this._activity;
  }

  get code(): NodeCode {
    return this._code;
  }

  get filteredParams(): Parameter[] {
    return this._params.filter((param: Parameter) => param.visible);
  }

  get idx(): number {
    return this._idx;
  }

  get model(): Model {
    return this._network.project.app.getModel(this._modelId);
  }

  set model(model: Model) {
    this.modelId = model.id;
  }

  get models(): Model[] {
    const elementType: string = this.model.elementType;
    return this._network.project.app.filterModels(elementType);
  }

  get modelId(): string {
    return this._modelId;
  }

  set modelId(value: string) {
    this._modelId = value;
    this._size = 1;
    this.initParameters();
    this.initSpatial();
    this._network.clean();
    this.initActivity();
    if (this.model.isRecorder()) {
      this.initActivityGraph();
    }
    this.nodeChanges();         // start simulation
  }

  get n(): number {
    return this._size;
  }

  get name(): string {
    return this._name;
  }

  get network(): Network {
    return this._network;
  }

  get nodes(): Node[] {
    if (this.model.existing === 'spike_detector') { return this.sources; }
    if (['multimeter', 'voltmeter'].includes(this.model.existing)) { return this.targets; }
    return [];
  }

  get params(): Parameter[] {
    return this._params;
  }

  get positions(): number[][] {
    return this._positions;
  }

  // set positions(value: number[][]) {
  //   this._positions = value;
  // }

  get recordables(): string[] {
    if (this.model.existing !== 'multimeter') { return []; }
    const targets: Node[] = this.targets;
    if (targets.length === 0) { return []; }
    const recordables = targets.map((target: Node) => target.model.recordables);
    if (recordables.length === 0) { return []; }
    const recordablesFlat: string[] = [].concat(...recordables);
    const recordablesSet: any[] = [...new Set(recordablesFlat)];
    recordablesSet.sort((a: number, b: number) => a - b);
    return recordablesSet;
  }

  get recordFrom(): string[] {
    return this._recordFrom;
  }

  set recordFrom(value: string[]) {
    this._recordFrom = value;
  }

  get size(): number {
    return this._size;
  }

  set size(value: number) {
    this._size = value;
    this.nodeChanges();
  }

  get sources(): Node[] {
    const nodes: Node[] = this._network.connections
      .filter((connection: Connection) => connection.target.idx === this._idx)
      .map((connection: Connection) => connection.source);
    return nodes;
  }

  get spatial(): NodeSpatial {
    return this._spatial;
  }

  get targets(): Node[] {
    const nodes: Node[] = this._network.connections
      .filter((connection: Connection) => connection.source.idx === this._idx)
      .map((connection: Connection) => connection.target);
    return nodes;
  }

  get view(): NodeView {
    return this._view;
  }

  nodeChanges(): void {
    this._network.networkChanges();
  }

  initActivity(): void {
    if (!this.model.isRecorder()) { return; }
    if (this.model.existing === 'spike_detector') {
      this._activity = new SpikeActivity(this);
    } else if (['voltmeter', 'multimeter'].includes(this.model.existing)) {
      this._activity = new AnalogSignalActivity(this);
    } else {
      this._activity = new Activity(this);
    }
  }

  initActivityGraph(): void {
    this._network.project.activityGraph.init();
  }

  initParameters(node: any = null): void {
    // Update parameters from model or node
    this._params = [];
    if (this.model && node && node.hasOwnProperty('params')) {
      this.model.params.forEach((modelParam: Parameter) => {
        const nodeParam = node.params.find((p: any) => p.id === modelParam.id);
        this.addParameter(nodeParam || modelParam);
      });
    } else if (this.model) {
      this.model.params.forEach((param: Parameter) => this.addParameter(param));
    } else if (node.hasOwnProperty('params')) {
      node.params.forEach((param: Parameter) => this.addParameter(param));
    }
    if (this.model.existing === 'multimeter') {
      this._recordFrom = (node !== null) ? node.recordFrom || ['V_m'] : ['V_m'];
    }
  }

  addParameter(param: any): void {
    this._params.push(new Parameter(this, param));
  }

  hasParameter(paramId: string): boolean {
    return this._params.find((param: Parameter) => param.id === paramId) !== undefined;
  }

  getParameter(paramId: string): any {
    if (this.hasParameter(paramId)) {
      return this._params.find((param: Parameter) => param.id === paramId).value;
    }
  }

  resetParameters(): void {
    this._params.forEach((param: Parameter) => param.reset());
    this.nodeChanges();
  }

  setWeights(term: string): void {
    const connections: Connection[] = this._network.connections
      .filter((connection: Connection) => connection.source.idx === this._idx && connection.target.model.elementType !== 'recorder');
    connections.forEach((connection: Connection) => {
      const value: number = Math.abs(connection.synapse.weight);
      connection.synapse.weight = (term === 'inhibitory' ? -1 : 1) * value;
    });
    this.nodeChanges();
  }

  initSpatial(spatial: any = {}) {
    this._spatial = new NodeSpatial(this, spatial);
  }

  clean(): void {
    this._idx = this._network.nodes.indexOf(this);
    this.collectRecordFromTargets();
    this.view.clean();
  }

  collectRecordFromTargets(): void {
    if (this.model.existing !== 'multimeter') { return; }
    const recordables = this.recordables;
    this._recordFrom = (recordables.length > 0) ? this.recordFrom.filter((rec: string) => recordables.includes(rec)) : [];
  }

  clone(): Node {
    return new Node(this._network, this);
  }

  delete(): void {
    this._network.deleteNode(this);
  }

  copy(item: any): any {
    return JSON.parse(JSON.stringify(item));
  }

  toJSON(target: string = 'db'): any {
    const node: any = {
      model: this._modelId,
    };
    if (target === 'simulator') {
      node.n = this._size;
      node.element_type = this.model.elementType;
      node.params = {};
      this._params
        .filter((param: Parameter) => param.visible)
        .forEach((param: Parameter) => node.params[param.id] = param.value);
      if (this.model.existing === 'multimeter' && this._recordFrom.length > 0) {
        node.params.record_from = this._recordFrom;
      }
    } else {
      node.size = this._size;
      node.view = this._view.toJSON();
      node.params = this._params.map((param: Parameter) => param.toJSON());
      if (this.model.existing === 'multimeter') {
        node.recordFrom = this._recordFrom;
      }
    }
    if (this._spatial.hasPositions()) {
      node.spatial = this._spatial.toJSON(target);
    }
    return node;
  }

}
