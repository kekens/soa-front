// @ts-nocheck
import {Component, OnInit} from '@angular/core';
import {LabWorkService} from "../../services/labwork.service";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LabWorkModel} from "../../models/labwork.model";
import {MessageService} from "primeng/api";

@Component({
  templateUrl: './labwork-dialog.component.html',
  styleUrls: ['./labwork-dialog.component.scss'],
  providers: [MessageService]
})
export class LabWorkDialogComponent implements OnInit {

  // Form and labwork for creating
  formUpdate: FormGroup;
  labWorkModel: LabWorkModel;

  optionDifficulties: Difficulty[];
  optionDisciplines: Discipline[];

  constructor(private labWorkService: LabWorkService, private formBuilder: FormBuilder, private messageService: MessageService,
              public ref: DynamicDialogRef, public config: DynamicDialogConfig)
  {
    this.optionDisciplines = [
      { id: 1, name: 'soa', lectureHours: 100 },
      { id: 2, name: 'blps', lectureHours: 88 }
    ]

    this.optionDifficulties = [
      {name: 'Легко', value: 'VERY_EASY'},
      {name: 'Нормально', value: 'NORMAL'},
      {name: 'Невозможно', value: 'IMPOSSIBLE'}
    ]

    this.formUpdate = this.formBuilder.group({
      labName: [this.config.data.name, Validators.required],
      labX: [this.config.data.coordinates.x, Validators.required],
      labY: [this.config.data.coordinates.y, [Validators.required]],
      labMinimalPoint: [this.config.data.minimalPoint, [Validators.min(1)]],
      labDifficulty: [this.config.data.difficulty],
      labDiscipline: [this.config.data.discipline, Validators.required]
    })

    this.labWorkModel = {
      name: '',
      coordinates: null,
      minimalPoint: null,
      difficulty: null,
      discipline: null,
    }

  }

  ngOnInit(): void {

  }

  updateLabWork() {
    var isChanged = false

    this.labWorkModel = this.labWorkService.getLabWorkFromForm(this.formUpdate)
    this.labWorkModel.id = this.config.data.id

    if ((this.labWorkModel.name != this.config.data.name) || (this.labWorkModel.coordinates.x != this.config.data.coordinates.x)
    || (this.labWorkModel.coordinates.y != this.config.data.coordinates.y) || (this.labWorkModel.minimalPoint != this.config.data.minimalPoint)
    || (this.labWorkModel.difficulty != this.config.data.difficulty) || (this.labWorkModel.discipline.name != this.config.data.discipline.name))
    {
      isChanged = true
    }

    if (!isChanged) {
      this.messageService.add({severity:'info', summary:'Инфо', detail: 'Данные не изменились'});
    } else {
      this.labWorkService.updateLabWork(this.labWorkModel).subscribe(data => {
        console.log("LabWork updated")
      }, error => {
        for (let er of error.error) {
          this.messageService.add({severity:'error', summary:'Ошибка', detail: er['message']});
        }
      })

      this.ref.close()
    }
  }
}

interface Difficulty {
  name: string,
  value: string
}

interface Discipline {
  id: number,
  name: string,
  lectureHours: number
}
