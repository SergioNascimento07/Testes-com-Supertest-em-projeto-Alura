import { afterEach, beforeEach, describe, expect } from '@jest/globals';
import app from '../../app.js'
import request from 'supertest'
import { jest } from '@jest/globals';

let server;
beforeEach(()=> {
    const PORT = 3001;
    server = app.listen(PORT)
})
afterEach(()=> {
    server.close()
})

describe('GET em /editoras', () => {
    it("Deve retornar uma lista de editoras", async ()=> {
        const resposta = await request(app)
        .get('/editoras')
        .set('Accept', 'application/json')
        // .expect('content-type', /json/)
        // .expect(200)
        expect(resposta.status).toBe(200)
        expect(resposta.body[0].email).toBe('e@e.com')
    })
})

let idResposta;
describe('POST em /editoras', ()=> {
    it("Deve adicionar uma nova editora", async ()=> {
        const resposta = await request(app)
        .post('/editoras')
        .send({
            nome: 'MEU',
            cidade: 'Rj',
            email: 'rj@rj.com'
        })
        .expect(201)
        idResposta = resposta.body.content.id
    })

    it("Deve não adicionar nada ao passar o body vazio", async ()=> {
        await request(app)
            .post('/editoras')
            .send({})
            .expect(400)
    })
})

describe("PUT em /editoras/id", ()=> {
    it.each([
        ['nome', {nome: 'casa do código'}],
        ['cidade', {cidade: 'SP'}],
        ['email',{emal: 'cdc@cdc.com.brtest'}]
    ])
    (`Deve alterar o %s`, async (param)=> {
        const requisicao = { request }
        const spy = jest.spyOn(requisicao, 'request')
        await requisicao.request(app) 
        .put(`/editoras/${idResposta}`)
        .send(param[1])
        .expect(204)

        expect(spy).toHaveBeenCalled()
    })
})

describe('DELETE em /editoras/id', () => {
  it("Deletar o recurso adicionado", async ()=> {
    await request(app)
    .delete(`/editoras/${idResposta}`)
    .expect(200)
  })
})

describe('GET em /editoras/id', () => {
    it("deve retornar o recurso selecionado", async ()=> {
      await request(app)
      .get(`/editoras/${idResposta}`)
      .expect(200)
    })
})


  




