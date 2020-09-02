import { ChangeDetectorRef, Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';

import { App } from '../components/app';

import { AppService } from '../services/app/app.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('content', { static: false }) content: ElementRef;
  public mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(
    private _appService: AppService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _media: MediaMatcher,
    public router: Router,
  ) {
    this.mobileQuery = _media.matchMedia('(max-width: 1023px)');
    this._mobileQueryListener = () => _changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  get sidenavOpened(): boolean {
    return this._appService.sidenavOpened;
  }

  set sidenavOpened(value: boolean) {
    this._appService.sidenavOpened = value;
  }

  get rightClick(): boolean {
    return this._appService.rightClick;
  }

  triggerResize(): void {
    if (!this.mobileQuery.matches) {
      window.dispatchEvent(new Event('resize'));
    }
  }

}
