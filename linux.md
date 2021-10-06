## [Checking Port Open](https://www.cyberciti.biz/faq/unix-linux-check-if-port-is-in-use-command/)

```bash
sudo lsof -i -P -n | grep LISTEN
sudo netstat -tulpn | grep LISTEN
sudo ss -tulpn | grep LISTEN
sudo lsof -i:22 ## see a specific port such as 22 ##
sudo nmap -sTU -O IP-address-Here

netstat -tulpn | grep LISTEN
netstat -plnt
```

## [Checking Service](https://devconnected.com/how-to-list-services-on-linux/)
```bash
pstree
systemctl list-units --type=service
systemctl list-units --type=service --all
systemctl list-units --state=<state>
```

## [Xargs](https://www.tecmint.com/xargs-command-examples/)

- command that reads streams of data from standard input, then generates and executes command lines
 
 ```bash
 find . -name "<pattern>" | xargs <other command>
 find . -name "<pattern>" | xargs chmod 755
 ```

## find PID

```bash
# FileName: wlsPid.sh 
# This script will Fetches PID of WebLogic Server instances 
# =========================================================
clear
echo "PID associated with WebLogic instances"
echo  "====================================="
/usr/ucb/ps -awwx | grep "weblogic.Name" | grep -v "grep weblogic.Name" | nawk '
BEGIN {print "PID\tWLServer";
print  "=====================================" } ;
        {
        NUM = match($0, "weblogic.Name=") ;
        START_POS  = RSTART+RLENGTH ;
        START_STR = substr($0, START_POS) ;
        FINISH = match(START_STR, " ") ;
        FINISH_POS = START_POS+RSTART+RLENGTH ;
        FINISH_STR = substr($0, START_POS, FINISH_POS) ;
        NUM = split(FINISH_STR,FINISH_ARRAY) ;
        printf ("%s\t%s\n",$1, FINISH_ARRAY[1]) ;
        }
        END {
        print "===================================="}'
 
#=== Published on http://wlatricksntips.blogspot.com  ===== 
```
