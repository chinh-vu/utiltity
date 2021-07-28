# Restore Xstore DB
1. go to /xstoredb/backup
2. open xstore.bak.gz
3. move xstore.bak to /xstoredb/backup
4. go to Xenvironment
5. select **System**
6. select **Run Atom**
7. key in **oracle-restore-xstore** or **oracle-backup-xstore**
8. go to /xstoredb/backup
9. view **restore_xstore_prod.log for progress**
- Notice: look for all atom in C:\environment\lib\xenvironment.jar\xenvironment\actions.properties
# trouble shoot
## Long query session
- first
```sql
DECLARE
    l_rindex     PLS_INTEGER;
    l_slno       PLS_INTEGER;
    l_totalwork  NUMBER;
    l_sofar      NUMBER;
    l_obj        PLS_INTEGER;
BEGIN
    l_rindex := dbms_application_info.set_session_longops_nohint;
    l_sofar := 0;
    l_totalwork := 10;
    WHILE l_sofar < 10 LOOP
-- Do some work
        dbms_lock.sleep(5);
        l_sofar := l_sofar + 1;
        dbms_application_info.set_session_longops(rindex => l_rindex, slno => l_slno, op_name => 'BATCH_LOAD', target => l_obj,
                                                 context => 0,
                                                 sofar => l_sofar,
                                                 totalwork => l_totalwork,
                                                 target_desc => 'BATCH_LOAD_TABLE',
                                                 units => 'rows');

    END LOOP;

END;
```
- then
```sql
select opname, start_time, target, sofar, totalwork, units, elapsed_seconds, message
from v$session_longops
order by start_time desc
```


