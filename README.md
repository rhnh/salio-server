# Installation:
clone the repo
yarn
# setup
## dot files
```bash
TEST_DB_NAME=salioTest
DB_PORT=8080
SECRET_TOKEN=your token
```

1. > cd src 
2. > ssh-keygen -t rsa -b 4096 -m PEM -f rsa_key
3. > rename files to rsa_key.pub.pem und rsa_key.priv.pem

## Login Route:

To register:
> POST: http://localhost:8080/users

To Login:
> POST: http://localhost:8080/users/user

To Logout:
> GET: http://localhost:8080/users/user 

## List Route:

To Create new list:
> POST: http://localhost:8080/lists

To Get certain List:

> GET: http://localhost:8080/lists/list/:listName

To get All Birds for the Certain list:

> POST: http://localhost:8080/lists/:listName/birds

To get Certain bird for the certain list:

> POST: http://localhost:8080/lists/list/:listName/birds/bird/:birdName

To add Certain bird into certain list:
> POST: http://localhost:8080/lists/:listName/birds