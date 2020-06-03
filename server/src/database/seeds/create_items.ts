import Knex from 'knex';

export async function seed(knex: Knex) {
    await knex('items').insert([
        { title: 'Lampadas', image: 'lampadas.sgv' },
        { title: 'Pilhas e Baterias', image: 'baterias.sgv' },
        { title: 'Papeis e Papelao E', image: 'papeis-papelao.sgv' },
        { title: 'Residuos Eletronicos', image: 'eletronicos.sgv' },
        { title: 'Residuos Organicos', image: 'organicos.sgv' },
        { title: 'Oleo de Cozinha', image: 'oleo.sgv' },
    ]);
}