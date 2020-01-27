pipeline {
   agent any
   
   environment {
       timestamp = new Date().format("yyyyMMddHHmm")
   }

   stages {
      stage('Checkout From SCM'){
          steps{
              checkout changelog: true, poll: true, scm: [$class: 'GitSCM', branches: [[name: '*/*']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: 'git-access-token', url: 'https://github.com/vasuki1996/Url-Short-Frontend.git']]]
          }
      }
      stage('Install Dependencies and Build'){
          steps{
              sh 'npm ci && npm run build'
          }
      }
      stage('Deploy to distribution') { 
        steps{
            script{
                def remote = [:]
                remote.name = "ec2-18-219-59-88.us-east-2.compute.amazonaws.com"
                remote.host = "ec2-18-219-59-88.us-east-2.compute.amazonaws.com"
                remote.allowAnyHosts = true
                withCredentials([sshUserPrivateKey(credentialsId: 'ec2-pem', keyFileVariable: 'ec2Pem', usernameVariable: 'userName')]) {
                    remote.user = userName
                    remote.identityFile = ec2Pem
                    echo "TARBALL"
                    sh 'tar -czvf build_$timestamp.tar.gz ./build/*'
                    echo "END - TARBALL"
                    sshPut remote: remote, from: 'build_'+timestamp+'.tar.gz', into: '.'
                    sshCommand remote: remote, command: 'tar -xzvf build_'+timestamp+'.tar.gz -C /var/www/html/ && cp -R /var/www/html/build/* /var/www/html/ && rm -rf build'
                }
            }
        }
      }
   }
}