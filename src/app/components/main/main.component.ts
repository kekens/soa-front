// @ts-nocheck
import { Component, OnInit, ViewChild} from '@angular/core';
import {LabWorkService} from "../../services/labwork.service";
import {LabWorkModel} from "../../models/labwork.model";
import {ParamsModel} from "../../models/params.model";
import {ConfirmationService, MenuItem, MessageService} from "primeng/api";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DialogService} from "primeng/dynamicdialog";
import {LabWorkDialogComponent} from "../labwork-dialog/labwork-dialog.component";
import {Paginator} from "primeng/paginator";
import {SecondaryService} from "../../services/secondary.service";
import {DisciplineService} from "../../services/discipline.service";
import {DisciplineModel} from "../../models/discipline.model";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  providers: [MessageService, ConfirmationService, DialogService]
})
export class MainComponent  implements OnInit {

  @ViewChild('paginator', { static: true }) paginator: Paginator

  // Form and labwork for creating
  formCreate: FormGroup;
  labWorkModel: LabWorkModel;

  // ID for finding by ID
  idLab: number;

  // Step count for decreasing difficulty
  stepCount: number;

  // LabWork array for getting results
  labWorkArrayFilter: LabWorkModel[];
  allLabWorks: LabWorkModel[];

  // Discipliness
  allDisciplines: DisciplineModel[];

  splitButtonItems: MenuItem[];

  displayModal1: boolean;
  displayModal2: boolean;
  displayModal3: boolean;
  displayModal4: boolean;
  displayModalCreate: boolean;

  selectedDifficultyExtra: Difficulty;
  selectedLabWorkDecrease: LabWorkModel;
  selectedLabWorkRemove: LabWorkModel;
  selectedDiscipline: DisciplineModel;

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
  selectedDisciplinesFilter: Discipline = localStorage.getItem('selectedDisciplinesFilter');
  sortParam: string = localStorage.getItem('sortParam');
  pageFilter: number = (localStorage.getItem('pageFilter') == null) ? 1 : parseInt(localStorage.getItem('pageFilter'))
  countFilter: number = (localStorage.getItem('countFilter') == null) ? 5 : parseInt(localStorage.getItem('countFilter'))

  countAll: number = 0;

