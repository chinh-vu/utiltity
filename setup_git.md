## Create and Config SSH key
- [article](https://kbroman.org/github_tutorial/pages/first_time.html)
### Create SSH Key
```jshell
$ cd ~/.ssh/ && ssh-keygen -t rsa -b 4096 -C "email@example.com"
```
- expected result. Notice: hit enter if you don't want the passphrase
```jshell
Generating public/private rsa key pair.
Enter file in which to save the key (/home/schkn/.ssh/id_rsa): custom_id_rsa
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in custom_id_rsa.
Your public key has been saved in custom_id_rsa.pub.
The key fingerprint is:
SHA256:6yBEAZCCAZCAfdeokgo256452574ffaaz+F6dedefr23222CUXTQc email@example.com
The key's randomart image is:
+---[RSA 4096]----+
|@*o+=+.   E..    |
|*+.+o    o .     |
|... =.  ....     |
| . + =. ..o      |
|  . *.o.S  .     |
|   . o.= =  .    |
|    . o o.+.     |
|     . o.oo      |
|        =*o      |
+----[SHA256]-----+
```

### Config SSH
```
$ sudo nano ~/.ssh/config

Host *
    Hostname github.com
    User <git user name>
    IdentityFile ~/.ssh/custom_id_rsa
```

## Config and Test Git
### Import SSK Key to GIT
- use notepad to view the id_rsa.pub
- copy the content
- go to github.com 
- select <b>Settings</b> from the profile
- select <b>SSH and GPG keys</b>
- click <b>New SSH key</b>
- key in <b>Title</b> - for your reference
- paste the <b>id_rsa.pub</b> content into key. Notice: make sure to delete newline
- save

#### Config Git
```
git config --global user.name "Your Name"
git config --global user.email "your git email"
```

#### Test
```
ssh -T git@github.com
```
- expected print out
```
Hi username! You've successfully authenticated, but Github does
not provide shell access.
```

## Create new git project
- go to git and create new repository
- copy the url

### clone git from github
```
git clone <url>
```

### add existing project into git
```
cd <project>
git init -b main
git add .                   ## add all files in the existing project
git commit -m "<comment>"   ## commit the track
git remote add origin <url> ## set new remote
git remote -v               ## verify git remote url
git push origin main        ## push code to git repo
```


