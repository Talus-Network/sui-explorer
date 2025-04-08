#!/bin/sh

set -e

# This script is used to create a JavaScript file that contains environment variables
# needed.
# TODO: Use a more general approach, instead of hardcoding the variable name.
#       I guess next time, when more is needed, we can use something like:
#
#       env|grep ^PREFIX|sort|awk -F= '{print $1": \""$2"\""}'
#

ENVJS=/usr/share/nginx/html/env-config.js

cat <<EOF >$ENVJS
window.__ENV__ = {
  SUI_RPC_URL: "${SUI_RPC_URL}",
};
EOF

if [ -z "${SUI_RPC_URL}" ]; then
    echo
    echo "SUI_RPC_URL is not set."
fi

cat $ENVJS