  constructor(private labWorkService: LabWorkService, private secondaryService: SecondaryService, private disciplineService: DisciplineService,
              private messageService: MessageService, private formBuilder: FormBuilder,
              private confirmationService: ConfirmationService, private dialogService: DialogService)
  {
    this.splitButtonItems =[
      {
        label: 'Количество объектов по сложности', command: () => {
          this.showModalDialog2()
        }
      },
      {
        label: 'Понизить сложность лабораторной работы', command: () => {
          this.showModalDialog3()
        }
      },
      {
        label: 'Удалить лабораторную работу из дисциплины', command: () => {
          this.showModalDialog4()
        }
      }
    ]

    this.optionDisciplines = [
      { id: 1, name: 'soa', lectureHours: 100 },
      { id: 2, name: 'blps', lectureHours: 88 }
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
    this.findAllLabWorks()
    this.findAllDisciplines()

    this.paginator.rows = this.countFilter
    setTimeout(() => { this.paginator.changePage(this.pageFilter-1) }, 0);

    this.filterList()
  }

  // Disciplines

  findAllDisciplines() {
    this.disciplineService.getAllDisciplines().subscribe(data => {
      this.allDisciplines = data
      console.log(this.allDisciplines)
    });
  }

  // CRUD

  async findAllLabWorks() {
    this.allLabWorks = await this.labWorkService.getAllLabWorks();
  }

  findLabWorkById(idLab: number) {
    this.resetFilters()

    if (idLab != null) {
      this.labWorkService.getLabWork(idLab).subscribe(data => {
        console.log(data);
        this.labWorkArrayFilter = [];
        this.labWorkArrayFilter.push(data);
      }, error => {
        this.printErrors(error);
      })
    } else {
      this.messageService.add({severity:'info', summary:'Внимание', detail: 'Введите ID'});
    }
  }

  deleteLabWorkById(id: number) {
    this.labWorkService.deleteLabWork(id).subscribe(data => {
      console.log('LabWork deleted')
      this.refresh()
    }, error => {
      this.printErrors(error)
    })
  }

  createLabWork() {

    this.labWorkModel = this.labWorkService.getLabWorkFromForm(this.formCreate)

    this.labWorkService.addLabWork(this.labWorkModel).subscribe( data => {
      console.log('LabWork added');
      this.refresh();
    }, error => {
      this.printErrors(error)
    })
  }

  // Update dialog

  showDynamicDialog(labWork: LabWorkModel) {
    console.log(labWork.discipline)
    const ref = this.dialogService.open(LabWorkDialogComponent, {
      header: 'Изменить лабораторную работу' + labWork.id,
      width: '30%',
      dismissableMask: 'true',
      closeOnEscape: 'true',
      data: {
        id: labWork.id,
        name: labWork.name,
        coordinates: labWork.coordinates,
        minimalPoint: labWork.minimalPoint,
        difficulty: labWork.difficulty,
        discipline: labWork.discipline
      }
    });

    ref.onClose.subscribe(data => {
      this.refresh()
    });
  }

  // Pagination
  paginate(event) {
    this.pageFilter = event.page + 1
    localStorage.setItem('pageFilter', event.page + 1)

    this.countFilter = event.rows
    localStorage.setItem('countFilter', event.rows)

    this.filterList()
  }

  // Extra methods

  deleteRandom() {
    this.labWorkService.deleteRandomLabWork(this.selectedDifficultyExtra.value).subscribe(error => {
      console.log(error)
    });
  }

  getCountDifficulty() {
    this.labWorkService.getCountLabWork(this.selectedDifficultyExtra.value).subscribe( data => {
      this.messageService.add({severity:'success', summary:'Результат', detail: 'Количество лабораторных, сложность которых выше ' + data});
      console.log(data)
    })
  }

  decreaseDifficulty() {
    this.secondaryService.decreaseDifficulty(this.selectedLabWorkDecrease.id, this.stepCount).subscribe(data => {
      this.messageService.add({severity:'success', summary:'Успех', detail: 'Сложность понижена'});
      this.refresh();
    }, error => {
      this.printErrors(error)
    })
  }

  deleteFromDiscipline() {
    this.secondaryService.removeLabWorkFromDiscipline(this.selectedDiscipline.id, this.selectedLabWorkRemove.id).subscribe(data => {
      this.messageService.add({severity:'success', summary:'Успех', detail: 'Лабораторная удалена'});
      this.refresh();
    }, error => {
      this.printErrors(error)
    })
  }

  // Filter

  filterList() {
    this.saveFiltersToLocalStorage();

    let paramsModel = new ParamsModel(
      this.nameFilter, this.coordinatesXFromFilter, this.coordinatesXUntilFiler,
      this.coordinatesYFromFilter, this.coordinatesYUntilFilter, this.rangeDatesFilter, this.minimalPointFromFilter, this.minimalPointUntilFilter,
      this.selectedDifficultiesFilter, this.selectedDisciplinesFilter, this.sortParam, this.pageFilter, this.countFilter)

    this.labWorkService.getAllLabWorksFiltering(paramsModel).subscribe(labWorkArray => {
      this.labWorkArrayFilter = labWorkArray;
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


  isCoordinatesFiltered(): boolean {
    return this.coordinatesXFromFilter != null || this.coordinatesXUntilFiler != null || this.coordinatesYUntilFilter != null || this.coordinatesYFromFilter != null;
  }

  isMinimalPointFiltered(): boolean {
    return this.minimalPointFromFilter != null || this.minimalPointUntilFilter != null;
  }

  isDisciplineFiltered(): boolean {
    return (this.selectedDisciplinesFilter != '' && this.selectedDisciplinesFilter != null) || this.lectureHours != null;
  }

  refresh(): void {
    window.location.reload();
  }

  printErrors(error: any) {
    for (let er of error.error) {
      this.messageService.add({severity:'error', summary:'Ошибка', detail: er['message']});
    }
  }

  confirm(name: string, id: number) {
    this.confirmationService.confirm({
      message: 'Вы действительно хотите удалить лабу ' + name,
      header: 'Подтверждение',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteLabWorkById(id);
      }
    });
  }

  showModalDialog1() {
    this.displayModal1 = true
  }

  showModalDialog2() {
    this.displayModal2 = true
  }

  showModalDialog3() {
    this.displayModal3 = true
  }

  showModalDialog4() {
    this.displayModal4 = true
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
