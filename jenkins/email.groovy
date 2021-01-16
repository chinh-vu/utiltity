#!/usr/bin/env groovy
//report generation start
def masterRepo = ''

def loopThroughRepos(buildNumber) {
    echo 'loopThroughRepos started'

    echo "current build${currentBuild} \t project name: ${currentBuild.projectName}"
    def fileChanges = []

    // get all files changed in the current git repo
    def localChanges = gitChanges(fileChanges)
    println("=============== Pre Local Changed: $localChanges")

    def repoMap = getRepoMap(localChanges)

    println("=============== Post Local Changed: $localChanges")
    println("LOOP THROUGH REPOS: ${repoMap}")
    def reportMap = [:]
    for (repo in repoMap) {
        println "Current Processing Repository ${repo}"
        def emails = ''
        def map = gitShowWithFilter(repo.REPO, repo.URL, repo.BRANCH, repo.PATTERN, fileChanges, buildNumber)
        reportMap[repo.REPO] = map
        def tmpReportMap = [:]
//        tmpReportMap[repo.REPO] = map
//        writeOutIndividualRepoReport(tmpReportMap, repo.REPO, buildNumber, fileChanges,emails)
    }
    writeOutReport(reportMap)
    //archiveArtifacts(artifacts: "report.txt")
}


def getPivotingRepo(details) {
    sh "mkdir -p codes"
    sh "cd codes"

    dir('codes') {
        git branch: details[4],
                credentialsId: 'ihr_auto',
                url: details[3]

        sh('git diff --name-only $(git log --pretty="%H" -1)^..HEAD > git-diff.txt')
//        def fileChanges = tmpCID.split('"\\r?\\n"');
        def changeFiles = readFile "git-diff.txt"
        def changeLines = changeFiles.readLines()
//        println("======================= File Changes: ${fileChanges}")
        println("======================= File ChangesLines: ${changeLines}")
        def changeNames = []
        for (String line in changeLines) {
//            fileChanges.add(line)
            if (line.contains('/') && line.indexOf('.') < line.length() - 1) {
                println "Removed / and . from line: " + line.substring(1 + line.lastIndexOf('/'), line.indexOf('.'))
                changeNames.add(line.substring(1 + line.lastIndexOf('/'), line.indexOf('.')))
            } else if (line.contains('.') && line.indexOf('.') < line.length() - 1) {
                try {
                    println "Removed . from line: " + line.substring(0, line.indexOf('.'))
                    changeNames.add(line.substring(0, line.indexOf('.')))
                } catch (Exception e) {
                }
            } else {
                println "Just the line: " + line
                changeNames.add(line)
            }
        }
        return changeNames
    }
}

def gitChanges(fileChanges) {
    // get the file changed since last merged
    sh('git diff --name-only $(git log --pretty="%H" -1)^..HEAD > git-diff.txt')
    def changeFiles = readFile "git-diff.txt"
    def changeLines = changeFiles.readLines()
    def changeNames = []
    for (String line in changeLines) {
        fileChanges.add(line)
        if (line.contains('/')) {
            println "Removed / and . from line: " + line.substring(1 + line.lastIndexOf('/'), line.indexOf('.'))
            changeNames.add(line.substring(1 + line.lastIndexOf('/'), line.indexOf('.')))
        } else if (line.contains('.')) {
            println "Removed . from line: " + line.substring(0, line.indexOf('.'))
            changeNames.add(line.substring(0, line.indexOf('.')))
        } else {
            println "Just the line: " + line
            changeNames.add(line)
        }
    }
    return changeNames
}
//writeOutIndividualRepoReport(relationShips, repoName, buildNumber, fileChanges, sEmails)

