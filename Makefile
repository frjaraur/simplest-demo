clean:
	docker-compose -f simplest-demo.yml -p demo stop
	docker-compose -f simplest-demo.yml -p demo rm -f

demo:
	docker-compose -f simplest-demo.yml -p demo up -d

rebuild:
	docker build -t frjaraur/simplest-demo:simplestapp -f simplestapp/Dockerfile simplestapp
	docker build -t frjaraur/simplest-demo:simplestlb -f simplestlb/Dockerfile simplestlb
	docker build -t frjaraur/simplest-demo:simplestdb -f simplestdb/Dockerfile simplestdb

update:
	docker push frjaraur/simplest-demo:simplestapp
	docker push frjaraur/simplest-demo:simplestlb
	docker push frjaraur/simplest-demo:simplestdb

scale_app:
	docker-compose -f simplest-demo.yml -p demo scale app=5

hits:
	while :;do curl -s http://0.0.0.0:8080 >/dev/null;sleep 2;done

editnode:
	docker network create db || echo

	#docker rm -fv simplestdb simplestapp || echo
	#docker run --net=db -e "POSTGRES_PASSWORD=changeme" -d --name simplestdb frjaraur/simplest-demo:simplestdb

	docker run --rm --name simplestapp --net=db -ti \
	-e dbhost=pgpool -e dbname=demo -e dbuser=demo -e dbpasswd=demo -e dbpool=true \
	-v ${PWD}/simplestapp/simplestapp.js:/APP/simplestapp.js \
	-v ${PWD}/simplestapp/simplestapp.html:/APP/simplestapp.html -p 8080:3000 frjaraur/simplest-demo:simplestapp sh
