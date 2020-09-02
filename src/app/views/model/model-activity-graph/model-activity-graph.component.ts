import { Component, OnInit, Input } from '@angular/core';

import { App } from '../../../components/app';
import { Model } from '../../../components/model/model';
import { Project } from '../../../components/project/project';
import { Activity } from '../../../components/activity/activity';
import { ActivityChartGraph } from '../../../components/activity/Plotly/activityChartGraph';

import { AppService } from '../../../services/app/app.service';
import { SimulationRunService } from '../../../services/simulation/simulation-run.service';


@Component({
  selector: 'app-model-activity-graph',
  templateUrl: './model-activity-graph.component.html',
  styleUrls: ['./model-activity-graph.component.scss'],
})
export class ModelActivityGraphComponent implements OnInit {
  @Input() modelId: string;
  private _project: Project;
  public graph: ActivityChartGraph;
  public config: any = {
    staticPlot: true,
  };
  public data: any[] = [{
    mode: 'lines',
    type: 'scatter',
    x: [0, 1],
    y: [1, 0]
  }];
  public layout: any = {
    title: 'Neuronal response to spike inputs',
    xaxis: {
      title: 'Time [ms]'
    },
    yaxis: {
      title: 'Membrane potential [mV]'
    },
    showlegend: false
  };
  public style: any = {
    width: '100%',
  };


  constructor(
    private _appService: AppService,
    private _simulationRunService: SimulationRunService,
  ) { }

  ngOnInit() {
    this.update();
  }

  get activity(): Activity {
    return this._project.activities[0];
  }

  update(): void {
    this._project = this._appService.app.createNeuronModelProject(this.modelId);
    this._simulationRunService.run(this._project, true).then(() => {
      this.graph = new ActivityChartGraph(this._project, 'model');
    });
  }

}
