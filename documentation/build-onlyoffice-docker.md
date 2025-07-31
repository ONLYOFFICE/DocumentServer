## Run following scripts
```
cd build_tools/develop
docker pull onlyoffice/documentserver  
docker build --no-cache -t documentserver-develop .  
```

## Run docker with local files
```
docker run -i -t -p 80:80 --restart=always -e ALLOW_PRIVATE_IP_ADDRESS=true \
    -v $(pwd)/sdkjs:/var/www/onlyoffice/documentserver/sdkjs \
    -v $(pwd)/web-apps:/var/www/onlyoffice/documentserver/web-apps  \
    -v $(pwd)/server:/var/www/onlyoffice/documentserver/server \
    -v $(pwd)/build_tools:/var/www/onlyoffice/documentserver/build_tools \
    documentserver-develop

```

## Run docker with local files & data mounts
```
docker run -i -t -p 80:80 -p 25432:5432 -p 25672:5672 -p 26379:6379 --restart=always -e ALLOW_PRIVATE_IP_ADDRESS=true \
    -v $(pwd)/sdkjs:/var/www/onlyoffice/documentserver/sdkjs \
    -v $(pwd)/web-apps:/var/www/onlyoffice/documentserver/web-apps  \
    -v $(pwd)/server:/var/www/onlyoffice/documentserver/server \
    -v $(pwd)/build_tools:/var/www/onlyoffice/documentserver/build_tools \
    -v $(pwd)/data/logs:/var/log/onlyoffice \
    -v $(pwd)/data/data:/var/www/onlyoffice/Data \
    -v $(pwd)/data/lib:/var/lib/onlyoffice \
    -v $(pwd)/data/db:/var/lib/postgresql \
    -e JWT_SECRET=my_strong_secret \
    documentserver-develop

```