## Deployment:
- Deployment Link : https://cloudvault-tsfx.onrender.com
#### Deployment description: 
```text
used render to deploy both frontend and backend
frontend deployment using render static site
backend deployment using render web service
```
- frontend link : https://cloudvault-tsfx.onrender.com
- backend link : https://cloudvaultbackend-n1x9.onrender.com

### Screenshots
<img width="754" height="471" alt="© CloudVault" src="https://github.com/user-attachments/assets/597dcf9f-c146-4a42-a1cb-c1ad4d20b107" />
<img width="727" height="343" alt="unknown" src="https://github.com/user-attachments/assets/8ccbfbe9-086a-4a96-aad2-02656052bad4" />
<img width="807" height="466" alt="unknown" src="https://github.com/user-attachments/assets/15cf1c76-5385-46c2-90fc-dac2acd9cf85" />
<img width="807" height="501" alt="unknown" src="https://github.com/user-attachments/assets/4bc980f1-7401-405b-a365-18efcfa9c1eb" />
<img width="807" height="523" alt="unknown" src="https://github.com/user-attachments/assets/9ebb09ac-6f4c-433a-992e-a8ce48556ee6" />


## BACKEND
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

## Backend Structure
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

## Frontend

### setup
- npm create vite@latest

### installations
- npm i tailwindcss @tailwindcss/vite - install taiwlindcss
- axios
- react
- react-hook-form
- react-router
- zustand

# Frontend Strucuture 

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
