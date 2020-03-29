docker login
cd ech-backend
docker build -t ech-backend:latest .
docker tag ech-backend patreu22/ech-backend:latest
docker push patreu22/ech-backend:latest
cd ../ech-frontend
yarn build
yarn deploy

