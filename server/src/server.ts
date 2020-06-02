import express from 'express';

const app = express();

app.get('/users', (request, response) => {
    console.log('Listagem de usuarios');

    response.json([
        'John',
        'Joe',
        'Jason'
    ]);
});

app.listen(3333);