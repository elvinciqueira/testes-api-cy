/// <reference types="cypress" />
import contrato from '../contracts/produtos.contract';

describe('Testes da Funcionalidade Produtos', () => {
  let bearerToken;
  before(() => {
    cy.token('fulano@qa.com', 'teste').then((token) => {
      bearerToken = token;
    });
  });

  it('Deve validar contrato de produtos', () => {
    cy.request('produtos').then((response) => {
      return contrato.validateAsync(response.body);
    });
  });

  it('Deve listar os produtos cadastrados', () => {
    cy.request({
      method: 'GET',
      url: 'produtos',
    }).then((response) => {
      expect(response.body.produtos).to.be.an('array');
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('produtos');
      expect(response.duration).to.be.lessThan(20);
    });
  });

  it('Deve cadastrar um produto com sucesso', () => {
    const body = {
      nome: `Produto EBAC ${Math.floor(Math.random() * 100000000)}`,
      preco: 200,
      descricao: 'Produto novo',
      quantidade: 100,
    };

    cy.request({
      method: 'POST',
      url: 'produtos',
      body,
      headers: { authorization: bearerToken },
    }).then((response) => {
      expect(response.status).to.equal(201);
      expect(response.body.message).to.equal('Cadastro realizado com sucesso');
    });
  });

  it('Deve validar mensagem de erro ao cadastrar produto repetido', () => {
    const body = {
      nome: `Produto EBAC Novo 1`,
      preco: 250,
      descricao: 'Descrição do produto novo',
      quantidade: 100,
    };

    cy.cadastrarProduto(bearerToken, body).then((response) => {
      expect(response.status).to.equal(400);
      expect(response.body.message).to.equal('Já existe produto com esse nome');
    });
  });

  it('Deve editar um produto já cadastrado', () => {
    cy.request('produtos').then((response) => {
      const { _id } = response.body.produtos[0];
      cy.request({
        method: 'PUT',
        url: `produtos/${_id}`,
        headers: { authorization: bearerToken },
        body: {
          nome: 'Produto Editado',
          preco: 100,
          descricao: 'Produto editado',
          quantidade: 100,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.body.message).to.equal('Registro alterado com sucesso');
      });
    });
  });

  it('Deve editar um produto cadastrado previamente', () => {
    const random = Math.floor(Math.random() * 100000000);
    const body = {
      nome: `Produto EBAC ${random}`,
      preco: 200,
      descricao: 'Produto novo',
      quantidade: 100,
    };

    cy.cadastrarProduto(bearerToken, body).then((response) => {
      const { _id } = response.body;
      cy.request({
        method: 'PUT',
        url: `produtos/${_id}`,
        headers: { authorization: bearerToken },
        body: {
          nome: `Produto editado ${random}`,
          preco: 200,
          descricao: 'Produto editado',
          quantidade: 300,
        },
      }).then((response) => {
        expect(response.body.message).to.equal('Registro alterado com sucesso');
      });
    });
  });

  it('Deve deletar um produto previamente cadastrado', () => {
    const body = {
      nome: `Produto EBAC ${Math.floor(Math.random() * 100000000)}`,
      preco: 200,
      descricao: 'Produto novo',
      quantidade: 100,
    };

    cy.cadastrarProduto(bearerToken, body).then((response) => {
      const { _id } = response.body;
      cy.request({
        method: 'DELETE',
        url: `produtos/${_id}`,
        headers: { authorization: bearerToken },
      }).then((response) => {
        expect(response.body.message).to.equal('Registro excluído com sucesso');
        expect(response.status).to.equal(200);
      });
    });
  });
});
