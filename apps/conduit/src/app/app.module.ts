import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { FooterComponent } from './layout/footer/footer.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { ApiModule } from './api/api.module';
import { AuthModule } from './auth/auth.module';
import { GLOBAL_XSTATE_ANGULAR } from './auth/+xstate/auth-machine.config';

@NgModule({
  imports: [
    ApiModule,
    AuthModule,
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(
      [
        {
          path: '',
          loadChildren: () =>
            import('./home/home.module').then((m) => m.HomeModule),
        },
      ],
      {
        initialNavigation: 'enabled',
        useHash: true,
      }
    ),
  ],
  declarations: [AppComponent, FooterComponent, NavbarComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
