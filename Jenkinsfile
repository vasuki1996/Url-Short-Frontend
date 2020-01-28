pipeline {
   agent any
   
   environment {
       timestamp = new Date().format("yyyyMMddHHmm")
       gitToken = 'git-access-token'
       gitURL = 'https://github.com/vasuki1996/Url-Short-Frontend.git'
       deployHost = "ec2-18-219-59-88.us-east-2.compute.amazonaws.com"

       emailRecipients = 'vasukiv@geekyants.com'
   }

   stages {
      stage('Checkout From SCM'){
          steps{
              checkout changelog: true, poll: true, scm: [$class: 'GitSCM', branches: [[name: '*/*']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: gitToken, url: gitURL]]]
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
                remote.name = deployHost
                remote.host = deployHost
                remote.allowAnyHosts = true
                withCredentials([sshUserPrivateKey(credentialsId: 'ec2-pem', keyFileVariable: 'ec2Pem', usernameVariable: 'userName')]) {
                    remote.user = userName
                    remote.identityFile = ec2Pem
                    echo "TARBALL"
                    sh 'tar -czvf build_$timestamp.tar.gz ./build/*'
                    echo "END - TARBALL"
                    sshPut remote: remote, from: 'build_'+timestamp+'.tar.gz', into: '.'
                    sshCommand remote: remote, command: 'tar -xzvf build_'+timestamp+'.tar.gz -C /var/www/html/ && cp -R /var/www/html/build/* /var/www/html/ && rm -rf ./build'
                }
            }
        }
      }
   }

   post {
       always{
           cleanWs()
       }

       success {
           mail to: emailRecipients,
                from: 'jenkins-ci@geekyants.com'
                subject: '$PROJECT_NAME - Build # $BUILD_NUMBER - $BUILD_STATUS!',
                mimeType: 'text/html', 
                body: '''<h2>Build Success</h2>
                        <p>Your build is live <a href="http://'''+deployHost+''''">here</a>.</p>
                        <p>Build Number : ''' + env.BUILD_NUMBER + 
                        ''' <p>Build url: ''' + env.BUILD_URL
       }

       failure {
           mail to: emailRecipients,
                from: 'jenkins-ci@geekyants.com'
                subject: '$PROJECT_NAME - Build # $BUILD_NUMBER - $BUILD_STATUS!',
                mimeType: 'text/html', 
                body: '''<h2>Build Failed</h2>
                        <p>Your previous build might be live <a href="http://'''+deployHost+''''">here</a>.</p>
                        <p>Build Number : ''' + env.BUILD_NUMBER + 
                        ''' <p>Build url: ''' + env.BUILD_URL
       }
   }
}