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

  nameFilter: string = localStorage.getItem('nameFilter');
  coordinatesXFromFilter: number = localStorage.getItem('coordinatesXFromFilter');
  coordinatesXUntilFiler: number = localStorage.getItem('coordinatesXUntilFilter');
  coordinatesYFromFilter: number = localStorage.getItem('coordinatesYFromFilter');
  coordinatesYUntilFilter: number = localStorage.getItem('coordinatesYUntilFilter');
  rangeDatesFilter: Date[] = localStorage.getItem('rangeDatesFilter');
  minimalPointFromFilter: number = localStorage.getItem('minimalPointFromFilter');
  minimalPointUntilFilter: number = localStorage.getItem('minimalPointUntilFilter');
  selectedDifficultiesFilter: string[] = localStorage.getItem('selectedDifficultiesFilter');
  selectedDisciplinesFilter: string[] = localStorage.getItem('selectedDisciplinesFilter');
  sortParam: string = localStorage.getItem('sortParam');

  constructor(private labWorkService: LabWorkService, private messageService: MessageService, private formBuilder: FormBuilder) {
    this.splitButtonItems =[
      {
        label: 'Количество объектов по сложности', command: () => {
          this.showModalDialog2()
        }
      }
    ]

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
    this.filterList()
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
    this.saveFiltersToLocalStorage();

    let paramsModel = new ParamsModel(
      this.nameFilter, this.coordinatesXFromFilter, this.coordinatesXUntilFiler,
      this.coordinatesYFromFilter, this.coordinatesYUntilFilter, this.rangeDatesFilter, this.minimalPointFromFilter, this.minimalPointUntilFilter,
      this.selectedDifficultiesFilter, this.selectedDisciplinesFilter, this.sortParam)

    this.labWorkService.getAllLabWorks(paramsModel).subscribe(labWorkArray => {
      this.labWorks = labWorkArray;
      console.log(labWorkArray);
    })
  }

  saveFiltersToLocalStorage() {
    (this.nameFilter == null) ? localStorage.removeItem('nameFilter') : localStorage.setItem('nameFilter', this.nameFilter);

    (this.coordinatesXFromFilter == null) ? localStorage.removeItem('coordinatesXFromFilter') :
      localStorage.setItem('coordinatesXFromFilter', this.coordinatesXFromFilter);

    (this.coordinatesXUntilFiler == null) ? localStorage.removeItem('coordinatesXUntilFiler') :
      localStorage.setItem('coordinatesXUntilFiler', this.coordinatesXUntilFiler);

    (this.coordinatesYFromFilter == null) ? localStorage.removeItem('coordinatesYFromFilter') :
      localStorage.setItem('coordinatesYFromFilter', this.coordinatesYFromFilter);

    (this.coordinatesYUntilFilter == null) ? localStorage.removeItem('coordinatesYUntilFilter') :
      localStorage.setItem('coordinatesYUntilFilter', this.coordinatesYUntilFilter);

    (this.minimalPointFromFilter == null) ? localStorage.removeItem('minimalPointFromFilter') :
      localStorage.setItem('minimalPointFromFilter', this.minimalPointFromFilter);

    (this.minimalPointUntilFilter == null) ? localStorage.removeItem('minimalPointUntilFilter') :
      localStorage.setItem('minimalPointUntilFilter', this.minimalPointUntilFilter);

    (this.selectedDifficultiesFilter == null) ? localStorage.removeItem('selectedDifficultiesFilter') :
      localStorage.setItem('selectedDifficultiesFilter', this.selectedDifficultiesFilter);

    (this.selectedDisciplinesFilter == null) ? localStorage.removeItem('selectedDisciplinesFilter') :
      localStorage.setItem('selectedDisciplinesFilter', this.selectedDisciplinesFilter);
  }

  refresh(): void {
    window.location.reload();
  }

  resetFilters(): void {
    this.nameFilter = null;
    this.coordinatesXFromFilter = null;
    this.coordinatesXUntilFiler = null;
    this.coordinatesYFromFilter = null;
    this.coordinatesYUntilFilter = null;
    this.rangeDatesFilter = null;
    this.minimalPointFromFilter = null;
    this.minimalPointUntilFilter = null;
    this.selectedDifficultiesFilter = null;
    this.selectedDisciplinesFilter = null;
    this.sortParam = null;

    localStorage.removeItem('nameFilter');
    localStorage.removeItem('coordinatesXFromFilter');
    localStorage.removeItem('coordinatesXUntilFiler');
    localStorage.removeItem('coordinatesYFromFilter');
    localStorage.removeItem('coordinatesYUntilFilter');
    localStorage.removeItem('minimalPointFromFilter');
    localStorage.removeItem('minimalPointUntilFilter');
    localStorage.removeItem('selectedDifficultiesFilter');
    localStorage.removeItem('selectedDisciplinesFilter');
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
    return this.coordinatesXFromFilter != null || this.coordinatesXUntilFiler != null || this.coordinatesYUntilFilter != null || this.coordinatesYFromFilter != null;
  }

  isMinimalPointFiltered(): boolean {
    return this.minimalPointFromFilter != null || this.minimalPointUntilFilter != null;
  }

  isDisciplineFiltered(): boolean {
    return (this.selectedDisciplinesFilter != '' && this.selectedDisciplinesFilter != null) || this.lectureHours != null;
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
}

interface Difficulty {
  name: string,
  value: string
}

interface Discipline {
  id: number,
  name: string
}
