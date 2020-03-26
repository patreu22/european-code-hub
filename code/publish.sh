# docker login
# cd ech-backend
# docker build -t ech-backend:latest .
# cd ../ech-frontend
cd ech-frontend
yarn build
yarn deploy
# docker build -t ech-frontend:latest .
# docker tag ech-frontend patreu22/ech-frontend:latest
# docker push patreu22/ech-frontend:latest
# docker tag ech-backend patreu22/ech-backend:latest
# docker push patreu22/ech-backend:latest
