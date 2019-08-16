


PRINT_FEEDBACK="yes"

for last; do true; done
if [ "--now" == "$last" ]; then
    PRINT_FEEDBACK="no"
fi

BACKUP_DATE_FORMAT=${BACKUP_DATE_FORMAT:-"+%Y%m%d.%H%M%S"}
BACKUP_DATE=$(date $BACKUP_DATE_FORMAT)
BACKUP_FILE_FORMAT="%s_%d"

BACKUP_NAME=${P2:-$BACKUP_FILE_FORMAT}
BACKUP_NAME="${BACKUP_NAME/\%s/pg}"
BACKUP_NAME="${BACKUP_NAME/\%d/$BACKUP_DATE}"

BACKUP_FILE_ROOT="$HUMBLE_BACKUP/$BACKUP_NAME"
BACKUP_FILE_PATH="/backup/$BACKUP_NAME.sql"

if [ "$PRINT_FEEDBACK" == "yes" ]; then
    echo ""
    echo "======== PG BACKUP ========"
    echo "user:      $PG_USER"
    echo "database:  $PG_DATABASE"
    echo "target:    $BACKUP_FILE_PATH"
    echo ""
    enterToContinue
    echo ""
    echo ""
fi

# Uncompressed
#humble exec postgres pg_dump --user=$SQL_USER $SQL_DATABASE --file=$BACKUP_FILE_PATH

# Compressed
humble exec postgres pg_dump --user=$PG_USER -Fc $PG_DATABASE --file=$BACKUP_FILE_PATH

# Upload
#aws  s3 cp "$HUMBLE_BACKUP/$BACKUP_NAME.sql" s3://mysocial-backups/$BACKUP_NAME/$BACKUP_NAME.sql
