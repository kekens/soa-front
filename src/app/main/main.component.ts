// @ts-nocheck
import {Component} from '@angular/core';
import {LabWorkService} from "../service/labwork.service";
import {LabWorkModel} from "../model/labwork.model";
import {ParamsModel} from "../model/params.model";
import {MenuItem, MessageService} from "primeng/api";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CoordinatesModel} from "../model/coordinates.model";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  providers: [MessageService]
})
export class MainComponent  implements ngOnInit {

  formCreate: FormGroup;
  labWorkModel: LabWorkModel;

  labWorks: LabWorkModel[];
  splitButtonItems: MenuItem[];

  displayModal1: boolean;
  displayModal2: boolean;
  displayModalCreate: boolean;

  selectedDifficultyExtra: Difficulty;
  optionDifficulties: Difficulty[];

  optionDisciplines: Discipline[];

  name: string = null;
  coordinatesXFrom: number = null;
  coordinatesXUntil: number = null;
  coordinatesYFrom: number = null;
  coordinatesYUntil: number = null;
  rangeDates: Date[] = null;
  minimalPointFrom: number = null;
  minimalPointUntil: number = null;
  selectedDifficulties: string[] = null;
  disciplines: string[] = null;
  selectedDisciplines: string[] = null;
  lectureHours: number = null;

  constructor(private labWorkService: LabWorkService, private messageService: MessageService, private formBuilder: FormBuilder) {
    this.optionDisciplines = [
      { id: 1, name: 'soa' },
      { id: 2, name: 'blps' }
    ]

    this.optionDifficulties = [
      {name: 'Легко', value: 'VERY_EASY'},
      {name: 'Нормально', value: 'NORMAL'},
      {name: 'Невозможно', value: 'IMPOSSIBLE'}
    ]

    this.formCreate = formBuilder.group({
      labName: ['', Validators.required],
      labX: [null, Validators.required],
      labY: [null, [Validators.required]],
      labMinimalPoint: [null, [Validators.min(1)]],
      labDifficulty: [null],
      labDiscipline: [null, Validators.required]
    })

    this.labWorkModel = {
      name: '',
      coordinates: null,
      minimalPoint: null,
      difficulty: null,
      discipline: null,
    }
  }

  ngOnInit() {
    this.splitButtonItems =[
      {
        label: 'Количество объектов по сложности', command: () => {
          this.showModalDialog2()
        }
      }
    ]
    this.labWorkService.getAllLabWorks().subscribe(labWorkArray => {
      this.labWorks = labWorkArray;
      console.log(this.labWorks);
    })
  }

  createLabWork() {
    this.labWorkModel.name = this.formCreate.get('labName').value;
    this.labWorkModel.coordinates = new CoordinatesModel(this.formCreate.get('labX').value, this.formCreate.get('labY').value);
    this.labWorkModel.minimalPoint = this.formCreate.get('labMinimalPoint').value;
    this.labWorkModel.difficulty = this.formCreate.get('labDifficulty').value;
    this.labWorkModel.discipline = this.formCreate.get('labDiscipline').value;

    this.labWorkService.addLabWork(this.labWorkModel).subscribe( data => {
      if (data == null) {
        console.log('LabWork added');
        this.refresh();
      } else {
        console.log('Errors')
        console.log(data)
        console.log(data['message'])
        this.messageService.add({severity:'error', summary:'Ошибка', detail: data.valueOf('message')});
      }
    })
  }

  filterList() {
    let paramsModel = new ParamsModel(
      this.name, this.coordinatesXFrom, this.coordinatesXUntil,
      this.coordinatesYFrom, this.coordinatesYUntil, this.rangeDates, this.minimalPointFrom, this.minimalPointUntil,
      this.selectedDifficulties, this.selectedDisciplines, this.lectureHours)

    this.labWorkService.getAllLabWorks(paramsModel).subscribe(labWorkArray => {
      this.labWorks = labWorkArray;
      console.log(labWorkArray);
    })
  }

  deleteRandom() {
    this.labWorkService.deleteRandomLabWork(this.selectedDifficultyExtra.value).subscribe(error => {
      console.log(error)
    });
  }

  getCount() {
    this.labWorkService.getCountLabWork(this.selectedDifficultyExtra.value).subscribe( data => {
      this.messageService.add({severity:'success', summary:'Результат', detail: 'Количество лабораторных, сложность которых выше ' + data});
      console.log(data)
    })
  }

  isCoordinatesFiltered(): boolean {
    return this.coordinatesXFrom != null || this.coordinatesXUntil != null || this.coordinatesYUntil != null || this.coordinatesYFrom != null;
  }

  isMinimalPointFiltered(): boolean {
    return this.minimalPointFrom != null || this.minimalPointUntil != null;
  }

  isDisciplineFiltered(): boolean {
    return (this.selectedDisciplines != '' && this.selectedDisciplines != null) || this.lectureHours != null;
  }

  showModalDialog1() {
    this.displayModal1 = true
  }

  showModalDialog2() {
    this.displayModal2 = true
  }

  showModalDialogCreate() {
    this.displayModalCreate = true
  }

  refresh(): void {
    window.location.reload();
  }
}

interface Difficulty {
  name: string,
  value: string
}

interface Discipline {
  id: number,
  name: string
}
