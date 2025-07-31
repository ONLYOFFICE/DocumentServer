#!/bin/bash

umask 0022

start_process() {
  "$@" &
  CHILD=$!; wait "$CHILD"; CHILD="";
}

function clean_exit {
  [[ -z "$CHILD" ]] || kill -s SIGTERM "$CHILD" 2>/dev/null
  if [ ${ONLYOFFICE_DATA_CONTAINER} == "false" ] && \
  [ ${ONLYOFFICE_DATA_CONTAINER_HOST} == "localhost" ]; then
    /usr/bin/documentserver-prepare4shutdown.sh
  fi
  exit
}

trap clean_exit SIGTERM SIGQUIT SIGABRT SIGINT

# Define '**' behavior explicitly
shopt -s globstar

APP_DIR="/var/www/${COMPANY_NAME}/documentserver"
DATA_DIR="/var/www/${COMPANY_NAME}/Data"
PRIVATE_DATA_DIR="${DATA_DIR}/.private"
DS_RELEASE_DATE="${PRIVATE_DATA_DIR}/ds_release_date"
LOG_DIR="/var/log/${COMPANY_NAME}"
DS_LOG_DIR="${LOG_DIR}/documentserver"
LIB_DIR="/var/lib/${COMPANY_NAME}"
DS_LIB_DIR="${LIB_DIR}/documentserver"
CONF_DIR="/etc/${COMPANY_NAME}/documentserver"
SUPERVISOR_CONF_DIR="/etc/supervisor/conf.d"
IS_UPGRADE="false"
PLUGINS_ENABLED=${PLUGINS_ENABLED:-true}

ONLYOFFICE_DATA_CONTAINER=${ONLYOFFICE_DATA_CONTAINER:-false}
ONLYOFFICE_DATA_CONTAINER_HOST=${ONLYOFFICE_DATA_CONTAINER_HOST:-localhost}
ONLYOFFICE_DATA_CONTAINER_PORT=80

RELEASE_DATE="$(stat -c="%y" ${APP_DIR}/server/DocService/docservice | sed -r 's/=([0-9]+)-([0-9]+)-([0-9]+) ([0-9:.+ ]+)/\1-\2-\3/')";
if [ -f ${DS_RELEASE_DATE} ]; then
  PREV_RELEASE_DATE=$(head -n 1 ${DS_RELEASE_DATE})
else
  PREV_RELEASE_DATE="0"
fi

if [ "${RELEASE_DATE}" != "${PREV_RELEASE_DATE}" ]; then
  if [ ${ONLYOFFICE_DATA_CONTAINER} != "true" ]; then
    IS_UPGRADE="true";
  fi
fi

SSL_CERTIFICATES_DIR="/usr/share/ca-certificates/ds"; mkdir -p ${SSL_CERTIFICATES_DIR}
find "${DATA_DIR}/certs" -type f \( -iname '*.crt' -o -iname '*.pem' -o -iname '*.key' \) -exec cp -f {} "${SSL_CERTIFICATES_DIR}"/ \;
if find "${SSL_CERTIFICATES_DIR}" -maxdepth 1 -type f | read _; then
  find "${SSL_CERTIFICATES_DIR}" -type f \( -iname '*.crt' -o -iname '*.pem' \) -exec chmod 644 {} \;
  find "${SSL_CERTIFICATES_DIR}" -type f -iname '*.key' -exec chmod 400 {} \;
fi

if [[ -z $SSL_CERTIFICATE_PATH ]] && [[ -f ${SSL_CERTIFICATES_DIR}/${COMPANY_NAME}.crt ]]; then
  SSL_CERTIFICATE_PATH=${SSL_CERTIFICATES_DIR}/${COMPANY_NAME}.crt
else
  SSL_CERTIFICATE_PATH=${SSL_CERTIFICATE_PATH:-${SSL_CERTIFICATES_DIR}/tls.crt}
fi
if [[ -z $SSL_KEY_PATH ]] && [[ -f ${SSL_CERTIFICATES_DIR}/${COMPANY_NAME}.key ]]; then
  SSL_KEY_PATH=${SSL_CERTIFICATES_DIR}/${COMPANY_NAME}.key
else
  SSL_KEY_PATH=${SSL_KEY_PATH:-${SSL_CERTIFICATES_DIR}/tls.key}
fi

#When set, the well known "root" CAs will be extended with the extra certificates in file
NODE_EXTRA_CA_CERTS=${NODE_EXTRA_CA_CERTS:-${SSL_CERTIFICATES_DIR}/extra-ca-certs.pem}
if [[ -f ${NODE_EXTRA_CA_CERTS} ]]; then
  NODE_EXTRA_ENVIRONMENT="${NODE_EXTRA_CA_CERTS}"
elif [[ -f ${SSL_CERTIFICATE_PATH} ]]; then
  SSL_CERTIFICATE_SUBJECT=$(openssl x509 -subject -noout -in "${SSL_CERTIFICATE_PATH}" | sed 's/subject=//')
  SSL_CERTIFICATE_ISSUER=$(openssl x509 -issuer -noout -in "${SSL_CERTIFICATE_PATH}" | sed 's/issuer=//')

  #Add self-signed certificate to trusted list for validating Docs requests to the test example 
  if [[ -n $SSL_CERTIFICATE_SUBJECT && $SSL_CERTIFICATE_SUBJECT == $SSL_CERTIFICATE_ISSUER ]]; then
    NODE_EXTRA_ENVIRONMENT="${SSL_CERTIFICATE_PATH}"
  fi
