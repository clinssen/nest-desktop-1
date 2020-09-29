import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatMenuTrigger } from '@angular/material/menu';

import { enterAnimation } from '../../../animations/enter-animation';

import { Project } from '../../../components/project/project';

import { SimulationRunService } from '../../../services/simulation/simulation-run.service';


@Component({
  selector: 'app-project-toolbar',
  templateUrl: './project-toolbar.component.html',
  styleUrls: ['./project-toolbar.component.scss'],
  animations: [enterAnimation],
})
export class ProjectToolbarComponent implements OnInit {
  @Input() project: Project;

  @ViewChild(MatMenuTrigger, { static: false }) contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  constructor(
    private _router: Router,
    private _simulationRunService: SimulationRunService,
  ) { }

  ngOnInit() {
  }

  get view(): any {
    return this.project.app.view.project;
  }

  navigate(id: string): void {
    const url: string = 'project/' + id;
    this._router.navigate([{ outlets: { primary: url, nav: 'project' } }]);
  }

  run(): void {
    this.selectMode('activityExplorer');
    this._simulationRunService.run(this.project);
  }

  countBefore(): number {
    return this.project.networkRevisionIdx;
  }

  countAfter(): number {
    return this.project.networkRevisions.length - this.project.networkRevisionIdx - 1;
  }

  selectMode(mode: string): void {
    this.project.app.view.selectProjectMode(mode);
  }

  isActive(mode: string): boolean {
    return this.view.mode === mode;
  }

  onSelectionChange(event: any): void {
    const configData: any = this.project.config;
    configData[event.option.value] = event.option.selected;
    this.project.config = configData;
  }

  onContextMenu(event: MouseEvent): void {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.openMenu();
  }

}
