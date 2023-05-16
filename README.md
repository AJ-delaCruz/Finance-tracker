# Personal Financial tracker Web App 


## Project Description 
The Finance tracker application offers features for managing personal finances. It allows users to track transactions, set budgets, define financial goals, and manage bills to assist users with questions about the application such as how to set transactions, budgets, bills, or goals.

## How to run locally
1. Clone the repository:
- git clone https://github.com/AJ-delaCruz/Finance-tracker
2. Install dependencies for the client and server:
- cd client
- npm install
- cd server
- npm install
3. Setup the environment variables:
- Create a `.env` file in the server directory. Add:
- MONGODB_URL = ... 
- JWT_SECRET = ... 
- OPENAI_API_KEY = ... 
4. Run the client & server:
- cd client
- npm start
- cd server
- nodemon index.js
5. Navigate to `http://localhost:4000` in your browser.

## Deployment
The project is deployed on AWS EC2 using Docker.
1. Clone the repository:
- git clone https://github.com/AJ-delaCruz/Finance-tracker
2. Run Docker Compose:
- docker-compose up

## Technologies Used
- MongoDB: for database
- Express: for backend server
- React: for frontend
- Node.js: for backend
- Docker: for containerization and deployment
- AWS EC2: for hosting the application
- OpenAI GPT-3 (Davinci model): for chatbot functionality
- Selenium: for automation frontend testing
- JMeter: for load testing
