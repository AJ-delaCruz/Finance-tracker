# Personal Financial tracker Web App 

## Table of Contents
- [Project Description](#project-description)
- [How to Run Locally](#how-to-run-locally)
- [Running Integration Tests](#running-integration-tests)
- [Local Deployment with Kubernetes](#local-deployment-with-kubernetes)
- [Cloud Deployment](#cloud-deployment)
- [Jenkins](#jenkins)
- [Technologies Used](#technologies-used)

## Project Description 
The Finance tracker application offers features for managing personal finances. It allows users to track transactions, set budgets, define financial goals, and manage bills. The chatbot feature automates customer service by providing assistance to users with questions about the application such as how to set transactions, budgets, bills, or goals.


## How to run locally
1. Clone the repository:
 ```shell
git clone https://github.com/AJ-delaCruz/Finance-tracker
 ```
2. Install dependencies for the client and server:
```shell
cd client
npm install
cd server
npm install
```
3. Setup the environment variables:
- Create a `.env` file in the server directory. Add with values:
- `MONGODB_URL` = ... 
- `JWT_SECRET` = ... 
- `OPENAI_API_KEY` = ... 
4. Run the client & server in separate terminals:
```shell
cd client && npm start
cd server && nodemon index.js
```
5. Navigate to http://localhost:4000 in your browser.


## Running Integration Tests
 ```shell
cd server
npm test
```
1. Or cd to root directory of the project
2. Run docker-compose:
 ```shell
docker-compose -f docker-compose.test.yml up --build
```

## Local Deployment with Kubernetes
1. Install and Start Minikube 
```shell
minikube start
minikube status
```
2. Create the secrets.yaml configuration file in kubernetes directory
- Follow the instructions [here](https://kubernetes.io/docs/tasks/configmap-secret/managing-secret-using-config-file/) to create the `secrets.yaml` file.
- Set up env variables: MONGODB_URL, JWT_SECRET, OPENAI_API_KEY 
3. Set up Ingres-nginx controller
```shell
minikube addons enable ingress
```
4. Apply the Kubernetes configurations:
```shell
kubectl apply -f kubernetes/ --recursive
```
5. Navigate to http://localhost


## Cloud Deployment
The project is deployed on AWS EC2 using Docker.
1. Clone the repository:
```shell
git clone https://github.com/AJ-delaCruz/Finance-tracker
```
2. Run Docker Compose:
```shell
docker-compose -f docker-compose.yml up
```
3. Todo:
- Deploy on AWS EKS using Kubernetes and Docker

## Jenkins

We utilized Jenkins for our CI/CD pipeline to automate building, testing, and deployment. The Jenkins pipeline uses environment variables for configuration and DockerHub credentials for pushing images. 

Overview of the pipeline stages on Jenkinsfile:

1. **Build**: Build Docker images using Docker Compose for testing.
2. **Test**: Tests the Docker images using Docker Compose. 
3. **Build production images**: Docker images for production are built using separate Docker Compose file for production.
4. **Push images**: Docker images are pushed to DockerHub.
5. **Deploy**: The application is deployed to a Kubernetes cluster using `kubectl`.

To set up environment variables in Jenkins, follow these steps:
- Click the pipeline name on Jenkins Dashboard
- Click Configure
- Check the checkbox for "This project is parameterized"
- Add String Parameters for MONGODB_URL, JWT_SECRET, OPENAI_API_KEY with values

## Technologies Used
- MongoDB: for database
- Express: for backend server
- React: for frontend
- Node.js: for backend
- OpenAI GPT-3 (Davinci model): for chatbot functionality
- Selenium with Jest: for end-to-end testing
- Mocha with Chai: for integration testing 
- JMeter: for load testing
- AWS EC2: for hosting the application
- Docker: for containerization and deployment
- Kubernetes: for orchestration of Docker images
- Jenkins: for continuous integration and continuous deployment (CI/CD)

