import { Component, OnInit } from '@angular/core';

import { BaseResourceModel } from '../../models/base-resource.model';
import { BaseResourceService } from '../../services/base-resource.service';

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.css']
})
export class BaseResourceListComponent<T extends BaseResourceModel> implements OnInit {

  resources: T[] = [];

  constructor(protected resourceService: BaseResourceService<T>) { }

  ngOnInit() {
    this.resourceService.getAll().subscribe(
        resources => this.resources = resources.sort((a,b) => b.id - a.id),
        error => alert('Erro ao carregar a lista!')
    );
  }

  deleteResource(resource: T) {
    const meuDelete = confirm('Deseja realmente excluir este item?');

    if (meuDelete) {
      this.resourceService.delete(resource.id).subscribe(
        () => this.resources = this.resources.filter(element => element != resource),
        () => alert('Erro ao tentar excluir!')
      );
    }
  }

}
