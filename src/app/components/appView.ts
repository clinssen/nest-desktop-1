import { App } from './app';
import { Project } from './project/project';

export class AppView {
  private _app: App;                       // parent
  private _project: any;
  private _model: any;

  constructor(app: App) {
    this._app = app;
    this._project = {
      searchTerm: '',
      mode: 'networkEditor',
      sidenavMode: 'networkSelection',
      sidenavOpened: false,
    };
    this._model = {
      selectedModel: '',
      sidenavMode: 'list',
      sidenavOpened: true,
    };
  }

  get filteredProjects(): Project[] {
    if (this._project.searchTerm === '') { return this._app.projects; }
    return this._app.projects.filter((project: Project) =>
      project.name.toLowerCase().indexOf(this._project.searchTerm.toLowerCase()) > -1
    );
  }

  get project(): any {
    return this._project;
  }

  selectProjectMode(value: string) {
    this._project.mode = value;
    if (this._project.mode === 'labBook') {
      this._project.sidenavOpened = false;
    }
    setTimeout(() => window.dispatchEvent(new Event('resize')), 10);
  }

  selectProjectSidenav(mode: string): void {
    if (this._project.sidenavMode === mode) {
      this._project.sidenavOpened = !this._project.sidenavOpened;
    } else {
      this._project.sidenavMode = mode;
      this._project.sidenavOpened = true;
      if (this._project.sidenavMode === 'codeEditor') {
        this._app.project.code.generate();
      }
    }
  }

}
