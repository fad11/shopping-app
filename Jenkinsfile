pipeline {
  agent any
  
  environment {
    DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
    DOCKERHUB_REPO = 'your-dockerhub-username/shopping-app' // Replace with your Docker Hub repository
    APP_NAME = 'shopping-app'
    DOCKER_IMAGE = "${DOCKERHUB_REPO}:${env.BUILD_NUMBER}"
  }

  stages {
    stage('Clone') {
      steps {
        git branch: 'main', url: 'https://github.com/your-repository-url.git'
      }
    }

    stage('Build') {
      steps {
        catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
          script {
            sh 'cd /var/jenkins_home/workspace/Internship-Pipeline'
            sh 'docker build -t $DOCKER_IMAGE .'
          }
        }
      }
    }
    
    stage('Push Image') {
      steps {
        catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
          script {
            withDockerRegistry([credentialsId: 'dockerhub-credentials', url: 'https://registry.hub.docker.com']) {
              docker.withRegistry('https://registry.hub.docker.com', 'dockerhub-credentials') {
                def image = docker.image("$DOCKER_IMAGE")
                image.push()
              }
            }
          }
        }
      }
    }

    stage(''){
        steps{
            script{
                sh 'ssh user@127.0.0.1'
                sh 'docker run -d -p 3000:3000 --name $APP_NAME $DOCKER_IMAGE'
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