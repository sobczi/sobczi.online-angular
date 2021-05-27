deploy:
	npm run ng build -- --prod
	rm -rf ../frontend_deployment/*
	cp -R dist/sobczi-cv/* ../frontend_deployment
	cd ../frontend_deployment && git add * && git commit -m "Rebuild" && git push
