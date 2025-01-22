~$stème de Surveillance de la Santé à Distance.docx
backend/
    __pycache__/
    .env
    api.py
    mqtt_publisher.py
    scriptTest.py
frontend/
    health-monitoring/
        .gitignore
        ...
leshan/
    .github/
    .gitignore
    .jenkins/
    .trivyignore
    about.html
    build-config/
    CODE_OF_CONDUCT.md
    CONTRIBUTING.md
    documentation/
    eclipse/
    leshan-demo-bsserver/
    leshan-demo-client/
    leshan-demo-server/
    leshan-demo-servers-shared/
    leshan-demo-shared/
    ...
README.md
Système de Surveillance de la Santé à Distance.docx

Backend
Files
api.py: Contains the API endpoints for the backend.
mqtt_publisher.py: Handles MQTT publishing.
scriptTest.py: Contains test scripts.

Frontend
Files
health-monitoring/: Contains the frontend code for health monitoring.

Leshan
Files
.github/: Contains GitHub configuration files.
.jenkins/: Contains Jenkins configuration files.
build-config/: Contains build configuration files.
documentation/: Contains project documentation.
eclipse/: Contains Eclipse IDE configuration files.
leshan-demo-bsserver/: Contains the bootstrap server demo.
leshan-demo-client/: Contains the client demo.
leshan-demo-server/: Contains the server demo.
leshan-demo-servers-shared/: Contains shared code between server and bootstrap server demos.
leshan-demo-shared/: Contains shared code between client, server, and bootstrap server demos.

Important Files
pom.xml: Maven project configuration file.
README.md: Project readme file.
CODE_OF_CONDUCT.md: Code of conduct for contributors.
CONTRIBUTING.md: Contribution guidelines.

Build and Deployment
Maven
The project uses Maven for build and dependency management. Key Maven plugins and configurations can be found in the pom.xml files across different modules.

Jenkins
Jenkins configuration files are located in the .jenkins/ directory. These files define the CI/CD pipelines for the project.

Development Workflow
Backend
Set up the environment variables in .env.
Run the backend server using api.py.

Frontend
Navigate to the health-monitoring/ directory.
Install dependencies using npm install.
Start the development server using npm run serve.
Leshan Demos
Navigate to the respective demo directory (leshan-demo-client, leshan-demo-server, etc.).
Build the project using mvn clean install.
Run the demo using the generated JAR files.
Additional Information
For more detailed information, refer to the documentation files located in the documentation/ directory and the README.md files in each module.