def writeOutIndividualRepoReport(reportMap, repoName, bNumber, fileChanges, regPattern) {
    echo "writeOutReport started with build numer ${bNumber} and report for repo: ${repoName} repoMap: ${reportMap} "
    StringBuilder builder = new StringBuilder()
    builder.append("<html lang=\"en\">\n" +
            "<head>\n" +
            "    <meta charset=\"UTF-8\">\n" +
            "    <title>Email Notification</title>\n" +
            "    <style>" +
            "       body {padding: 10px;}\n" +
            "       table, th, td, tr {\n" +
            "            border-spacing: 0;\n" +
            "            padding: 5px;\n" +
            "            text-align: left;" +
            "        }\n" +
            "    </style>" +
            "</head>\n" +
            "<body>\n")

    def foundChange = false
    def rName = env.GIT_BRANCH
    if (masterRepo && masterRepo.trim().length() > 0) rName = masterRepo
    for (repo in reportMap) {

        builder.append("<h1>The following change on the ${rName} may have impacted on your project ${repoName}</h1>")
        builder.append("<div><h2>Build number: ${bNumber}</h2></div>")
        builder.append("<div><h2>build url: ${env.BUILD_URL}</h2></div>")
        builder.append("<div><h2>Applying regular express pattern ${regPattern}</h2>")

/*
        builder.append("<table><thead>\n" +
                "    <tr>\n" +
                "        <th>File Changed in the ${rName}</th>\n" +
                "    </tr></thead><tbody>")
        fileChanges.each {
            builder.append("<tr><td>${it}</td></tr>")
        }
        builder.append("</tbody></table>")
*/

        builder.append("<br/><br/><h3>Your current project ${repoName} has the following reference the code(s) which were changed!</h3>")
        builder.append("<table><thead>" +
                "    <tr>" +
                "        <th><u>Impacted File</u></th>" +
                "        <th><u>Using File (Import/Include)</u></th>" +
                "    </tr></thead>")

//        builder.append("Project: ${repo.key}")
        builder.append("<tbody>")
        for (file in repo.value) {
            builder.append("<tr>")
            builder.append("<td> ${file.key}</td>")
            builder.append("<td>")
            for (f in file.value) {
                if (f && f.trim().length() > 0) {
                    def tmpReplaceQuote = f.trim().replace("\"", "").replace(">", "")
                    def tmpFSplit = tmpReplaceQuote.split(" ")
                    if (tmpFSplit.size() > 0) {
                        builder.append("${tmpFSplit[tmpFSplit.size() - 1]}\n")
                    }
                }
            }
            builder.append("</td>")
            builder.append("</tr>")

            foundChange = true
        }
        builder.append("</tbody></table>")
    }

    def tmpEmails = sh(returnStdout: true, script: "git --no-pager log --merges -s --format=\"%ae\" | sort -u")
    def sEmails = tmpEmails.split("\r?\n")
    println("Split email to array: ${sEmails}")
    def eml = new StringBuilder()
    if (sEmails) {
        sEmails.each { eml.append(it).append(";") }
    }
    println "\t\t\t\t\t\t\t\t=====emails: ${eml}"

    builder.append("<h2>FYI: git repo approver's emails:</h2> <br/><br/>").append(eml.toString())

    builder.append("</body></html>")

    try {

//        println "about to write into file: ${repoName}.txt .........."
        //'A change occurred on the file your repo has dependency on'
//        writeFile(file: "${repoName}.txt", text: builder.toString())

        println "done writing into file: ${repoName}.txt .......... for ${repoName} foundChange: ${foundChange}"
        emailext mimeType: 'text/html',
//                attachmentsPattern: "${repoName}.txt",
                body: builder.toString(),
                subject: "A change occurred on the file your repo ${repoName} has dependency on this build: ${bNumber}",
                to: 'chinh.vu@uhg.com'

        /*body: "The following files are changed in the current repo \n${b}\n Build number: ${bNumber}, build url: ${env.BUILD_URL}",*/

        println "done sending email ........... for ${repoName} "
    } catch (Exception e) {
        println "---------------- something went wrong in sending email per repo!!!!!!"
        println e.printStackTrace()
    }

    //sh 'ls -ltr'
    //sh 'cat report.txt'
}

def writeOutReport(reportMap) {
    echo 'writeOutReport started'
    StringBuilder builder = new StringBuilder()

    boolean first = true
    for (repo in reportMap) {
        if (!first) {
            builder.append("\n")
        } else {
            first = false
        }
        builder.append("Project: ${repo.key}")
        for (file in repo.value) {
            builder.append("\nFile: ${file.key}")
            builder.append("\nDependencies:\t${file.value}")
        }
    }
    writeFile(file: "report.txt", text: builder.toString())


    //sh 'ls -ltr'
    //sh 'cat report.txt'
}

