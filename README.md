# BACKEND
### setup
- npm init -y
- npm i express

### installations
- dotenv
- mongoose
- bcrypt
- cloudinary
- multer
- bcrypt
- cookie-parser
- cors
- jsonwebtoken

## Structure
```text
Backend
    |_____APIs/
    |        |__FileAPI
    |        |__UserAPI
    | 
    |_____Models/
    |       |__UserModel
    |       |__FileModel
    |
    |______Config/
    |       |___cloudinary
    |
    |______Services/
    |       |___authentication.js
    |
    |_______ .env
    |_______server.js(main)
```

Env Variables:
- DB_URL= database url for mongodb atlas
- PORT = portno
- FRONTEND_URL = deployed frontend url
- JWT_SECRET= jwt secret key
- NODE_ENV =production/ deployment
- CLOUDINARY_CLOUD_NAME= cloudinary cloud name
- CLOUDINARY_API_KEY= cloudinary api key
- CLOUDINARY_API_SECRET= cloudinary api secret

## Description
### API
- user API  : get users, add user, update user, del/restore , hard del, login , logout
- File API : Upload, get , del

### services 
- authentication.js : login authentication , logout user session

### models
- user model : firstName,lastName , password, email , mobile
- file model : file name ,file type, file url ,size, cloudinary id , user(ref)

# Frontend

### setup
- npm create vite@latest

### installations
- npm i tailwindcss @tailwindcss/vite - install taiwlindcss
- axios
- react
- react-hook-form
- react-router
- zustand

# Strucuture 

```text
frontend
    |_________src/
    |          |
    |          |___components/
    |          |         |____Dashboard
    |          |         |____Header
    |          |         |____Home
    |          |         |____Login
    |          |         |____Profile
    |          |         |____Register
    |          |         |____RootLayout
    |          |____store/
    |          |        |____useAuthStore
    |          |____App.jsx
    |          |____assets/     //store images displayed on frontend homepage    
    |
    |______vite.config.js  // add tailwindcss to the configuration  

```