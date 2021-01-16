# Kubernetes scripts

## Create Context
```
./create-context.sh <CONTEXT NAME> <kube cluster> my-special-namespace this@is.a!really*lLonGtoken
```
- create-context.sh
```
#!/bin/bash

NICKNAME=$1
SERVER=$2
NAMESPACE=$3
TOKEN=$4

echo ""
echo ""
echo "======================================="
echo "==	PARAMETERS"
echo "======================================="
echo "== Nickname: $NICKNAME"
echo "== Server: $SERVER"
echo "== Namespace: $NAMESPACE"
echo "== Token: $TOKEN"
echo "======================================="
echo ""
echo ""

if [[ -z "$NICKNAME" ]]
then
	echo "The nickname you provided is empty!"
	exit 1
fi

NAME_EXISTS=$(kubectl config view | grep -w "$NICKNAME")
if [[ -n "$NAME_EXISTS" ]]
then 
	echo "The nickname is already in use, please provide a different name than $NICKNAME"
	exit 1
fi

if [[ -z "$SERVER" ]]
then
	echo "The server you provided is empty!"
	exit 1
fi

if [[ ! $SERVER =~ ^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}:[0-9]{1,}$ ]] && [[ ! $SERVER =~ ^https?:\/\/.+:[0-9]{1,}$ ]]
then 
	echo "The format of the server you provided is incorrect: $SERVER"
	echo "It should follow one of the following formats:"
	echo "http\(s\)://this-is.the-server:12345"
	echo "192.168.1.1:12345"
	exit 1
fi

if [[ -z "$NAMESPACE" ]]
then
	echo "The namespace you provided is empty!"
	exit 1
fi

if [[ -z "$TOKEN" ]]
then
	echo "The token you provided is empty!"
	exit 1
fi


echo "Your inputs check out! :D"

echo ""
echo ""
echo "======================================="
echo "==	Creating K8 Context"
echo "======================================="

K8_USER=$NICKNAME"_USER"
K8_CLUSTER=$NICKNAME"_CLUSTER"

echo "$(kubectl config set-cluster $K8_CLUSTER --server=$SERVER)"
echo "$(kubectl config set-cluster $K8_CLUSTER --insecure-skip-tls-verify)"

echo "$(kubectl config set-credentials $K8_USER --token=$TOKEN)"

echo "$(kubectl config set-context $NICKNAME --cluster=$K8_CLUSTER --user=$K8_USER --namespace=$NAMESPACE)"

echo ""
echo "Finished creating context. To use context run command \"kubectl config use-context $NICKNAME\""
```

## Delete Context
```
./delete-context.sh <CONTEXT NAME>
```
-- delete-context.sh
```
#!/bin/bash

NICKNAME=$1

echo "==========================================="
echo "== Deleting \"$NICKNAME\" from config"
echo "==========================================="
echo ""
if [[ -z "$NICKNAME" ]]
then
	echo "The nickname to delete from kubectl config must not be empty"
	exit 1
fi

USER=$NICKNAME"_USER"
CLUSTER=$NICKNAME"_CLUSTER"

echo "$(kubectl config unset contexts.$NICKNAME)"
echo "$(kubectl config unset users.$USER)"
echo "$(kubectl config unset clusters.$CLUSTER)"
```

## Switch Context
```
./switch-context.sh <CONTEXT NAME>
```

- switch-context.sh
```
#!/bin/bash

NICKNAME=$1

if [[ -z "$NICKNAME" ]]
then
	echo "The first parameter (context name) should not be empty!"
	echo "Proper script use is \"./switch-context.sh CONTEXT-TO-USE\""
	exit 1
fi

echo "$(kubectl config use-context $NICKNAME)"
```
