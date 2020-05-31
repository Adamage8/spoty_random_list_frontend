import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {
  ApiCompositionItemType,
  ApiCompositionType,
  CompositionApiService,
} from '../../service/api/api-composition.service';
import { Observable } from 'rxjs/Observable';
import { FormControl, FormGroup } from '@angular/forms';
import { omit } from 'lodash';
import { TokenService } from 'spotify-auth';

@Component({
  selector: 'app-composition-edit',
  templateUrl: './composition-edit.component.html',
  styleUrls: ['./composition-edit.component.css'],
})
export class CompositionEditComponent implements OnInit {
  selectedSearchItem: Pick<ApiCompositionItemType, 'spotifyId' | 'searchName'>;
  saveForm: FormGroup;
  composition: ApiCompositionType = { name: '', numberOfItems: 0, id: 0, compositionItems: [], comments: [] };

  ngOnInit(): void {
    this.saveForm = new FormGroup({
      name: new FormControl(''),
      numberOfItems: new FormControl(0),
    });
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      const id = paramMap.get('id');
      if (id) {
        (this.apiService.get(id) as Observable<ApiCompositionType>).subscribe((responseComposition) => {
          this.composition = responseComposition;
          this.saveForm.controls['name'].setValue(this.composition.name);
          this.saveForm.controls['numberOfItems'].setValue(this.composition.numberOfItems);
        });
      }
    });
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: CompositionApiService,
    private tokenSvc: TokenService,
    private router: Router
  ) {}

  onSelect = ({ id, name }) => {
    this.selectedSearchItem = { spotifyId: id, searchName: name };
  };

  onAdd = (values) => {
    this.composition.compositionItems.push({
      ...this.selectedSearchItem,
      percent: Number(values.percentage),
      id: Math.random(),
    });
  };

  onSave = (values: any) => {
    this.apiService
      .update({
        ...this.composition,
        compositionItems: this.composition.compositionItems.map((item) => omit(item, 'id')),
        ...values,
      })
      .subscribe();
    this.router.navigate(['compositions']);
  };

  hasUser = () => {
    return !!this.tokenSvc.oAuthToken;
  };
}