fi

if [[ -n $NODE_EXTRA_ENVIRONMENT ]]; then
  sed -i "s|^environment=.*$|&,NODE_EXTRA_CA_CERTS=${NODE_EXTRA_ENVIRONMENT}|" /etc/supervisor/conf.d/*.conf
fi

CA_CERTIFICATES_PATH=${CA_CERTIFICATES_PATH:-${SSL_CERTIFICATES_DIR}/ca-certificates.pem}
SSL_DHPARAM_PATH=${SSL_DHPARAM_PATH:-${SSL_CERTIFICATES_DIR}/dhparam.pem}
SSL_VERIFY_CLIENT=${SSL_VERIFY_CLIENT:-off}
USE_UNAUTHORIZED_STORAGE=${USE_UNAUTHORIZED_STORAGE:-false}
ONLYOFFICE_HTTPS_HSTS_ENABLED=${ONLYOFFICE_HTTPS_HSTS_ENABLED:-true}
ONLYOFFICE_HTTPS_HSTS_MAXAGE=${ONLYOFFICE_HTTPS_HSTS_MAXAGE:-31536000}
SYSCONF_TEMPLATES_DIR="/app/ds/setup/config"

NGINX_CONFD_PATH="/etc/nginx/conf.d";
NGINX_ONLYOFFICE_PATH="${CONF_DIR}/nginx"
NGINX_ONLYOFFICE_CONF="${NGINX_ONLYOFFICE_PATH}/ds.conf"
NGINX_ONLYOFFICE_EXAMPLE_PATH="${CONF_DIR}-example/nginx"
NGINX_ONLYOFFICE_EXAMPLE_CONF="${NGINX_ONLYOFFICE_EXAMPLE_PATH}/includes/ds-example.conf"

NGINX_CONFIG_PATH="/etc/nginx/nginx.conf"
NGINX_WORKER_PROCESSES=${NGINX_WORKER_PROCESSES:-1}
# Limiting the maximum number of simultaneous connections due to possible memory shortage
LIMIT=$(ulimit -n); [ $LIMIT -gt 1048576 ] && LIMIT=1048576
NGINX_WORKER_CONNECTIONS=${NGINX_WORKER_CONNECTIONS:-$LIMIT}
RABBIT_CONNECTIONS=${RABBIT_CONNECTIONS:-$LIMIT}

JWT_ENABLED=${JWT_ENABLED:-true}

# validate user's vars before usinig in json
if [ "${JWT_ENABLED}" == "true" ]; then
  JWT_ENABLED="true"
else
  JWT_ENABLED="false"
fi

[ -z $JWT_SECRET ] && JWT_MESSAGE='JWT is enabled by default. A random secret is generated automatically. Run the command "docker exec $(sudo docker ps -q) sudo documentserver-jwt-status.sh" to get information about JWT.'

JWT_SECRET=${JWT_SECRET:-$(pwgen -s 32)}
JWT_HEADER=${JWT_HEADER:-Authorization}
JWT_IN_BODY=${JWT_IN_BODY:-false}

WOPI_ENABLED=${WOPI_ENABLED:-false}
ALLOW_META_IP_ADDRESS=${ALLOW_META_IP_ADDRESS:-false}
ALLOW_PRIVATE_IP_ADDRESS=${ALLOW_PRIVATE_IP_ADDRESS:-false}

GENERATE_FONTS=${GENERATE_FONTS:-true}

if [[ ${PRODUCT_NAME}${PRODUCT_EDITION} == "documentserver" ]]; then
  REDIS_ENABLED=false
else
  REDIS_ENABLED=true
fi

ONLYOFFICE_DEFAULT_CONFIG=${CONF_DIR}/local.json
ONLYOFFICE_LOG4JS_CONFIG=${CONF_DIR}/log4js/production.json
ONLYOFFICE_EXAMPLE_CONFIG=${CONF_DIR}-example/local.json

JSON_BIN=${APP_DIR}/npm/json
JSON="${JSON_BIN} -q -f ${ONLYOFFICE_DEFAULT_CONFIG}"
JSON_LOG="${JSON_BIN} -q -f ${ONLYOFFICE_LOG4JS_CONFIG}"
JSON_EXAMPLE="${JSON_BIN} -q -f ${ONLYOFFICE_EXAMPLE_CONFIG}"

LOCAL_SERVICES=()

PG_ROOT=/var/lib/postgresql
PG_NAME=main
PGDATA=${PG_ROOT}/${PG_VERSION}/${PG_NAME}
PG_NEW_CLUSTER=false
RABBITMQ_DATA=/var/lib/rabbitmq
REDIS_DATA=/var/lib/redis

if [ "${LETS_ENCRYPT_DOMAIN}" != "" -a "${LETS_ENCRYPT_MAIL}" != "" ]; then
  LETSENCRYPT_ROOT_DIR="/etc/letsencrypt/live"
  SSL_CERTIFICATE_PATH=${LETSENCRYPT_ROOT_DIR}/${LETS_ENCRYPT_DOMAIN}/fullchain.pem
  SSL_KEY_PATH=${LETSENCRYPT_ROOT_DIR}/${LETS_ENCRYPT_DOMAIN}/privkey.pem
fi

read_setting(){
  deprecated_var POSTGRESQL_SERVER_HOST DB_HOST
  deprecated_var POSTGRESQL_SERVER_PORT DB_PORT
  deprecated_var POSTGRESQL_SERVER_DB_NAME DB_NAME
  deprecated_var POSTGRESQL_SERVER_USER DB_USER
  deprecated_var POSTGRESQL_SERVER_PASS DB_PWD
  deprecated_var RABBITMQ_SERVER_URL AMQP_URI
  deprecated_var AMQP_SERVER_URL AMQP_URI
  deprecated_var AMQP_SERVER_TYPE AMQP_TYPE

  METRICS_ENABLED="${METRICS_ENABLED:-false}"
  METRICS_HOST="${METRICS_HOST:-localhost}"
  METRICS_PORT="${METRICS_PORT:-8125}"
  METRICS_PREFIX="${METRICS_PREFIX:-.ds}"

  DB_HOST=${DB_HOST:-${POSTGRESQL_SERVER_HOST:-$(${JSON} services.CoAuthoring.sql.dbHost)}}
  DB_TYPE=${DB_TYPE:-$(${JSON} services.CoAuthoring.sql.type)}
  case $DB_TYPE in
    "postgres")
      DB_PORT=${DB_PORT:-"5432"}
      ;;
    "mariadb"|"mysql")
      DB_PORT=${DB_PORT:-"3306"}
      ;;
    "dameng")
      DB_PORT=${DB_PORT:-"5236"}
      ;;
    "mssql")
      DB_PORT=${DB_PORT:-"1433"}
      ;;
    "oracle")
      DB_PORT=${DB_PORT:-"1521"}
      ;;
    "")
      DB_PORT=${DB_PORT:-${POSTGRESQL_SERVER_PORT:-$(${JSON} services.CoAuthoring.sql.dbPort)}}
      ;;
    *)
      echo "ERROR: unknown database type"
      exit 1
      ;;
  esac
  DB_NAME=${DB_NAME:-${POSTGRESQL_SERVER_DB_NAME:-$(${JSON} services.CoAuthoring.sql.dbName)}}
  DB_USER=${DB_USER:-${POSTGRESQL_SERVER_USER:-$(${JSON} services.CoAuthoring.sql.dbUser)}}
  DB_PWD=${DB_PWD:-${POSTGRESQL_SERVER_PASS:-$(${JSON} services.CoAuthoring.sql.dbPass)}}

  RABBITMQ_SERVER_URL=${RABBITMQ_SERVER_URL:-$(${JSON} rabbitmq.url)}
  AMQP_URI=${AMQP_URI:-${AMQP_SERVER_URL:-${RABBITMQ_SERVER_URL}}}
  AMQP_TYPE=${AMQP_TYPE:-${AMQP_SERVER_TYPE:-rabbitmq}}
  parse_rabbitmq_url ${AMQP_URI}

  REDIS_SERVER_HOST=${REDIS_SERVER_HOST:-$(${JSON} services.CoAuthoring.redis.host)}
  REDIS_SERVER_PORT=${REDIS_SERVER_PORT:-6379}

  DS_LOG_LEVEL=${DS_LOG_LEVEL:-$(${JSON_LOG} categories.default.level)}
}

deprecated_var() {
  if [[ -n ${!1} ]]; then
    echo "Variable $1 is deprecated. Use $2 instead."
  fi
}

parse_rabbitmq_url(){
  local amqp=$1

  # extract the protocol
  local proto="$(echo $amqp | grep :// | sed -e's,^\(.*://\).*,\1,g')"
  # remove the protocol
  local url="$(echo ${amqp/$proto/})"

  # extract the user and password (if any)
  local userpass="`echo $url | grep @ | cut -d@ -f1`"
  local pass=`echo $userpass | grep : | cut -d: -f2`

  local user
  if [ -n "$pass" ]; then
    user=`echo $userpass | grep : | cut -d: -f1`
  else
    user=$userpass
  fi

  # extract the host
  local hostport="$(echo ${url/$userpass@/} | cut -d/ -f1)"
  # by request - try to extract the port
  local port="$(echo $hostport | grep : | sed -r 's_^.*:+|/.*$__g')"

  local host
  if [ -n "$port" ]; then
    host=`echo $hostport | grep : | cut -d: -f1`
  else
    host=$hostport
    port="5672"
  fi

  # extract the path (if any)
  local path="$(echo $url | grep / | cut -d/ -f2-)"

  AMQP_SERVER_PROTO=${proto:0:-3}
  AMQP_SERVER_HOST=$host
  AMQP_SERVER_USER=$user
  AMQP_SERVER_PASS=$pass
  AMQP_SERVER_PORT=$port
}

waiting_for_connection(){
  until nc -z -w 3 "$1" "$2"; do
    >&2 echo "Waiting for connection to the $1 host on port $2"
    sleep 1
  done
}

waiting_for_db_ready(){
  case $DB_TYPE in
    "oracle")
      ORACLE_SQL="sqlplus $DB_USER/$DB_PWD@//$DB_HOST:$DB_PORT/${DB_NAME}"
      DB_TEST="echo \"SELECT version FROM V\$INSTANCE;\" | $ORACLE_SQL 2>/dev/null | grep \"Connected\" | wc -l"
      ;;
    *)
      return
      ;;
  esac

  for (( i=1; i <= 10; i++ )); do
    RES=$(eval $DB_TEST)
    if [ "$RES" -ne "0" ]; then
      echo "Database is ready"
      break
    fi
    sleep 5
  done
}

waiting_for_db(){
  waiting_for_connection $DB_HOST $DB_PORT
  waiting_for_db_ready
}

waiting_for_amqp(){
  waiting_for_connection ${AMQP_SERVER_HOST} ${AMQP_SERVER_PORT}
}

waiting_for_redis(){
  waiting_for_connection ${REDIS_SERVER_HOST} ${REDIS_SERVER_PORT}
}
waiting_for_datacontainer(){
  waiting_for_connection ${ONLYOFFICE_DATA_CONTAINER_HOST} ${ONLYOFFICE_DATA_CONTAINER_PORT}
}

update_statsd_settings(){
  ${JSON} -I -e "if(this.statsd===undefined)this.statsd={};"
  ${JSON} -I -e "this.statsd.useMetrics = '${METRICS_ENABLED}'"
  ${JSON} -I -e "this.statsd.host = '${METRICS_HOST}'"
  ${JSON} -I -e "this.statsd.port = '${METRICS_PORT}'"
  ${JSON} -I -e "this.statsd.prefix = '${METRICS_PREFIX}'"
  sed -i -E "s/(autostart|autorestart)=.*$/\1=${METRICS_ENABLED}/g" ${SUPERVISOR_CONF_DIR}/ds-metrics.conf
}

update_db_settings(){
  ${JSON} -I -e "this.services.CoAuthoring.sql.type = '${DB_TYPE}'"
  ${JSON} -I -e "this.services.CoAuthoring.sql.dbHost = '${DB_HOST}'"
  ${JSON} -I -e "this.services.CoAuthoring.sql.dbPort = '${DB_PORT}'"
  ${JSON} -I -e "this.services.CoAuthoring.sql.dbName = '${DB_NAME}'"
  ${JSON} -I -e "this.services.CoAuthoring.sql.dbUser = '${DB_USER}'"
  ${JSON} -I -e "this.services.CoAuthoring.sql.dbPass = '${DB_PWD}'"
}

update_rabbitmq_setting(){
  if [ "${AMQP_TYPE}" == "rabbitmq" ]; then
    ${JSON} -I -e "if(this.queue===undefined)this.queue={};"
    ${JSON} -I -e "this.queue.type = 'rabbitmq'"
    ${JSON} -I -e "this.rabbitmq.url = '${AMQP_URI}'"
  fi
  
  if [ "${AMQP_TYPE}" == "activemq" ]; then
    ${JSON} -I -e "if(this.queue===undefined)this.queue={};"
    ${JSON} -I -e "this.queue.type = 'activemq'"
    ${JSON} -I -e "if(this.activemq===undefined)this.activemq={};"
    ${JSON} -I -e "if(this.activemq.connectOptions===undefined)this.activemq.connectOptions={};"

    ${JSON} -I -e "this.activemq.connectOptions.host = '${AMQP_SERVER_HOST}'"

    if [ ! "${AMQP_SERVER_PORT}" == "" ]; then
      ${JSON} -I -e "this.activemq.connectOptions.port = '${AMQP_SERVER_PORT}'"
    else
      ${JSON} -I -e "delete this.activemq.connectOptions.port"
    fi

    if [ ! "${AMQP_SERVER_USER}" == "" ]; then
      ${JSON} -I -e "this.activemq.connectOptions.username = '${AMQP_SERVER_USER}'"
    else
      ${JSON} -I -e "delete this.activemq.connectOptions.username"
    fi

    if [ ! "${AMQP_SERVER_PASS}" == "" ]; then
      ${JSON} -I -e "this.activemq.connectOptions.password = '${AMQP_SERVER_PASS}'"
    else
      ${JSON} -I -e "delete this.activemq.connectOptions.password"
    fi

    case "${AMQP_SERVER_PROTO}" in
      amqp+ssl|amqps)
        ${JSON} -I -e "this.activemq.connectOptions.transport = 'tls'"
        ;;
      *)
        ${JSON} -I -e "delete this.activemq.connectOptions.transport"
        ;;
    esac 
  fi
}

update_redis_settings(){
  ${JSON} -I -e "if(this.services.CoAuthoring.redis===undefined)this.services.CoAuthoring.redis={};"
  ${JSON} -I -e "this.services.CoAuthoring.redis.host = '${REDIS_SERVER_HOST}'"
  ${JSON} -I -e "this.services.CoAuthoring.redis.port = '${REDIS_SERVER_PORT}'"

  if [ -n "${REDIS_SERVER_PASS}" ]; then
    ${JSON} -I -e "this.services.CoAuthoring.redis.options = {'password':'${REDIS_SERVER_PASS}'}"
  fi

}

update_ds_settings(){
  ${JSON} -I -e "this.services.CoAuthoring.token.enable.browser = ${JWT_ENABLED}"
  ${JSON} -I -e "this.services.CoAuthoring.token.enable.request.inbox = ${JWT_ENABLED}"
  ${JSON} -I -e "this.services.CoAuthoring.token.enable.request.outbox = ${JWT_ENABLED}"

  ${JSON} -I -e "this.services.CoAuthoring.secret.inbox.string = '${JWT_SECRET}'"
  ${JSON} -I -e "this.services.CoAuthoring.secret.outbox.string = '${JWT_SECRET}'"
  ${JSON} -I -e "this.services.CoAuthoring.secret.session.string = '${JWT_SECRET}'"

  ${JSON} -I -e "this.services.CoAuthoring.token.inbox.header = '${JWT_HEADER}'"
  ${JSON} -I -e "this.services.CoAuthoring.token.outbox.header = '${JWT_HEADER}'"

  ${JSON} -I -e "this.services.CoAuthoring.token.inbox.inBody = ${JWT_IN_BODY}"
  ${JSON} -I -e "this.services.CoAuthoring.token.outbox.inBody = ${JWT_IN_BODY}"

  if [ -f "${ONLYOFFICE_EXAMPLE_CONFIG}" ]; then
    ${JSON_EXAMPLE} -I -e "this.server.token.enable = ${JWT_ENABLED}"
    ${JSON_EXAMPLE} -I -e "this.server.token.secret = '${JWT_SECRET}'"
    ${JSON_EXAMPLE} -I -e "this.server.token.authorizationHeader = '${JWT_HEADER}'"
  fi
 
  if [ "${USE_UNAUTHORIZED_STORAGE}" == "true" ]; then
    ${JSON} -I -e "if(this.services.CoAuthoring.requestDefaults===undefined)this.services.CoAuthoring.requestDefaults={}"
    ${JSON} -I -e "if(this.services.CoAuthoring.requestDefaults.rejectUnauthorized===undefined)this.services.CoAuthoring.requestDefaults.rejectUnauthorized=false"
  fi

  WOPI_PRIVATE_KEY="${DATA_DIR}/wopi_private.key"
  WOPI_PUBLIC_KEY="${DATA_DIR}/wopi_public.key"

  [ ! -f "${WOPI_PRIVATE_KEY}" ] && echo -n "Generating WOPI private key..." && openssl genpkey -algorithm RSA -outform PEM -out "${WOPI_PRIVATE_KEY}" >/dev/null 2>&1 && echo "Done"
  [ ! -f "${WOPI_PUBLIC_KEY}" ] && echo -n "Generating WOPI public key..." && openssl rsa -RSAPublicKey_out -in "${WOPI_PRIVATE_KEY}" -outform "MS PUBLICKEYBLOB" -out "${WOPI_PUBLIC_KEY}" >/dev/null 2>&1  && echo "Done"
  WOPI_MODULUS=$(openssl rsa -pubin -inform "MS PUBLICKEYBLOB" -modulus -noout -in "${WOPI_PUBLIC_KEY}" | sed 's/Modulus=//' | xxd -r -p | openssl base64 -A)
  WOPI_EXPONENT=$(openssl rsa -pubin -inform "MS PUBLICKEYBLOB" -text -noout -in "${WOPI_PUBLIC_KEY}" | grep -oP '(?<=Exponent: )\d+')
  
  ${JSON} -I -e "if(this.wopi===undefined)this.wopi={};"
  ${JSON} -I -e "this.wopi.enable = ${WOPI_ENABLED}"
  ${JSON} -I -e "this.wopi.privateKey = '$(awk '{printf "%s\\n", $0}' ${WOPI_PRIVATE_KEY})'"
  ${JSON} -I -e "this.wopi.privateKeyOld = '$(awk '{printf "%s\\n", $0}' ${WOPI_PRIVATE_KEY})'"
  ${JSON} -I -e "this.wopi.publicKey = '$(openssl base64 -in ${WOPI_PUBLIC_KEY} -A)'"
  ${JSON} -I -e "this.wopi.publicKeyOld = '$(openssl base64 -in ${WOPI_PUBLIC_KEY} -A)'"
  ${JSON} -I -e "this.wopi.modulus = '${WOPI_MODULUS}'"
  ${JSON} -I -e "this.wopi.modulusOld = '${WOPI_MODULUS}'"
  ${JSON} -I -e "this.wopi.exponent = ${WOPI_EXPONENT}"
  ${JSON} -I -e "this.wopi.exponentOld = ${WOPI_EXPONENT}"

  if [ "${ALLOW_META_IP_ADDRESS}" = "true" ] || [ "${ALLOW_PRIVATE_IP_ADDRESS}" = "true" ]; then
    ${JSON} -I -e "if(this.services.CoAuthoring['request-filtering-agent']===undefined)this.services.CoAuthoring['request-filtering-agent']={}"
    [ "${ALLOW_META_IP_ADDRESS}" = "true" ] && ${JSON} -I -e "this.services.CoAuthoring['request-filtering-agent'].allowMetaIPAddress = true"
    [ "${ALLOW_PRIVATE_IP_ADDRESS}" = "true" ] && ${JSON} -I -e "this.services.CoAuthoring['request-filtering-agent'].allowPrivateIPAddress = true"
  fi
}

create_postgresql_cluster(){
  local pg_conf_dir=/etc/postgresql/${PG_VERSION}/${PG_NAME}
  local postgresql_conf=$pg_conf_dir/postgresql.conf
  local hba_conf=$pg_conf_dir/pg_hba.conf

  mv $postgresql_conf $postgresql_conf.backup
  mv $hba_conf $hba_conf.backup

  pg_createcluster ${PG_VERSION} ${PG_NAME}
}

create_postgresql_db(){
  sudo -u postgres psql -c "CREATE USER $DB_USER WITH password '"$DB_PWD"';"
  sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"
}

create_mssql_db(){
  MSSQL="/opt/mssql-tools18/bin/sqlcmd -S $DB_HOST,$DB_PORT"

  $MSSQL -U $DB_USER -P "$DB_PWD" -C -Q "IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = '$DB_NAME') BEGIN CREATE DATABASE $DB_NAME; END"
}

create_db_tbl() {
  case $DB_TYPE in
    "postgres")
      create_postgresql_tbl
    ;;
    "mariadb"|"mysql")
      create_mysql_tbl
    ;;
    "mssql")
      create_mssql_tbl
    ;;
    "oracle")
      create_oracle_tbl
    ;;
  esac
}

upgrade_db_tbl() {
  case $DB_TYPE in
    "postgres")
      upgrade_postgresql_tbl
    ;;
    "mariadb"|"mysql")
      upgrade_mysql_tbl
    ;;
    "mssql")
      upgrade_mssql_tbl
    ;;
    "oracle")
      upgrade_oracle_tbl
    ;;
  esac
}

upgrade_postgresql_tbl() {
  if [ -n "$DB_PWD" ]; then
    export PGPASSWORD=$DB_PWD
  fi

  PSQL="psql -q -h$DB_HOST -p$DB_PORT -d$DB_NAME -U$DB_USER -w"

  $PSQL -f "$APP_DIR/server/schema/postgresql/removetbl.sql"
  $PSQL -f "$APP_DIR/server/schema/postgresql/createdb.sql"
}

upgrade_mysql_tbl() {
  CONNECTION_PARAMS="-h$DB_HOST -P$DB_PORT -u$DB_USER -p$DB_PWD -w"
  MYSQL="mysql -q $CONNECTION_PARAMS"

  $MYSQL $DB_NAME < "$APP_DIR/server/schema/mysql/removetbl.sql" >/dev/null 2>&1
  $MYSQL $DB_NAME < "$APP_DIR/server/schema/mysql/createdb.sql" >/dev/null 2>&1
}

upgrade_mssql_tbl() {
  CONN_PARAMS="-d $DB_NAME -U $DB_USER -P "$DB_PWD" -C"
  MSSQL="/opt/mssql-tools18/bin/sqlcmd -S $DB_HOST,$DB_PORT $CONN_PARAMS"

  $MSSQL < "$APP_DIR/server/schema/mssql/removetbl.sql" >/dev/null 2>&1
  $MSSQL < "$APP_DIR/server/schema/mssql/createdb.sql" >/dev/null 2>&1
}

upgrade_oracle_tbl() {
  ORACLE_SQL="sqlplus $DB_USER/$DB_PWD@//$DB_HOST:$DB_PORT/${DB_NAME}"

  $ORACLE_SQL @$APP_DIR/server/schema/oracle/removetbl.sql >/dev/null 2>&1
  $ORACLE_SQL @$APP_DIR/server/schema/oracle/createdb.sql >/dev/null 2>&1
}

create_postgresql_tbl() {
  if [ -n "$DB_PWD" ]; then
    export PGPASSWORD=$DB_PWD
  fi

  PSQL="psql -q -h$DB_HOST -p$DB_PORT -d$DB_NAME -U$DB_USER -w"
  $PSQL -f "$APP_DIR/server/schema/postgresql/createdb.sql"
}

create_mysql_tbl() {
  CONNECTION_PARAMS="-h$DB_HOST -P$DB_PORT -u$DB_USER -p$DB_PWD -w"
  MYSQL="mysql -q $CONNECTION_PARAMS"

  # Create db on remote server
  $MYSQL -e "CREATE DATABASE IF NOT EXISTS $DB_NAME DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;" >/dev/null 2>&1

  $MYSQL $DB_NAME < "$APP_DIR/server/schema/mysql/createdb.sql" >/dev/null 2>&1
}

create_mssql_tbl() {  
  create_mssql_db

  CONN_PARAMS="-d $DB_NAME -U $DB_USER -P "$DB_PWD" -C"
  MSSQL="/opt/mssql-tools18/bin/sqlcmd -S $DB_HOST,$DB_PORT $CONN_PARAMS"

  $MSSQL < "$APP_DIR/server/schema/mssql/createdb.sql" >/dev/null 2>&1
}

create_oracle_tbl() {
  ORACLE_SQL="sqlplus $DB_USER/$DB_PWD@//$DB_HOST:$DB_PORT/${DB_NAME}"

  $ORACLE_SQL @$APP_DIR/server/schema/oracle/createdb.sql >/dev/null 2>&1
}

update_welcome_page() {
  WELCOME_PAGE="${APP_DIR}-example/welcome/docker.html"
  if [[ -e $WELCOME_PAGE ]]; then
    DOCKER_CONTAINER_ID=$(basename $(cat /proc/1/cpuset))
    (( ${#DOCKER_CONTAINER_ID} < 12 )) && DOCKER_CONTAINER_ID=$(hostname)
    if (( ${#DOCKER_CONTAINER_ID} >= 12 )); then
      if [[ -x $(command -v docker) ]]; then
        DOCKER_CONTAINER_NAME=$(docker inspect --format="{{.Name}}" $DOCKER_CONTAINER_ID)
        sed 's/$(sudo docker ps -q)/'"${DOCKER_CONTAINER_NAME#/}"'/' -i $WELCOME_PAGE
        JWT_MESSAGE=$(echo $JWT_MESSAGE | sed 's/$(sudo docker ps -q)/'"${DOCKER_CONTAINER_NAME#/}"'/')
      else
        sed 's/$(sudo docker ps -q)/'"${DOCKER_CONTAINER_ID::12}"'/' -i $WELCOME_PAGE
        JWT_MESSAGE=$(echo $JWT_MESSAGE | sed 's/$(sudo docker ps -q)/'"${DOCKER_CONTAINER_ID::12}"'/')
      fi
    fi
  fi
}

update_nginx_settings(){
  # Set up nginx
  sed 's/^worker_processes.*/'"worker_processes ${NGINX_WORKER_PROCESSES};"'/' -i ${NGINX_CONFIG_PATH}
  sed 's/worker_connections.*/'"worker_connections ${NGINX_WORKER_CONNECTIONS};"'/' -i ${NGINX_CONFIG_PATH}
  sed 's/access_log.*/'"access_log off;"'/' -i ${NGINX_CONFIG_PATH}

  # setup HTTPS
  if [ -f "${SSL_CERTIFICATE_PATH}" -a -f "${SSL_KEY_PATH}" ]; then
    cp -f ${NGINX_ONLYOFFICE_PATH}/ds-ssl.conf.tmpl ${NGINX_ONLYOFFICE_CONF}

    # configure nginx
    sed 's,{{SSL_CERTIFICATE_PATH}},'"${SSL_CERTIFICATE_PATH}"',' -i ${NGINX_ONLYOFFICE_CONF}
    sed 's,{{SSL_KEY_PATH}},'"${SSL_KEY_PATH}"',' -i ${NGINX_ONLYOFFICE_CONF}

    # turn on http2
    sed 's,\(443 ssl\),\1 http2,' -i ${NGINX_ONLYOFFICE_CONF}

    # if dhparam path is valid, add to the config, otherwise remove the option
    if [ -r "${SSL_DHPARAM_PATH}" ]; then
      sed 's,\(\#* *\)\?\(ssl_dhparam \).*\(;\)$,'"\2${SSL_DHPARAM_PATH}\3"',' -i ${NGINX_ONLYOFFICE_CONF}
    else
      sed '/ssl_dhparam/d' -i ${NGINX_ONLYOFFICE_CONF}
    fi

    sed 's,\(ssl_verify_client \).*\(;\)$,'"\1${SSL_VERIFY_CLIENT}\2"',' -i ${NGINX_ONLYOFFICE_CONF}

    if [ -f "${CA_CERTIFICATES_PATH}" ]; then
      sed '/ssl_verify_client/a '"ssl_client_certificate ${CA_CERTIFICATES_PATH}"';' -i ${NGINX_ONLYOFFICE_CONF}
    fi

    if [ "${ONLYOFFICE_HTTPS_HSTS_ENABLED}" == "true" ]; then
      sed 's,\(max-age=\).*\(;\)$,'"\1${ONLYOFFICE_HTTPS_HSTS_MAXAGE}\2"',' -i ${NGINX_ONLYOFFICE_CONF}
    else
      sed '/max-age=/d' -i ${NGINX_ONLYOFFICE_CONF}
    fi
  else
    ln -sf ${NGINX_ONLYOFFICE_PATH}/ds.conf.tmpl ${NGINX_ONLYOFFICE_CONF}
  fi

  # check if ipv6 supported otherwise remove it from nginx config
  if [ ! -f /proc/net/if_inet6 ]; then
    sed '/listen\s\+\[::[0-9]*\].\+/d' -i $NGINX_ONLYOFFICE_CONF
  fi

  if [ -f "${NGINX_ONLYOFFICE_EXAMPLE_CONF}" ]; then
    sed 's/linux/docker/' -i ${NGINX_ONLYOFFICE_EXAMPLE_CONF}
  fi

  start_process documentserver-update-securelink.sh -s ${SECURE_LINK_SECRET:-$(pwgen -s 20)} -r false
}

