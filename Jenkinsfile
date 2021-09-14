pipeline {
    agent any

    stages {
        stage('Clone repository') {
            steps {
                git branch: 'main' url: 'git@github.com:elvinciqueira/testes-api-cy.git'
            }
        }
        stage('Install dependencies') {
            steps {
                sh 'npm install'
            }
        }
        stage('Run E2E tests') {
            steps {
                sh 'NO_COLOR=1 npm run cy:run'
            }
        }
    }
}