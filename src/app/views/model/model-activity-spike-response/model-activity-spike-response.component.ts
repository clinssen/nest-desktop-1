import { Component, OnInit, Input } from '@angular/core';

import { Project } from '../../../components/project/project';
import { Activity } from '../../../components/activity/activity';
import { ActivityChartGraph } from '../../../components/activity/activityChartGraph';
import { AnalogSignalPlotPanel } from '../../../components/activity/plotPanels/analogSignalPlotPanel';

import { AppService } from '../../../services/app/app.service';


@Component({
  selector: 'app-model-activity-spike-response',
  templateUrl: './model-activity-spike-response.component.html',
  styleUrls: ['./model-activity-spike-response.component.scss'],
})
export class ModelActivitySpikeResponseComponent implements OnInit {
  @Input() modelId: string;
  private _config: any = {
    staticPlot: true,
  };
  private _filename = 'neuron-spike-response';
  private _graph: ActivityChartGraph;
  private _layout: any = {
    title: 'Neuronal response to spike inputs',
    xaxis: {
      title: 'Time [ms]'
    },
    yaxis: {
      title: 'Membrane potential [mV]'
    },
    showlegend: false
  };
  private _project: Project;
  private _registerPanels: any[] = [
    (graph: ActivityChartGraph) => new AnalogSignalPlotPanel(graph),
  ];
  private _style: any = {};

  constructor(
    private _appService: AppService,
  ) { }

  ngOnInit() {
    this.update();
  }

  get activity(): Activity {
    return this._project.activities[0];
  }

  get config(): any {
    return this._config;
  }

  get data(): any[] {
    return this._graph ? this._graph.data : [];
  }

  get layout(): any {
    return this._layout;
  }

  get style(): any {
    return this._style;
  }

  update(): void {
    if (this.modelId) {
      this._project = this._appService.app.initProjectFromAssets(this._filename);
      this._project.network.nodes[1].modelId = this.modelId;
      this._project.code.generate();
      this._project.initActivityGraph(this._registerPanels);
      this._project.runSimulationCode();
    }
  }

}
