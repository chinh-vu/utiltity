## [Checking Port Open](https://www.cyberciti.biz/faq/unix-linux-check-if-port-is-in-use-command/)
```
sudo lsof -i -P -n | grep LISTEN
sudo netstat -tulpn | grep LISTEN
sudo ss -tulpn | grep LISTEN
sudo lsof -i:22 ## see a specific port such as 22 ##
sudo nmap -sTU -O IP-address-Here

$ netstat -tulpn | grep LISTEN
```

## [Xargs](https://www.tecmint.com/xargs-command-examples/)
 command that reads streams of data from standard input, then generates and executes command lines
 ```
 find . -name "<pattern>" | xargs <other command>
 find . -name "<pattern>" | xargs chmod 755
 ```
