import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { PropertyService } from '../../services/property.service';
import { UserService } from '../../services/user.service';
import { User } from '../../model/user.model';
import { Property } from '../../model/property.model';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import $ from 'jquery';
declare let google: any;
import { AgmMap } from '@agm/core';

import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-view-property',
  templateUrl: './view-property.component.html',
  styleUrls: ['./view-property.component.css']
})
export class ViewPropertyComponent implements OnInit {
  @ViewChild('agmMap') agmMap: AgmMap

  latitude: Number;
  longitude: Number;
  public iconURL = ['', "../../../assets/icons/B-wireless-network.png",
    "../../../assets/icons/B-hdtv.png",
    "../../../assets/icons/B-bed.png",
    "../../../assets/icons/B-single-bed.png",

    "../../../assets/icons/B-air-conditioner.png",
    "../../../assets/icons/B-fridge.png",
    "../../../assets/icons/B-stove-oven.png",
    "../../../assets/icons/B-washing-machine.png",

    "../../../assets/icons/B-bathtub.png",
    "../../../assets/icons/B-microwave.png",
    "../../../assets/icons/B-landline.png",
    "../../../assets/icons/B-fireplace.png"
  ];
  image = true;
  downloadimage = false;
  public taken;
  public isClicked = [];
  public url;
  public users: User;
  public isDataLoaded = false;
  public images = [];
  public floorplan = [];
  public pos = 0;
  public property;
  public watcher: string;
  public activ = null;
  public hasWaitlist;
  public amount;
  public minDate: Date;
  form: FormGroup;

  constructor(private router: Router, private route: ActivatedRoute, private propSer: PropertyService, private userSer: UserService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    window.onclick = function(event) {
      if (event.target === document.getElementById('floor_plan') ||
        event.target === document.getElementById('map') ||
        event.target === document.getElementById('video')) {
        for (let i = 0; i < document.getElementsByClassName('modal').length; i++) {
          //document.getElementsByClassName('modal')[i].style.display = 'none';
        }
      }
    }

    this.form = new FormGroup({
      from: new FormControl('', [Validators.required]),
      til: new FormControl('', [Validators.required])
    });

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDate = new Date().getDate();
    this.minDate = new Date(currentYear, currentMonth, currentDate);

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.taken = params.get('id');
      this.propSer.viewProperty(this.taken).subscribe(
        data => {

          this.amount = data.prop.deposit;
          this.property = data.prop;
          this.property.longitude = data.prop.longitude;
          this.property.latitude = data.prop.latitude;
          if (data.prop.youtube != undefined) {
            this.property.youtube = this.sanitizer.bypassSecurityTrustResourceUrl(data.prop.youtube.replace('watch?v=', 'embed/'));
          }
          this.property.user = data.user;
          this.isClicked[1] = data.prop.internet,
            this.isClicked[2] = data.prop.cableTV,
            this.isClicked[3] = data.prop.bBed,
            this.isClicked[4] = data.prop.sBed,
            this.isClicked[5] = data.prop.conditioner,
            this.isClicked[6] = data.prop.fridge,
            this.isClicked[7] = data.prop.stove,
            this.isClicked[8] = data.prop.washer,
            this.isClicked[9] = data.prop.bathub,
            this.isClicked[10] = data.prop.microwave,
            this.isClicked[11] = data.prop.landline,
            this.isClicked[12] = data.prop.fireplace,
            this.url = "/uploads/avatars/" + this.property.user.avatar;
          if (this.property.image1 != "no")
            this.images.push(this.propSer.getImateUrl(this.property.image1));
          if (this.property.image2 != "no")
            this.images.push(this.propSer.getImateUrl(this.property.image2));
          if (this.property.image3 != "no")
            this.images.push(this.propSer.getImateUrl(this.property.image3));
          if (this.property.image4 != "no")
            this.images.push(this.propSer.getImateUrl(this.property.image4));
          if (this.property.image5 != "no")
            this.floorplan.push(this.propSer.getImateUrl(this.property.image5));
          if (this.images.length == 0)
            this.images.push(this.propSer.getImateUrl("no"));

          if (this.isLoggedIn()) {
            this.userSer.getSettings().subscribe(
              data => {
                this.users = data.user;
                if (this.users.request == "none") {
                  this.hasWaitlist = false;
                } else {
                  this.hasWaitlist = true;
                }

              });
          }

          this.isDataLoaded = true;
        });
    });
  }

  left() {
    if (this.downloadimage == true) {
      this.downloadimage = false;
      this.image = true;
    } else if (this.pos == 0) {
      this.downloadimage = true;
      this.image = false;
      this.pos = this.images.length - 1;
    } else {
      this.pos = this.pos - 1;
    }
  }

  right() {
    if (this.downloadimage == true) {
      this.downloadimage = false;
      this.image = true;
    } else if (this.pos == this.images.length - 1) {
      this.downloadimage = true;
      this.image = false;
      this.pos = 0;
    } else {
      this.pos = this.pos + 1;
    }
  }

  isLoggedIn() {
    if (this.userSer.isLoggedIn()) {
      if (this.activ == null && this.property.user._id != undefined) {
        this.activ = 1;
      }
      if (this.watcher != this.property.user._id) return true;
      else return false;
    } else return false;
  }

  goToProfile() {
    this.router.navigate(['/users/profile/', this.property.user.userName]);
  }

  payProperty(prop) {
    let a = this.form.value.from.toString().split(" ");
    let b = this.form.value.til.toString().split(" ");
    let param = prop._id + "&" + a[1] + " " + a[2] + " " + a[3] + "&" + b[1] + " " + b[2] + " " + b[3];
    this.router.navigate(['/properties/payment', param]);
  }

  isActive(num) {
    return this.isClicked[num] == true;
  }

  seemore() {
    window.open(this.property.moreimage, "_blank");
  }

  goForProp(prop) { this.router.navigate(['/properties/view', prop._id]); }

  getDate(s) {
    var b = s.split(/\D+/);
    var c = new Date(Date.UTC(b[0], --b[1], b[2]));
    var result = c.toString().split(" ");
    return result[1] + " " + result[2] + ", " + result[3];
  }

  dispPopup(elm) {
    document.getElementById(elm).style.display = 'flex';
  }

  closeModal(elm) {
    document.getElementById(elm).style.display = 'none';
  }
}