update_log_settings(){
   ${JSON_LOG} -I -e "this.categories.default.level = '${DS_LOG_LEVEL}'"
}

update_logrotate_settings(){
  sed 's|\(^su\b\).*|\1 root root|' -i /etc/logrotate.conf
}

update_release_date(){
  mkdir -p ${PRIVATE_DATA_DIR}
  echo ${RELEASE_DATE} > ${DS_RELEASE_DATE}
}

# create base folders
for i in converter docservice metrics; do
  mkdir -p "${DS_LOG_DIR}/$i"
done

mkdir -p ${DS_LOG_DIR}-example

# create app folders
for i in ${DS_LIB_DIR}/App_Data/cache/files ${DS_LIB_DIR}/App_Data/docbuilder ${DS_LIB_DIR}-example/files; do
  mkdir -p "$i"
done

# change folder rights
chown ds:ds "${DATA_DIR}"
for i in ${DS_LOG_DIR} ${DS_LOG_DIR}-example ${LIB_DIR}; do
  chown -R ds:ds "$i"
  chmod -R 755 "$i"
done

# Bug 75324 - Update permissions for runtime.json
AI_CONFIG_FILE="${DATA_DIR}/runtime.json"
[ -f "${AI_CONFIG_FILE}" ] && { chown ds:ds "${AI_CONFIG_FILE}" && chmod 644 "${AI_CONFIG_FILE}"; }

