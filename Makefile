clean:
	docker-compose -f simplest-demo.yml -p demo stop
	docker-compose -f simplest-demo.yml -p demo rm -f

start:
	docker-compose -f simplest-demo.yml -p demo up -d

update:
	docker build -t frjaraur/simplest-demo:simplestapp -f simplestapp/Dockerfile simplestapp
	#docker build -t frjaraur/simplest-demo:simplestlb -f simplestlb/Dockerfile simplestlb
	#docker build -t frjaraur/simplest-demo:simplestdb -f simplestdb/Dockerfile simplestdb

scale_app:
	docker-compose -f simplest-demo.yml -p demo scale app=5
	
demo:
	while :;do curl -s http://0.0.0.0:8080 >/dev/null;sleep 2;done
