import { InMemoryDbService } from 'angular-in-memory-web-api';

import { Category } from './pages/categories/shared/category.model';
import { Entry } from './pages/entries/shared/entry.model';

export class InMemoryDatabase implements InMemoryDbService {

    createDb() {
        const categories: Category[] = [
            { id: 1, name: "Moradia", description: "Pagamentos de Contas da Casa" },
            { id: 2, name: "Saúde", description: "Plano de Saúde e Remédios" },
            { id: 3, name: "Lazer", description: "Cinema, parques, praia, etc." },
            { id: 4, name: "Salário", description: "Recebimento de Salário" },
            { id: 5, name: "Freelas", description: "Trabalhos como freelancer" }
        ];

        const entries: Entry[] = [
            { id: 1, name: 'Gás de Cozinha', categoryId: categories[0].id, category: categories[0], paid: true, date: '14/10/2018', amount: '70,80', type: 'expense', description: 'Qualquer descrição para essa despesa' } as Entry,
            { id: 1, name: 'Salário', categoryId: categories[3].id, category: categories[3], paid: true, date: '30/10/2018', amount: '4200,00', type: 'revenue', description: 'Qualquer descrição para essa receita' } as Entry,
            { id: 1, name: 'Desenvolvimento', categoryId: categories[4].id, category: categories[4], paid: true, date: '18/10/2018', amount: '1045,20', type: 'revenue', description: 'Qualquer descrição para essa receita' } as Entry,
            { id: 1, name: 'Netflix', categoryId: categories[2].id, category: categories[2], paid: true, date: '20/10/2018', amount: '49,90', type: 'expense', description: 'Qualquer descrição para essa despesa' } as Entry
        ];

        return { categories, entries };
    }

}