deploy:
	npm run ng build -- --prod
	rm -rf ../deployment/frontend/*
	cp dist/sobczi-cv/* -r ../deployment/frontend
	cd ../deployment/frontend && git add * && git commit -m "Rebuild" && git push