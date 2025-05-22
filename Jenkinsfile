pipeline {
    agent {label "kali"}

    stages {
        stage('code') {
            steps {
                echo 'cloning the code'
                git url: "https://github.com/Kalasoftware/notes-app-dev.git" , branch:"main"
                echo "code has been cloned"
            }
            
        }
        stage('build'){
            steps{
                echo "this is build stage"
                sh "docker build -t notes-app:latest ."
            }
        }
        stage('push to docker'){
    steps{
        echo "this is psuhing to docker stage"
        withCredentials([usernamePassword(
            credentialsId: "dockerHubCred", 
            passwordVariable: "dockerhubpass",
            usernameVariable: "dockerhubuser")]) {
                sh "docker login -u ${env.dockerhubuser} -p ${env.dockerhubpass}"
                sh "docker image tag notes-app:latest kalasoftware/notes-app:latest"
                sh "docker push kalasoftware/notes-app:latest" 
        }
    }
}
        stage('deploy'){
            steps{
                echo "this is deploying stage"
                sh "docker run -d -p 3000:3000 notes-app:latest"
            }
        }
    }
}
