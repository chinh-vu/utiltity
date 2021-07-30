# FINDING PARTITION
```
 SELECT *  FROM ALL_TAB_PARTITIONS   where TABLE_OWNER='RMS19';
```

# FINDIND BLOCKING QUERY
- [found article](http://www.dba-oracle.com/t_find_blocking_sessions.htm#:~:text=Answer%3A%20You%20can%20query%20the%20dba_blockers%20and%20dba_waiters,these%20related%20notes%20on%20finding%20Oracle%20blocking%20sessions%3A)
- check in the following tables
  - v$lock/v$lock_object
  - v$log_history
  - v$process
  
```
SQL> select blocking_session, sid, serial#, wait_class, seconds_in_wait 
from v$session
where blocking_session is not NULL 
order by blocking_session;

SQL> select sid,type,lmode,request,ctime,block from v$lock;

```

```
 select inst_id,sid,serial#, machine, username, event, blocking_session, blocking_instance, status, sql_id from gv$session where status ='ACTIVE'and username is not null; 

 select sql_id, parsing_schema_name, parsing_schema_id, sql_fulltext  from v$sql where sql_id in (select sql_id from v$session where sql_id is not  null);
 ALTER SYSTEM KILL SESSION 'sid,serial#' IMMEDIATE;
```

# CHANGING ORACLE PASSWORD

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
