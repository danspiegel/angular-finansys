import { OnInit, AfterContentChecked, Injector } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { BaseResourceModel } from '../../models/base-resource.model';
import { BaseResourceService } from '../../services/base-resource.service';

import { switchMap } from 'rxjs/operators';

import toastr from 'toastr';

export abstract class BaseResourceFormComponent<T extends BaseResourceModel> implements OnInit, AfterContentChecked {

    currentAction: string;
    resourceForm: FormGroup;
    pageTitle: string;
    serverErrorMessages: string[] = null;
    submittingForm: boolean = false;

    protected activatedRoute: ActivatedRoute;
    protected router: Router;
    protected formBuilder: FormBuilder;


    constructor(
        protected injector: Injector,
        public resource: T,
        protected resourceService: BaseResourceService<T>,
        protected jsonDataToResourceFn: (jsonData: any) => T
    ) {
        this.activatedRoute = this.injector.get(ActivatedRoute);
        this.router = this.injector.get(Router);
        this.formBuilder = this.injector.get(FormBuilder);
    }

    ngOnInit() {
        this.setCurrentAction();
        this.buildResourceForm();
        this.loadResource();
    }

    ngAfterContentChecked() {
        this.setPageTitle();
    }

    submitForm() {
        this.submittingForm = true;

        if (this.currentAction == "new") {
        this.createResource();
        } else {
        this.updateResource();
        }
    }

    // Private Methods

    protected setCurrentAction() {
        if (this.activatedRoute.snapshot.url[0].path == "new") {
        this.currentAction = "new";
        } else {
        this.currentAction = "edit";
        }
    }

    protected loadResource() {
        if (this.currentAction == "edit") {
        this.activatedRoute.paramMap.pipe(
            switchMap(params => this.resourceService.getById(+params.get("id")))
        ).subscribe(
            (resource) => {
            this.resource = resource;
            this.resourceForm.patchValue(this.resource); // binds loaded resource data to ResourceForm
            },
            (error) => alert('Ocorreu um erro no servidor, tente novamente mais tarde.')
        )
        }
    }

    protected setPageTitle() {
        if (this.currentAction == "new") {
            this.pageTitle = this.creationPageTitle();
        } else {
            this.pageTitle = this.editionPageTitle();
        }
    }

    protected creationPageTitle(): string {
        return "Novo";
    }

    protected editionPageTitle(): string {
        return "Edição";
    }

    protected createResource() {
        const resource: T = this.jsonDataToResourceFn(this.resourceForm.value);

        this.resourceService.create(resource)
        .subscribe(
            resource => this.actionForSuccess(resource),
            error => this.actionForError(error)
        )
    }

    protected updateResource() {
        const resource: T = this.jsonDataToResourceFn(this.resourceForm.value);

        this.resourceService.update(resource)
        .subscribe(
            resource => this.actionForSuccess(resource),
            error => this.actionForError(error)
        )

    }

    protected actionForSuccess(resource: T) {
        toastr.success("Solicitação processada com sucesso!");

        const baseComponentPath: string = this.activatedRoute.snapshot.url[0].path;

        // redirect/reload do componente da página
        this.router.navigateByUrl(baseComponentPath, {skipLocationChange: true}).then(
            () => this.router.navigate([baseComponentPath, resource.id, "edit"])
        )
    }

    protected actionForError(error) {
        toastr.error("Ocorreu um erro ao processar sua solicitação.");

        this.submittingForm = false;

        if (error.status === 422) {
            this.serverErrorMessages = JSON.parse(error._body).errors;
        } else {
            this.serverErrorMessages = ["Falha na comunicação com o servidor. Por favor tente novamente mais tarde."];
        }
    }

    protected abstract buildResourceForm(): void;

}
