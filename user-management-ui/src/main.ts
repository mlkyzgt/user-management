import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import 'zone.js';

// Angular uygulamasını App componenti ile başlatıyor.
bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
