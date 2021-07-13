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
