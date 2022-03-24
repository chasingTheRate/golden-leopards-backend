

# Create CRON File
touch game-schedule-cron

# Edit File

echo "$SCHEDULE_UPDATE_GAMES root curl -X PUT $GL_API_BASE_PATH/api/schedules/season/checkForUpdates/ >> /var/log/cron.log 2>&1" >> ./game-schedule-cron
echo "# Don't remove the empty line at the end of this file. It is required to run the cron job" >> ./game-schedule-cron

# Move cron job
mv ./game-schedule-cron /etc/cron.d/game-schedule-cron

# Give execution rights on the cron job
chmod 0644 /etc/cron.d/game-schedule-cron

# Create the log file to be able to run tail
touch /var/log/game-schedule-cron.log

cron && tail -f /var/log/game-schedule-cron.log