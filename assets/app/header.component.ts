import {Component} from '@angular/core';

@Component({
    selector: 'app-header',
    template: `
        <h4 style="opacity: .5; float: right;">A MEAN messenger<br><h6>by Jordan Purinton</h6><br>
        <h6 *ngIf="isLoggedIn()">Logged in as <b>{{firstName}}</b></h6>
        </h4>
        
        <header class="row">
                <ul class="nav nav-pills">
                    <li routerLinkActive="active"><a [routerLink]="['/messages']">Messenger</a></li>
                    <li routerLinkActive="active"><a [routerLink]="['/auth']">Account</a></li>
                </ul>
        </header>
    `
})

export class HeaderComponent{

    isLoggedIn(){
        return localStorage.getItem('token') !== null;
    }

    firstName = localStorage.getItem('firstName');
}