# Remove container
docker rm --force gl-cron-container

# Remove latest image
docker rmi -f gl-cron-image:latest

# Build new image
docker build ../ -t gl-cron-image

# Run Docker
docker run --env GL_API_BASE_PATH=$GL_API_BASE_PATH --env SCHEDULE_UPDATE_GAMES="${SCHEDULE_UPDATE_GAMES}" --name gl-cron-container -d gl-cron-image:latest