if [ ${ONLYOFFICE_DATA_CONTAINER_HOST} = "localhost" ]; then

  read_setting

  if [ $METRICS_ENABLED = "true" ]; then
    update_statsd_settings
  fi

  update_welcome_page

  update_log_settings

  update_ds_settings

  # update settings by env variables
  if [ $DB_HOST != "localhost" ]; then
    update_db_settings
    waiting_for_db
    create_db_tbl
  else
    # change rights for postgres directory
    chown -R postgres:postgres ${PG_ROOT}
    chmod -R 700 ${PG_ROOT}

    # create new db if it isn't exist
    if [ ! -d ${PGDATA} ]; then
      create_postgresql_cluster
      PG_NEW_CLUSTER=true
    fi
    LOCAL_SERVICES+=("postgresql")
  fi

  if [ ${AMQP_SERVER_HOST} != "localhost" ]; then
    update_rabbitmq_setting
  else
    # change rights for rabbitmq directory
    chown -R rabbitmq:rabbitmq ${RABBITMQ_DATA}
    chmod -R go=rX,u=rwX ${RABBITMQ_DATA}
    if [ -f ${RABBITMQ_DATA}/.erlang.cookie ]; then
        chmod 400 ${RABBITMQ_DATA}/.erlang.cookie
    fi

    echo "ulimit -n $RABBIT_CONNECTIONS" >> /etc/default/rabbitmq-server

    LOCAL_SERVICES+=("rabbitmq-server")
    # allow Rabbitmq startup after container kill
    rm -rf /var/run/rabbitmq
  fi

  if [ ${REDIS_ENABLED} = "true" ]; then
    if [ ${REDIS_SERVER_HOST} != "localhost" ]; then
      update_redis_settings
    else
      # change rights for redis directory
      chown -R redis:redis ${REDIS_DATA}
      chmod -R 750 ${REDIS_DATA}

      LOCAL_SERVICES+=("redis-server")
    fi
  fi
