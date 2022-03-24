
FROM ubuntu:latest

#Install Cron, Curl
RUN apt-get update
RUN apt-get -y install cron curl

# Add crontab file in the cron directory
ADD ./crons/updateSeasonGameScheduleCron.sh /

# Give execution rights
RUN chmod +x ./updateSeasonGameScheduleCron.sh

CMD ./updateSeasonGameScheduleCron.sh