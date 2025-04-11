# laravel-react-todoList
Requirements installed in you System:
• PHP (>= 8.2)
• Composer
• Node.js (>= 16.x) and npm
• MySQL or any other database supported by Laravel
• Git

Clone the Project Repository:
https://github.com/p0k3m0n187/laravel-react-todoList.git

=Backend Set up=

-Open the Folder to IDE ( prefer VsCode )
-open IDE terminal
-cd backend
-composer install

Copy the .env.example file to .env:
-cp cp .env.example .env

Update the .env file with your database credentials
ex.
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=todoList
DB_USERNAME=root
DB_PASSWORD=

Generate the Application Key:
-php artisan key:generate

Run Database Migrations and seeders:
-php artisan migrate --seed

Run the backend:
-php artisan serve

=Frontend Set up=

Open new Terminal:
- cd frontend
- npm install

Run the Frontend

-npm start