else
  # no need to update settings just wait for remote data
  waiting_for_datacontainer

  # read settings after the data container in ready state
  # to prevent get unconfigureted data
  read_setting
  
  update_welcome_page
fi

find /etc/${COMPANY_NAME} ! -path '*logrotate*' -exec chown ds:ds {} \;

#start needed local services
for i in ${LOCAL_SERVICES[@]}; do
  service $i start
done

if [ ${PG_NEW_CLUSTER} = "true" ]; then
  create_postgresql_db
  create_postgresql_tbl
fi

if [ ${ONLYOFFICE_DATA_CONTAINER} != "true" ]; then
  waiting_for_db
  waiting_for_amqp
  if [ ${REDIS_ENABLED} = "true" ]; then
    waiting_for_redis
  fi

  if [ "${IS_UPGRADE}" = "true" ]; then
    upgrade_db_tbl
    update_release_date
  fi

  update_nginx_settings
  
  service supervisor start
  
  # start cron to enable log rotating
  update_logrotate_settings
  service cron start
fi

# Fix to resolve the `unknown "cache_tag" variable` error
start_process documentserver-flush-cache.sh -r false

# nginx used as a proxy, and as data container status service.
# it run in all cases.
service nginx start

if [ "${LETS_ENCRYPT_DOMAIN}" != "" -a "${LETS_ENCRYPT_MAIL}" != "" ]; then
  if [ ! -f "${SSL_CERTIFICATE_PATH}" -a ! -f "${SSL_KEY_PATH}" ]; then
    start_process documentserver-letsencrypt.sh ${LETS_ENCRYPT_MAIL} ${LETS_ENCRYPT_DOMAIN}
  fi
fi

# Regenerate the fonts list and the fonts thumbnails
if [ "${GENERATE_FONTS}" == "true" ]; then
  start_process documentserver-generate-allfonts.sh ${ONLYOFFICE_DATA_CONTAINER}
fi

if [ "${PLUGINS_ENABLED}" = "true" ]; then
  echo -n Installing plugins, please wait...
  start_process documentserver-pluginsmanager.sh -r false --update=\"${APP_DIR}/sdkjs-plugins/plugin-list-default.json\" >/dev/null
  echo Done
fi


echo "${JWT_MESSAGE}" 

start_process find "$DS_LOG_DIR" "$DS_LOG_DIR-example" -type f -name "*.log" | xargs tail -f