def getRepoMap(changes) {
    println("\t\t\t CHANGE PATTERN - ${changes}")

    echo 'getRepoMap started'
    echo "${WORKSPACE}"
    //sh 'ls -ltr'
    def repoFile = readFile "${WORKSPACE}/controller.csv"
    //def repoFile = readFile(file: 'gitRepos.csv')
    println("Reading controller.csv " + repoFile)
    def repoLines = repoFile.readLines()
    //echo 'Reading gitRepos.csv lines'
    def repoMap = []
    for (line in repoLines) {
        if (line && !line.contains(',')) continue
        def details = line.split(',')
//        def map = [REPO: details[0], EMAIL: details[1], URL: details[2], BRANCH: details[3], PATTERN: processRepoPattern(details[4], changes)]
        if (details && details.length < 5) continue

        if (details[0] != null && details[0].equalsIgnoreCase("master")) {
            changes = getPivotingRepo(details)
            println("\t\t\t CHANGE PATTERN - ${changes}")
            println("changes: ${changes}")
            masterRepo = details[1]
            continue
        }

        def map = [PIVOTING: details[0], REPO: details[1], EMAIL: details[2], URL: details[3], BRANCH: details[4], PATTERN: processRepoPattern(details[5], changes)]

        println "GIT - REPO - MAP: repo: ${map.REPO}, email: ${map.EMAIL}, url: ${map.URL} pattern:${map.PATTERN}"
        repoMap.add(map)
    }
    println "GIT REPOR MAP ${repoMap}"
    repoMap
}

def processRepoPattern(String repoPattern, baseChanges) {
    if (repoPattern.contains('[CHANGE]')) {
        boolean first = true
        StringBuilder cases = new StringBuilder()
        for (String change in baseChanges) {
            if (first) {
                first = false
            } else {
                cases.append("|")
            }
            cases.append(change)
        }
        def pattern = repoPattern.replaceAll('\\[CHANGE]', cases.toString())
        println("CASES: TO STRING: ${cases}")
        println repoPattern.replaceAll('\\[CHANGE]', cases.toString())
        return pattern
    } else {
        return repoPattern
    }
}

def gitShowWithFilter(repoName, gitUrl, branch, regPattern, fileChanges, buildNumber) {
    sh "mkdir -p codes"
    sh "cd codes"
    println(" git cloning into " + pwd() + " url: " + gitUrl + " branch: " + branch)
    def relationShips = [:]
    dir('codes') {
        git branch: branch,
                credentialsId: 'ihr_auto',
                url: gitUrl
        def dh = new File("${WORKSPACE}/codes")

        findRecursivefiles(dh, relationShips, regPattern)

        def tmpReportMap = [:]
        tmpReportMap[repoName] = relationShips
        writeOutIndividualRepoReport(tmpReportMap, repoName, buildNumber, fileChanges, regPattern)

    }
    sh "cd .."
    sh "rm -rf codes"
    return relationShips
}


def findRecursivefiles(dh, relShips, regPattern) {
    def files = findFiles()
    for (f in files) {
        if (f.directory) {
            dir(f.path) {
                findRecursivefiles(f, relShips, regPattern)
            }
        } else {
            def fileName = f.name
            def a = readFileContent(fileName, regPattern)
            if (a != null && a.size() > 0) {
                relShips[fileName] = a
            }
        }
    }
}


def readFileContent(f, regPattern) {
    try {
        def filePath = readFile f
        def lines = filePath.readLines()
        //println ("================================ " + lines)
        def a = []
        for (line in lines) {
            def matcher = line =~ regPattern
            if (matcher.matches()) {
                //println("match happened inside matcher")
                for (i = 0; i < matcher.groupCount(); i++) {
                    if (matcher.group(i) != null) {
                        a.add(matcher.group(i))
                    }
                }
            }
        }
        return a
    } catch (Exception e) {
        println e
    }
}

def readLineByLine() {
    echo 'readLineByLine started'
    def filePath = readFile "${WORKSPACE}/out1.txt"
    def lines = filePath.readLines()

    for (line in lines) {
        //echo "line by line: ${line}"
        def str = line.split(" ")
        for (s in str) {
            echo "After split: $s"
        }
        echo "================"
    }
}

//report generation end

