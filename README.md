# simplest-demo

docker network create simplest-demo

docker run -p 8181:80 --name simplestlb --net simplest-demo frjaraur/simplest-demo:simplestlb

docker run -p 5432:5432 --name simplestdb --net simplest-demo -e POSTGRES_PASSWORD=changeme -d frjaraur/simplest-demo:simplestdb

docker run --net simplest-demo --name simplestapp -d -p 8080:3000 frjaraur/simplest-demo:simplestapp 


docker-compose -f simplest-demo.yml -p simplest-demo up -d







DEBUG:
docker run -ti --net simplestdemo_simplest-demo -p 8080:3000 -v YOUR_PATH_FOR_simplest-demo/simplestapp/simplestapp.html:/APP/simplestapp.html -v YOUR_PATH_FOR_simplest-demo/simplestapp/simplestapp.js:/APP/simplestapp.js frjaraur/simplest-demo:simplestapp sh

docker run -ti --net=simplestdemo_simplest-demo frjaraur/simplest-demo:simplestdb psql -h db -d demo -U demo
