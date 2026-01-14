BACKEND/
 └── src/
      ├── config
      ├── controllers
      ├── middlewares
      ├── models
      ├── routes
      └── utils

      
To create above structure one line commad 

``  mkdir "src/config","src/controllers","src/middlewares","src/models","src/routes","src/utils"  ``
To create file
`` echo > src/config/db.js ``
-----------------------------------------------------------------------------------------

Student login :
{
  "email": "student@college.com",
  "password": "student123"
}

Response:
{
    "message": "Login Successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NjY4ZTk0YzQyZDEyMGUzZGUyZjM0ZiIsInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzY4MzY3NzYwLCJleHAiOjE3Njg5NzI1NjB9.5NLOxdAvMEoaF_8YPNRL3F7oFDDaNoZCT1-WbZ6mJZA",
    "user": {
        "id": "69668e94c42d120e3de2f34f",
        "name": "Student User",
        "role": "student"
    }
}
-----------------------------------------------------------------------------------------
Admin login :
{
  "email": "admin@college.com",
  "password": "admin123"
}

Response:
{
    "message": "Login Successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NjY4YmM0NDMxNTU0OGI0ZTQyZjYyYyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2ODM3NDE0MCwiZXhwIjoxNzY4OTc4OTQwfQ.phTDt3RE5R5E7xoDMHRNBNwxogsjU1XW7JZAkb-GBQ0",
    "user": {
        "id": "69668bc44315548b4e42f62c",
        "name": "Admin User",
        "role": "admin"
    }
}
-----------------------------------------------------------------------------------------

Staff login:
{
  "email": "staff@college.com",
  "password": "staff123"
}


