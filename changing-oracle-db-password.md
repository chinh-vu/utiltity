#

```
SELECT username, account_status, lock_date, PASSWORD_VERSIONS, authentication_type FROM dba_users where username like 'O%'; WHERE ACCOUNT_STATUS LIKE '%EXPIRED%';
show con_name;
desc dba_users;
SELECT TABLE_NAME FROM ALL_TABLES WHERE OWNER = 'SYS' AND TABLE_NAME LIKE '%USER%' ORDER BY 1;
SELECT * FROM USER$ where name like 'OID%' ;
-- and exptime < '05-JAN-22' order by 2;

ALTER USER ODSSM IDENTIFIED BY Btmgcs4mau;
commit;
 ALTER PROFILE DEFAULT LIMIT PASSWORD_LIFE_TIME UNLIMITED;
 ALTER PROFILE DEFAULT LIMIT PASSWORD_LIFE_TIME UNLIMITED;
 ```
## from command line
```
SQL> SET LINESIZE 4000

sqlplus /nolog
SQL> connect / as SYSDBA
Connected.

SQL> SELECT username, account_status FROM dba_users WHERE ACCOUNT_STATUS LIKE '%EXPIRED%';

SQL> ALTER USER system IDENTIFIED BY system;         
User altered.

SQL> ALTER USER system ACCOUNT UNLOCK;
User altered.

SQL> ALTER PROFILE DEFAULT LIMIT PASSWORD_LIFE_TIME UNLIMITED;
Profile altered.

SQL> exit

select username, user_id, account_status, expiry_date, lock_date from cdb_users where account_status like  '%EXPIRED%';

ALTER USER OID_MDS IDENTIFIED BY Btmgcs4mau;
```
