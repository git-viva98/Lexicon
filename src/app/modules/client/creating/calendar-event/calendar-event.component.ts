import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DialogService } from 'src/app/modules/shared/dialog.service';
import { vwClient } from 'src/common/swagger-providers/models';
import { AddClientEventComponent } from './add-client-event/add-client-event.component';

@Component({
  selector: 'app-client-calendar-event',
  templateUrl: './calendar-event.component.html',
  styleUrls: ['./calendar-event.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class ClientCalendarEventComponent implements OnInit {
  @Input() clientDetails: vwClient;

  public eventList: Array<any> = [];
  public indexNumber: number = null;

  constructor(
    private modalService: NgbModal,
    private dialogService: DialogService
  ) {}

  ngOnInit() {}

  public addEvent(action: string) {
    let modalRef = this.modalService.open(AddClientEventComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
      windowClass: 'modal-xlg',
    });

    let component = modalRef.componentInstance;
    component.clientDetails = this.clientDetails;
    component.action = action;
    if (action === 'edit') {
      component.eventDetails = this.eventList[this.indexNumber];
    }

    modalRef.result.then((res) => {
      if (res) {
        if (action === 'edit') {
          this.eventList[this.indexNumber] = res;
        } else {
          this.eventList.push(res);
        }
        this.eventList = [...this.eventList];
      }
    });
  }

  public deleteEvent(index: number) {
    this.dialogService
      .confirm(
        'Are you sure you want to delete this event?',
        'Yes, delete',
        'Cancel',
        'Delete event',
        true,
        'md'
      )
      .then((response) => {
        if (response) {
          this.eventList.splice(index, 1);
        }
      });
  }

  public editEvent(index: number) {
    this.indexNumber = index;
    this.addEvent('edit');
  }

  trackByFn(index: number,obj: any) {
    return obj ? obj['id'] || obj : index ;
  }
}