def call(Map context) {
    pipeline {
        agent { label 'docker-slave' }
        //agent any

        options {
            buildDiscarder(logRotator(numToKeepStr: '20'))
            disableConcurrentBuilds()
        }
        /*parameters {
            choice(name: 'RUN_PIPELINE', choices: ['No', 'Yes'], description: 'Run Pipeline?')
            string(name: 'EMAIL_SUBJECT', defaultValue: 'A change occurred on the file your repo has dependency on')
        }*/
        environment {
            DOCKER_NAMESPACE = 'ihr/base'
            DOCKER_REGISTRY = 'docker.repo1.uhc.com'
            BASE_IMAGE = 'docker.repo1.uhc.com/ihr/base'
            EMAIL_NOTICATION_SUBJECT = 'A change occurred on the file your repo has dependency on'
            EMAIL_BODY = ''
        }
        stages {
            stage('Set Git Variables') {
                when {
                    beforeAgent true
                    anyOf {
                        branch 'PR-*'
                        branch 'master'
                        branch 'bugfix-'
                        branch 'hotfix-*'
                        branch 'feature-STR-11324'
                        branch 'base-plus-smoke'
                        branch 'email-notification'
                        tag '*'
                        expression { params.RUN_PIPELINE == 'Yes' }
                    }
                }
                //agent {label 'docker-slave'}
                steps {
                    glGitGetInfo()
                    script {
                        currentBuild.displayName = "${env.BUILD_NUMBER}-${env.BRANCH_NAME}-${env.GIT_COMMIT_SHORT}"
                    }
                }
            }
            stage('Generate Report File') {
                //agent {label 'docker-slave'}
                steps {
                    loopThroughRepos(currentBuild.getId())
                }
            }
        }
        post {
            always {
                println "OK"
                /*archiveArtifacts(artifacts: "report.txt")

                script {
                    emailext mimeType: 'text/html',
                            // attachmentsPattern: 'report.txt',
                            body: "<html><header><title>Email Notication on New Build Repo</title></header>" +
                                    "<body><div>Your next build may get impacted by this changed, please check your repo</div>" +
                                    "<div>for more detail please look at this built: ${env.BUILD_URL} and the attachment which detail which class potentially gets impacted" +
                                    "</body></html>",
                            subject: "$EMAIL_NOTICATION_SUBJECT this build $currentBuild.currentResult $JOB_NAME",
                            to: 'chinh.vu@uhg.com'
                }*/

                /*stage ('Sequential: Build, Scan, Publish') {
                  when {
                    beforeAgent true
                    anyOf {
                      branch 'PR-*'
                      branch 'master'
                      branch 'bugfix-'
                      branch 'hotfix-*'
                      branch 'feature-STR-11324'
                      branch 'base-plus-smoke'
                      tag '*'
                      expression { params.RUN_PIPELINE == 'Yes' }
                    }
                  }
                  agent {label 'docker-slave'}
                  stages {
                    stage ('Docker Base Build') {
                      steps {
                        glDockerImageBuild image:"${BASE_IMAGE}/${env.GIT_REMOTE_REPO_NAME}:${env.BRANCH_NAME}",
                                           extraBuildOptions:"--build-arg IMAGE_TAG=${env.BRANCH_NAME} --file docker/base-image.Dockerfile"
                      }
                    }
                    stage ('Twistlock Scan') {
                      steps {
                        glTwistlockScan dockerCredentials: "ihr_auto",
                                        dockerRepository: "${DOCKER_REGISTRY}/${DOCKER_NAMESPACE}/${env.GIT_REMOTE_REPO_NAME}:${env.BRANCH_NAME}",
                                        twistlockCredentials: "ihr_auto",
                                        failBuild:true,
                                        vulnerabilityThreshold:'critical',
                                        complianceThreshold:'critical',
                                        useDefaultDockerHost: true
                      }
                    }
                    stage ('Docker Publish') {
                      when {
                        anyOf {
                          branch 'master'
                          branch 'feature-STR-11324'
                          branch 'base-plus-smoke'
                          tag '*'
                        }
                      }
                      steps {
                        glDockerImagePush image:"${DOCKER_REGISTRY}/${DOCKER_NAMESPACE}/${env.GIT_REMOTE_REPO_NAME}:${env.BRANCH_NAME}",
                                          credentialsId:"ihr_auto",
                                          containerRegistry:"docker.repo1.uhc.com"
                      }
                    }
                  }
                }*/
                /*
                stage ('Docker Smoke Build') {
                  when {
                    beforeAgent true
                    anyOf {
                      branch 'PR-*'
                      branch 'master'
                      branch 'bugfix-'
                      branch 'hotfix-*'
                      branch 'feature-STR-11324'
                      branch 'base-plus-smoke'
                      tag '*'
                      expression { params.RUN_PIPELINE == 'Yes' }
                    }
                  }
                  agent {label 'docker-slave'}
                  stages {
                    stage ('Docker Build') {
                      steps {
                        glDockerImageBuild image:"${BASE_IMAGE}/${env.GIT_REMOTE_REPO_NAME}/mongo-smoke:${env.BRANCH_NAME}",
                                           extraBuildOptions:"--build-arg IMAGE_TAG=${env.BRANCH_NAME} --file docker/smoke-base-image.Dockerfile " +
                                                             "--build-arg SOURCE_IMAGE=${BASE_IMAGE}/${env.GIT_REMOTE_REPO_NAME}:${env.BRANCH_NAME}"
                      }
                    }
                  }
                }  */
                /*
              stage ('Promote Release Image') {
                when {
                  beforeAgent true
                  anyOf {
                    tag '*'
                  }
                }
                //agent {label 'docker-slave'}
                options {skipDefaultCheckout()}
                steps {
                  glArtifactoryDockerPromote artifactoryUrl:'https://repo1.uhc.com/artifactory',
                                             credentialsId:'ihr_auto',
                                             copy:true,
                                             destArtifactoryRepo:'optum-docker-prod',
                                             destDockerRepo:"${DOCKER_NAMESPACE}/${env.GIT_REMOTE_REPO_NAME}",
                                             destTag:"${env.BRANCH_NAME}",
                                             sourceArtifactoryRepo:'optum-docker',
                                             sourceDockerRepo:"${DOCKER_NAMESPACE}/${env.GIT_REMOTE_REPO_NAME}",
                                             sourceTag:"${env.BRANCH_NAME}"
                }
              }
            }
            post {

              always {
                echo 'This will always run..'
                script {
                  if (env.BRANCH_NAME == 'base-plus-smoke' || env.BRANCH_NAME.charAt(0) == 'v') {
                    emailext attachmentsPattern: 'report.txt',
                             body: "Hi All, \n\n Your project may get impacted by the change in base image \nImage: ${DOCKER_REGISTRY}/${DOCKER_NAMESPACE}/${env.GIT_REMOTE_REPO_NAME}:${env.BRANCH_NAME} \n Build URL: ${env.BUILD_URL}",
                             subject: "$currentBuild.currentResult $JOB_NAME",
                             to: 'mohd_sarfraz@optum.com,chinh.vu@uhg.com'
                  }
                }
              }
              success {
                echo 'This will run only if successful'
              }
              failure {
                echo 'This will run only if failed'
                script {
                  if (env.BRANCH_NAME == 'base-plus-smoke' || env.BRANCH_NAME.charAt(0) == 'v') {
                    emailext attachmentsPattern: 'report.txt',
                             body: "Image: ${DOCKER_REGISTRY}/${DOCKER_NAMESPACE}/${env.GIT_REMOTE_REPO_NAME}:${env.BRANCH_NAME} \n Build URL: ${env.BUILD_URL}",
                             subject: "$currentBuild.currentResult $JOB_NAME",
                             to: 'mohd_sarfraz@optum.com,chinh.vu@uhg.com'


                  }
                }
              }
              unstable {
                echo 'This will run only if the run was marked as unstable'
                script {
                  if (env.BRANCH_NAME == 'base-plus-smoke' || env.BRANCH_NAME.charAt(0) == 'v') {
                    emailext body: "Image: ${DOCKER_REGISTRY}/${DOCKER_NAMESPACE}/${env.GIT_REMOTE_REPO_NAME}:${env.BRANCH_NAME} \n Build URL: ${env.BUILD_URL}",
                             subject: "$currentBuild.currentResult $JOB_NAME",
                             to: 'mohd_sarfraz@optum.com,chinh.vu@uhg.com'


                  }
                }
              }

              changed {
                echo 'This will run only if the state of the Pipeline has changed'
                echo 'For example, if the Pipeline was previously failing but is now successful'
                script {
                  if (env.BRANCH_NAME == 'base-plus-smoke' || env.BRANCH_NAME.charAt(0) == 'v') {
                    emailext attachmentsPattern: 'report.txt',
                             body: "Image: ${DOCKER_REGISTRY}/${DOCKER_NAMESPACE}/${env.GIT_REMOTE_REPO_NAME}:${env.BRANCH_NAME} \n Build URL: ${env.BUILD_URL}",
                             subject: "$currentBuild.currentResult $JOB_NAME",
                             to: 'mohd_sarfraz@optum.com,chinh.vu@uhg.com'


                  }
                }
              }*/
            }
        }
    }
}

