pipeline {
  agent any
  
  environment {
    DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
    DOCKERHUB_REPO = 'fadiib/nodeapp'
    APP_NAME = 'nodeapp'
    DOCKER_IMAGE = "${DOCKERHUB_REPO}:${env.BUILD_NUMBER}"
  }

  stages {
    stage('Clone') {
      steps {
        git branch: 'main', url: 'https://github.com/fad11/shopping-app.git'
      }
    }

    stage('Build') {
      steps {
        catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
          script {
            sh 'cd /var/jenkins_home/workspace/node'
            sh 'docker build -f Dockerfile -t $DOCKER_IMAGE .'
            sh 'docker tag $DOCKER_IMAGE $DOCKER_IMAGE '
          }
        }
      }
    }
    
    stage('Push Image') {
      steps {
        catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
          script{
              withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'USER', passwordVariable: 'PASSWORD')]) {
                sh "echo $PASSWORD | docker login -u $USER --password-stdin"
                sh "docker push $DOCKER_IMAGE"
            }
        }
        }
      }
    }
  }
  post {
        always {
            script {
                sh 'docker rmi $DOCKER_IMAGE || true'
            }
        }
        success {
            echo 'Pipeline completed successfully.'
        }
        failure {
            echo 'Pipeline failed.'
        }
    }
}