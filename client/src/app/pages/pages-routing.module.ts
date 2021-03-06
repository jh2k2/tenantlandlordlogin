import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { SearchComponent } from './search/search.component';
import { AboutComponent } from './about/about.component';
import { HiwComponent } from './hiw/hiw.component';
import { ContactComponent } from './contact/contact.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'search', component: SearchComponent },
  { path: 'hiw', component: HiwComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'search/:param', component: SearchComponent },
  { path: 'about', component: AboutComponent },
  { path: 'signup', component: SignupComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
