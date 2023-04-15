#!/bin/bash
# shell script log goes to /tmp/stdout.log
# shell script error log goes to /tmp/stderr.log

APP_LOCATION="/var/app/automation"
NODE_EXE="node"

TIMESTAMP=$(date +"%m-%d-%Y-%r")
TIMESTAMP_UNIX=$(date +%s)


#################################
# Helpers
#################################
function _log(){
  echo "[$(basename $0)][$TIMESTAMP($TIMESTAMP_UNIX)] $1"
}
function _allinone(){
  #
}

function _monitoringTerminalAPI(){
  echo "Monitoring Terminal API call."
  URL="https://_API_URL_"
  RESPONSE=$(curl -IL -X GET $URL 2>/dev/null | grep HTTP | tail -n 1 | cut -d' ' -f2)
  echo "RESPONSE>>>$RESPONSE"
  date
  TZ="America/New_York" date
  if [ "$RESPONSE" != "200" ]
  then
    echo "Site is down."
    echo "$NODE_EXE $APP_LOCATION/scripts/execute_call.js terminalAPIDown"
    cd $APP_LOCATION
    pwd
    $NODE_EXE scripts/execute_call.js terminalAPIDown
  else
    echo "Site is up."
  fi
}


function _monitoringSubgraph(){
  echo "Monitoring Subgraph call."
  URL="https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3"
  RESPONSE=$(curl -IL -X GET $URL 2>/dev/null | grep HTTP | tail -n 1 | cut -d' ' -f2)
  echo "RESPONSE>>>$RESPONSE"
  date
  TZ="America/New_York" date
  if [ "$RESPONSE" == "404" ]
  then
    echo "Subgraph is down."
    echo "$NODE_EXE $APP_LOCATION/scripts/execute_call.js subgraphAPIDown"
    cd $APP_LOCATION
    pwd
    $NODE_EXE scripts/execute_call.js subgraphAPIDown
  elif [ "$RESPONSE" == "200" ]
  then
    echo "Subgraph is up."
  else
    echo "Subgraph returns http - $RESPONSE"
  fi
}


function _callSwitch(){
  ACTION=$1
  case $ACTION in
    "allinone")
      _allinone
    ;;
    "monitoringTerminalAPI")
      _monitoringTerminalAPI
    ;;
    "monitoringSubgraph")
      _monitoringSubgraph
    ;;
  esac
}


# Default values of arguments
TMP_PROJECT_DIRECTORY="/etc/projects"
TMP_OTHER_ARGUMENTS=()

for arg in "$@"
do
    case $arg in
      -h|--help)
        echo "options:"
        echo "-h, --help                show brief help"
        echo "-a, --action              specify an action to use[monitoringTerminalAPI, preprocess, execute_call_test, postprocess]"
        echo "-d, --directory           specify project dir to use"
        exit 0
        ;;
      -a|--action)
        shift
        ACTION_CALL="$1"
        _callSwitch "$ACTION_CALL"
        ;;
      -d|--directory)
        TMP_PROJECT_DIRECTORY="$2"
        shift
        ;;
      *)
        TMP_OTHER_ARGUMENTS+=("$4")
        shift
        ;;
    esac
done

echo "\n# Action call: $ACTION_CALL"
echo "# Root directory: $TMP_PROJECT_DIRECTORY"
echo "# Other arguments: ${TMP_OTHER_ARGUMENTS[*]}"
