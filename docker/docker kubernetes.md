Kubernetes Cheat Sheet
========================
Kubernetes-CLI
---------------
-  download by running `brew install kubernetes-cli`
-  [kube cmd](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands)


Cluster Connection Setup
--------------------
1. Create cluster configuration
    1. Instantiate cluster config: `kubectl config set-cluster SERVER_NICKNAME --server=http://SERVER:PORT`
        * SERVER_NICKNAME can be anything you want as long as it doesn't conflict with another cluster name in your kubectl config
        * SERVER and PORT are that of the K8 cluster itself and what you will authenticate against with the user you setup in step 2
    2. Configure ssl bypass: `kubectl config set-cluster SERVER_NICKNAME --insecure-skip-tls-verify`
2. Create user configuration: `kubectl config set-credentials USER_NICKNAME --token=GET_TOKEN_FROM_TEAM`
    * USER_NICKNAME can be anything you want as long as it doesn't conflict with another user name you used in your kubectl config
    * GET_TOKEN_FROM_TEAM is the authentication token specific to the namespace you'll be able to access, you'll need to get this from the K8 support or from a team member who has it
3. Create connection context: `kubectl config set-context CONTEXT_NICKNAME --cluster=SERVER_NICKNAME --user=USER_NICKNAME --namespace=GET_FROM_TEAM`
    * CONTEXT_NICKNAME can be anything you want as long as it doesn't conflict with another context name in your kubectl config
    * SERVER_NICKNAME and USER_NICKNAME refer to the cluster and user configured in steps 1 and 2 respectively
    * GET_FROM_TEAM should be replaced with the K8 namespace you want to connect to, get it from a team member

To switch to the new connection use `kubectl config use-context CONTEXT_NICKNAME` and now any cluster commands will be directed to the active context.

Commands
----------------
#### Get Pods
```
kubectl get pods
```
#### Get Services
```
kubectl get services
```
#### Follow Pod Logs
```
kubectl logs <POD_NAME> --tail=### 
# get previous log
kubectl logs -f <pod> -n <namespace> -c <container name> --previous

```
#### Describe deployment
```
kubectl describe deployment
```
### docker -  ssh to images
```
docker container exec -it <image name> bash
```
