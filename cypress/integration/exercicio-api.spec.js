/// <reference types="cypress" />
import contract, { bodySchema } from '../contracts/usuarios.contract';

const random = Math.floor(Math.random() * 10000);

describe('Testes da Funcionalidade Usuários', () => {
  it('Deve validar contrato de usuários', () => {
    cy.request('usuarios').then((response) =>
      contract.validateAsync(response.body)
    );
  });

  it('Deve listar usuários cadastrados', () => {
    cy.request('usuarios').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.haveOwnProperty('usuarios');
      expect(response.body.usuarios).to.be.an('array');
      expect(response.body).to.haveOwnProperty('quantidade');
    });
  });

  it('Deve cadastrar um usuário com sucesso', () => {
    const body = {
      nome: 'Usuário Teste',
      email: `beltrano${random}@qa.com.br`,
      password: 'teste',
      administrador: 'true',
    };

    cy.cadastrarUsuario(body).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.message).to.eql('Cadastro realizado com sucesso');
      expect(response.body).to.haveOwnProperty('_id');
    });
  });

  it('Deve validar um usuário com email inválido', () => {
    const body = {
      nome: 'Usuário Teste',
      email: random,
      password: 'teste',
      administrador: 'true',
    };
    const errorResponse = bodySchema.validate(body);
    const errorMessage = errorResponse.error.details[0].message;

    expect(errorMessage).to.eql('"email" must be a string');
    cy.cadastrarUsuario(body).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body.email).to.eql('email deve ser uma string');
    });
  });

  it('Deve editar um usuário previamente cadastrado', () => {
    const body = {
      nome: 'Usuário Editado',
      email: `emaileditado${random}@qa.com.br`,
      password: 'teste',
      administrador: 'true',
    };

    cy.cadastrarUsuario(body).then((postResponse) => {
      const { _id } = postResponse.body;
      cy.request({
        method: 'PUT',
        url: `usuarios/${_id}`,
        body,
      }).then((putResponse) => {
        expect(putResponse.status).to.eq(200);
        expect(putResponse.body.message).to.eql(
          'Registro alterado com sucesso'
        );
      });
    });
  });

  it('Deve deletar um usuário previamente cadastrado', () => {
    const body = {
      nome: 'Usuário Teste',
      email: `email${random}@qa.com.br`,
      password: 'teste',
      administrador: 'true',
    };

    cy.cadastrarUsuario(body).then((postResponse) => {
      const { _id } = postResponse.body;
      cy.request({
        method: 'DELETE',
        url: `usuarios/${_id}`,
      }).then((deleteResponse) => {
        expect(deleteResponse.status).to.eq(200);
        expect(deleteResponse.body.message).to.eql(
          'Registro excluído com sucesso'
        );
      });
    });
  });
});
