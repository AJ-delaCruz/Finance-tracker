pipeline {
    agent any 

    stages {
        stage('Build') {
            steps {
                script {
                    echo 'Building docker images...'
                    sh 'docker-compose -f docker-compose.yml build'
                }
            }
        }
        stage('Test') {
            steps {
                script {
                    echo 'Testing...'
                    // sh 'docker-compose -f docker-compose.yml up --exit-code-from test'
                }
            }
        }
        stage('Push images') {
            steps {
                script {
                    echo 'Pushing docker images...'
                    sh 'docker push aj09/finance-client'
                    sh 'docker push aj09/finance-node'
                }
            }
        }
        stage('Deploy') {
            steps {
                script {
                    echo 'Deploying...'
                }
            }
        }
    }
}
